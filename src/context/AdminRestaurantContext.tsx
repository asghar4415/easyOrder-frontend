"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";

export interface RestaurantAdmin {
  id: string;
  email: string;
}

export interface RestaurantCount {
  categories: number;
}

export interface Option {
  id: string;
  name: string;
  price: number;
  isDefault: boolean;
  isAvailable: boolean;
  variantId: string;
}

export interface Variant {
  id: string;
  name: string;
  type: "SINGLE" | "MULTI";
  isRequired: boolean;
  minOptions: number | null;
  maxOptions: number | null;
  options: Option[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
  image: string | null;
  isAvailable: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isSpicy: boolean;
  variants: Variant[];
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  items: MenuItem[];
}

export interface OpeningHoursDay {
  open: string;
  close: string;
}

export interface OpeningHours {
  monday: OpeningHoursDay;
  tuesday: OpeningHoursDay;
  wednesday: OpeningHoursDay;
  thursday: OpeningHoursDay;
  friday: OpeningHoursDay;
  saturday: OpeningHoursDay;
  sunday: OpeningHoursDay;
}

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  isActive: boolean;
  isVerified: boolean;
  commissionRate: number;
  createdAt: string;
  admin: RestaurantAdmin; // Required based on your new backend select
  _count: RestaurantCount; // Required based on your new backend select

  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string | null;
  banner?: string | null;
  deliveryTime?: number;
  adminId?: string;
}

interface SuperAdminContextType {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
  fetchAllRestaurants: () => Promise<void>;
  fetchCompleteRestaurantData: (id: string) => Promise<any>; // New function
  updateRestaurantStatus: (id: string, status: { isActive?: boolean; isVerified?: boolean }) => Promise<void>;
  deleteRestaurant: (id: string) => Promise<void>;
  createRestaurant: (payload: any) => Promise<any>;
  updateRestaurant: (id: string, payload: any) => Promise<any>;
}

const SuperAdminContext = createContext<SuperAdminContextType | undefined>(undefined);

export function SuperAdminProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllRestaurants = useCallback(async () => {
    if (authLoading || !user || user.role !== "SUPER_ADMIN") {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const token = Cookies.get("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!token) throw new Error("Authentication token missing");

      const response = await axios.get(`${apiUrl}/restaurants/all-restaurants`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Your backend returns { message: "...", restaurants: [...] }
      const data = response.data.restaurants;
      setRestaurants(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      console.error("SuperAdmin Fetch Error:", err);
      setError(err.response?.data?.error || "Failed to load platform restaurants");
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]);

  // Admin Action: Update Status
  const updateRestaurantStatus = async (id: string, status: { isActive?: boolean; isVerified?: boolean }) => {
    try {
      const token = Cookies.get("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      // Note: Use PATCH or PUT based on your backend route
      await axios.put(`${apiUrl}/restaurants/${id}`, status, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setRestaurants((prev) => 
        prev.map((r) => (r.id === id ? { ...r, ...status } : r))
      );
    } catch (err: any) {
      throw err;
    }
  };

  // Admin Action: Delete
  const deleteRestaurant = async (id: string) => {
    try {
      const token = Cookies.get("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      await axios.delete(`${apiUrl}/restaurants/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setRestaurants((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      throw err;
    }
  };
  const fetchCompleteRestaurantData = useCallback(async (id: string) => {
  try {
    const token = Cookies.get("token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    // Hitting your specific deep-data API
    const response = await axios.get(`${apiUrl}/restaurants/completeData/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return response.data; // This returns the massive JSON you provided
  } catch (err: any) {
    throw new Error(err.response?.data?.error || "Failed to fetch complete details");
  }
}, []);
 const createRestaurant = useCallback(async (payload: any) => {
    try {
      const token = Cookies.get("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const response = await axios.post(`${apiUrl}/restaurants/create-restaurant`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchAllRestaurants();
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Failed to create restaurant");
    }
  }, [fetchAllRestaurants]); 

  useEffect(() => {
    fetchAllRestaurants();
  }, [fetchAllRestaurants]);

  const updateRestaurant = useCallback(async (id: string, payload: any) => {
  try {
    const token = Cookies.get("token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const response = await axios.put(`${apiUrl}/restaurants/update-restaurant/${id}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Refresh the list to reflect changes in the sidebar and main list
    await fetchAllRestaurants();
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.error || "Failed to update restaurant");
  }
}, [fetchAllRestaurants]);

  return (
    <SuperAdminContext.Provider 
      value={{ 
        restaurants, 
        loading, 
        error, 
        fetchAllRestaurants, 
        updateRestaurantStatus,
        deleteRestaurant,
        fetchCompleteRestaurantData,
        createRestaurant,
        updateRestaurant,
      }}
    >
      {children}
    </SuperAdminContext.Provider>
  );
}

export const useSuperAdminRestaurants = () => {
  const context = useContext(SuperAdminContext);
  if (!context) throw new Error("useSuperAdminRestaurants must be used within a SuperAdminProvider");
  return context;
};
