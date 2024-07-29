import { Request,Response,NextFunction } from "express";
import jwt from 'jsonwebtoken'
import 'dotenv/config'

export const authMiddleware=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const authCookie=req.cookies.AccessCookie || req.body.AccessCookie;
        
        
        if(authCookie){
            const isVerified=await jwt.verify(authCookie,process.env.ACCESS_TOKEN_SECRET!);            
            if(isVerified){                
                next();
            }else{
                res.status(401)
                .json({
                    success:false,
                    message:"unauthorised"
                })
            }
        }
        else{
            res.status(401)
                .json({
                    success:false,
                    message:"unauthorised"
                })
        }
    } catch (error) {
        res.status(500)
                .json({
                    success:false,
                    message:"Internal server error"
                })
    }
}