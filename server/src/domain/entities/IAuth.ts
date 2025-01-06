export interface IUserModel {
    username: string;
    phoneNumber: string;
    email: string;
    password: string;
    expiresAt?: Date; 
    otp:string
  }


 export interface userPayload {
    id: string,
    email: string
}


export interface newPassword {
    email:string;
    password:string;
}



  export interface IUser {
    username: string;
    phoneNumber: string;
    email: string;
    password: string;
    bio ?: string;
    avatar ?: string;
    otp?: string
    _id?:string;
  }


 export interface otpVerify {
    otp:string,
    email:string
  }

  export interface Login {
    email:string,
    password:string
  }