import { scheduleHostingJob, scheduleTranscodingJob } from "./k8s.service";

export const queueHost = process.env.QUEUE_HOST;
export const queueUser = process.env.QUEUE_USER;
export const queuePassword = process.env.QUEUE_PASSWORD;
export const myBucketName = process.env.MY_BUCKET_NAME;

export interface IRunProps {
  videoKey: string;
  userAccessKey: string;
  userSecretAccessKey: string;
  userBucketName: string;
  bucketPath: string;
  email: string;
}

export interface IRunPropsHost {
  gitUrl: string;
  webUrl: string;
}

/**
 * @description Spins up a transcoder ECS task with the provided run object parameters.
 * @param {IRunProps} runObj
 */
export const spinTranscoder = async (runObj: IRunProps) => {
    // await transcodingContainerTask(runObj);
    await scheduleTranscodingJob(runObj);
};

/**
 * @description Spins up a hoster ECS task with the provided run object parameters.
 * @param {IRunPropsHost} runObj 
 */
export const spinHoster = async (runObj: IRunPropsHost) => {
//  await hostingContainerTask(runObj);
    await scheduleHostingJob(runObj);
};
