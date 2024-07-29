import { Queue } from "bullmq";
import 'dotenv/config';

export const emailQueue = new Queue('Email',{
    connection:{
        host:process.env.QUEUE_HOST,
        port:19481,
        username:process.env.QUEUE_USER,
        password:process.env.QUEUE_PASSWORD
    }
});

export const apiKeysQueue=new Queue('APIKEYS',{
    connection:{
        host:process.env.QUEUE_HOST,
        port:19481,
        username:process.env.QUEUE_USER,
        password:process.env.QUEUE_PASSWORD
    }
})

export const hostingQueue=new Queue('Hosting',{
    connection:{
        host:process.env.QUEUE_HOST,
        port:19481,
        username:process.env.QUEUE_USER,
        password:process.env.QUEUE_PASSWORD
    }
})

export const hostingRenewalQueue=new Queue('HostingRenewal',{
    connection:{
        host:process.env.QUEUE_HOST,
        port:19481,
        username:process.env.QUEUE_USER,
        password:process.env.QUEUE_PASSWORD
    }
})

export const paymentQueue=new Queue('PaymentQueue',{
    connection:{
        host:process.env.QUEUE_HOST,
        port:19481,
        username:process.env.QUEUE_USER,
        password:process.env.QUEUE_PASSWORD
    }
})
