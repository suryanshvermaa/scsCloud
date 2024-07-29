import nodemailer from 'nodemailer';
import 'dotenv/config'

export const hostingEmail=async(email,websiteUrl)=>{
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
        subject:"Hosting successful!!",
        text:"hosting information !!",
        html:`<h2 style="text-align:center;">Your website successfully hosted. and your website Url is:-<a href=${websiteUrl}>${websiteUrl}</a></h1>`
     })
     console.log('sended');
}