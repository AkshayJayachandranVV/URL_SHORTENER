import express from 'express';
import {  authController} from '../controllers/authController';

const authRouter = express.Router();

authRouter.post('/signup',authController.registerUser);
authRouter.post('/otp',authController.otp);
authRouter.post('/login',authController.login);
authRouter.post('/refresh-token', authController.validateToken);
authRouter.post('/resendOtp', authController.resendOtp);
authRouter.post('/forgotPassword', authController.forgotPassword);
authRouter.post('/forgotOtpVerify', authController.forgotOtpVerify);
authRouter.post('/newPassword', authController.newPassword);

export default authRouter

