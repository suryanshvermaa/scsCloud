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

/**
 * @description Refresh access and refresh tokens using a valid refresh token
 * @param req request object containing the refresh token
 * @param res response object to send back the result
 */
export const refreshToken=asyncHandler(async(req:Request,res:Response)=>{
    const refreshToken=req.body.refreshToken;
    if(!refreshToken) throw new AppError('Refresh token is missing',400);
    const isVerified=await jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET!);
    if(!isVerified) throw new AppError('Invalid refresh token',400);
    const {userId}=JSON.parse(JSON.stringify(isVerified));
    const user=await User.findById(userId);
    if(!user) throw new AppError('User not found',404);
    if(user.refreshToken!==refreshToken) throw new AppError('Refresh token does not match',400);
    const accessTokenPayload={userId:user._id,userName:user.name,email:user.email};
    const refreshTokenPayload={userId:user._id};
    const accessT=await generateAccessToken(accessTokenPayload)
    const refreshT=await generateRefreshToken(refreshTokenPayload);
    user.refreshToken=refreshT;
    await user.save();
    response(res,200,"Refresh token generated successfully",{
        cookies:[
            {
                key:"AccessCookie",
                value:accessT
            },
            {
                key:"RefreshCookie",
                value:refreshT
            }
        ]
    })
});

/**
 * @description Get user profile information
 * @param req request object containing user credentials
 * @param res response object to send back the result
 */
export const getUserProfile=asyncHandler(async(req:Request,res:Response)=>{
    const authCookie=req.body.AccessCookie || req.query.token;
    if(!authCookie) throw new AppError('Authentication cookie is missing',400);
    const isVerified=await jwt.verify(authCookie,process.env.ACCESS_TOKEN_SECRET!);
    if(!isVerified) throw new AppError('Invalid authentication cookie',400);
    const {userId}=JSON.parse(JSON.stringify(isVerified)) 
    const user=await User.findById(userId).select('-refreshToken -isAdmin -_id')
    response( res,200,"user profile fetched successfully",{data:user})
})

/**
 * @description Get the SCS coins of the authenticated user
 * @param req request object containing user credentials
 * @param res response object to send back the result
 */
export const getSCSCoins=asyncHandler(async(req:Request,res:Response)=>{
    const authCookie=req.cookies.AccessCookie || req.body.AccessCookie || req.query.token;
    if(!authCookie) throw new AppError('Authentication cookie is missing',400);
    const isVerified=await jwt.verify(authCookie,process.env.ACCESS_TOKEN_SECRET!);
    if(!isVerified) throw new AppError('Invalid authentication cookie',400);
    const {userId}=JSON.parse(JSON.stringify(isVerified)) 
    const user=await User.findById(userId).select('-refreshToken -isAdmin -_id')
    const scsCoins=user?.SCSCoins;
    response(  res,200,"user profile fetched successfully",{data:{scsCoins}})
});

/**
 * @description Create API keys for the authenticated user
 * @param req request object containing user credentials
 * @param res response object to send back the result   
 */
export const createApiKeys=asyncHandler(async(req:Request,res:Response)=>{
    const authCookie=req.cookies.AccessCookie || req.body.AccessCookie || req.query.token;
    if(!authCookie) throw new AppError('Authentication cookie is missing',400);
    const isVerified=await jwt.verify(authCookie,process.env.ACCESS_TOKEN_SECRET!);
    if(!isVerified) throw new AppError('Invalid authentication cookie',400);
    const {userId}=JSON.parse(JSON.stringify(isVerified))
    const user=await User.findById(userId);
    if(!user) throw new AppError('User not found',404);
    const accessKey=await jwt.sign({userId:user?._id},process.env.ACCESS_KEY_CREDENTIALS_SECRET!)
    const secretAccessKey=await jwt.sign({userId:user?._id},process.env.SECRET_ACCESS_KEY_CREDENTIALS_SECRET!)
    user.credentialsActive=true;
    user.accessKey=accessKey;
    user.secretAccessKey=secretAccessKey;
    const email=user.email;
    await user.save();
    apiKeysQueue.add('apiKeys'+Date.now(),JSON.stringify({email,accessKey,secretAccessKey}))
    response(  res,201,'api keys created',{});
});

/**
 * @description Get the access key of the authenticated user
 * @param req request object containing user credentials
 * @param res response object to send back the result
 */
export const getAccessKey=asyncHandler(async(req:Request,res:Response)=>{
    const authCookie=req.cookies.AccessCookie || req.body.AccessCookie || req.query.token;
    const isVerified=await jwt.verify(authCookie,process.env.ACCESS_TOKEN_SECRET!);
    if(!isVerified) throw new AppError('Invalid authentication cookie',400);
    const {userId}=JSON.parse(JSON.stringify(isVerified))
    const user=await User.findById(userId);
    if(!user) throw new AppError('User not found',404);
    const accessKey=user.accessKey;
    response(res,200,"access key fetched successfully",{data:{accessKey}})
});