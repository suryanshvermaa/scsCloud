// Original file: containerService.proto

import type { Deployment as _pb_Deployment, Deployment__Output as _pb_Deployment__Output } from '../pb/Deployment';

export interface PostDeploymentRequest {
  'userId'?: (string);
  'deployment'?: (_pb_Deployment | null);
}

export interface PostDeploymentRequest__Output {
  'userId'?: (string);
  'deployment'?: (_pb_Deployment__Output);
}
