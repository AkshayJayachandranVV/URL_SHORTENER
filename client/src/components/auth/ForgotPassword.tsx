import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axiosInstance from "../../constraints/axios/userAxios";
import { userEndpoints } from "../../constraints/endpoints/userEndpoints";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type FormData = {
  email: string;
};

// Validation schema using Yup
const schema = yup.object({
  email: yup
    .string()
    .email("Please provide a valid email address.")
    .required("Email is required to reset your password."),
});

const ForgotPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
    const navigate = useNavigate();
  const onSubmit = async (data: FormData) => {
    try {
      const response = await axiosInstance.post(userEndpoints.forgotPassword, {
        email: data.email,
      });
      if (response.data.success) {
        console.log("forgot testing   --",response.data)
        localStorage.setItem("forgotPass","true")
        localStorage.setItem("email",response.data.email)
        navigate("/otp")
        toast.success("Password reset link sent to your email!");
      } else {
        toast.error(response.data.message || "Failed to send reset link.");
      }
    } catch (error) {
      console.error("Error sending forgot password email:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-300 to-blue-600">
      <div className="bg-white p-10 rounded-xl shadow-2xl border border-blue-600 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Forgot Password
        </h2>
        <p className="text-center text-lg font-medium text-gray-700 mb-4">
          Enter your registered email address to receive a reset link.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              className={`w-full px-4 py-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-600"
              }`}
              placeholder="Enter your email"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          <button
            type="submit"
            className={`w-full py-3 text-white rounded-lg text-lg font-medium bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
