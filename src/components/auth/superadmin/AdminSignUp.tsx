"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function SignUpForm() {
  const { login } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!isChecked) {
      setError("Please agree to the Terms and Conditions.");
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      // Request Body as per your requirements
      const payload = {
        ...formData,
        role: "SUPER_ADMIN", // Automatically assigned
      };

      const response = await axios.post(`${apiUrl}/auth/register`, payload);

      // Industry Standard: After successful signup, we usually log the user in immediately
      const { token, user } = response.data;
      
      // Map role name for context consistency
      const userData = {
        id: user.id,
        email: user.email,
        role: user.role.name || "SUPER_ADMIN"
      };

      login(token, userData);
      
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      {/* Navigation Header */}
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to Home Page
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto pb-10">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Create Admin Account
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Join the EasyOrder administration team to oversee operations.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg dark:bg-red-900/10 dark:border-red-900/20">
              {error}
            </div>
          )}

          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* First & Last Name Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <Label>First Name <span className="text-orange-500">*</span></Label>
                    <Input
                      type="text"
                      name="firstName"
                      placeholder="e.g. Joly"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label>Last Name <span className="text-orange-500">*</span></Label>
                    <Input
                      type="text"
                      name="lastName"
                      placeholder="e.g. Man"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label>Email <span className="text-orange-500">*</span></Label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="admin@easyorder.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <Label>Phone Number <span className="text-orange-500">*</span></Label>
                  <Input
                    type="text"
                    name="phone"
                    placeholder="03001234567"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <Label>Password <span className="text-orange-500">*</span></Label>
                  <div className="relative">
                    <Input
                      name="password"
                      placeholder="Enter a strong password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 text-gray-500"
                    >
                      {showPassword ? <EyeIcon className="w-5 h-5" /> : <EyeCloseIcon className="w-5 h-5" />}
                    </span>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3 mt-2">
                  <Checkbox
                    className="mt-1"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    By creating an account, I agree to the{" "}
                    <span className="text-gray-800 dark:text-white font-medium">Terms and Conditions</span> and{" "}
                    <span className="text-gray-800 dark:text-white font-medium">Privacy Policy</span>.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button 
                    className="w-full py-3 text-base" 
                    size="lg" 
                    variant="newvariant" 
                    type="submit" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
              </div>
            </form>

            {/* Redirect to Login */}
            <div className="mt-6 text-center">
              <p className="text-sm font-normal text-gray-700 dark:text-gray-400">
                Already have an admin account?{" "}
                <Link
                  href="/admin/signin"
                  className="font-semibold text-orange-500 transition-colors hover:text-orange-600 dark:text-orange-400 underline underline-offset-4"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}