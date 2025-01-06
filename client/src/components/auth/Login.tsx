import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import axiosInstance from "../../constraints/axios/userAxios";
import { userEndpoints } from "../../constraints/endpoints/userEndpoints";
import { toast } from "sonner";
import Cookies from "js-cookie";

type FormData = {
  email: string;
  password: string;
};

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();
  const onSubmit = async (data: FormData) => {
    console.log(data);
    const response = await axiosInstance.post(userEndpoints.login, data);
    console.log(response);
    if (response.data.success) {
      localStorage.setItem("email", response.data.user.email);
      Cookies.set("accessToken", response.data.accessToken, { expires: 1 });
      Cookies.set("refreshToken", response.data.refreshToken, { expires: 7 });
      navigate("/home");
    } else {
      toast.info(response.data.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-300 to-purple-600">
    <div className="bg-white p-10 rounded-xl shadow-2xl border border-purple-600 w-full max-w-md">
      <h2 className="text-3xl font-bold text-center text-purple-700 mb-8">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700">Email</label>
          <input
            {...register("email")}
            className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="Enter your email"
          />
          <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
        </div>
  
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700">Password</label>
          <input
            {...register("password")}
            type="password"
            className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="Enter your password"
          />
          <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>
        </div>
  
        <button
          type="submit"
          className="w-full py-3 mt-6 bg-purple-600 text-white rounded-lg text-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
        >
          Login
        </button>
      </form>
  
      <div className="text-center text-gray-600 mt-4">
        <p>
          Don't have an account?{" "}
          <a href="/signup" className="text-purple-600 font-medium hover:underline">
            Sign Up
          </a>
        </p>
        <p className="mt-2">
          <a
            href="/forgotPassword"
            className="text-purple-600 font-medium hover:underline"
          >
            Forgot Password?
          </a>
        </p>
      </div>
    </div>
  </div>
  
  );
};

export default Login;
