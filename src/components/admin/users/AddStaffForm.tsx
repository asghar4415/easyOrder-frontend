"use client";
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useSuperAdminRestaurants } from "@/context/AdminRestaurantContext";
import { CheckCircle2, Store, Users } from "lucide-react";

export default function AddStaffForm({ email, onComplete }: { email: string; onComplete?: () => void }) {
  const { restaurants } = useSuperAdminRestaurants();
  const [selectedRes, setSelectedRes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      await axios.post(`${apiUrl}/restaurants/add-staff`, 
        { restaurantId: selectedRes, staffEmail: email },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setSuccess(true);
      if (onComplete) onComplete();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to link staff");
    } finally { setLoading(false); }
  };

  if (success) return (
    <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 flex flex-col items-center text-center animate-in zoom-in-95">
      <CheckCircle2 className="text-blue-500 mb-2" size={32} />
      <p className="text-sm font-bold text-blue-800">Staff Link Established!</p>
      <p className="text-xs text-blue-600 mt-1">{email} is now authorized.</p>
    </div>
  );

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
      <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100">
        <p className="text-[10px] font-bold text-blue-600 uppercase">Target Staff User</p>
        <p className="text-sm font-bold text-gray-800 dark:text-white">{email}</p>
      </div>
      <div>
        <Label>Assign to Venue</Label>
        <select 
          value={selectedRes} onChange={(e) => setSelectedRes(e.target.value)}
          className="w-full mt-1.5 p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm"
        >
          <option value="">Select a restaurant...</option>
          {restaurants.map(res => <option key={res.id} value={res.id}>{res.name}</option>)}
        </select>
      </div>
      <Button onClick={handleAdd} variant="newvariant" className="w-full py-2.5 text-xs font-bold" disabled={loading || !selectedRes}>
        {loading ? "Linking..." : "Complete Linkage"}
      </Button>
    </div>
  );
}