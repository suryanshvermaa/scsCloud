import { Request,Response } from "express";
import jwt from 'jsonwebtoken';
import { spinHoster } from "../services/ecs.service";
import { generateSlug } from "random-word-slugs";
import Website, { IHosting } from "../models/hosting-website.model";
import User from "../models/user.model";
import { hostingQueue, hostingRenewalQueue } from "../services/queue.service";

export const hostWebsite=async(req:Request,res:Response)=>{
    try {
        const AccessCookie=req.body.AccessCookie || req.cookies.AccessCookie || req.query.token
        const {websiteName,websiteType,gitUrl}=req.body;
        const isVerified=await jwt.verify(AccessCookie,process.env.ACCESS_TOKEN_SECRET!);
        if(isVerified){
            const {userId}=JSON.parse(JSON.stringify(isVerified));
            const myUser=await User.findById(userId);
            if(myUser && myUser?.SCSCoins>=Number(process.env.HOSTING_SERVICE_CHARGE_PER_30_DAYS)){
                const webUrl=await generateSlug();
                const runObj={
                    gitUrl,
                    webUrl
                }
               
                spinHoster(runObj)
                const websiteUrl=`https://${webUrl}.suryanshverma.site`;
                const s3bucketUrl=`https://s3.ap-south-1.amazonaws.com/testingsuryansh.bucket/hosted-websites/${webUrl}`;
                const user=userId;
                hostingQueue.add('Hosting'+Date.now(),JSON.stringify({email:myUser.email,websiteUrl}))
                const validDate = new Date();
                validDate.setDate(validDate.getDate() + 30);
                const serviceCharge=Number(process.env.HOSTING_SERVICE_CHARGE_PER_30_DAYS);
                myUser.SCSCoins=myUser.SCSCoins-serviceCharge;
                await myUser.save();
                const website:IHosting=await Website.create({
                    websiteName,websiteType,websiteUrl,s3bucketUrl,user,validDate
                })
                await website.save();
                res.status(201)
                .json({
                    success:true,
                    message:'successfully hosted website.It will take 1-2 minutes to activate your url',
                    data:{
                        websiteUrl,
                        validDate
                    }
                })
            }else{
                res.status(400).json({
                    success:false,
                    message:'you have not sufficient amount'
                })
            }
           
            
        }else{
            res.status(401).json({
                success:false,
                message:'unauthorised'
            })
        }

    } catch (error:any) {
        res.status(400).json({
            success:false,
            message:'error in hosting website',
            error:error.message
        })
    }
}

export const getWebsites=async(req:Request,res:Response)=>{
    try {
        const AccessCookie=req.body.AccessCookie || req.cookies.AccessCookie || req.query.token
        const isVerified=await jwt.verify(AccessCookie,process.env.ACCESS_TOKEN_SECRET!);
        if(isVerified){
            const {userId}=JSON.parse(JSON.stringify(isVerified));
            const websites=await Website.find({user:userId}).select('-s3bucketUrl')
            res.status(200).json({
                success:true,
                message:"successfully got websites data",
                data:websites
            })
        }else{
            res.status(400).json({
                success:false,
                message:"unathorised",
                error:'unathorised'
            })
        }
    } catch (err:any) {
        res.status(400).json({
            success:false,
            message:"error in getting websites",
            error:err.message
        })
    }
}

export const renewValidity=async(req:Request,res:Response)=>{
    try {
        const AccessCookie=req.body.AccessCookie || req.cookies.AccessCookie || req.query.token
        const {websiteId}=req.body;
        const isVerified=await jwt.verify(AccessCookie,process.env.ACCESS_TOKEN_SECRET!);
        if(isVerified){
            const {userId}=JSON.parse(JSON.stringify(isVerified));
            const myUser=await User.findById(userId);
            if(myUser && myUser?.SCSCoins>=Number(process.env.HOSTING_SERVICE_CHARGE_PER_30_DAYS)){
                const website=await Website.findOne({user:userId,_id:websiteId})
                
               if(website){
                const validDate = new Date(website.validDate);
                validDate.setDate(validDate.getDate()+30)
                const serviceCharge=Number(process.env.HOSTING_SERVICE_CHARGE_PER_30_DAYS);
                myUser.SCSCoins=myUser.SCSCoins-serviceCharge;
                website.validDate=validDate;
                hostingRenewalQueue.add('HostingRenewal'+Date.now(),JSON.stringify({email:myUser.email,websiteUrl:website.websiteUrl}))

                await myUser.save();
                await website.save();
                res.status(201)
                .json({
                    success:true,
                    message:'successfully increased validity of hosted website.',
                })
               }else{
                res.status(400).json({
                    success:false,
                    message:'website not found'
                })
               }
            }else{
                res.status(400).json({
                    success:false,
                    message:'you have not sufficient amount'
                })
            }
           
            
        }else{
            res.status(401).json({
                success:false,
                message:'unauthorised'
            })
        }

    } catch (error:any) {
        res.status(400).json({
            success:false,
            message:'error in hosting website',
            error:error.message
        })
    }
}