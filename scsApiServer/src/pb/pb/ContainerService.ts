// Original file: containerService.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { DeleteDeploymentRequest as _pb_DeleteDeploymentRequest, DeleteDeploymentRequest__Output as _pb_DeleteDeploymentRequest__Output } from '../pb/DeleteDeploymentRequest';
import type { DeleteDeploymentResponse as _pb_DeleteDeploymentResponse, DeleteDeploymentResponse__Output as _pb_DeleteDeploymentResponse__Output } from '../pb/DeleteDeploymentResponse';
import type { GetDeploymentRequest as _pb_GetDeploymentRequest, GetDeploymentRequest__Output as _pb_GetDeploymentRequest__Output } from '../pb/GetDeploymentRequest';
import type { GetDeploymentsResponse as _pb_GetDeploymentsResponse, GetDeploymentsResponse__Output as _pb_GetDeploymentsResponse__Output } from '../pb/GetDeploymentsResponse';
import type { PostDeploymentRequest as _pb_PostDeploymentRequest, PostDeploymentRequest__Output as _pb_PostDeploymentRequest__Output } from '../pb/PostDeploymentRequest';
import type { PostDeploymentResponse as _pb_PostDeploymentResponse, PostDeploymentResponse__Output as _pb_PostDeploymentResponse__Output } from '../pb/PostDeploymentResponse';

export interface ContainerServiceClient extends grpc.Client {
  CreateDeployment(argument: _pb_PostDeploymentRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_pb_PostDeploymentResponse__Output>): grpc.ClientUnaryCall;
  CreateDeployment(argument: _pb_PostDeploymentRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_pb_PostDeploymentResponse__Output>): grpc.ClientUnaryCall;
  CreateDeployment(argument: _pb_PostDeploymentRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_pb_PostDeploymentResponse__Output>): grpc.ClientUnaryCall;
  CreateDeployment(argument: _pb_PostDeploymentRequest, callback: grpc.requestCallback<_pb_PostDeploymentResponse__Output>): grpc.ClientUnaryCall;
  createDeployment(argument: _pb_PostDeploymentRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_pb_PostDeploymentResponse__Output>): grpc.ClientUnaryCall;
  createDeployment(argument: _pb_PostDeploymentRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_pb_PostDeploymentResponse__Output>): grpc.ClientUnaryCall;
  createDeployment(argument: _pb_PostDeploymentRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_pb_PostDeploymentResponse__Output>): grpc.ClientUnaryCall;
  createDeployment(argument: _pb_PostDeploymentRequest, callback: grpc.requestCallback<_pb_PostDeploymentResponse__Output>): grpc.ClientUnaryCall;
  
  DeleteDeployment(argument: _pb_DeleteDeploymentRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_pb_DeleteDeploymentResponse__Output>): grpc.ClientUnaryCall;
  DeleteDeployment(argument: _pb_DeleteDeploymentRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_pb_DeleteDeploymentResponse__Output>): grpc.ClientUnaryCall;
  DeleteDeployment(argument: _pb_DeleteDeploymentRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_pb_DeleteDeploymentResponse__Output>): grpc.ClientUnaryCall;
  DeleteDeployment(argument: _pb_DeleteDeploymentRequest, callback: grpc.requestCallback<_pb_DeleteDeploymentResponse__Output>): grpc.ClientUnaryCall;
  deleteDeployment(argument: _pb_DeleteDeploymentRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_pb_DeleteDeploymentResponse__Output>): grpc.ClientUnaryCall;
  deleteDeployment(argument: _pb_DeleteDeploymentRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_pb_DeleteDeploymentResponse__Output>): grpc.ClientUnaryCall;
  deleteDeployment(argument: _pb_DeleteDeploymentRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_pb_DeleteDeploymentResponse__Output>): grpc.ClientUnaryCall;
  deleteDeployment(argument: _pb_DeleteDeploymentRequest, callback: grpc.requestCallback<_pb_DeleteDeploymentResponse__Output>): grpc.ClientUnaryCall;
  
  GetDeployments(argument: _pb_GetDeploymentRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_pb_GetDeploymentsResponse__Output>): grpc.ClientUnaryCall;
  GetDeployments(argument: _pb_GetDeploymentRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_pb_GetDeploymentsResponse__Output>): grpc.ClientUnaryCall;
  GetDeployments(argument: _pb_GetDeploymentRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_pb_GetDeploymentsResponse__Output>): grpc.ClientUnaryCall;
  GetDeployments(argument: _pb_GetDeploymentRequest, callback: grpc.requestCallback<_pb_GetDeploymentsResponse__Output>): grpc.ClientUnaryCall;
  getDeployments(argument: _pb_GetDeploymentRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_pb_GetDeploymentsResponse__Output>): grpc.ClientUnaryCall;
  getDeployments(argument: _pb_GetDeploymentRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_pb_GetDeploymentsResponse__Output>): grpc.ClientUnaryCall;
  getDeployments(argument: _pb_GetDeploymentRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_pb_GetDeploymentsResponse__Output>): grpc.ClientUnaryCall;
  getDeployments(argument: _pb_GetDeploymentRequest, callback: grpc.requestCallback<_pb_GetDeploymentsResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface ContainerServiceHandlers extends grpc.UntypedServiceImplementation {
  CreateDeployment: grpc.handleUnaryCall<_pb_PostDeploymentRequest__Output, _pb_PostDeploymentResponse>;
  
  DeleteDeployment: grpc.handleUnaryCall<_pb_DeleteDeploymentRequest__Output, _pb_DeleteDeploymentResponse>;
  
  GetDeployments: grpc.handleUnaryCall<_pb_GetDeploymentRequest__Output, _pb_GetDeploymentsResponse>;
  
}

export interface ContainerServiceDefinition extends grpc.ServiceDefinition {
  CreateDeployment: MethodDefinition<_pb_PostDeploymentRequest, _pb_PostDeploymentResponse, _pb_PostDeploymentRequest__Output, _pb_PostDeploymentResponse__Output>
  DeleteDeployment: MethodDefinition<_pb_DeleteDeploymentRequest, _pb_DeleteDeploymentResponse, _pb_DeleteDeploymentRequest__Output, _pb_DeleteDeploymentResponse__Output>
  GetDeployments: MethodDefinition<_pb_GetDeploymentRequest, _pb_GetDeploymentsResponse, _pb_GetDeploymentRequest__Output, _pb_GetDeploymentsResponse__Output>
}
