// Original file: containerService.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { DeleteDeploymentRequest as _containerService_DeleteDeploymentRequest, DeleteDeploymentRequest__Output as _containerService_DeleteDeploymentRequest__Output } from '../containerService/DeleteDeploymentRequest';
import type { DeleteDeploymentResponse as _containerService_DeleteDeploymentResponse, DeleteDeploymentResponse__Output as _containerService_DeleteDeploymentResponse__Output } from '../containerService/DeleteDeploymentResponse';
import type { GetDeploymentRequest as _containerService_GetDeploymentRequest, GetDeploymentRequest__Output as _containerService_GetDeploymentRequest__Output } from '../containerService/GetDeploymentRequest';
import type { GetDeploymentsResponse as _containerService_GetDeploymentsResponse, GetDeploymentsResponse__Output as _containerService_GetDeploymentsResponse__Output } from '../containerService/GetDeploymentsResponse';
import type { PostDeploymentRequest as _containerService_PostDeploymentRequest, PostDeploymentRequest__Output as _containerService_PostDeploymentRequest__Output } from '../containerService/PostDeploymentRequest';
import type { PostDeploymentResponse as _containerService_PostDeploymentResponse, PostDeploymentResponse__Output as _containerService_PostDeploymentResponse__Output } from '../containerService/PostDeploymentResponse';

export interface ContainerServiceClient extends grpc.Client {
  CreateDeployment(argument: _containerService_PostDeploymentRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_containerService_PostDeploymentResponse__Output>): grpc.ClientUnaryCall;
  CreateDeployment(argument: _containerService_PostDeploymentRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_containerService_PostDeploymentResponse__Output>): grpc.ClientUnaryCall;
  CreateDeployment(argument: _containerService_PostDeploymentRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_containerService_PostDeploymentResponse__Output>): grpc.ClientUnaryCall;
  CreateDeployment(argument: _containerService_PostDeploymentRequest, callback: grpc.requestCallback<_containerService_PostDeploymentResponse__Output>): grpc.ClientUnaryCall;
  createDeployment(argument: _containerService_PostDeploymentRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_containerService_PostDeploymentResponse__Output>): grpc.ClientUnaryCall;
  createDeployment(argument: _containerService_PostDeploymentRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_containerService_PostDeploymentResponse__Output>): grpc.ClientUnaryCall;
  createDeployment(argument: _containerService_PostDeploymentRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_containerService_PostDeploymentResponse__Output>): grpc.ClientUnaryCall;
  createDeployment(argument: _containerService_PostDeploymentRequest, callback: grpc.requestCallback<_containerService_PostDeploymentResponse__Output>): grpc.ClientUnaryCall;
  
  DeleteDeployment(argument: _containerService_DeleteDeploymentRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_containerService_DeleteDeploymentResponse__Output>): grpc.ClientUnaryCall;
  DeleteDeployment(argument: _containerService_DeleteDeploymentRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_containerService_DeleteDeploymentResponse__Output>): grpc.ClientUnaryCall;
  DeleteDeployment(argument: _containerService_DeleteDeploymentRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_containerService_DeleteDeploymentResponse__Output>): grpc.ClientUnaryCall;
  DeleteDeployment(argument: _containerService_DeleteDeploymentRequest, callback: grpc.requestCallback<_containerService_DeleteDeploymentResponse__Output>): grpc.ClientUnaryCall;
  deleteDeployment(argument: _containerService_DeleteDeploymentRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_containerService_DeleteDeploymentResponse__Output>): grpc.ClientUnaryCall;
  deleteDeployment(argument: _containerService_DeleteDeploymentRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_containerService_DeleteDeploymentResponse__Output>): grpc.ClientUnaryCall;
  deleteDeployment(argument: _containerService_DeleteDeploymentRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_containerService_DeleteDeploymentResponse__Output>): grpc.ClientUnaryCall;
  deleteDeployment(argument: _containerService_DeleteDeploymentRequest, callback: grpc.requestCallback<_containerService_DeleteDeploymentResponse__Output>): grpc.ClientUnaryCall;
  
  GetDeployments(argument: _containerService_GetDeploymentRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_containerService_GetDeploymentsResponse__Output>): grpc.ClientUnaryCall;
  GetDeployments(argument: _containerService_GetDeploymentRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_containerService_GetDeploymentsResponse__Output>): grpc.ClientUnaryCall;
  GetDeployments(argument: _containerService_GetDeploymentRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_containerService_GetDeploymentsResponse__Output>): grpc.ClientUnaryCall;
  GetDeployments(argument: _containerService_GetDeploymentRequest, callback: grpc.requestCallback<_containerService_GetDeploymentsResponse__Output>): grpc.ClientUnaryCall;
  getDeployments(argument: _containerService_GetDeploymentRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_containerService_GetDeploymentsResponse__Output>): grpc.ClientUnaryCall;
  getDeployments(argument: _containerService_GetDeploymentRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_containerService_GetDeploymentsResponse__Output>): grpc.ClientUnaryCall;
  getDeployments(argument: _containerService_GetDeploymentRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_containerService_GetDeploymentsResponse__Output>): grpc.ClientUnaryCall;
  getDeployments(argument: _containerService_GetDeploymentRequest, callback: grpc.requestCallback<_containerService_GetDeploymentsResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface ContainerServiceHandlers extends grpc.UntypedServiceImplementation {
  CreateDeployment: grpc.handleUnaryCall<_containerService_PostDeploymentRequest__Output, _containerService_PostDeploymentResponse>;
  
  DeleteDeployment: grpc.handleUnaryCall<_containerService_DeleteDeploymentRequest__Output, _containerService_DeleteDeploymentResponse>;
  
  GetDeployments: grpc.handleUnaryCall<_containerService_GetDeploymentRequest__Output, _containerService_GetDeploymentsResponse>;
  
}

export interface ContainerServiceDefinition extends grpc.ServiceDefinition {
  CreateDeployment: MethodDefinition<_containerService_PostDeploymentRequest, _containerService_PostDeploymentResponse, _containerService_PostDeploymentRequest__Output, _containerService_PostDeploymentResponse__Output>
  DeleteDeployment: MethodDefinition<_containerService_DeleteDeploymentRequest, _containerService_DeleteDeploymentResponse, _containerService_DeleteDeploymentRequest__Output, _containerService_DeleteDeploymentResponse__Output>
  GetDeployments: MethodDefinition<_containerService_GetDeploymentRequest, _containerService_GetDeploymentsResponse, _containerService_GetDeploymentRequest__Output, _containerService_GetDeploymentsResponse__Output>
}
