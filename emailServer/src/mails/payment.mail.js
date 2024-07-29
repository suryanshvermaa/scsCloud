import nodemailer from 'nodemailer';
import 'dotenv/config'

export const paymentMail=async(email,amount,paymentId)=>{
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
        subject:"payment Mail!!",
        text:"payment successful !!",
        html:`<h2 style="text-align:center;">Your paymnet successful of ${amount}rs with payment Id:${paymentId}</h1>`
     })
     console.log('sended');
}