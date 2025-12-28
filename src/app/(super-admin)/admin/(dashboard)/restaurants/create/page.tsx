"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { useSuperAdminRestaurants } from "@/context/AdminRestaurantContext";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { 
  ArrowLeft, Store, Percent, Phone, Mail, 
  MapPin, AlignLeft, Upload, Image as ImageIcon, X 
} from "lucide-react";

export default function CreateRestaurantPage() {
  const router = useRouter();
  const { createRestaurant } = useSuperAdminRestaurants();
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<{ logo: boolean; banner: boolean }>({ logo: false, banner: false });
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    commissionRate: 5,
    logo: "",   // S3 URL will be stored here
    banner: "", // S3 URL will be stored here
  });

  // Refs for hidden file inputs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- IMAGE UPLOAD LOGIC ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(prev => ({ ...prev, [type]: true }));
    setError("");

    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      const token = Cookies.get("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const response = await axios.post(`${apiUrl}/uploads/upload-image`, uploadData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}` 
        },
      });

      // Update the specific field with the S3 URL
      setFormData(prev => ({ ...prev, [type]: response.data.imageUrl }));
    } catch (err: any) {
      setError(`Failed to upload ${type}. Please try again.`);
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createRestaurant({
        ...formData,
        commissionRate: Number(formData.commissionRate)
      });
      router.push("/admin/restaurants");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-orange-500 transition-colors uppercase tracking-widest"
      >
        <ArrowLeft size={14} /> Back to Directory
      </button>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-white/5">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Register New Restaurant</h1>
          <p className="text-xs text-gray-500 mt-1">Onboard a new partner by providing their core business details.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="p-3 text-xs font-semibold text-red-500 bg-red-50 border border-red-100 rounded-lg">
              {error}
            </div>
          )}

          {/* --- MEDIA UPLOAD SECTION --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo Upload */}
            <div className="space-y-3">
              <Label>Restaurant Logo</Label>
              <div className="relative group w-32 h-32 bg-gray-50 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all hover:border-orange-500">
                {formData.logo ? (
                  <>
                    <img src={formData.logo} className="w-full h-full object-cover" alt="logo" />
                    <button 
                      type="button" 
                      onClick={() => setFormData(prev => ({...prev, logo: ""}))}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon className="mx-auto text-gray-300 mb-2" size={24} />
                    <button 
                      type="button"
                      disabled={uploading.logo}
                      onClick={() => logoInputRef.current?.click()}
                      className="text-[10px] font-bold text-orange-500 uppercase tracking-tighter hover:underline"
                    >
                      {uploading.logo ? "Uploading..." : "Upload Logo"}
                    </button>
                  </div>
                )}
                <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} />
              </div>
            </div>

            {/* Banner Upload */}
            <div className="md:col-span-2 space-y-3">
              <Label>Cover Photo (Banner)</Label>
              <div className="relative group h-32 bg-gray-50 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all hover:border-orange-500">
                {formData.banner ? (
                  <>
                    <img src={formData.banner} className="w-full h-full object-cover" alt="banner" />
                    <button 
                      type="button" 
                      onClick={() => setFormData(prev => ({...prev, banner: ""}))}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto text-gray-300 mb-2" size={24} />
                    <button 
                      type="button"
                      disabled={uploading.banner}
                      onClick={() => bannerInputRef.current?.click()}
                      className="text-xs font-bold text-orange-500 uppercase tracking-widest hover:underline"
                    >
                      {uploading.banner ? "Processing..." : "Select Banner Image"}
                    </button>
                  </div>
                )}
                <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'banner')} />
              </div>
            </div>
          </div>

          <hr className="border-gray-100 dark:border-gray-800" />

          {/* --- RESTAURANT INFO SECTION --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-1.5">
              <Label>Restaurant Name <span className="text-orange-500">*</span></Label>
              <div className="relative">
                <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <Input name="name" placeholder="Fast Burger Express" value={formData.name} onChange={handleChange} className="pl-11" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Commission Rate (%) <span className="text-orange-500">*</span></Label>
              <div className="relative">
                <Percent className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <Input type="number" name="commissionRate" placeholder="5" value={formData.commissionRate} onChange={handleChange} className="pl-11" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Business Email <span className="text-orange-500">*</span></Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <Input type="email" name="email" placeholder="admin@restaurant.com" value={formData.email} onChange={handleChange} className="pl-11" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Business Phone <span className="text-orange-500">*</span></Label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <Input name="phone" placeholder="03001234567" value={formData.phone} onChange={handleChange} className="pl-11" required />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Address <span className="text-orange-500">*</span></Label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
              <textarea 
                name="address" rows={2} placeholder="Full physical address..." value={formData.address} onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-1 focus:ring-orange-500 outline-none text-sm" required 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <div className="relative">
              <AlignLeft className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
              <textarea 
                name="description" rows={3} placeholder="About the restaurant..." value={formData.description} onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-1 focus:ring-orange-500 outline-none text-sm"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-4 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={() => router.back()} className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase">Cancel</button>
            <Button type="submit" variant="newvariant" className="px-10 py-3 text-sm font-bold" disabled={loading || uploading.logo || uploading.banner}>
              {loading ? "Registering..." : "Finalize Registration"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}