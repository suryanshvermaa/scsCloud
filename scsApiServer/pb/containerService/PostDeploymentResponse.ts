// Original file: containerService.proto

import type { Deployment as _containerService_Deployment, Deployment__Output as _containerService_Deployment__Output } from '../containerService/Deployment';

export interface PostDeploymentResponse {
  'id'?: (string);
  'deployment'?: (_containerService_Deployment | null);
}

export interface PostDeploymentResponse__Output {
  'id'?: (string);
  'deployment'?: (_containerService_Deployment__Output);
}
