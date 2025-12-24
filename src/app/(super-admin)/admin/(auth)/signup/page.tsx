import SignUpForm from "@/components/auth/superadmin/AdminSignUp";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | EasyOrder Super Admin",
  description: "Create an account to manage restaurants and oversee operations as a Super Admin on EasyOrder.",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
