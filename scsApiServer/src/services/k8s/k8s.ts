import * as k8s from "@kubernetes/client-node";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

export const k8sbatchAPi = kc.makeApiClient(k8s.BatchV1Api);
export const k8sObjectApi = k8s.KubernetesObjectApi.makeApiClient(kc);
export const k8sCoreV1Api = kc.makeApiClient(k8s.CoreV1Api);
export const k8sCoreApi = kc.makeApiClient(k8s.CoreApi);