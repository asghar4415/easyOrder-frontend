"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Spinner from "@/components/ui/spinner";
import { Users, ShoppingBag, DollarSign, AlertCircle, TrendingUp, Target } from "lucide-react";

// Import Sub-components
import { MetricCard } from "@/components/admin/dashboard/MetricCard";
import { OrderFeed } from "@/components/admin/dashboard/OrderFeed";
import { Leaderboard } from "@/components/admin/dashboard/Leaderboard";
import { SystemStatus } from "@/components/admin/dashboard/SystemStatus";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = Cookies.get("token");
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/superadmin/getstats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    }
    fetchStats();
  }, []);

  if (loading) return <div className="h-[70vh] flex items-center justify-center"><Spinner /></div>;

  return (
    <div className="grid grid-cols-12 gap-6 pb-10 animate-in fade-in duration-500">
      
      {/* 1. TOP METRICS */}
      <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Users" value={data?.metrics?.users} icon={<Users />} color="text-blue-600" bg="bg-blue-50" />
        <MetricCard title="Total Orders" value={data?.metrics?.orders} icon={<ShoppingBag />} color="text-green-600" bg="bg-green-50" />
        <MetricCard title="Platform Revenue" value={`$${data?.metrics?.revenue?.toFixed(2) || "0.00"}`} icon={<DollarSign />} color="text-purple-600" bg="bg-purple-50" />
        <MetricCard title="Pending Approvals" value={data?.metrics?.pendingApprovals} icon={<AlertCircle />} 
          color={data?.metrics?.pendingApprovals > 0 ? "text-red-600" : "text-gray-400"} 
          bg={data?.metrics?.pendingApprovals > 0 ? "bg-red-50 animate-pulse" : "bg-gray-50"} 
        />
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="col-span-12 xl:col-span-8 space-y-6">
        {/* Growth Chart Container */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
           <div className="flex items-center justify-between mb-6">
              <div><h3 className="text-lg font-bold text-gray-800 dark:text-white">Order Volume Trends</h3><p className="text-xs text-gray-500">Daily performance metrics across all active venues.</p></div>
              <div className="p-2 bg-orange-50 dark:bg-orange-500/10 rounded-xl"><TrendingUp className="text-orange-500" size={20} /></div>
           </div>
           <div className="h-[300px] bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center">
              <p className="text-xs text-gray-400 font-medium italic">[ Real-time Chart Data Processing ]</p>
           </div>
        </div>

        <OrderFeed orders={data?.recentActivity} />
      </div>

      {/* 3. SIDEBAR INSIGHTS */}
      <div className="col-span-12 xl:col-span-4 space-y-6">
        {/* Progress Goal */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
           <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Target size={14} className="text-orange-500" /> Platform Goal</h3>
           <div className="flex justify-between items-end mb-2">
              <p className="text-2xl font-black text-gray-800 dark:text-white">74%</p>
              <TrendingUp size={18} className="text-green-500" />
           </div>
           <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
              <div className="bg-orange-500 h-full rounded-full w-[74%]"></div>
           </div>
        </div>

        <Leaderboard restaurants={data?.topRestaurants} />
        <SystemStatus />
      </div>
    </div>
  );
}