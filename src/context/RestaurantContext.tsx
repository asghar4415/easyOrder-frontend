"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";

// --- TYPES (Based on your JSON) ---

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
  description: string;
  address: string;
  phone: string;
  email: string;
  logo: string | null;
  banner: string | null;
  isActive: boolean;
  isVerified: boolean;
  openingHours: OpeningHours;
  commissionRate: number;
  adminId: string;
  categories: Category[];
}

// --- CONTEXT SETUP ---

interface RestaurantContextType {
  restaurant: Restaurant | null;
  loading: boolean;
  error: string | null;
  refreshRestaurant: () => Promise<void>; // Call this to re-fetch data after an update
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Start loading true
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurant = useCallback(async () => {
    // Don't fetch if auth is still loading or user isn't an admin
    if (authLoading || !user || user.role !== "RESTAURANT_ADMIN") {
        setLoading(false);
        return;
    }

    setLoading(true);
    try {
      const token = Cookies.get("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!token) throw new Error("No token found");

      // 1. Get List
      const listRes = await axios.get(`${apiUrl}/restaurants/my-restaurants`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const myRestaurants = listRes.data.restaurants;

      if (Array.isArray(myRestaurants) && myRestaurants.length > 0) {
        const restaurantId = myRestaurants[0]._id || myRestaurants[0].id;
        
        const detailRes = await axios.get(`${apiUrl}/restaurants/${restaurantId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRestaurant(detailRes.data);
        setError(null);
      } else {
        setError("No restaurant found for this admin.");
        
      }
    } catch (err: any) {
      console.error("Error fetching restaurant:", err);
      setError(err.message || "Failed to load restaurant data");
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]);

  // Initial Fetch
  useEffect(() => {
    fetchRestaurant();
  }, [fetchRestaurant]);

  return (
    <RestaurantContext.Provider value={{ restaurant, loading, error, refreshRestaurant: fetchRestaurant }}>
      {children}
    </RestaurantContext.Provider>
  );
}

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) throw new Error("useRestaurant must be used within a RestaurantProvider");
  return context;
};