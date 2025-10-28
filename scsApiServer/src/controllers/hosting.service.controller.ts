import { Request,Response } from "express";
import jwt from 'jsonwebtoken';
import { spinHoster } from "../services/containers.service";
import { generateSlug } from "random-word-slugs";
import Website, { IHosting } from "../models/hosting-website.model";
import User from "../models/user.model";
import { hostingQueue, hostingRenewalQueue } from "../services/queue.service";
import asyncHandler from "../utils/asyncHandler";
import response from "../utils/response";

/**
 * @description Host a website for a verified user with sufficient SCSCoins.
 * @param req request object containing website details and user token
 * @param res response object to send back the hosting result   
 */
export const hostWebsite=asyncHandler(async(req:Request,res:Response)=>{
    const AccessCookie=req.body.AccessCookie||req.query.token;
    if(!AccessCookie) throw new Error('Access token is required');
    const {websiteName,websiteType,gitUrl}=req.body;
    if(!websiteName||!websiteType||!gitUrl) throw new Error('websiteName, websiteType and gitUrl are required');
    const isVerified=await jwt.verify(AccessCookie,process.env.ACCESS_TOKEN_SECRET!);
    if(!isVerified) throw new Error('Invalid access token');
    const {userId}=JSON.parse(JSON.stringify(isVerified));
    const myUser=await User.findById(userId);
    if(!myUser) throw new Error('User not found');
    if(myUser.SCSCoins<Number(process.env.HOSTING_SERVICE_CHARGE_PER_30_DAYS)) throw new Error('Insufficient SCSCoins');

    const webUrl=await generateSlug();
    const runObj={
        gitUrl,
        webUrl
    }
    spinHoster(runObj)
    const websiteUrl=`http://${webUrl}.${process.env.HOSTING_DOMAIN!}`;
    const s3bucketUrl=`${process.env.BUCKET_HOST_FOR_HOSTING!}/${webUrl}`;
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
    response(res,201,'successfully hosted website.It will take 1-2 minutes to activate your url',{
        websiteUrl,
        validDate
    })
})

/**
 * @description Get the hosted websites of the authenticated user
 * @param req request object containing user credentials
 * @param res response object to send back the hosted websites 
 */
export const getWebsites=asyncHandler(async(req:Request,res:Response)=>{
    const AccessCookie=req.body.AccessCookie || req.cookies.AccessCookie || req.query.token
    const isVerified=await jwt.verify(AccessCookie,process.env.ACCESS_TOKEN_SECRET!);
    if(!isVerified) throw new Error('Invalid access token');
    const {userId}=JSON.parse(JSON.stringify(isVerified));
    const websites=await Website.find({user:userId}).select('-s3bucketUrl')
    response(  res,200,'successfully got websites data',{data:websites})
});

/**
 * @description Renew the validity of a hosted website for an additional 30 days
 * @param req request object containing website ID and user token
 * @param res response object to send back the renewal result
 */
export const renewValidity=asyncHandler(async(req:Request,res:Response)=>{
    const AccessCookie=req.body.AccessCookie ||req.query.token
    const {websiteId}=req.body;
    if(!websiteId) throw new Error('websiteId is required');
    if(!AccessCookie) throw new Error('Access token is required');
    const isVerified=await jwt.verify(AccessCookie,process.env.ACCESS_TOKEN_SECRET!);
    if(!isVerified) throw new Error('Invalid access token');
    const {userId}=JSON.parse(JSON.stringify(isVerified));
    const myUser=await User.findById(userId);
    if(!myUser) throw new Error('User not found');
    if(myUser.SCSCoins<Number(process.env.HOSTING_SERVICE_CHARGE_PER_30_DAYS)) throw new Error('Insufficient SCSCoins');
    const website=await Website.findOne({user:userId,_id:websiteId})
    if(!website) throw new Error('Website not found');
    const validDate = new Date(website.validDate);
    const currentDate=new Date();
    
    if(validDate<currentDate){
        validDate.setDate(currentDate.getDate()+30)
    }else{
        validDate.setDate(validDate.getDate()+30)
    }
    const serviceCharge=Number(process.env.HOSTING_SERVICE_CHARGE_PER_30_DAYS);
    myUser.SCSCoins=myUser.SCSCoins-serviceCharge;
    website.validDate=validDate;
    hostingRenewalQueue.add('HostingRenewal'+Date.now(),JSON.stringify({email:myUser.email,websiteUrl:website.websiteUrl}))
    await myUser.save();
    await website.save();
    response(res, 201, 'successfully increased validity of hosted website.', {});        
})