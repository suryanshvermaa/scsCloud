// Original file: containerService.proto

import type { Deployment as _containerService_Deployment, Deployment__Output as _containerService_Deployment__Output } from '../containerService/Deployment';

export interface PostDeploymentRequest {
  'userId'?: (string);
  'deployment'?: (_containerService_Deployment | null);
}

export interface PostDeploymentRequest__Output {
  'userId'?: (string);
  'deployment'?: (_containerService_Deployment__Output);
}
