import { Request, Response } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import 'dotenv/config'
import { generateAccessToken, generateRefreshToken } from "../utils/tokens";
import { emailQueue,apiKeysQueue } from "../services/queue.service";



export const register=async(req:Request,res:Response)=>{
  try {
    const {email,password,name}=req.body;
    if(email && password && name){
        const otp=Math.floor(Math.random()*1000000);
        emailQueue.add('email'+Date.now(),JSON.stringify({email,otp}))
        const tokenData={
         email,password,name,otp
        }
        const verifyToken=await jwt.sign(tokenData,process.env.OTP_SECRET!);
        res.status(201)
        .cookie('authCookie',verifyToken,{
         httpOnly:true,
         maxAge:900000
        })
        .json({
         success:true,
         message:"Please Check your otp for verification",
         cookie:{
            key:"authCookie",
            value:verifyToken
         }
        })
        
    }else{
     res.status(400).json({
         success:false,
         message:'Please provide all the fields',
     })
    }
  } catch (error:any) {
    res.status(400)
    .json({
        success:false,
        error:error.message,
    })
  }
}

export const verifyEmail=async(req:Request,res:Response)=>{

   try {
     const authCookie=req.cookies.authCookie || req.body.cookie;
     const enteredOtp=req.body.OTP;
     if(authCookie && enteredOtp){
         const verifiedData=await jwt.verify(authCookie,process.env.OTP_SECRET!);
     if(verifiedData){
         const {email,password,otp,name}=JSON.parse(JSON.stringify(verifiedData));
       if(otp==enteredOtp){
         const user=await User.create({
             email,password,name
            });
            const data=await user.save;
            res.status(201)
            .clearCookie("authCookie")
            .json({
             success:true,
             message:"user created successfully. you can login to your account",
             data
            })
       }else{
         res.status(400)
         .json({
             success:false,
             message:"Your otp is wrong or expired",
         })
       }
     }
     
     }else{
         res.status(400)
         .json({
             success:false,
             message:"otp is expired",
         })
     }
    
   } catch (error:any) {
    res.status(400)
    .json({
        success:false,
        error:error.message,
    })
   }
}

export const login=async(req:Request,res:Response)=>{
   try {
    const {email,password}=req.body;
    if(email && password){
        const user=await User.findOne({email}).select('+password');
   if(user){
    const isCorrect=await user?.comparePassword(password);
    if(isCorrect){
        const accessTokenPayload={userId:user._id,userName:user.name,email:user.email};
        const refreshTokenPayload={userId:user._id};
        const accessToken=await generateAccessToken(accessTokenPayload)
        const refreshToken=await generateRefreshToken(refreshTokenPayload);
        user.refreshToken=refreshToken;
        await user.save();
        res.status(200)
        .cookie("AccessCookie",accessToken,{httpOnly:true,maxAge:3600000})
        .cookie("RefreshCookie",refreshToken,{httpOnly:true,maxAge:43200000})
        .json({
            success:true,
            message:"login successfully",
            cookies:[
                {
                    
                        key:"AccessCookie",
                        value:accessToken
                     
                },
                {
                    
                    key:"RefreshCookie",
                    value:refreshToken
                }
            ]
        })

    }else{
        res.status(400).json({
            success:false,
            message:"incorrect email or password"
        })
    }
   }else{
    res.status(400)
    .json({
        success:false,
        message:"User not found",
    })
   }
    }else{
        res.status(400)
    .json({
        success:false,
        message:"User not found",
    })
    }
   } catch (error:any) {
    res.status(400)
    .json({
        success:false,
        error:error.message,
    })
   }
}

export const logout=async(req:Request,res:Response)=>{
    try {
        res.status(200).clearCookie("AccessCookie").clearCookie("RefreshCookie").json({
            success:true,
            message:"logout successfully"
        })
    } catch (error) {
        res.status(200).json({
            success:false,
            message:"failed to logout"
        })
    }
}

export const refreshToken=async(req:Request,res:Response)=>{
    try {
        const refreshToken=req.cookies.RefreshCookie ||req.body.refreshToken;
       if(refreshToken){
        const isVerified=await jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET!);
        if(isVerified){
            const {userId}=JSON.parse(JSON.stringify(isVerified));
            const user=await User.findById(userId);
            if(user){
                const accessTokenPayload={userId:user._id,userName:user.name,email:user.email};
                const refreshTokenPayload={userId:user._id};
                const accessToken=await generateAccessToken(accessTokenPayload)
                const refreshToken=await generateRefreshToken(refreshTokenPayload);
                user.refreshToken=refreshToken;
                await user.save();
                res.status(200)
                .cookie("AccessCookie",accessToken,{httpOnly:true,maxAge:3600000})//1 hour
                .cookie("RefreshCookie",refreshToken,{httpOnly:true,maxAge:43200000})//12 hour
                .json({
                    success:true,
                    message:"Access token refressment successfully",
                    cookies:[
                        {
                    
                            key:"AccessCookie",
                            value:accessToken
                         
                    },
                    {
                        
                        key:"RefreshCookie",
                        value:refreshToken
                    }
                    ]
                })
            }else{
                res.status(200).json({
                    success:false,
                    message:"wrong refresh token"
                })
            }
        }else{
            res.status(200).json({
                success:false,
                message:"wrong refresh token"
            })
        }
       }else{
        res.status(200).json({
            success:false,
            message:"wrong refresh token"
        })
       }
    } catch (error) {
        res.status(200).json({
            success:false,
            message:"failed to refresh access token"
        })
    }
}

export const getUserProfile=async(req:Request,res:Response)=>{
    try {
        const authCookie=req.cookies.AccessCookie || req.body.AccessCookie || req.query.token;
        const isVerified=await jwt.verify(authCookie,process.env.ACCESS_TOKEN_SECRET!);
        const {userId}=JSON.parse(JSON.stringify(isVerified)) 
        const user=await User.findById(userId).select('-refreshToken -isAdmin -_id')
        res.status(200).json({
            success:true,
            message:"user profile fetched successfully",
            data:user
        })
    } catch (error:any) {
        res.status(400).json({
            success:false,
            message:"failed to get user profile",
            error:error.message
        })
    }
}

export const getSCSCoins=async(req:Request,res:Response)=>{
    try {
        const authCookie=req.cookies.AccessCookie || req.body.AccessCookie || req.query.token;
        const isVerified=await jwt.verify(authCookie,process.env.ACCESS_TOKEN_SECRET!);
        if(isVerified){
            const {userId}=JSON.parse(JSON.stringify(isVerified)) 
        const user=await User.findById(userId).select('-refreshToken -isAdmin -_id')
        const scsCoins=user?.SCSCoins;
        res.status(200).json({
            success:true,
            message:"user profile fetched successfully",
            data:{
                scsCoins
            }
        })
        }else{
            res.status(401).json({
                success:false,
                error:"unauthorised",
            })
        }
    } catch (err:any) {
        res.status(400).json({
            success:false,
            mesaage:"error in getting scs coins",
            error:err.message
        })
    }
}

export const createApiKeys=async(req:Request,res:Response)=>{
    try {
        const authCookie=req.cookies.AccessCookie || req.body.AccessCookie || req.query.token;
        const isVerified=await jwt.verify(authCookie,process.env.ACCESS_TOKEN_SECRET!);
        if(isVerified){
            const {userId}=JSON.parse(JSON.stringify(isVerified))
            const user=await User.findById(userId);
           if(user){
            const accessKey=await jwt.sign({userId:user?._id},process.env.ACCESS_KEY_CREDENTIALS_SECRET!)
            const secretAccessKey=await jwt.sign({userId:user?._id},process.env.SECRET_ACCESS_KEY_CREDENTIALS_SECRET!)
            user.credentialsActive=true;
            user.accessKey=accessKey;
            user.secretAccessKey=secretAccessKey;
            const email=user.email;
            await user.save();
            apiKeysQueue.add('apiKeys'+Date.now(),JSON.stringify({email,accessKey,secretAccessKey}))
            res.status(201).json({
                success:true,
                message:'api keys created'
            })
           }else{
            res.status(400).json({
                success:false,
                error:"User not found"
            })
           }
        }else{
            res.status(400).json({
                success:false,
                error:"Unathorised"
            })
        }
         
    } catch (err:any) {
        res.status(400).json({
            success:false,
            message:"error in creating api keys",
            error:err.message
        })
    }
}

export const getAccessKey=async(req:Request,res:Response)=>{
    try {
        const authCookie=req.cookies.AccessCookie || req.body.AccessCookie || req.query.token;
        const isVerified=await jwt.verify(authCookie,process.env.ACCESS_TOKEN_SECRET!);
        if(isVerified){
            const {userId}=JSON.parse(JSON.stringify(isVerified))
            const user=await User.findById(userId);
           if(user){
           const accessKey=user.accessKey;
            res.status(201).json({
                success:true,
                data:{
                    accessKey
                }
            })
           }else{
            res.status(400).json({
                success:false,
                error:"User not found"
            })
           }
        }else{
            res.status(400).json({
                success:false,
                error:"Unathorised"
            })
        }
         
    } catch (err:any) {
        res.status(400).json({
            success:false,
            message:"error in getting access key",
            error:err.message
        })
    }
}