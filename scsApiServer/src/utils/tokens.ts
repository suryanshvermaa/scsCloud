import jwt from 'jsonwebtoken';
import 'dotenv/config';
import crypto from 'crypto';

export const generateAccessToken=async(tokenPayload:object)=>{
    const token=await jwt.sign(tokenPayload,process.env.ACCESS_TOKEN_SECRET!,{
        expiresIn:'1h'
    })
    return token;
}

export const generateRefreshToken=async(tokenPayload:object)=>{
    const token=await jwt.sign(tokenPayload,process.env.REFRESH_TOKEN_SECRET!,{
        expiresIn:'12h'
    })
    return token;
}

export const generateOrderId=async()=>{
    const uniqueId= crypto.randomBytes(16).toString('hex');
    const hash=crypto.createHash('sha256');
    hash.update(uniqueId);
    const orderId=hash.digest('hex');
    return orderId.substring(0,12);
}