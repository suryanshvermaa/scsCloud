import {V1Job} from "@kubernetes/client-node";
import { IRunPropsHost, myBucketName } from "../ecs.service";

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
                  value: process.env.ACCESS_KEY_ID,
                },{
                  name:"MY_SECRET_ACCESS_KEY",
                  value: process.env.SECRET_ACCESS_KEY,
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

export default hostingJob;