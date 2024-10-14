"use client";
import React from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import axios from "axios"; // For API calls
import { useRouter } from "next/navigation"; // For navigation after successful login
import { useUser } from "@/context/UserContext";

const LoginPage = () => {
  const { setClientName } = useUser(); // Retrieve the context function to set clientName
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onBlur",
  });

  const router = useRouter(); // Initialize the router for redirect

  const onSubmit = async (data: any) => {
    try {
      // Call your login API
      const response = await axios.post(
        "http://localhost:5217/api/v1/client/login",
        {
          email: data.email,
          password: data.password,
        }
      );

      // If login is successful, navigate to dashboard or any secure page
      if (response.status === 200) {
        const responseData = response.data;

        setClientName(responseData.data.clientName);

        localStorage.setItem("accessToken", responseData.accessToken);
        localStorage.setItem("refreshToken", responseData.refreshToken);

        // Navigate to the dashboard
        router.push("/");
      }
    } catch (error: any) {
      console.error("Login failed", error);
      // Handle login errors like invalid credentials
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-white flex relative">
      {/* Left Section with SVG */}
      <div className="flex-1 relative">
        <img
          className="h-full object-cover"
          src="/signup_page.svg"
          alt="Sign Up Illustration"
        />
        {/* Medha Logo over the SVG */}
        <div className="absolute top-8 left-8">
          <div className="text-lg flex gap- font-normal items-center">
            <Image
              width={62}
              height={62}
              src="/Codepen.svg"
              objectFit="contain"
              alt="Medha Icon"
            />
            {/* <Image width={32} height={32} alt="Medha Logo" src="/Codepen.svg" /> */}
            <span className="text-[26px] text-white">Medha AI</span>
          </div>
        </div>
      </div>

      {/* Right Section for the Login Form */}
      <div className="flex flex-col justify-center items-end pr-20 flex-1">
        <div className="max-w-md w-full">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full text-center relative"
          >
            <h2 className="text-left text-[44px] font-semibold mb-2">Log in</h2>
            <p className="text-left text-[#696969] text-[15px] mb-8">
              Teach using the Power of Generative AI
            </p>

            {/* Email Input */}
            <div className="relative mb-4">
              <Image
                src="/Mail.svg"
                width={24}
                height={24}
                alt="Email Icon"
                className="absolute left-2 top-[15px] transform -translate-y-1/2"
              />
              <input
                id="email"
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                className={`border-b-2 border-black w-full pl-10 py-2 pr-8 text-gray-700 focus:outline-none ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {isValid && !errors.email && (
                <Image
                  src="/Check circle.svg"
                  width={20}
                  height={20}
                  alt="Checkmark Icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                />
              )}
              {errors.email && typeof errors.email.message === "string" && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative mb-6">
              <Image
                src="/Key.svg"
                width={24}
                height={24}
                alt="Lock Icon"
                className="absolute left-2 top-[15px] transform -translate-y-1/2"
              />
              <input
                id="password"
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                })}
                className={`border-b-2 border-black w-full pl-10 py-2 pr-8 text-gray-700 focus:outline-none ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              {isValid && !errors.password && (
                <Image
                  src="/Check circle.svg"
                  width={20}
                  height={20}
                  alt="Checkmark Icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                />
              )}
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="text-left flex items-center pt-6 gap-4 mb-6">
              <button
                type="submit"
                className="bg-[#2C2C2C] text-white font-light text-[16px] py-2 px-6 rounded-md focus:outline-none focus:shadow-outline"
              >
                Sign in
              </button>
              <span className="text-[#A1A1A1]">or</span>
              <Image
                onClick={async () => {
                  try {
                    await axios.post(
                      "/api/user/login",
                      {},
                      {
                        withCredentials: true,
                        responseType: "document",
                      }
                    );
                  } catch (error) {
                    console.error("Error:", error);
                  }
                }}
                src="/Screenshot_2024-08-22_at_3.00.58_AM-removebg-preview 4.png"
                width={32}
                height={32}
                alt="Alternate Sign In"
              />
            </div>

            {/* Sign Up Link */}
            <div className="text-left flex gap-2 text-sm">
              <span className="text-left text-[#696969]">New member?</span>
              <a href="/signup" className="font-bold text-[#354AB0]">
                Sign up
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
