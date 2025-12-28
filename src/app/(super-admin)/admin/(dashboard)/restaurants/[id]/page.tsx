"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSuperAdminRestaurants } from "@/context/AdminRestaurantContext";
import Spinner from "@/components/ui/spinner";
import EditRestaurantModal from "@/components/admin/restaurants/EditRestaurantModal";
import AddMenuItemModal from "@/components/admin/restaurants/AddMenuItemModal"; // Correct import
import { toast } from "sonner";
import { 
  ArrowLeft, Phone, Mail, Clock, ShieldCheck, 
  MapPin, Edit3, ExternalLink, CheckCircle2,
  Plus
} from "lucide-react";

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { fetchCompleteRestaurantData, updateRestaurant } = useSuperAdminRestaurants();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");

  const loadData = useCallback(async () => {
    try {
      const fullData = await fetchCompleteRestaurantData(id as string);
      setData(fullData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, fetchCompleteRestaurantData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdate = async (restaurantId: string, payload: any) => {
    try {
      await updateRestaurant(restaurantId, payload);
      toast.success("Settings updated", {
        description: `${data?.name} has been updated successfully.`,
        icon: <CheckCircle2 className="text-green-500" size={18} />
      });
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // --- INTERNAL RENDER HELPERS (Moved inside to access state/id/loadData) ---

  const renderInfoTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Clock size={12}/> Business Hours
        </h4>
        <div className="grid grid-cols-1 gap-1.5">
          {data?.openingHours ? (
            Object.entries(data.openingHours).map(([day, hours]: any) => (
              <div key={day} className="flex justify-between items-center p-2.5 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800 text-xs">
                <span className="capitalize font-semibold text-gray-600 dark:text-gray-400">{day}</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {hours?.open || "00:00"} — {hours?.close || "00:00"}
                </span>
              </div>
            ))
          ) : (
            <div className="p-4 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-center">
              <p className="text-[10px] text-gray-400 font-medium">No hours set yet.</p>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Owner Details</h4>
          <div className="p-3.5 bg-orange-50/50 dark:bg-orange-500/5 rounded-xl border border-orange-100 dark:border-orange-900/30">
             <p className="text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase mb-0.5">Primary Contact</p>
             <p className="text-sm font-bold text-gray-800 dark:text-white">
                {data?.admin?.email || "Unassigned / No Owner"}
             </p>
          </div>
        </div>
        <div className="space-y-2.5">
           <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Quick Contact</h4>
           <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 p-2">
             <Phone size={14} className="text-gray-400"/> {data?.phone || "N/A"}
           </div>
           <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 p-2 border-t border-gray-50 dark:border-white/5">
             <Mail size={14} className="text-gray-400"/> {data?.email || "N/A"}
           </div>
        </div>
      </div>
    </div>
  );

  const renderStaffTab = () => (
    <div className="space-y-3">
      {data?.staff && data.staff.length > 0 ? (
        data.staff.map((s: any) => (
          <div key={s.id} className="flex items-center justify-between p-3.5 border border-gray-100 dark:border-gray-800 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center font-bold text-sm text-gray-500 uppercase">
                {s.admin?.email?.[0] || "?"}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{s.admin?.email}</p>
                <p className={`text-[10px] font-bold px-1.5 py-0.5 rounded inline-block ${s.isDefault ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                  {s.isDefault ? 'OWNER' : 'STAFF'}
                </p>
              </div>
            </div>
            <button className="text-[10px] font-bold text-gray-400 hover:text-red-500 uppercase">Revoke</button>
          </div>
        ))
      ) : (
        <p className="text-xs text-gray-400 text-center py-10">No staff members assigned.</p>
      )}
    </div>
  );

  const renderMenuTab = () => (
    <div className="space-y-8">
      <div className="flex justify-end">
        <button 
          onClick={() => setIsMenuModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-xs font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/10"
        >
          <Plus size={16} /> Add Menu Item
        </button>
      </div>

      {isMenuModalOpen && (
        <AddMenuItemModal 
          restaurantId={id} 
          existingCategories={data?.categories || []}
          onClose={() => setIsMenuModalOpen(false)}
          onSuccess={loadData}
        />
      )}

      {data?.categories && data.categories.length > 0 ? (
        data.categories.map((cat: any) => (
          <div key={cat.id} className="space-y-4">
            <div className="flex items-center gap-3">
              <h4 className="text-sm font-bold text-gray-800 dark:text-white">{cat.name}</h4>
              <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">{cat.items?.length || 0} Items</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(cat.items || []).map((item: any) => (
                <div key={item.id} className="flex gap-3 p-3 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/20">
                  {item.image && <img src={item.image} className="w-14 h-14 rounded-lg object-cover" alt={item.name} />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.name}</p>
                    <p className="text-[10px] text-gray-500 line-clamp-1 my-0.5">{item.description}</p>
                    <p className="text-orange-600 font-bold text-xs">${item.basePrice}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className="text-xs text-gray-400 text-center py-10">The menu is empty.</p>
      )}
    </div>
  );

  // --- MAIN RENDER ---
  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Spinner /></div>;
  if (!data) return <div className="p-10 text-center text-sm text-gray-500">Restaurant not found.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-10">
      <div className="flex items-center justify-between">
        <button onClick={() => router.push('/admin/restaurants')} className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors text-xs font-semibold">
          <ArrowLeft size={14} /> Back to Directory
        </button>
      </div>

      <div className="relative h-44 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 dark:border-gray-800">
        {data.banner ? <img src={data.banner} className="w-full h-full object-cover" alt="banner" /> : <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-6 flex items-end gap-4">
          <div className="w-16 h-16 rounded-xl bg-white p-1 shadow-lg border border-gray-100 overflow-hidden">
             <img src={data.logo || "/placeholder-logo.png"} className="w-full h-full object-cover rounded-lg" alt="logo" />
          </div>
          <div className="pb-1">
            <h1 className="text-xl font-bold text-white leading-tight">{data.name}</h1>
            <p className="text-gray-200 text-xs flex items-center gap-1.5 opacity-90"><MapPin size={12}/> {data.address}</p>
          </div>
        </div>
      </div>

      {isEditModalOpen && <EditRestaurantModal restaurant={data} onClose={() => setIsEditModalOpen(false)} onUpdate={handleUpdate} />}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
            <div className="flex px-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-white/5">
              {["info", "staff", "menu"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`py-3.5 px-4 text-[11px] font-bold uppercase tracking-wider transition-all relative ${activeTab === tab ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'}`}>
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
                </button>
              ))}
            </div>
            <div className="p-6">
               {activeTab === "info" && renderInfoTab()}
               {activeTab === "staff" && renderStaffTab()}
               {activeTab === "menu" && renderMenuTab()}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Management</h3>
            <div className="space-y-2.5">
              <button onClick={() => setIsEditModalOpen(true)} className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-orange-600 transition-all"><Edit3 size={16} /> Edit Details</button>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 transition-all"><ExternalLink size={16} /> Storefront</button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white shadow-md">
             <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-bold uppercase opacity-80">Commission</p>
                <ShieldCheck size={14} className="opacity-80" />
             </div>
             <h4 className="text-2xl font-bold tracking-tight">{data.commissionRate}%</h4>
             <p className="text-[10px] mt-1.5 leading-relaxed opacity-90">Fee applied to transactions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}