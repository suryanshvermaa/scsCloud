import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from '../../pb/containerService';
import "dotenv/config";
import { Deployment } from '../../pb/containerService/Deployment';
import { GetDeploymentsResponse__Output } from '../../pb/containerService/GetDeploymentsResponse';
import { DeleteDeploymentResponse__Output } from '../../pb/containerService/DeleteDeploymentResponse';
import { PostDeploymentResponse__Output } from '../../pb/containerService/PostDeploymentResponse';

const PORT= process.env.CONTAINER_SERVICE_PORT || 8000;
const PROTO_PATH = path.join(__dirname, '..','..','..','containerService.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    // keepCase=false converts proto snake_case fields to camelCase in JS objects
    // which matches how the rest of this code builds the objects (dockerImage, userId, etc.)
    keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;

export const grpcClient= new grpcObject.pb.ContainerService(
    `${process.env.CONTAINER_SERVICE_HOST || 'localhost'}:${PORT}`,
    grpc.credentials.createInsecure()
)

const deadline = new Date();
deadline.setSeconds(deadline.getSeconds() + 5);

grpcClient.waitForReady(deadline, (error?: Error) => {
    if (error) {
        console.error('gRPC client connection error:', error);
    } else {
        console.log('gRPC client connected successfully');
    }
});

export function GetDeployments(userId: string):Promise<Deployment[]|undefined> {
    return new Promise((resolve, reject) => {
        grpcClient.getDeployments({userId: userId}, (error: grpc.ServiceError | null, response: GetDeploymentsResponse__Output | undefined) => {
            if (error) {
                reject(error);
            } else {
                resolve(response?.deployments);
            }
        });
    });
}

export function DeployContainer(userId: string, deploymentConfig: Deployment ):Promise<Deployment|undefined> {
    return new Promise((resolve, reject) => {
        // Ensure environments is a map<string,string> (protobuf expects a map) —
        // some clients send environments as an array of {key,value} objects; convert if necessary.
        let environments: any = deploymentConfig.environments || {};
        if (Array.isArray(environments)) {
            const envMap: Record<string,string> = {};
            for (const e of environments) {
                if (e && typeof e.key !== 'undefined') {
                    envMap[String(e.key)] = String(e.value ?? '');
                }
            }
            environments = envMap;
        }

        const deploymentPayload = {
            serviceSubdomain: deploymentConfig.serviceSubdomain,
            namespace: deploymentConfig.namespace,
            name: deploymentConfig.name,
            dockerImage: deploymentConfig.dockerImage,
            cpu: deploymentConfig.cpu,
            memory: deploymentConfig.memory,
            replicas: deploymentConfig.replicas,
            port: deploymentConfig.port,
            environments,
            createdAt: new Date().toISOString()
        };

        grpcClient.CreateDeployment({ userId: userId, deployment: deploymentPayload }, (error: grpc.ServiceError | null, response: PostDeploymentResponse__Output | undefined) => {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
}

export function DeleteDeployment(deploymentId: string) {
    return new Promise((resolve, reject) => {
        grpcClient.DeleteDeployment({ id: deploymentId}, (error: grpc.ServiceError | null, response: DeleteDeploymentResponse__Output | undefined) => {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
}