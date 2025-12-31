"use client";
import React, { useState } from "react";
import axios from "axios";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";

export default function CreateStaffForm({ onSuccess }: { onSuccess: (email: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "", password: "", firstName: "", lastName: "", phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      await axios.post(`${apiUrl}/auth/register`, {
        ...formData,
        role: "RESTAURANT_STAFF" // Set Role specifically to Staff
      });
      onSuccess(formData.email);
    } catch (err: any) {
      alert(err.response?.data?.error || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><Label>First Name</Label><Input placeholder="Staff" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required /></div>
        <div><Label>Last Name</Label><Input placeholder="Member" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required /></div>
      </div>
      <div><Label>Email</Label><Input type="email" placeholder="staff@restaurant.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Phone</Label><Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required /></div>
        <div><Label>Temp Password</Label><Input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required /></div>
      </div>
      <Button type="submit" variant="newvariant" className="w-full py-2.5 text-xs font-bold" disabled={loading}>
        {loading ? "Registering..." : "Create Staff Account"}
      </Button>
    </form>
  );
}