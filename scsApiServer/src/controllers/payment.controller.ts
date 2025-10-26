import { Request,Response } from "express";
import jwt from 'jsonwebtoken'
import Payment from "../models/payment.model";
import 'dotenv/config'
import Cashfree from '../services/payment.service';
import { generateOrderId } from "../utils/tokens";
import User from "../models/user.model";
import { paymentQueue } from "../services/queue.service";
import asyncHandler from "../utils/asyncHandler";
import { AppError } from "../utils/error";
import response from "../utils/response";

/**
 * @description: Controller to create a new payment order
 * @param req - request object containing payment details
 * @param res - response object to send back the order details
 */
export const createOrder=asyncHandler(async(req:Request,res:Response)=>{
  const {AccessCookie,paymentAmount,phoneNumber}=req.body;
  const isVerified=await jwt.verify(AccessCookie,process.env.ACCESS_TOKEN_SECRET!);
  if(!isVerified) throw new AppError('Unauthenticated',401);
    const {userId}=JSON.parse(JSON.stringify(isVerified));
    const user=await User.findById(userId);
    const request = {
      "order_amount": Number(paymentAmount),
      "order_currency": "INR",
      "order_id":await generateOrderId(),
      "customer_details": {
        "customer_id": String(user!._id),
        "customer_name": user!.name,
        "customer_email": user!.email,
        "customer_phone": String(phoneNumber)
      }
    }
    
    Cashfree.PGCreateOrder("2023-08-01", request).then((r:any) => {
      const a = r.data;
      console.log(a)
      response(res,200,"payment initiated successfully",{a});
    })
    .catch((error:any) => {
      console.error('Error setting up order request:', error.response.data);
      response(res, 400, 'error', { error: error.response.data });
    });
});

/**
 * @description: Controller to get payment history for a user
 * @param req request object containing authentication token
 * @param res response object to send back the payment history
 */
export const getPaymentHistory=asyncHandler(async(req:Request,res:Response)=>{
  const authCookie=req.cookies.AccessCookie || req.body.AccessCookie || req.query.token;
  const isVerified=await jwt.verify(authCookie,process.env.ACCESS_TOKEN_SECRET!);
  if(!isVerified) throw new AppError('Unauthenticated',401);
  const {userId}=JSON.parse(JSON.stringify(isVerified)) 
  const payments=await Payment.find({userId});
  response(res,200,"successfully got payment history",{data:payments});
});

/**
 * @description: Controller to verify payment and update user balance
 * @param req request object containing payment verification details
 * @param res response object to send back the verification result
 */
export const verifyPayment=asyncHandler(async(req:Request,res:Response)=>{
  const {AccessCookie,orderId}=req.body;
  if(!AccessCookie || !orderId) throw new AppError('Invalid request parameters',400);
  const isVerified=await jwt.verify(AccessCookie,process.env.ACCESS_TOKEN_SECRET!);
  if(!isVerified) throw new AppError('Unauthenticated',401);
  const {email,userId}=JSON.parse(JSON.stringify(isVerified));
  Cashfree.PGOrderFetchPayments("2023-08-01",orderId).then(async(response:any)=>{
    const dataObj=response.data[0];
    const amount=dataObj.order_amount;
    const paymentId=dataObj.cf_payment_id;
    const user=await User.findById(userId);
    user!.SCSCoins=user?.SCSCoins+amount;
    const payment=await Payment.create({
      paymentId:dataObj.cf_payment_id,
      orderId:dataObj.order_id,
      amount:dataObj.payment_amount,
      userId,
      payment_currency:dataObj.payment_currency
    });
    await paymentQueue.add('payment'+Date.now(),JSON.stringify({email,amount,paymentId}))
    user!.paymentCount=user!.paymentCount+1;
    user!.paymentAmount=user!.paymentAmount+amount;
    await user?.save();
    await payment.save();
    response(res,200,'Payment successful',{payment});
  }).catch((error:any)=>{throw new AppError('Payment verification failed',500)});
});