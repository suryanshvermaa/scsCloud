import * as k8s from "@kubernetes/client-node";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

export const k8sbatchAPi = kc.makeApiClient(k8s.BatchV1Api);