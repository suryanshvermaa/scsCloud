// Original file: containerService.proto

import type { Deployment as _pb_Deployment, Deployment__Output as _pb_Deployment__Output } from '../pb/Deployment';

export interface PostDeploymentResponse {
  'id'?: (string);
  'deployment'?: (_pb_Deployment | null);
}

export interface PostDeploymentResponse__Output {
  'id'?: (string);
  'deployment'?: (_pb_Deployment__Output);
}
