import {V1Job} from "@kubernetes/client-node";
import "dotenv/config";

const myBucketName = process.env.BUCKET_NAME!;
const accessKeyId = process.env.ACCESS_KEY_ID!;
const secretAccessKey = process.env.SECRET_ACCESS_KEY!;

export interface IRunPropsHost {
  gitUrl: string;
  webUrl: string;
}

const hostingJob = (runProps: IRunPropsHost) => {
  const jobConfig: V1Job = {
    apiVersion: "batch/v1",
    kind: "Job",
    metadata: {
      name: `hosting-job-${Date.now()}`,
    },
    spec: {
      template: {
        spec: {
          containers:[
            {
              name: "hosting-container",
              image: "suryanshvermaaa/hosting-container:1.0.0",
              env:[
                {
                  name: "MY_ACCESS_KEY_ID",
                  value: accessKeyId,
                },{
                  name:"MY_SECRET_ACCESS_KEY",
                  value: secretAccessKey,
                },{
                  name:"MY_BUCKET_NAME",
                  value: myBucketName,
                },{
                  name: "GIT_URL",
                  value: runProps.gitUrl
                }, {
                  name: "WEB_URL",
                  value: runProps.webUrl
                }
              ]
            },
          ],
          restartPolicy: "Never",
        },
      },
      backoffLimit: 2
    }
  }

  return jobConfig;
}

import {} from "@kubernetes/client-node";

const getIngressConfig=(ingressName: string, ingressHost:string,ingressService: string,servicePort: number, namespace: string)=>{
    const ingressConfig: any = {
        apiVersion: "networking.k8s.io/v1",
        kind: "Ingress",
        metadata: {
            name: ingressName,
            namespace,
            labels: {
                "app.kubernetes.io/name": ingressName,
                "app.kubernetes.io/part-of": "scs-cloud"
            }
        },
        spec: {
            rules: [
                {
                    host: ingressHost,
                    http: {
                        paths: [
                            {
                                pathType: "Prefix",
                                path: "/",
                                backend: {
                                    service: {
                                        name: ingressService,
                                        port: {
                                            number: servicePort
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };
    return ingressConfig;
}

export { getIngressConfig, hostingJob };