import * as k8s from "@kubernetes/client-node";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

export const k8sObjectApi = k8s.KubernetesObjectApi.makeApiClient(kc);