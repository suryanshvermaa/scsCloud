import { Queue } from "bullmq";
import 'dotenv/config';

const connection={
    connection:{
        host:process.env.QUEUE_HOST,
        port:Number(process.env.QUEUE_PORT),
        username:process.env.QUEUE_USER,
        password:process.env.QUEUE_PASSWORD
    }
};

/**
 * @description emailQueue is used for handling email-related tasks in the application. 
 */
export const emailQueue = new Queue('Email',connection);

/**
 * @description apiKeysQueue is responsible for managing API key related operations in the queue system.
 */
export const apiKeysQueue=new Queue('APIKEYS',connection);

/**
 * @description hostingQueue handles tasks related to hosting services within the application.
 */
export const hostingQueue=new Queue('Hosting',connection);

/**
 * @description hostingRenewalQueue is dedicated to processing hosting renewal tasks in the queue system.
 */
export const hostingRenewalQueue=new Queue('HostingRenewal',connection);

/**
 * @description paymentQueue manages payment processing tasks within the application's queue infrastructure.
 */
export const paymentQueue=new Queue('PaymentQueue',connection);

/**
 * @description hostingWorkerQueue is used for processing background tasks related to hosting services.
 */
export const hostingWorkerQueue=new Queue('HostingWorker',connection);

/**
 * @description transcodingWorkerQueue handles video transcoding tasks in the background.
 */
export const transcodingWorkerQueue=new Queue('TranscodingWorker',connection);