"use client";
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useSuperAdminRestaurants } from "@/context/AdminRestaurantContext";
import { CheckCircle2, Store } from "lucide-react";

export default function AssignOwnerForm({ email }: { email: string }) {
  const { restaurants, fetchAllRestaurants } = useSuperAdminRestaurants();
  const [selectedRes, setSelectedRes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAssign = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await axios.put(`${apiUrl}/restaurants/assign-owner`, 
        { restaurantId: selectedRes, owneremail: email },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setSuccess(true);
      fetchAllRestaurants(); // Refresh sidebar/list
    } catch (err) {
      alert("Assignment failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="p-6 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 flex flex-col items-center text-center">
      <CheckCircle2 className="text-green-500 mb-2" size={32} />
      <p className="text-sm font-bold text-green-800">Owner Successfully Assigned!</p>
      <p className="text-xs text-green-600 mt-1">{email} now manages the selected restaurant.</p>
    </div>
  );

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
      <div className="p-3 bg-orange-50 rounded-lg border border-orange-100 mb-4">
        <p className="text-[10px] font-bold text-orange-600 uppercase">Selected User</p>
        <p className="text-sm font-bold text-gray-800">{email}</p>
      </div>
      <div>
        <Label>Select Restaurant to Assign</Label>
        <select 
          value={selectedRes} 
          onChange={(e) => setSelectedRes(e.target.value)}
          className="w-full mt-1.5 p-2.5 bg-white dark:bg-gray-900 border border-gray-200 rounded-lg text-sm"
        >
          <option value="">Choose a restaurant...</option>
          {restaurants.map(res => (
            <option key={res.id} value={res.id}>{res.name}</option>
          ))}
        </select>
      </div>
      <Button onClick={handleAssign} variant="newvariant" className="w-full py-2.5 text-xs font-bold" disabled={loading || !selectedRes}>
        {loading ? "Processing..." : "Complete Assignment"}
      </Button>
    </div>
  );
}