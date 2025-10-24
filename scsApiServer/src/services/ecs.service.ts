import "dotenv/config";
import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";

// Initialize ECS Client
const ecsClient = new ECSClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

const queueHost = process.env.QUEUE_HOST;
const queueUser = process.env.QUEUE_USER;
const queuePassword = process.env.QUEUE_PASSWORD;
const myBucketName = process.env.MY_BUCKET_NAME;

export interface IRunProps {
  videoKey: string;
  userAccessKey: string;
  userSecretAccessKey: string;
  userBucketName: string;
  bucketPath: string;
  email: string;
}

/**
 * @description Spins up a transcoder ECS task with the provided run object parameters.
 * @param {IRunProps} runObj
 */
export const spinTranscoder = async (runObj: IRunProps) => {
  const command = new RunTaskCommand({
    cluster: process.env.CLUSTER_ARN,
    taskDefinition: process.env.TRANSCODER_TASK_DEFINITION_ARN,
    launchType: "FARGATE",
    count: 1,
    networkConfiguration: {
      awsvpcConfiguration: {
        assignPublicIp: "ENABLED",
        subnets: [
          process.env.MY_SUBNET_1!,
          process.env.MY_SUBNET_2!,
          process.env.MY_SUBNET_3!,
        ],
        securityGroups: [process.env.MY_SECURITY_GROUP!],
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: process.env.TRANSCODER_TASK_NAME,
          environment: [
            {
              name: "MY_ACCESS_KEY_ID",
              value: process.env.ACCESS_KEY_ID!,
            },
            {
              name: "MY_SECRET_ACCESS_KEY",
              value: process.env.SECRET_ACCESS_KEY!,
            },
            {
              name: "MY_BUCKET_NAME",
              value: myBucketName,
            },
            {
              name: "USER_ACCESS_KEY_ID",
              value: runObj.userAccessKey,
            },
            {
              name: "USER_SECRET_ACCESS_KEY",
              value: runObj.userSecretAccessKey,
            },
            {
              name: "USER_BUCKET_NAME",
              value: runObj.userBucketName,
            },
            {
              name: "VIDEO_KEY",
              value: runObj.videoKey,
            },
            {
              name: "BUCKET_PATH",
              value: runObj.bucketPath,
            },
            {
              name: "QUEUE_HOST",
              value: queueHost,
            },
            {
              name: "QUEUE_USER",
              value: queueUser,
            },
            {
              name: "QUEUE_PASSWORD",
              value: queuePassword,
            },
            {
              name: "USER_EMAIL",
              value: runObj.email,
            },
          ],
        },
      ],
    },
  });
  await ecsClient.send(command);
};

interface IRunPropsHost {
  gitUrl: string;
  webUrl: string;
}

/**
 * @description Spins up a hoster ECS task with the provided run object parameters.
 * @param {IRunPropsHost} runObj 
 */
export const spinHoster = async (runObj: IRunPropsHost) => {
  const command = new RunTaskCommand({
    cluster: process.env.CLUSTER_ARN,
    taskDefinition: process.env.HOSTER_TASK_DEFINITION_ARN,
    launchType: "FARGATE",
    count: 1,
    networkConfiguration: {
      awsvpcConfiguration: {
        assignPublicIp: "ENABLED",
        subnets: [
          process.env.MY_SUBNET_1!,
          process.env.MY_SUBNET_2!,
          process.env.MY_SUBNET_3!,
        ],
        securityGroups: [process.env.MY_SECURITY_GROUP!],
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: process.env.HOSTER_TASK_NAME,
          environment: [
            {
              name: "MY_ACCESS_KEY_ID",
              value: process.env.ACCESS_KEY_ID!,
            },
            {
              name: "MY_SECRET_ACCESS_KEY",
              value: process.env.SECRET_ACCESS_KEY!,
            },
            {
              name: "MY_BUCKET_NAME",
              value: myBucketName,
            },
            {
              name: "GIT_URL",
              value: runObj.gitUrl,
            },
            {
              name: "WEB_URL",
              value: runObj.webUrl,
            },
          ],
        },
      ],
    },
  });
  await ecsClient.send(command);
};
