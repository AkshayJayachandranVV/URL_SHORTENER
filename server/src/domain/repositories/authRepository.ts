import User from '../../models/userModel'
import {IUser, Login, otpVerify} from '../../domain/entities/IAuth'
import TempUserModel from '../../models/tempUserModel';
import bcrypt from 'bcrypt'


export class AuthRepository {

    async findByEmail(email:string) {
        try {
            console.log("eneted findbyemail")
            const result = await User.findOne({ email: email });
            return result;
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw new Error('An error occurred while searching for the user. Please try again later.');
        }
    }


    async createTempUser (data:IUser) {
        try {
            console.log("eneterd to Repo",data)
            const tempUserCheck = await TempUserModel.findOne({email:data.email})
            if(tempUserCheck){
                return { success: false, message: "User with this email already exists." };
            }

            const result = await TempUserModel.create(data)
            return {success:true,data:result}
        } catch (error) {
            console.error('Error creating temporary user:', error);
            throw new Error('An error occurred while creating the temporary user. Please try again later.');
        }
    }



    // async createTempForgotPassword (data:IUser) {
    //     try {
    //         console.log("eneterd to Repo",data)

    //         const result = await TempUserModel.create(data)
    //         return {success:true,data:result}
    //     } catch (error) {
    //         console.error('Error creating temporary user:', error);
    //         throw new Error('An error occurred while creating the temporary user. Please try again later.');
    //     }
    // }



    async verifyOtp(data: otpVerify) {
        try {
          console.log("Entered into Repo", data);
      
          const { email, otp } = data;
      
          // Find the temporary user in TempUserModel
          const tempUserCheck = await TempUserModel.findOne({ email });
      
          if (!tempUserCheck) {
            throw new Error("User not found with the provided email.");
          }
      
          // Check if the OTP matches
          if (tempUserCheck.otp === otp) {
            console.log("OTP verified successfully.");
      
            const newUserData = {
              email: tempUserCheck.email,
              username: tempUserCheck.username,
              phoneNumber: tempUserCheck.phoneNumber,
              password: tempUserCheck.password,

            };
      
            const newUser = new User(newUserData);
            await newUser.save(); 
      
            await TempUserModel.deleteOne({ email });
      
            return { success: true, message: "OTP verified and user registered successfully." };
          } else {
            console.log("OTP verification failed.");
            return { success: false, message: "Invalid OTP. Please try again." };
          }
        } catch (error) {
          console.error("Error verifying OTP:", error);
          throw new Error("An error occurred while verifying the OTP. Please try again later.");
        }
      }




      async forgotOtpVerify(data: otpVerify) {
        try {
          console.log("Entered into Repo", data);
      
          const { email, otp } = data;
      
          // Find the temporary user in TempUserModel
          const tempUserCheck = await TempUserModel.findOne({ email });
      
          if (!tempUserCheck) {
            throw new Error("User not found with the provided email.");
          }
      
          // Check if the OTP matches
          if (tempUserCheck.otp === otp) {
            console.log("OTP verified successfully.");
      
            await TempUserModel.deleteOne({ email });
      
            return { success: true, message: "OTP verified and user registered successfully." };
          } else {
            console.log("OTP verification failed.");
            return { success: false, message: "Invalid OTP. Please try again." };
          }
        } catch (error) {
          console.error("Error verifying OTP:", error);
          throw new Error("An error occurred while verifying the OTP. Please try again later.");
        }
      }
      

      async login(data: Login) {
        try {
          const { email, password } = data;
      
          // Find the user by email in the User collection
          const user = await User.findOne({ email });
      
          if (!user) {
            return { success: false, message: "Incorrect email. Please try again." };
          }
      
          // Compare the provided password with the stored hashed password
          const isPasswordMatch = await bcrypt.compare(password, user.password);
      
          if (isPasswordMatch) {
            console.log("Login successful");

            return { success: true, message: "Login successful", user };
          } else {
            console.log("Incorrect password");
            return { success: false, message: "Incorrect password. Please try again." };
          }
        } catch (error) {
          console.error("Error during login:", error);
          throw new Error("An error occurred during login. Please try again later.");
        }
      }
      

      async updateOtp({ email, otp }: { email: string; otp: string }) {
        try {
          console.log("Updating OTP...");
      
          const tempUserCheck = await TempUserModel.updateOne(
            { email: email }, 
            { $set: { otp: otp } } 
          );
      
          if (tempUserCheck.modifiedCount > 0) {
            console.log("OTP updated successfully.");
            return {succes:true,message:"OTP updated successfully."}
          } else {
            console.log("No matching email found, or OTP was not updated.");
            return {succes:false,message:"No matching email found"}
          }
        } catch (error) {
          console.error("Error during OTP update:", error);
          throw new Error("An error occurred while updating the OTP. Please try again later.");
        }
      }
      
     
      async newPassword({ email, password }: { email: string; password: string }) {
        try {
          // Check if the user exists
          const user = await User.findOne({ email: email });
          if (!user) {
            throw new Error("User not found with the provided email.");
          }
      
          // Hash the new password
          const hashedPassword = await bcrypt.hash(password, 10);
      
          // Update the user's password
          user.password = hashedPassword;
          await user.save();
      
          return { success: true, message: "Password updated successfully." };
        } catch (error) {
          console.error("Error during password update:", error);
          throw new Error("An error occurred while updating the password. Please try again later.");
        }
      }
      

}




