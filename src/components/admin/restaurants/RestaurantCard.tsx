"use client";
import Link from "next/link";
import { Restaurant } from "@/context/AdminRestaurantContext";
import { User, ChevronRight, LayoutGrid } from "lucide-react";

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link 
      href={`/admin/restaurants/${restaurant.id}`}
      className="group block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden transition-all hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/5 active:scale-[0.98]"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          {/* Logo Placeholder or Image */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/10 dark:to-orange-900/20 flex items-center justify-center border border-orange-200 dark:border-orange-800 transition-transform group-hover:scale-110">
             <span className="text-2xl font-black text-orange-600 uppercase">
               {restaurant.name[0]}
             </span>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
              restaurant.isActive 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
            }`}>
              {restaurant.isActive ? 'Active' : 'Suspended'}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate">
          {restaurant.name}
        </h3>
        
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <User size={14} className="text-orange-500" />
            <span className="text-xs font-medium truncate">{restaurant.admin.email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <LayoutGrid size={14} className="text-orange-500" />
            <span className="text-xs font-medium">{restaurant._count.categories} Menu Categories</span>
          </div>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center group-hover:bg-orange-50/50 dark:group-hover:bg-orange-500/5 transition-colors">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Platform Fee</span>
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{restaurant.commissionRate}%</span>
        </div>
        <div className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm transition-transform group-hover:translate-x-1">
          <ChevronRight size={16} className="text-orange-500" />
        </div>
      </div>
    </Link>
  );
}