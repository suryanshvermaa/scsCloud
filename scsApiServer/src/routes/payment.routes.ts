import { Router } from "express";
import { createOrder, getPaymentHistory, verifyPayment } from "../controllers/payment.controller";

const paymentRouter=Router();

paymentRouter
.get('/history',getPaymentHistory)
.post('/create-order',createOrder)
.post('/verify-payment',verifyPayment)

export default paymentRouter;