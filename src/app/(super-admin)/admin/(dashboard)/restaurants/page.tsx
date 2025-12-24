"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSuperAdminRestaurants } from "@/context/AdminRestaurantContext";
import Spinner from "@/components/ui/spinner";
import { SearchIcon, PlusIcon } from "lucide-react";
import RestaurantCard from "@/components/admin/restaurants/RestaurantCard";

export default function RestaurantsPage() {
  const { restaurants, loading } = useSuperAdminRestaurants();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const filtered = restaurants.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.admin?.email && r.admin.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return (
    <div className="h-[70vh] flex items-center justify-center">
      <Spinner />
    </div>
  );

  return (
    <div className="p-1 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Restaurant Partners
          </h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Visual directory of all restaurants currently on the platform.
          </p>
        </div>
        
        <button 
          onClick={() => router.push("/admin/restaurants/create")}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white transition-all bg-orange-500 rounded-lg hover:bg-orange-600 shadow-sm active:scale-95"
        >
          <PlusIcon size={18} /> Add New Restaurant
        </button>
      </div>

      {/* Search Bar Row */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-[320px]">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none">
            <SearchIcon size={18} />
          </span>
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full py-2.5 pl-12 pr-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="hidden lg:block">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Total Results: <span className="text-gray-800 dark:text-white">{filtered.length}</span>
          </p>
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((res) => (
            <RestaurantCard key={res.id} restaurant={res} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
          <SearchIcon size={40} className="text-gray-200 mb-4" />
          <p className="text-gray-500 font-medium">No results found for your search</p>
          <button 
            onClick={() => setSearchTerm("")} 
            className="mt-3 text-sm font-bold text-orange-500 hover:text-orange-600"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}