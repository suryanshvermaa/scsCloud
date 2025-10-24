import { Request, Response } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import 'dotenv/config'
import { generateAccessToken, generateRefreshToken } from "../utils/tokens";
import { emailQueue,apiKeysQueue } from "../services/queue.service";
import { AppError } from "../utils/error";
import asyncHandler from "../utils/asyncHandler";
import response from "../utils/response";


/**
 * @description Register a new user and send OTP for email verification
 * @param req request object containing user details
 * @param res response object to send back the result
 */
export const register=asyncHandler(async(req:Request,res:Response)=>{
    const {email,password,name}=req.body;
    if(!email || !password || !name) throw new AppError('Please provide all the fields',400);
    const otp=Math.floor(Math.random()*1000000);
    emailQueue.add('email'+Date.now(),JSON.stringify({email,otp}))
    const tokenData={
        email,password,name,otp
    }
    const verifyToken=await jwt.sign(tokenData,process.env.OTP_SECRET!);
    response(res,201,"Please Check your otp for verification",{cookie:{
        key:"authCookie",
        value:verifyToken
    }})
});

/**
 * @description Verify user's email using OTP and create a new user account
 * @param req request object containing OTP and auth cookie
 * @param res response object to send back the result
 */
export const verifyEmail=asyncHandler(async(req:Request,res:Response)=>{
    const authCookie=req.body.cookie;
    const enteredOtp=req.body.OTP;
    if(!authCookie || !enteredOtp) throw new AppError('Authentication cookie is missing',400);
    const verifiedData=await jwt.verify(authCookie,process.env.OTP_SECRET!);
    if(!verifiedData) throw new AppError('Invalid authentication cookie',400);
    const {email,password,otp,name}=JSON.parse(JSON.stringify(verifiedData));
    if(otp!==enteredOtp) throw new AppError('Invalid OTP',400);
    const user=await User.create({
        email,password,name
    });
    const data=await user.save();
    response(res,201,"user created successfully. you can login to your account",{});
});

/**
 * @description Login user and generate access and refresh tokens
 * @param req request object containing user credentials
 * @param res response object to send back the result
 */
export const login=asyncHandler(async(req:Request,res:Response)=>{
    const {email,password}=req.body;
    if(!email || !password) throw new AppError('Please provide email and password',400);
    const user=await User.findOne({email}).select('+password');
    if(!user) throw new AppError('Invalid email or password',400);
    const isCorrect=await user?.comparePassword(password);
    if(!isCorrect) throw new AppError('Invalid email or password',400);
    const accessTokenPayload={userId:user._id,userName:user.name,email:user.email};
    const refreshTokenPayload={userId:user._id};
    const accessToken=await generateAccessToken(accessTokenPayload)
    const refreshToken=await generateRefreshToken(refreshTokenPayload);
    user.refreshToken=refreshToken;
    await user.save();
    response(res,200,"login successfully",{
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
});


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