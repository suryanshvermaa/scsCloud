import { Request,Response,NextFunction } from "express";
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import response from "../utils/response";

/**
 * 
 * @description Middleware to verify JWT token from cookies, body, or headers for authentication.
 * @param req  request object
 * @param res response object
 * @param next next middleware function
 */
export const authMiddleware=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const authCookie=req.cookies.AccessCookie || req.body.AccessCookie || req.headers['accesscookie']|| req.headers.authorization?.split(' ')[1];
        if(!authCookie) throw new Error("Unauthorised");
        const isVerified=await jwt.verify(authCookie,process.env.ACCESS_TOKEN_SECRET!); 
        if(!isVerified) throw new Error("Unauthorised");                           
        next();
    } catch (error) {
        response(res,401,"Unauthorised",{});
    }
}