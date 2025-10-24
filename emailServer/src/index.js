import { Worker } from 'bullmq';
import 'dotenv/config';
import {sendEmail} from './mails/otp.mail.js'
import {sendTranscodingEmail} from './mails/transcoding.mail.js'
import { apiKeysEmail } from './mails/apiKeys.mail.js';
import {hostingEmail} from './mails/hosting.mail.js'
import { hostingRenewalEmail } from './mails/hostingRenewal.mail.js';
import {paymentMail} from './mails/payment.mail.js'


/**
 * @description Connection configuration for BullMQ workers
 */
const connection={
    connection:{
        host:process.env.QUEUE_HOST,
        port:19482,
        username:process.env.QUEUE_USER,
        password:process.env.QUEUE_PASSWORD,
    }
}

/**
 * @description Worker to process email sending jobs
 */
const emailWorker = new Worker('Email', async job => {
    const data=JSON.parse(job.data);
    const {email,otp}=data;
    console.log(data);
    await sendEmail(email,otp);
     
},connection);

/**
 * @description Worker to process transcoding email jobs
 */
const transcodingWorker = new Worker('TranscodingQueue', async job => {
    const data=JSON.parse(job.data);
    const {email,videoKey}=data;
    const videoKeyModified=String(videoKey).split('/')[1];
    await sendTranscodingEmail(email,videoKeyModified);
    console.log('send');  
},connection);

/**
 * @description Worker to process API keys email jobs
 */
const apiKeysWorker=new Worker('APIKEYS', async job => {
    const data=JSON.parse(job.data);
    const {email,accessKey,secretAccessKey}=data;
    await apiKeysEmail(email,accessKey,secretAccessKey);
    console.log('send');  
},connection);

/**
 * @description Worker to process hosting email jobs
 */
const hostingWorker=new Worker('Hosting', async job => {
    const data=JSON.parse(job.data);
    const {email,websiteUrl}=data;
    await hostingEmail(email,websiteUrl);
    console.log('send');  
},connection);

/**
 * @description Worker to process hosting renewal email jobs
 */
const hostingRenewalWorker=new Worker('HostingRenewal', async job => {
    const data=JSON.parse(job.data);
    const {email,websiteUrl}=data;
    await hostingRenewalEmail(email,websiteUrl);
    console.log('send');  
},connection);

/**
 * @description Worker to process payment email jobs
 */
const paymentWorker=new Worker('PaymentQueue', async job => {
    const data=JSON.parse(job.data);
    const {email,amount,paymentId}=data;
    await paymentMail(email,amount,paymentId);
    console.log('send');  
},connection);


