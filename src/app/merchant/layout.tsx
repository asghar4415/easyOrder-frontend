"use client";

import React, { useEffect } from "react";
import { useSidebar } from "@/context/SidebarContext";
import { RestaurantProvider } from "@/context/RestaurantContext"; // Import Provider
import { ProfileProvider } from "@/context/ProfileContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/spinner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Auth Protection Only
  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== "RESTAURANT_ADMIN") {
        router.push("/signin");
      }
    }
  }, [user, isLoading, router]);



  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <Spinner />
      </div>
    );
  }

  if (!user || user.role !== "RESTAURANT_ADMIN") return null;

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <ProfileProvider>
    <RestaurantProvider>
      <div className="min-h-screen xl:flex">
        <AppSidebar />
        <Backdrop />
        <div className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}>
          <AppHeader />
          <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
            {children}
          </div>
        </div>
      </div>
    </RestaurantProvider>
    </ProfileProvider>
  );
}