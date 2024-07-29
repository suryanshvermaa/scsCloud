import { Request,Response } from "express";
import jwt from 'jsonwebtoken'
import Payment from "../models/payment.model";
import 'dotenv/config'
import Cashfree from '../services/payment.service';
import { generateOrderId } from "../utils/tokens";
import User from "../models/user.model";
import { paymentQueue } from "../services/queue.service";

export const createOrder=async(req:Request,res:Response)=>{
    try {

      const {AccessCookie,paymentAmount,phoneNumber}=req.body;
      const isVerified=await jwt.verify(AccessCookie,process.env.ACCESS_TOKEN_SECRET!);
      if(isVerified){
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
            },
          }
          Cashfree.PGCreateOrder("2023-08-01", request).then((response) => {
            var a = response.data;
            console.log(a)
            res.json({
              success:true,
              message:'payment initiated successfully',
              data:a
            });
          })
            .catch((error) => {
              console.error('Error setting up order request:', error.response.data);
              res.status(400).json({
                success:false,
                message:'error',
                error:error.response.data
              })
            });
      }else{
        res.status(401).json({
          success:false,
          error:'unathorised'
        })
      }
    } catch (error:any) {
      res.status(401).json({
        success:false,
        message:'error',
        error:error.message
      })
    }
}

export const getPaymentHistory=async(req:Request,res:Response)=>{
    try {
        const authCookie=req.cookies.AccessCookie || req.body.AccessCookie || req.query.token;
        const isVerified=await jwt.verify(authCookie,process.env.ACCESS_TOKEN_SECRET!);
        const {userId}=JSON.parse(JSON.stringify(isVerified)) 
        const payments=await Payment.find({userId});
        res.status(200).json({
            success:true,
            message:'successfully got payment history',
            data:payments
        })
    } catch (error:any) {
        res.status(400).json({
            success:false,
            message:'error in getting payment history',
            error:error.message
        })
    }
}

export const verifyPayment=async(req:Request,res:Response)=>{
  try {
    const {AccessCookie,orderId}=req.body;
      const isVerified=await jwt.verify(AccessCookie,process.env.ACCESS_TOKEN_SECRET!);
      if(isVerified){
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
            })
            paymentQueue.add('payment'+Date.now(),JSON.stringify({email,amount,paymentId}))
            user!.paymentCount=user!.paymentCount+1;
            user!.paymentAmount=user!.paymentAmount+amount;
            await user?.save();
            await payment.save();
            res.status(200).json({
              success:true,
              message:'Payment Successful'
            })
            
               
          }).catch((err:any)=>{
            res.status(400).json({
              success:false,
              message:'Error in Payment',
              error:err.message
            })
          })
      }
      else{
        res.status(400).json({
          success:false,
          message:'Unathorised',
          error:'Unathorised'
        })
      }
  } catch (error:any) {
    res.status(400).json({
      success:false,
      message:'payment not successful',
      error:error.message
    })
  }
}