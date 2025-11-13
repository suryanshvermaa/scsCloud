import { Worker } from "bullmq"
import scheduleHostingJob from "./schedule";

/**
 * @description Connection configuration for BullMQ workers
 */
const connection={
    connection:{
        host:process.env.QUEUE_HOST,
        port:Number(process.env.QUEUE_PORT),
        username:process.env.QUEUE_USER,
        password:process.env.QUEUE_PASSWORD,
    }
}


/**
 * @description Worker to process email sending jobs
 */
new Worker('HostingWorker', async job => {
    const data=JSON.parse(job.data);
    const {runProps}=data;
    await scheduleHostingJob(runProps);
},connection);