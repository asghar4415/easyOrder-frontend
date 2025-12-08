"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";

// Define the shape of your Admin Profile
// Add any fields your backend /api/users/profile returns
export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  phone?: string;
  role?: string;
}

interface ProfileContextType {
  profile: AdminProfile | null;
  loading: boolean;
  error: string | null;
  refetchProfile: () => Promise<void>; // Call this after updating profile
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    // 1. Wait for Auth to finish
    if (authLoading) return;

    // 2. If no user is logged in, clear profile and stop
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const token = Cookies.get("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!token) throw new Error("No token found");

      // 3. Fetch Data
      const response = await axios.get(`${apiUrl}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;
      setProfile({
        id: data.id || data._id,
        name: data.name || "Admin",
        email: data.email,
        avatar: data.image || data.avatar || null, // Handle 'image' vs 'avatar'
        phone: data.phone || "",
        role: data.role || user.role // Fallback to auth role if not in profile
      });
      setError(null);

    } catch (err: any) {
      console.error("Error fetching profile:", err);
      setError(err.message || "Failed to load profile");
      
      // Fallback: If API fails, at least show what we know from the Token
      setProfile({
        id: user.id,
        name: "Admin",
        email: user.email,
        avatar: null,
        role: typeof user.role === 'string' ? user.role : user.role.name
      });
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]);

  // Initial Fetch
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <ProfileContext.Provider value={{ profile, loading, error, refetchProfile: fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile must be used within a ProfileProvider");
  return context;
};