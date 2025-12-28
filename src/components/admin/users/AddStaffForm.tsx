"use client";
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useSuperAdminRestaurants } from "@/context/AdminRestaurantContext";
import { Users, CheckCircle, Mail, Store, AlertCircle } from "lucide-react";

export default function AddStaffForm() {
  const { restaurants } = useSuperAdminRestaurants();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    restaurantId: "",
    staffEmail: "",
  });

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const token = Cookies.get("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const res = await axios.post(
        `${apiUrl}/restaurants/add-staff`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    //   console.log(res.data);    
      setSuccess(true);
      setFormData({ ...formData, staffEmail: "" }); // Reset email but keep restaurant selected
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add staff member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAddStaff} className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
      {/* Success Message */}
      {success && (
        <div className="p-3 flex items-center gap-2 bg-green-50 dark:bg-green-900/10 border border-green-100 rounded-lg text-green-700 text-xs font-bold">
          <CheckCircle size={16} /> Staff member added successfully!
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 flex items-center gap-2 bg-red-50 dark:bg-red-900/10 border border-red-100 rounded-lg text-red-700 text-xs font-bold">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Restaurant Selection */}
      <div className="space-y-1.5">
        <Label>Target Restaurant</Label>
        <div className="relative">
          <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select 
            value={formData.restaurantId} 
            onChange={(e) => setFormData({...formData, restaurantId: e.target.value})}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:ring-1 focus:ring-orange-500 outline-none appearance-none"
            required
          >
            <option value="">Select a restaurant</option>
            {restaurants.map(res => (
              <option key={res.id} value={res.id}>{res.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Staff Email Input */}
      <div className="space-y-1.5">
        <Label>Staff Member Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <Input 
            type="email" 
            placeholder="staff@example.com" 
            value={formData.staffEmail} 
            onChange={(e) => setFormData({...formData, staffEmail: e.target.value})} 
            className="pl-10"
            required
          />
        </div>
        <p className="text-[10px] text-gray-400 mt-1 italic">
          * The staff member must already have an account on the platform.
        </p>
      </div>

      {/* Action Button */}
      <Button 
        type="submit" 
        variant="newvariant" 
        className="w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2" 
        disabled={loading}
      >
        {loading ? "Adding..." : <><Users size={16} /> Grant Access</>}
      </Button>
    </form>
  );
}