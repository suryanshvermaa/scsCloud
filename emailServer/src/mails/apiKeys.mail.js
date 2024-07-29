import nodemailer from 'nodemailer';
import 'dotenv/config'

export const apiKeysEmail=async(email,accessKey,secretAccessKey)=>{
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
        subject:"API KEYS!!",
        text:"API KEYS!!",
        html:`<h2 style="text-align:center;">Plese don't share your api keys.<p>your api keys are:-</p><p>accessKey:${accessKey}</p><p>secretAccessKey: ${secretAccessKey}</p></h1>`
     })
     console.log('sended');
}