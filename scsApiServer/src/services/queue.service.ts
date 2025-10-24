import { Queue } from "bullmq";
import 'dotenv/config';

/**
 * @description emailQueue is used for handling email-related tasks in the application. 
 */
export const emailQueue = new Queue('Email',{
    connection:{
        host:process.env.QUEUE_HOST,
        port:19481,
        username:process.env.QUEUE_USER,
        password:process.env.QUEUE_PASSWORD
    }
});

/**
 * @description apiKeysQueue is responsible for managing API key related operations in the queue system.
 */
export const apiKeysQueue=new Queue('APIKEYS',{
    connection:{
        host:process.env.QUEUE_HOST,
        port:19481,
        username:process.env.QUEUE_USER,
        password:process.env.QUEUE_PASSWORD
    }
})

/**
 * @description hostingQueue handles tasks related to hosting services within the application.
 */
export const hostingQueue=new Queue('Hosting',{
    connection:{
        host:process.env.QUEUE_HOST,
        port:19481,
        username:process.env.QUEUE_USER,
        password:process.env.QUEUE_PASSWORD
    }
})

/**
 * @description hostingRenewalQueue is dedicated to processing hosting renewal tasks in the queue system.
 */
export const hostingRenewalQueue=new Queue('HostingRenewal',{
    connection:{
        host:process.env.QUEUE_HOST,
        port:19481,
        username:process.env.QUEUE_USER,
        password:process.env.QUEUE_PASSWORD
    }
})

/**
 * @description paymentQueue manages payment processing tasks within the application's queue infrastructure.
 */
export const paymentQueue=new Queue('PaymentQueue',{
    connection:{
        host:process.env.QUEUE_HOST,
        port:19481,
        username:process.env.QUEUE_USER,
        password:process.env.QUEUE_PASSWORD
    }
})
