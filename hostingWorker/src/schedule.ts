import { k8sbatchAPi, k8sObjectApi } from "./config/k8s";
import { getIngressConfig, hostingJob, IRunPropsHost } from "./manifests";

const scheduleHostingJob=async(runObj:IRunPropsHost)=>{
    await k8sbatchAPi.createNamespacedJob("scs-cloud",hostingJob(runObj));
    // Create an Ingress for the hosted app
    await k8sObjectApi.create(
        getIngressConfig(
            runObj.webUrl,
            `${runObj.webUrl}.${(process.env.HOSTING_DOMAIN!).split(":")[0]}`, // Remove port if present
            "scs-cloud-app-service",
            3000,
            "scs-cloud",
        )
    );
}
export default scheduleHostingJob;