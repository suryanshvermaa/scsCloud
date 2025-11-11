import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from '../../pb/containerService';
import "dotenv/config";
import { Deployment } from '../../pb/containerService/Deployment';

const PORT= process.env.GRPC_PORT || 8000;
const PROTO_PATH = path.join(__dirname, '..', 'containerService.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;

export const grpcClient= new grpcObject.containerService.ContainerService(
    `${process.env.GRPC_HOST || 'localhost'}:${PORT}`,
    grpc.credentials.createInsecure()
)

const deadline = new Date();
deadline.setSeconds(deadline.getSeconds() + 5);

grpcClient.waitForReady(deadline, (error) => {
    if (error) {
        console.error('gRPC client connection error:', error);
    } else {
        console.log('gRPC client connected successfully');
    }
});

export function GetDeployments(userId: string) {
    return new Promise((resolve, reject) => {
        grpcClient.getDeployments({userId: userId}, (error, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
}

export function DeployContainer(userId: string, deploymentConfig: Deployment ) {
    return new Promise((resolve, reject) => {
        grpcClient.CreateDeployment({userId: userId, deployment:{
           serviceSubdomain: deploymentConfig.serviceSubdomain,
           namespace: deploymentConfig.namespace,
           name: deploymentConfig.name,
           dockerImage: deploymentConfig.dockerImage,
           cpu: deploymentConfig.cpu,
           memory: deploymentConfig.memory,
           replicas: deploymentConfig.replicas,
           port: deploymentConfig.port,
           environments: deploymentConfig.environments,
           createdAt: new Date().toISOString() 
        }}, (error, response) => {
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
        grpcClient.DeleteDeployment({ id: deploymentId}, (error, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
}