import { SignInForm } from "@/components/auth/superadmin/AdminSignIn";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | EasyOrder Super Admin",
  description: "Sign in to manage restarants and oversee operations as a Super Admin on EasyOrder.",
};

export default function SignIn() {
  return <SignInForm />;
}