import { Request,Response } from "express";
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import {  spinTranscoder } from "../services/containers.service";
import User from "../models/user.model";
import { AppError } from "../utils/error";
import response from "../utils/response";
import asyncHandler from "../utils/asyncHandler";
import { getS3Client, putObjectSignedUrl } from "../services/objectStorage/methods";
import ObjectStorage from "../models/object-storage.model";

/**
 * @description Upload video URL generation for HLS transcoding
 * @param req upload request containing fileName and authentication details
 * @param res response object to send back the upload URL
 */
export const uploadVideoUrl=asyncHandler(async(req:Request,res:Response)=>{
    const {fileName,AccessCookie,credentials, videoSizeInMB,bucketName}=req.body;
    if(!fileName) throw new AppError('fileName is required',400);
    // Handle upload URL generation based on authentication method
    if(AccessCookie){ // -> Access Cookie authentication
        const isVerified=await jwt.verify(AccessCookie,process.env.ACCESS_TOKEN_SECRET!);
        if(!isVerified) throw new AppError('Invalid Access Cookie',401);
        const {email,userId}=JSON.parse(JSON.stringify(isVerified));
        const myUser=await User.findById(userId);
        if(!myUser) throw new AppError('User not found',404);
        if(!myUser.objectStorageServiceEnabled) throw new AppError('Object Storage Service is not enabled',403);
        if(myUser.SCSCoins<Number(process.env.TRANSCODER_SERVICE_CHARGE)*videoSizeInMB) throw new AppError('Insufficient SCSCoins',400);
        const userStorage=await ObjectStorage.findOne({userId});
        if(!userStorage) throw new AppError('Object Storage not configured',400);
        const s3Client=getS3Client({
            accessKeyId:userStorage.accessKey,
            secretAccessKey:userStorage.secretAccessKey,
            region: "ap-south-1",
            endpoint: process.env.IS_UNDER_KUBERNETES=="true"?userStorage.ingressEndpoint: "http://localhost:9000",
        })
        const uploadUrl=await putObjectSignedUrl(s3Client,bucketName,fileName);
        response(res,200,'uploading video',{uploadUrl,videoKey: fileName,email});
    }
        
    // Handle upload URL generation based on credentials
    if(credentials) { // -> Credentials authentication
        const {accessKey,secretAccessKey} =credentials;
        if(!accessKey || !secretAccessKey) throw new AppError('Credentials are required',400);
        const isVerified1=await jwt.verify(accessKey,process.env.ACCESS_KEY_CREDENTIALS_SECRET!)
        const isVerified2=await jwt.verify(secretAccessKey,process.env.SECRET_ACCESS_KEY_CREDENTIALS_SECRET!)
        if(!isVerified1 || !isVerified2) throw new AppError('Invalid Credentials',401);
        const user=await User.findOne({accessKey})
        if(!user) throw new AppError('User not found',404);
        if(!user.credentialsActive) throw new AppError('Credentials are not active',403);
        const userSecretAccessKey=user.secretAccessKey;
        if(userSecretAccessKey!==secretAccessKey) throw new AppError('Credentials do not match',401);
        if(!user.objectStorageServiceEnabled) throw new AppError('Object Storage Service is not enabled',403);
        const userStorage=await ObjectStorage.findOne({userId:user._id});
        if(!userStorage) throw new AppError('Object Storage not configured',400);
        if(user.SCSCoins<Number(process.env.TRANSCODER_SERVICE_CHARGE)*videoSizeInMB) throw new AppError('Insufficient SCSCoins',400);
        const s3Client=getS3Client({
            accessKeyId:userStorage.accessKey,
            secretAccessKey:userStorage.secretAccessKey,
            region: "ap-south-1",
            endpoint: process.env.IS_UNDER_KUBERNETES=="true"?userStorage.ingressEndpoint: "http://localhost:9000",
        })
        const uploadUrl=await putObjectSignedUrl(s3Client,bucketName,fileName);
        response(res,200,'uploading video',{uploadUrl,videoKey:`${fileName}`,email:user.email});
    }
    throw new AppError('Authentication required',401);
});

/**
 * @description Transcode video to HLS format
 * @param req request containing video details and authentication
 * @param res response object to send back the transcoding status
 */
export const transcodeVideo=asyncHandler(async(req:Request,res:Response)=>{
    const {videoKey,bucketPath,userBucketName,email,AccessCookie,credentials,videoSizeInMB}=req.body;
    if(!videoKey || !bucketPath || !userBucketName || !email) {
        throw new AppError('All fields are required',400);
    }
    // Handle transcoding based on authentication method
    if(AccessCookie){ // -> Access Cookie authentication
        if(!AccessCookie) throw new AppError('Access Cookie is required',400);
        const isVerified=await jwt.verify(AccessCookie,process.env.ACCESS_TOKEN_SECRET!)
        if(!isVerified) throw new AppError('Invalid Access Cookie',401);
        const user=await User.findOne({email})
        if(!user) throw new AppError('User not found',404);
         const serviceCharge=Number(process.env.TRANSCODER_SERVICE_CHARGE)*videoSizeInMB;
        if(user.SCSCoins<serviceCharge) throw new AppError('Insufficient SCSCoins',400);
        user.SCSCoins=user.SCSCoins-serviceCharge;
        const objectStorage=await ObjectStorage.findOne({userId:user._id});
        if(!objectStorage) throw new AppError('Object Storage not configured',400);
        await user.save();
        const runObj={videoKey: videoKey as string,
            userAccessKey:objectStorage.accessKey as string,
            userSecretAccessKey:objectStorage.secretAccessKey as string,
            userBucketName:userBucketName as string,
            bucketPath:bucketPath as string,
            email: email as string,
            storageEndpoint:`http://${objectStorage.service}.minio.svc.cluster.local:9000` as string
        };
        await spinTranscoder(runObj);
        response(res,200,'transcoding process is queued. when transcoding completes we will notify through email',{});
    }

    // Handle transcoding based on credentials
    if(credentials){ // -> Credentials authentication
        const {accessKey,secretAccessKey} =credentials;
        if(!accessKey || !secretAccessKey) throw new AppError('Credentials are required',400);
        const isVerified1=await jwt.verify(accessKey,process.env.ACCESS_KEY_CREDENTIALS_SECRET!)
        const isVerified2=await jwt.verify(secretAccessKey,process.env.SECRET_ACCESS_KEY_CREDENTIALS_SECRET!)
        if(!isVerified1 || !isVerified2) throw new AppError('Invalid Credentials',401);
        const user=await User.findOne({accessKey})
        if(!user) throw new AppError('User not found',404);
        if(!user.credentialsActive) throw new AppError('Credentials are not active',403);
        const userSecretAK=user.secretAccessKey;
        if(userSecretAK!==secretAccessKey) throw new AppError('User secret access key not found',404);
        const serviceCharge=Number(process.env.TRANSCODER_SERVICE_CHARGE)*videoSizeInMB;
        if(user.SCSCoins<serviceCharge) throw new AppError('Insufficient SCSCoins',400);
        user.SCSCoins=user.SCSCoins-serviceCharge;
        const objectStorage=await ObjectStorage.findOne({userId:user._id});
        if(!objectStorage) throw new AppError('Object Storage not configured',400);
        const runObj={videoKey: videoKey as string,
            userAccessKey:objectStorage.accessKey as string,
            userSecretAccessKey:objectStorage.secretAccessKey as string,
            userBucketName:userBucketName as string,
            bucketPath:bucketPath as string,
            email: email as string,
            storageEndpoint:`http://${objectStorage.service}.minio.svc.cluster.local:9000` as string
        };
        await spinTranscoder(runObj);
        response(res,200,'transcoding process is queued. when transcoding completes we will notify through email',{});
    };
    throw new AppError('Authentication required',401);
});