import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axiosInstance from "../../constraints/axios/userAxios";
import { userEndpoints } from "../../constraints/endpoints/userEndpoints";
import { useNavigate } from "react-router-dom";
import {toast} from 'sonner'

type FormData = {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
};

const schema = yup.object({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const Signup: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate()
  const onSubmit = async(data: FormData) => {
    const timer = localStorage.getItem("otpTimer");
    localStorage.removeItem("forgotPass")
    if (timer && !isNaN(Number(timer))) {
      const timerValue = Number(timer);
      if (timerValue < 60) {
        // Perform some logic if the timer is less than 60
        console.log(`Timer value is less than 60: ${timerValue}`);
        
        // Remove the timer from localStorage
        localStorage.removeItem("otpTimer");
        console.log("otpTimer removed from localStorage.");
      } else {
        console.log(`Timer value is ${timerValue}, not less than 60.`);
      }
    } else {
      console.error("Invalid or undefined timer value.");
    }
    
    console.log(data);
    const response = await axiosInstance.post(userEndpoints.signup,data) 
    console.log(response)
    if(response.data.success){
      localStorage.setItem("email",response.data.email)
      // localStorage.setItem("otpTimerStart",value)
      navigate("/otp")
    }else{
      toast.info("Something went wrong")
    }
  };

  return (
<div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-300 to-blue-600">
<div className="bg-white p-8 rounded-md shadow-lg border border-blue-600 max-w-md w-full">
        <h3 className="text-2xl font-semibold text-center text-purple-600 mb-6">Signup</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              {...register("username")}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Enter your username"
            />
            <p className="text-red-500 text-sm">{errors.username?.message}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              {...register("email")}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Enter your email"
            />
            <p className="text-red-500 text-sm">{errors.email?.message}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              {...register("phoneNumber")}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Enter your phone number"
            />
            <p className="text-red-500 text-sm">{errors.phoneNumber?.message}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              {...register("password")}
              type="password"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Enter your password"
            />
            <p className="text-red-500 text-sm">{errors.password?.message}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              {...register("confirmPassword")}
              type="password"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Confirm your password"
            />
            <p className="text-red-500 text-sm">{errors.confirmPassword?.message}</p>
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none"
          >
            Sign Up
          </button>
        </form>
        <div className="text-center text-gray-600 mt-4">
        <p>
          Already have an account?{" "}
          <a href="/login" className="text-purple-600 font-medium hover:underline">
            Login
          </a>
        </p>
      </div>
      </div>
    </div>
  );
};

export default Signup;
