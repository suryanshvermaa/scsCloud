import { IRunProps, IRunPropsHost } from "./containers.service";
import hostingJob from "./k8s/hostingJob";
import { k8sbatchAPi } from "./k8s/k8s";
import transcodingJob from "./k8s/transcodingJob";

export const scheduleTranscodingJob=async(runObj:IRunProps)=>{
    k8sbatchAPi.createNamespacedJob("scs-cloud",transcodingJob(runObj));
}

export const scheduleHostingJob=async(runObj:IRunPropsHost)=>{
    k8sbatchAPi.createNamespacedJob("scs-cloud",hostingJob(runObj));
}