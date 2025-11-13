import {V1Job} from "@kubernetes/client-node";
import { IRunProps } from "./schedule";

const transcodingJob = (runProps: IRunProps) => {
  const jobConfig: V1Job = {
    apiVersion: "batch/v1",
    kind: "Job",
    metadata: {
      name: `transcoding-job-${Date.now()}`,
      namespace: "scs-cloud"
    },
    spec: {
      template: {
        spec: {
          containers:[
            {
              name: "transcoding-container",
              image: "suryanshvermaaa/transcoding-container:1.0.3",
              env:[
                {
                  name: "ACCESS_KEY",
                  value: runProps.userAccessKey,
                },{
                  name:"SECRET_ACCESS_KEY",
                  value: runProps.userSecretAccessKey,
                },{
                  name:"BUCKET_NAME",
                  value: runProps.userBucketName,
                },
                {
                    name: "VIDEO_KEY",
                    value: runProps.videoKey,
                },{
                    name: "BUCKET_PATH",
                    value: runProps.bucketPath,
                },
                {
                    name: "USER_EMAIL",
                    value: runProps.email,
                },{
                    name: "QUEUE_HOST",
                    value: process.env.QUEUE_HOST,
                },{
                    name: "QUEUE_USER",
                    value: process.env.QUEUE_USER,
                },
                {
                    name: "QUEUE_PASSWORD",
                    value: process.env.QUEUE_PASSWORD,
                },
                {
                    name: "QUEUE_PORT",
                    value: process.env.QUEUE_PORT,
                },
                {
                  name: "STORAGE_ENDPOINT",
                  value: runProps.storageEndpoint,
                }
              ]
            },
          ],
          restartPolicy: "Never",
        },
      },
      backoffLimit: 1
    }
  }

  return jobConfig;
}

export default transcodingJob;