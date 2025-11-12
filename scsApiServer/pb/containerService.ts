import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { ContainerServiceClient as _pb_ContainerServiceClient, ContainerServiceDefinition as _pb_ContainerServiceDefinition } from './pb/ContainerService';
import type { DeleteDeploymentRequest as _pb_DeleteDeploymentRequest, DeleteDeploymentRequest__Output as _pb_DeleteDeploymentRequest__Output } from './pb/DeleteDeploymentRequest';
import type { DeleteDeploymentResponse as _pb_DeleteDeploymentResponse, DeleteDeploymentResponse__Output as _pb_DeleteDeploymentResponse__Output } from './pb/DeleteDeploymentResponse';
import type { Deployment as _pb_Deployment, Deployment__Output as _pb_Deployment__Output } from './pb/Deployment';
import type { GetDeploymentRequest as _pb_GetDeploymentRequest, GetDeploymentRequest__Output as _pb_GetDeploymentRequest__Output } from './pb/GetDeploymentRequest';
import type { GetDeploymentsResponse as _pb_GetDeploymentsResponse, GetDeploymentsResponse__Output as _pb_GetDeploymentsResponse__Output } from './pb/GetDeploymentsResponse';
import type { PostDeploymentRequest as _pb_PostDeploymentRequest, PostDeploymentRequest__Output as _pb_PostDeploymentRequest__Output } from './pb/PostDeploymentRequest';
import type { PostDeploymentResponse as _pb_PostDeploymentResponse, PostDeploymentResponse__Output as _pb_PostDeploymentResponse__Output } from './pb/PostDeploymentResponse';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  pb: {
    ContainerService: SubtypeConstructor<typeof grpc.Client, _pb_ContainerServiceClient> & { service: _pb_ContainerServiceDefinition }
    DeleteDeploymentRequest: MessageTypeDefinition<_pb_DeleteDeploymentRequest, _pb_DeleteDeploymentRequest__Output>
    DeleteDeploymentResponse: MessageTypeDefinition<_pb_DeleteDeploymentResponse, _pb_DeleteDeploymentResponse__Output>
    Deployment: MessageTypeDefinition<_pb_Deployment, _pb_Deployment__Output>
    GetDeploymentRequest: MessageTypeDefinition<_pb_GetDeploymentRequest, _pb_GetDeploymentRequest__Output>
    GetDeploymentsResponse: MessageTypeDefinition<_pb_GetDeploymentsResponse, _pb_GetDeploymentsResponse__Output>
    PostDeploymentRequest: MessageTypeDefinition<_pb_PostDeploymentRequest, _pb_PostDeploymentRequest__Output>
    PostDeploymentResponse: MessageTypeDefinition<_pb_PostDeploymentResponse, _pb_PostDeploymentResponse__Output>
  }
}

