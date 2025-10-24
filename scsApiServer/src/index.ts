import express, { NextFunction, Request,Response } from 'express';
import { dbConnect } from './db/db';
import cors from 'cors'
import userRouter from './routes/user.routes';
import cookieParser from 'cookie-parser';
import 'dotenv/config'
import transcodingRouter from './routes/transcoding.service.routes';
import paymentRouter from './routes/payment.routes';
import httpProxy from 'http-proxy'
import hostingRouter from './routes/hosting.routes';
import errorHandler from './middleware/error.middleware';
import asyncHandler from './utils/asyncHandler';
import response from './utils/response';

const app=express();

/**
 * @description Middleware to handle subdomain-based routing.
 */
app.get('/*',(req:Request,res:Response,next:NextFunction)=>{
    const hostname=req.hostname;
    const subdomain=hostname.split('.')[0];
    if(hostname!="localhost"&&subdomain!='api'){
        const resolveWeb=`${process.env.BUCKET_HOST_FOR_HOSTING!}/${subdomain}`
        const proxy=httpProxy.createProxy();
        proxy.web(req,res,{target:resolveWeb,changeOrigin:true})
        proxy.on('proxyReq',(proxyReq:any,req:any,res:any)=>{
            const url=req.url;
            if(url==='/'){
                proxyReq.path+='index.html'
            }
        })
        return;
    }
    next();
})

//middlewares
app.use(express.json())
.use(express.urlencoded({extended:true}))
.use(cors())
.use(cookieParser());

//routes
app.use('/api/v1',userRouter)
app.use('/api/v1',transcodingRouter)
app.use('/api/payment',paymentRouter)
app.use('/api/host',hostingRouter)

// health check route
app.get('/api/v1/health-check',asyncHandler(async(req:Request,res:Response)=>{
    response(res,200,'API is healthy',{timestamp: new Date().toISOString()});
}));
// error handling middleware
app.use(errorHandler);

const PORT=process.env.PORT || 8080;

dbConnect().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);   
    })
}).catch(()=>{
    console.log('error in connection');
    
})