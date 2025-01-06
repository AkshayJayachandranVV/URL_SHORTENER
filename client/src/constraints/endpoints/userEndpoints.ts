export const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}`


export const userEndpoints = {
    signup:`${BASE_URL}/auth/signup`,
    otp:`${BASE_URL}/auth/otp`,
    login:`${BASE_URL}/auth/login`,
    resendOtp:`${BASE_URL}/auth/resendOtp`,
    forgotPassword:`${BASE_URL}/auth/forgotPassword`,
    forgotOtp:`${BASE_URL}/auth/forgotOtpVerify`,
    newPassword:`${BASE_URL}/auth/newPassword`, 
}