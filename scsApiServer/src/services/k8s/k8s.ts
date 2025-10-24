import k8s, { BatchV1Api, CoreV1Api } from "@kubernetes/client-node";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

export const k8sbatchAPi=kc.makeApiClient(BatchV1Api);