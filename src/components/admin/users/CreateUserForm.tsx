"use client";
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { UserPlus, Mail, Lock, Phone, User } from "lucide-react";

interface Props {
  onSuccess: (email: string) => void;
}

export default function CreateUserForm({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "", password: "", firstName: "", lastName: "", phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      await axios.post(`${apiUrl}/auth/register`, {
        ...formData,
        role: "RESTAURANT_ADMIN"
      });
      onSuccess(formData.email); // Pass email to the next step
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>First Name</Label>
          <Input placeholder="John" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input placeholder="Doe" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
        </div>
      </div>
      <div>
        <Label>Email Address</Label>
        <Input type="email" placeholder="owner@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Phone</Label>
          <Input placeholder="03001234567" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
        </div>
        <div>
          <Label>Temporary Password</Label>
          <Input type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
        </div>
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      <Button type="submit" variant="newvariant" className="w-full py-2.5 text-xs font-bold" disabled={loading}>
        {loading ? "Creating Account..." : "Create Owner Account"}
      </Button>
    </form>
  );
}