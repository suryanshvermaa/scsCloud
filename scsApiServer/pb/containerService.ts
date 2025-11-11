import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { ContainerServiceClient as _containerService_ContainerServiceClient, ContainerServiceDefinition as _containerService_ContainerServiceDefinition } from './containerService/ContainerService';
import type { DeleteDeploymentRequest as _containerService_DeleteDeploymentRequest, DeleteDeploymentRequest__Output as _containerService_DeleteDeploymentRequest__Output } from './containerService/DeleteDeploymentRequest';
import type { DeleteDeploymentResponse as _containerService_DeleteDeploymentResponse, DeleteDeploymentResponse__Output as _containerService_DeleteDeploymentResponse__Output } from './containerService/DeleteDeploymentResponse';
import type { Deployment as _containerService_Deployment, Deployment__Output as _containerService_Deployment__Output } from './containerService/Deployment';
import type { GetDeploymentRequest as _containerService_GetDeploymentRequest, GetDeploymentRequest__Output as _containerService_GetDeploymentRequest__Output } from './containerService/GetDeploymentRequest';
import type { GetDeploymentsResponse as _containerService_GetDeploymentsResponse, GetDeploymentsResponse__Output as _containerService_GetDeploymentsResponse__Output } from './containerService/GetDeploymentsResponse';
import type { PostDeploymentRequest as _containerService_PostDeploymentRequest, PostDeploymentRequest__Output as _containerService_PostDeploymentRequest__Output } from './containerService/PostDeploymentRequest';
import type { PostDeploymentResponse as _containerService_PostDeploymentResponse, PostDeploymentResponse__Output as _containerService_PostDeploymentResponse__Output } from './containerService/PostDeploymentResponse';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  containerService: {
    ContainerService: SubtypeConstructor<typeof grpc.Client, _containerService_ContainerServiceClient> & { service: _containerService_ContainerServiceDefinition }
    DeleteDeploymentRequest: MessageTypeDefinition<_containerService_DeleteDeploymentRequest, _containerService_DeleteDeploymentRequest__Output>
    DeleteDeploymentResponse: MessageTypeDefinition<_containerService_DeleteDeploymentResponse, _containerService_DeleteDeploymentResponse__Output>
    Deployment: MessageTypeDefinition<_containerService_Deployment, _containerService_Deployment__Output>
    GetDeploymentRequest: MessageTypeDefinition<_containerService_GetDeploymentRequest, _containerService_GetDeploymentRequest__Output>
    GetDeploymentsResponse: MessageTypeDefinition<_containerService_GetDeploymentsResponse, _containerService_GetDeploymentsResponse__Output>
    PostDeploymentRequest: MessageTypeDefinition<_containerService_PostDeploymentRequest, _containerService_PostDeploymentRequest__Output>
    PostDeploymentResponse: MessageTypeDefinition<_containerService_PostDeploymentResponse, _containerService_PostDeploymentResponse__Output>
  }
}

