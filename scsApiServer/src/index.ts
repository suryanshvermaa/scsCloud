import express, { NextFunction, request, Request,response,Response } from 'express';
import { dbConnect } from './db/db';
import cors from 'cors'
import userRouter from './routes/user.routes';
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import transcodingRouter from './routes/transcoding.service.routes';
import paymentRouter from './routes/payment.routes';
import httpProxy from 'http-proxy'
import hostingRouter from './routes/hosting.routes';

const app=express();

//proxy request
app.get('/*',(req:Request,res:Response,next:NextFunction)=>{
    const hostname=req.hostname;
    const subdomain=hostname.split('.')[0];
    if(subdomain=='api'){
        next()
    }else{
        const resolveWeb=`https://s3.ap-south-1.amazonaws.com/testingsuryansh.bucket/hosted-websites/${subdomain}`
        const proxy=httpProxy.createProxy();
        proxy.web(req,res,{target:resolveWeb,changeOrigin:true})
        proxy.on('proxyReq',(proxyReq:any,req:any,res:any)=>{
            const url=req.url;
            if(url==='/'){
                proxyReq.path+='index.html'
            }
        })
    }
})

app.use(express.json())
.use(express.urlencoded({extended:true}))
.use(cors())
.use(cookieParser())

app.use('/api/v1',userRouter)
app.use('/api/v1',transcodingRouter)
app.use('/api/payment',paymentRouter)
app.use('/api/host',hostingRouter)



const PORT=process.env.PORT || 8080;
dbConnect().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);   
    })
}).catch(()=>{
    console.log('error in connection');
    
})