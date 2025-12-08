"use client";
import Link from "next/link";
import React from "react";
import GridShape from "@/components/common/GridShape"; // Adjust path if needed

export default function MerchantNotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[60vh] p-6 overflow-hidden z-1">
      {/* Background Shape */}
      <div className="absolute inset-0 opacity-50 pointer-events-none">
         <GridShape />
      </div>

      <div className="mx-auto w-full max-w-[400px] text-center z-10">
        <h1 className="mb-4 font-bold text-gray-800 text-title-xl dark:text-white/90">
          404
        </h1>
        
        <h2 className="mb-6 text-xl font-semibold text-gray-700 dark:text-gray-300">
          Page Not Found
        </h2>

        <p className="mb-8 text-base text-gray-500 dark:text-gray-400">
          The page you are looking for in the dashboard does not exist or is under construction.
        </p>

        <Link
          href="/merchant"
          className="inline-flex items-center justify-center rounded-lg border border-orange-500 bg-orange-500 px-6 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-orange-600 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}