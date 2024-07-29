import nodemailer from 'nodemailer';
import 'dotenv/config'

export const hostingRenewalEmail=async(email,websiteUrl)=>{
     const transporter=await nodemailer.createTransport({
        service:'gmail',
        auth:{
         user:process.env.MY_EMAIL,
         pass:process.env.MY_PASSWORD
        }
     });

     const info=await transporter.sendMail({
        from:'suryanshverma.nitp@gmail.com',
        to:email,
        subject:"Hosting Renewal successful!!",
        text:"Renewal information !!",
        html:`<h2 style="text-align:center;">Your website ${websiteUrl} has been renewalled for 30 days.</h1>`
     })
     console.log('sended');
}