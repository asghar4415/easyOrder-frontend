"use client";
import React, { useMemo, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useSuperAdminRestaurants } from "@/context/AdminRestaurantContext";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function AssignOwnerForm({ email }: { email: string }) {
  const { restaurants, fetchAllRestaurants } = useSuperAdminRestaurants();
  const [selectedRes, setSelectedRes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);


  const availableRestaurants = useMemo(() => {
    return restaurants.filter(res => !res.admin.id);
  }, [restaurants]);

  const handleAssign = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      await axios.put(`${apiUrl}/restaurants/assign-owner`, 
        { restaurantId: selectedRes, owneremail: email },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setSuccess(true);
      fetchAllRestaurants(); // Refresh global state to reflect new assignment
    } catch (err: any) {
      alert(err.response?.data?.error || "Assignment failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="p-6 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 flex flex-col items-center text-center animate-in zoom-in-95">
      <CheckCircle2 className="text-green-500 mb-2" size={32} />
      <p className="text-sm font-bold text-green-800">Owner Successfully Assigned!</p>
      <p className="text-xs text-green-600 mt-1">{email} is now live.</p>
    </div>
  );

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
      <div className="p-3 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-100 dark:border-orange-900/20">
        <p className="text-[10px] font-bold text-orange-600 uppercase">Target Administrator</p>
        <p className="text-sm font-bold text-gray-800 dark:text-white">{email}</p>
      </div>

      <div>
        <Label>Select Unassigned Restaurant</Label>
        {availableRestaurants.length > 0 ? (
          <select 
            value={selectedRes} 
            onChange={(e) => setSelectedRes(e.target.value)}
            className="w-full mt-1.5 p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="">Choose a restaurant...</option>
            {availableRestaurants.map(res => (
              <option key={res.id} value={res.id}>{res.name}</option>
            ))}
          </select>
        ) : (
          <div className="mt-2 p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-dashed border-gray-200 dark:border-gray-800 flex items-center gap-2 text-gray-400">
            <AlertCircle size={14} />
            <p className="text-[11px] font-medium uppercase">No unassigned restaurants found</p>
          </div>
        )}
      </div>

      <Button 
        onClick={handleAssign} 
        variant="newvariant" 
        className="w-full py-2.5 text-xs font-bold" 
        disabled={loading || !selectedRes || availableRestaurants.length === 0}
      >
        {loading ? "Processing..." : "Confirm & Link Account"}
      </Button>
    </div>
  );
}