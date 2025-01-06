import { AuthService } from "../../app/useCases/auth";
import config from "../../infrastructure/config/config";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';

const JWT_SECRET = config.JWT_SECRET;

class AuthController {
    private authService: AuthService;

    constructor(){
        this.authService = new AuthService()
    }


    registerUser = async(req:Request,res:Response): Promise<void> =>{
        try {

            const user = req.body
            console.log(user)

            const result = await this.authService.register(user)

            if(result.success){
                res.status(200).json({ success: true, message: result.message,email:result.email })
            }else{
                res.json({ success: false, message: result.message })
            }
            
        } catch (error) {
            console.log('error in the controller', error);
            
    }
}


otp = async(req:Request,res:Response): Promise<void> =>{
    try {

        const user = req.body
        console.log(user)

        const result = await this.authService.otp(user)

        if(result.success){
            res.status(200).json({ success: true, message: result.message })
        }else{
            res.json({ success: false, message: result.message })
        }
        
    } catch (error) {
        console.log('error in the controller', error);
        
}
}




login = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.body;
        console.log(user);

        const result = await this.authService.login(user);

        if (result.success) {
            console.log("success")
            res.status(200).json({
                success: true,
                message: result.message,
                user: result.user,
                accessToken:result.accessToken,
                refreshToken:result.refreshToken
            });
        } else {
            console.log("else working ---")
            res.json({
                success: false,
                message: result.message || 'Login failed.',
            });
        }
    } catch (error) {
        console.log('Error in the controller', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while logging in.',
        });
    }
};


validateToken = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Validating token...", req.body);

        const { token } = req.body;

        const result = await this.authService.validateToken(token);

        if (result) {
            res.status(200).json(result);
        } else {
            res.status(401).json({ success: false, message: "Invalid token" });
        }
    } catch (error) {
        console.error("Error in validateToken:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};




resendOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Validating token...", req.body);

        const { email } = req.body;

        const result = await this.authService.resendOtp(email);

        if (result) {
            res.status(200).json(result);
        } else {
            res.status(401).json({ success: false, message: "Invalid token" });
        }
    } catch (error) {
        console.error("Error in validateToken:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Validating token...", req.body);

        const { email } = req.body;

        const result = await this.authService.forgotPassword(email);

        if (result && result.success) {
            res.status(200).json(result);
        } else {
            res.json(result);
        }
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


forgotOtpVerify = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("forgotOtpVerify----------------")
        const user = req.body
        console.log(user)

        const result = await this.authService.forgotVerifyOtp(user)

        if(result.success){
            res.status(200).json({ success: true, message: result.message })
        }else{
            res.json({ success: false, message: result.message })
        }
        
    } catch (error) {
        console.log('error in the controller', error);
        
}
};




newPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("new Password----------------")
        const user = req.body
        console.log(user)

        const result = await this.authService.newPassword(user)

        if(result.success){
            res.status(200).json({ success: true, message: result.message })
        }else{
            res.json({ success: false, message: result.message })
        }
        
    } catch (error) {
        console.log('error in the controller', error);
        
}
};




}

export const authController = new AuthController()


