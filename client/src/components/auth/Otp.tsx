import React, { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axiosInstance from "../../constraints/axios/userAxios";
import { userEndpoints } from "../../constraints/endpoints/userEndpoints";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type FormData = {
  otp: string[];
};

// Validation schema using Yup
const schema = yup.object({
  otp: yup
    .array()
    .of(
      yup
        .string()
        .matches(/^[0-9]$/, "Only numbers are allowed")
        .required("Required")
    )
    .length(6, "OTP must be 6 digits")
    .required(),
});

const OTP: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      otp: Array(6).fill(""),
    },
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const [timer, setTimer] = useState<number>(() => {
    const savedTime = localStorage.getItem("otpTimer");
    return savedTime ? Number(savedTime) : 60; // Initialize timer from localStorage or default to 60 seconds
  });

  // Use ref for input boxes
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => {
          const newTimer = prevTimer - 1;
          localStorage.setItem("otpTimer", newTimer.toString()); // Save updated timer value
          return newTimer;
        });
      }, 1000);

      return () => clearInterval(countdown); // Cleanup timer on component unmount
    } else {
      localStorage.setItem("otpTimer", "0"); // Ensure timer is stored as 0
    }
  }, [timer]);

  const onSubmit = async (data: FormData) => {
    const otpValue = data.otp.join(""); // Combine OTP array into a string
    const email = localStorage.getItem("email"); // Retrieve email from local storage
    if (!email) {
      toast.error("Email not found. Please try again.");
      return;
    }
  
    try {
      const forgotPass = localStorage.getItem("forgotPass");
      
      if (forgotPass === "true") {
        // OTP verification for Forgot Password flow
        const response = await axiosInstance.post(userEndpoints.forgotOtp, { otp: otpValue, email });
        
        if (response.data.success) {
          localStorage.removeItem("forgotPass"); // Clean up storage
          toast.success("OTP verified successfully. Redirecting to reset password...");
          navigate("/newPassword"); // Navigate to the reset password page
        } else {
          toast.error(response.data.message || "Invalid OTP. Please try again.");
        }
      } else {
        // Normal OTP verification flow
        const response = await axiosInstance.post(userEndpoints.otp, { otp: otpValue, email });
        
        if (response.data.success) {
          toast.success("OTP verified successfully. Redirecting to login...");
          navigate("/login"); // Navigate to the login page
        } else {
          toast.error(response.data.message || "Invalid OTP. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };
  

  const handleResendOtp = async () => {
    const email = localStorage.getItem("email");
    const response = await axiosInstance.post(userEndpoints.resendOtp, { email });
    if (response.data.success) {
      toast.success("OTP resent successfully!");
      setTimer(60); // Reset the timer to 60 seconds
    } else {
      toast.error("Failed to resend OTP");
    }
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    onChange: (value: string) => void
  ) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) {
      onChange(value);
      if (value && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-300 to-blue-600">
      <div className="bg-white p-10 rounded-xl shadow-2xl border border-blue-600 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-4">Enter OTP</h2>
        <p className="text-center text-lg font-medium text-gray-700">
          Time left: <span className="text-red-500">{timer}s</span>
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="flex justify-between">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <Controller
                  key={index}
                  name={`otp.${index}`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      className={`w-12 h-12 text-center text-lg font-medium border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                        errors.otp?.[index] ? "border-red-500" : "border-gray-300"
                      }`}
                      onChange={(e) => handleInput(e, index, field.onChange)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  )}
                />
              ))}
          </div>
          {errors.otp && (
            <p className="text-red-500 text-sm text-center mt-2">
              {errors.otp.message || "Please enter a valid 6-digit OTP"}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            disabled={timer === 0}
          >
            Verify OTP
          </button>

          <button
            type="button"
            onClick={handleResendOtp}
            className="w-full py-3 mt-3 bg-gray-300 text-gray-700 rounded-lg text-lg font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={timer > 0}
          >
            Resend OTP
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

export default OTP;
