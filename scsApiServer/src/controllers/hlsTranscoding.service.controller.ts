import { Request,Response } from "express";
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { putObjectSignedUrl } from "../services/s3.service";
import { spinTranscoder } from "../services/ecs.service";
import User from "../models/user.model";

export const uploadVideoUrl=async(req:Request,res:Response)=>{
    try {
        const {fileName,AccessCookie,credentials}=req.body;
        
        if(fileName && AccessCookie){
            const isVerified=await jwt.verify(AccessCookie,process.env.ACCESS_TOKEN_SECRET!);
            if(isVerified){
                const {email,userId}=JSON.parse(JSON.stringify(isVerified))
                const myUser=await User.findById(userId);
               if(myUser && myUser.SCSCoins>=Number(process.env.TRANSCODER_SERVICE_CHARGE)){
                const uploadUrl=await putObjectSignedUrl(fileName);            
                res.status(200).
                   json({
                 success:true,
                 message:'uploading video',
                 uploadUrl,
                 videoKey:`outputs/${fileName}`,
                 email
                  })
               }else{
                res.status(400).
                json({
                    success:false,
                    message:'You have no sufficient amount'
                })
               }
            }else{
                res.status(400).
                json({
                    success:false,
                    message:'error in uploading video'
                })
           }
            }
            if(fileName && credentials){
                const {accessKey,secretAccessKey} =credentials;
                const isVerified1=await jwt.verify(accessKey,process.env.ACCESS_KEY_CREDENTIALS_SECRET!)
                const isVerified2=await jwt.verify(secretAccessKey,process.env.SECRET_ACCESS_KEY_CREDENTIALS_SECRET!)
                if(isVerified1 && isVerified2){
                    const user=await User.findOne({accessKey})
                    if(user?.credentialsActive){
                        const userSecretAccessKey=user.secretAccessKey;
                        if(userSecretAccessKey==secretAccessKey){
                            
                            if(user && user.SCSCoins>=Number(process.env.TRANSCODER_SERVICE_CHARGE)){
                             const uploadUrl=await putObjectSignedUrl(fileName);
                            
                             res.status(200).
                                json({
                              success:true,
                              message:'uploading video',
                              uploadUrl,
                              videoKey:`outputs/${fileName}`,
                               })
                            }else{
                                res.status(400).json({
                                    success:false,
                                    error:'invalid credentials or not sufficient amount'
                                })
                            }
                        }else{
                            res.status(400).json({
                                success:false,
                                error:'invalid credentials'
                            })
                        }       
                    }else{
                        res.status(400).json({
                            success:false,
                            error:'invalid credentials'
                        })
                    }
                }else{
                    res.status(400).json({
                        success:false,
                        error:'invalid credentials'
                    })
                }
            }
    } catch (error) {
        res.status(400).
        json({
            success:false,
            message:'error in uploading video'
        })
    }
}

export const transcodeVideo=async(req:Request,res:Response)=>{
   try {
    const {videoKey,userAccessKey,userSecretAccessKey,bucketPath,userBucketName,email,AccessCookie,credentials}=req.body;
    if(videoKey && userAccessKey && userSecretAccessKey && bucketPath && userBucketName && email && AccessCookie){
        const runObj={videoKey,userAccessKey,userSecretAccessKey,bucketPath,userBucketName,email};
        const isVerified=await jwt.verify(AccessCookie,process.env.ACCESS_TOKEN_SECRET!)
        if(isVerified){
            const user=await User.findOne({email})
           if(user){
            const serviceCharge=Number(process.env.TRANSCODER_SERVICE_CHARGE);
            user.SCSCoins=user.SCSCoins-serviceCharge;
            await user.save();
            await spinTranscoder(runObj);
            res.status(200).
            json({
                success:true,
                message:'transcoding process is queued. when transcoding completes we will notify through email'
            })
           }else{
            res.status(400).
            json({
                success:false,
                message:'email is wrong'
            })
           }
           }else{
           res.status(400).
           json({
               success:false,
               message:'error in transcoding video'
           })
           }

    }
    if(videoKey && userAccessKey && userSecretAccessKey && bucketPath && userBucketName && email && credentials){
        const runObj={videoKey,userAccessKey,userSecretAccessKey,bucketPath,userBucketName,email};
        const {accessKey,secretAccessKey} =credentials;
        const isVerified1=await jwt.verify(accessKey,process.env.ACCESS_KEY_CREDENTIALS_SECRET!)
        const isVerified2=await jwt.verify(secretAccessKey,process.env.SECRET_ACCESS_KEY_CREDENTIALS_SECRET!)
        if(isVerified1 && isVerified2){
            const user=await User.findOne({accessKey})
            if(user?.credentialsActive){
                 const userSecretAccessKey=user.secretAccessKey;
                 if(userSecretAccessKey==secretAccessKey){
                    const serviceCharge=Number(process.env.TRANSCODER_SERVICE_CHARGE);
                    user.SCSCoins=user.SCSCoins-serviceCharge;
                    await user.save();
                    
                    await spinTranscoder(runObj);
                    res.status(200).
                    json({
                        success:true,
                        message:'transcoding process is queued. when transcoding completes we will notify through email'
                    })
                   }else{
                   res.status(400).
                   json({
                       success:false,
                       message:'error in transcoding video'
                   })
                   }
                 }else{
                    res.status(400).json({
                        success:false,
                        error:'invalid credentials'
                    })
                 }
            }else{
                res.status(400).json({
                    success:false,
                    error:'invalid credentials'
                })
            }
           
    }
    
    else{
        res.status(400).
        json({
            success:false,
            message:'error in transcoding video'
        })
            } 
  
      
   } catch (error) {
    res.status(400).
    json({
        success:false,
        message:'error in transcoding video'
    })
   }
    
}