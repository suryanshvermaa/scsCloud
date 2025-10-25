import { hostingContainerTask, IRunProps, IRunPropsHost, transcodingContainerTask } from "./ecs.service";
import { scheduleHostingJob, scheduleTranscodingJob } from "./k8s.service";

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
