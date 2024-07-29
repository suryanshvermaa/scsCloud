import nodemailer from 'nodemailer';
import 'dotenv/config'

export const sendTranscodingEmail=async(email,videoKey)=>{
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
        subject:"Transcoding !!",
        text:"Transcoding completion !!",
        html:`<h2 style="text-align:center;">YOUR Video ${videoKey} has been transcoded</h2><h1 style="text-align:center;">video:<b>${videoKey}</b></h1>`
     })
     console.log('sended');
}
