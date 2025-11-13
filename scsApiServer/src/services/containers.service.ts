import { scheduleHostingJob, scheduleTranscodingJob } from "./k8s.service";

export interface IRunProps {
  videoKey: string;
  userAccessKey: string;
  userSecretAccessKey: string;
  userBucketName: string;
  bucketPath: string;
  email: string;
  storageEndpoint: string;
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
    await scheduleTranscodingJob(runObj);
};

/**
 * @description Spins up a hoster ECS task with the provided run object parameters.
 * @param {IRunPropsHost} runObj 
 */
export const spinHoster = async (runObj: IRunPropsHost) => {
    await scheduleHostingJob(runObj);
};
