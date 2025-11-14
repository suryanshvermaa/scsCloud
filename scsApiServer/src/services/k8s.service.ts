import { IRunProps, IRunPropsHost } from "./containers.service";
import { hostingWorkerQueue, transcodingWorkerQueue } from "./queue.service";

export const scheduleTranscodingJob=async(runObj:IRunProps)=>{
    await transcodingWorkerQueue.add('transcoding-job'+Date.now(),JSON.stringify({runProps: runObj}));
}

export const scheduleHostingJob=async(runObj:IRunPropsHost)=>{
    await hostingWorkerQueue.add('hosting-job'+Date.now(),JSON.stringify({runProps: runObj}));
}
