import { SignInForm } from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | EasyOrder Admin",
  description: "Sign in to manage your restaurant operations with EasyOrder.",
};

export default function SignIn() {
  return <SignInForm />;
}