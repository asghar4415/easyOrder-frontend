"use client"

import type React from "react"
import { useAuth } from "@/context/AuthContext"; 
import { useRouter } from "next/navigation"; 
import { useEffect } from "react";    
import Spinner from "@/components/ui/spinner";



export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
 const { user, isLoading } = useAuth();
  const router = useRouter();
  


  useEffect(() => {
    if (!isLoading) {
      if (user && user.role === "SUPER_ADMIN") {
         router.push("/admin/dashboard"); 
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || (user && user.role === "SUPER_ADMIN")) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-gray-900">
       <Spinner />
      </div>
    );
  }

  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-gray-900 sm:p-0">
        {children}
        <div className="lg:w-1/2 w-full h-full bg-gradient-to-br from-orange-500 to-orange-600 lg:grid items-center hidden">
          <div className="relative items-center justify-center flex z-1">
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="80" fill="white" />
                <circle cx="300" cy="300" r="60" fill="white" />
                <circle cx="350" cy="80" r="50" fill="white" />
                <circle cx="50" cy="320" r="45" fill="white" />
              </svg>
            </div>
            <div className="relative flex flex-col items-center max-w-xs text-center">
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-white mb-2">EasyOrder</h2>
                <p className="text-orange-100 text-lg font-medium">Restaurant Management</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/20">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 10l-4.293-4.293a1 1 0 010-1.414zm-6 6a1 1 0 011.414 0L10 14.586l4.293-4.293a1 1 0 111.414 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Manage Orders</p>
                      <p className="text-orange-100 text-sm">Real-time order tracking</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Analytics</p>
                      <p className="text-orange-100 text-sm">Insights & reporting</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v4h8v-4zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Team Management</p>
                      <p className="text-orange-100 text-sm">Coordinate your staff</p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-orange-100 text-sm">
                Streamline your restaurant operations with an intuitive admin dashboard
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
