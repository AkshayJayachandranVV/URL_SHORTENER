import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axiosInstance from "../../constraints/axios/userAxios";
import { userEndpoints } from "../../constraints/endpoints/userEndpoints";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type FormData = {
  password: string;
  confirmPassword: string;
};

const schema = yup.object({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .required("Password is required."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), undefined], "Passwords must match.")
    .required("Please confirm your password."),
});

const ResetPassword: React.FC = () => {
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
      const email = localStorage.getItem("email");
      if (!email) {
        toast.error("Email not found. Please try again.");
        return;
      }

      const response = await axiosInstance.post(userEndpoints.newPassword, {
        email,
        password: data.password,
      });

      if (response.data.success) {
        toast.success("Password reset successfully!");
        navigate("/login");
      } else {
        toast.error(response.data.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700">
      <div className="bg-white p-10 rounded-xl shadow-2xl border border-blue-700 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Reset Password
        </h2>
        <p className="text-center text-lg font-medium text-gray-700 mb-4">
          Enter your new password to reset it.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700">
              New Password
            </label>
            <input
              {...register("password")}
              type="password"
              className={`w-full px-4 py-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-600"
              }`}
              placeholder="Enter new password"
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              {...register("confirmPassword")}
              type="password"
              className={`w-full px-4 py-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-600"
              }`}
              placeholder="Confirm new password"
              disabled={isSubmitting}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className={`w-full py-3 text-white rounded-lg text-lg font-medium bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
