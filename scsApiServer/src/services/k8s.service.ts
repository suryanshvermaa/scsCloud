import { IRunProps, IRunPropsHost } from "./containers.service";
import hostingJob from "./k8s/hostingJob";
import { k8sbatchAPi, k8sObjectApi } from "./k8s/k8s";
import transcodingJob from "./k8s/transcodingJob";
import getIngressConfig from "./k8s/websiteIngress";

export const scheduleTranscodingJob=async(runObj:IRunProps)=>{
    k8sbatchAPi.createNamespacedJob("scs-cloud",transcodingJob(runObj));
}

export const scheduleHostingJob=async(runObj:IRunPropsHost)=>{
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

