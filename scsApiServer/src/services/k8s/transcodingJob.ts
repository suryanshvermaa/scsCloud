import {V1Job} from "@kubernetes/client-node";
import { IRunProps, myBucketName } from "../ecs.service";

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
              image: "suryanshvermaaa/transcoding-container:1.0.0",
              env:[
                {
                  name: "MY_ACCESS_KEY_ID",
                  value: process.env.ACCESS_KEY_ID,
                },{
                  name:"MY_SECRET_ACCESS_KEY",
                  value: process.env.SECRET_ACCESS_KEY,
                },{
                  name:"MY_BUCKET_NAME",
                  value: myBucketName,
                },{
                    name: "USER_ACCESS_KEY_ID",
                    value: runProps.userAccessKey,
                },{
                    name: "USER_SECRET_ACCESS_KEY",
                    value: runProps.userSecretAccessKey,
                },{
                    name: "USER_BUCKET_NAME",
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

export default transcodingJob;