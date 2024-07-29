import nodemailer from 'nodemailer';
import 'dotenv/config'

export const sendEmail=async(email,otp)=>{
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
        subject:"Suryansh' app Verification !!",
        text:"Verification !!",
        html:`<h2 style="text-align:center;">YOUR OTP for verfication on SCS is</h2><h1 style="text-align:center;"><b>${otp}</b></h1>`
     })
     console.log('sended');
}