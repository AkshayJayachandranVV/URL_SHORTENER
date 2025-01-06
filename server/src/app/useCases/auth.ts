import { AuthRepository } from "../../domain/repositories/authRepository"
import {otpVerify,IUser,Login,newPassword} from '../../domain/entities/IAuth'
import { generateOtp } from "../../utils/generateOtp"
import { sendOtpEmail } from "../../utils/sendEmail"
import bcrypt from 'bcrypt'
import  {generateToken} from '../../jwt/jwtCreate'
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET; 

export class AuthService {
    private authRepo : AuthRepository

    constructor() {
        this.authRepo = new AuthRepository()
    }


    async register(data:IUser ){
        try {
            const email :string =  data.email

            const UserFound  = await this.authRepo.findByEmail(email)


            if(UserFound){
                return { success: false, message: 'Account already registered with this email address.' };
            }

            
            const otp = generateOtp()

            const hashedPsword = await bcrypt.hash(data.password,10)

            const updatePassword = {
                ...data,
                password:hashedPsword,
                otp:otp
            }

            const storeData = await this.authRepo.createTempUser(updatePassword)

            if(storeData){
                console.log(otp,"otp ---- ")
                await sendOtpEmail(data.email,otp)
                return { success: true, message: 'A verification email has been sent. Please check your inbox to verify your email address.',email:data.email};
            }else{
                return { success: false, message: 'Error is verifyinh the email. Please try again later.' };
            }
        } catch (error) {
            console.error('Error in registration process:', error);
            return { success: false, message: 'An unexpected error occurred. Please try again later.' }; 
        }
    }



    async otp(data:otpVerify ){
        try {
            
            const result = await this.authRepo.verifyOtp(data)

            console.log(result)

        
            return result
          
        } catch (error) {
            console.error('Error in otp verify process:', error);
            return { success: false, message: 'An unexpected error occurred. Please try again later.' }; 
        }
    }


    async login(data: Login) {
        try {
            const result = await this.authRepo.login(data);
    
            console.log(result);
    
            if (result.success && result.user) {
                const { accessToken, refreshToken } = await generateToken({
                    id: result.user._id.toString(),
                    email: result.user.email,
                });
    
                console.log("Tokens generated:", accessToken, refreshToken);
    
                return {
                    success: true,
                    message: result.message || 'Login successful.',
                    user: result.user,
                    accessToken,
                    refreshToken,
                };
            } else {
                console.log("helelele")
                return {
                    success: false,
                    message: result.message || 'Login failed.',
                };
            }
        } catch (error) {
            console.error('Error in login process:', error);
            return {
                success: false,
                message: 'An unexpected error occurred. Please try again later.',
            };
        }
    }
    
    

    async validateToken(token: string): Promise<{ success: boolean; message?: string; accessToken?: string }> {
        try {
            if (!JWT_SECRET) {
                return { success: false, message: "JWT secret is not defined" };
            }
    
            // Use a promise wrapper to handle jwt.verify callback
            const decoded = await new Promise<any>((resolve, reject) => {
                jwt.verify(token, JWT_SECRET, (err, decoded) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(decoded);
                });
            });
    
            // Ensure decoded contains the required properties
            if (!decoded || !decoded.email) {
                return { success: false, message: "Invalid token payload" };
            }
    
            const { email } = decoded;
    
            // Generate a new access token
            const newAccessToken = jwt.sign(
                { email },
                JWT_SECRET,
                { expiresIn: '1d' } // Set access token expiration
            );
    
            return { success: true, accessToken: newAccessToken };
    
        } catch (error:any) {
            if (error.name === 'TokenExpiredError') {
                console.log('Token expired', error);
                return { success: false, message: 'Token expired' };
            } else if (error.name === 'JsonWebTokenError') {
                console.log('Invalid token', error);
                return { success: false, message: 'Invalid token' };
            }
    
            console.error('Error in validateToken:', error);
            return { success: false, message: 'An unexpected error occurred. Please try again later.' };
        }
    }
    
    
    async resendOtp(email:string ){
        try {
           
            console.log("service resendotp",email)
            const UserFound  = await this.authRepo.findByEmail(email)


            if(UserFound){
                return { success: false, message: 'Account already registered with this email address.' };
            }

            
            const otp = generateOtp()

            
            const storeData = await this.authRepo.updateOtp({email,otp})

            if(storeData.succes){
                console.log(otp,"otp ---- ")
                await sendOtpEmail(email,otp)
                return { success: true, message: 'A verification email has been sent. Please check your inbox to verify your email address.',email:email};
            }else{
                return { success: false, message: 'Error in verifying the email. Please try again later.' };
            }
        } catch (error) {
            console.error('Error in registration process:', error);
            return { success: false, message: 'An unexpected error occurred. Please try again later.' }; 
        }
    }



      
    async forgotPassword(email:string ){
        try {
           
            console.log("service forgotPassword",email)
            const UserFound  = await this.authRepo.findByEmail(email)


            if(!UserFound){
                return { success: false, message: 'Entered Incorrect Email' };
            }



            
            const otp = generateOtp()


            const user = {
                username:UserFound.username,
                phoneNumber:UserFound.phoneNumber,
                password:UserFound.password,
                email:UserFound.email,
                otp:otp
            }

       
            const saveTempUser = await this.authRepo.createTempUser(user)

            console.log(saveTempUser)
            // const storeData = await this.authRepo.updateOtp({email,otp})

            if(saveTempUser.success){
                console.log(otp,"otp ---- ")
                await sendOtpEmail(email,otp)
                return { success: true, message: 'A verification email has been sent. Please check your inbox to verify your email address.',email:email,forgotPass:true};
            }else{
                return { success: false, message: 'Error in verifying the email. Please try again later.' };
            }
        } catch (error) {
            console.error('Error in registration process:', error);
            return { success: false, message: 'An unexpected error occurred. Please try again later.' }; 
        }
    }



    async forgotVerifyOtp(data:otpVerify ){
        try {
            
            const result = await this.authRepo.forgotOtpVerify(data)

            console.log(result)

        
            return result
          
        } catch (error) {
            console.error('Error in otp verify process:', error);
            return { success: false, message: 'An unexpected error occurred. Please try again later.' }; 
        }
    }


     
    async newPassword(data: newPassword){
        try {
            
            const result = await this.authRepo.newPassword(data)

            console.log(result)

        
            return result
          
        } catch (error) {
            console.error('Error in otp verify process:', error);
            return { success: false, message: 'An unexpected error occurred. Please try again later.' }; 
        }
    }



}


