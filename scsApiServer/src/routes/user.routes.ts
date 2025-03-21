import { Router } from "express";
import { createApiKeys, getAccessKey, getSCSCoins, getUserProfile, login, logout, refreshToken, register, verifyEmail } from "../controllers/user.controller";
const userRouter=Router();

userRouter
.post('/register',register)
.post('/verify-email',verifyEmail)
.post('/login',login)
.post('/logout',logout)
.get('/refresh-token',refreshToken)
.get('/profile',getUserProfile)
.get('/scs-coins',getSCSCoins)
.post('/create-api-keys',createApiKeys)
.get('/get-access-key',getAccessKey)

export default userRouter;