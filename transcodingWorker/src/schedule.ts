import { k8sbatchAPi } from "./config/k8s";
import transcodingJob from "./manifests";

export interface IRunProps {
  videoKey: string;
  userAccessKey: string;
  userSecretAccessKey: string;
  userBucketName: string;
  bucketPath: string;
  email: string;
  storageEndpoint: string;
}

const scheduleTranscodingJob=async(runObj:IRunProps)=>{
    k8sbatchAPi.createNamespacedJob("scs-cloud",transcodingJob(runObj));
}

export default scheduleTranscodingJob;
