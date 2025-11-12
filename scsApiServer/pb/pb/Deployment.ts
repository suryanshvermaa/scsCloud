// Original file: containerService.proto


export interface Deployment {
  'id'?: (string);
  'namespace'?: (string);
  'name'?: (string);
  'dockerImage'?: (string);
  'cpu'?: (string);
  'memory'?: (string);
  'replicas'?: (number);
  'port'?: (number);
  'environments'?: ({[key: string]: string});
  'createdAt'?: (string);
  'serviceSubdomain'?: (string);
  '_id'?: "id";
  '_serviceSubdomain'?: "serviceSubdomain";
}

export interface Deployment__Output {
  'id'?: (string);
  'namespace'?: (string);
  'name'?: (string);
  'dockerImage'?: (string);
  'cpu'?: (string);
  'memory'?: (string);
  'replicas'?: (number);
  'port'?: (number);
  'environments'?: ({[key: string]: string});
  'createdAt'?: (string);
  'serviceSubdomain'?: (string);
}
