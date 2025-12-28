"use client";
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { X, Upload, AlertCircle, Loader2 } from "lucide-react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { toast } from "sonner";

export default function EditRestaurantModal({ restaurant, onClose, onUpdate }: any) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState({ logo: false, banner: false });

    const [formData, setFormData] = useState({
        name: restaurant.name || "",
        description: restaurant.description || "",
        address: restaurant.address || "",
        phone: restaurant.phone || "",
        email: restaurant.email || "",
        commissionRate: restaurant.commissionRate,
        deliveryTime: restaurant.deliveryTime || 30,
        isActive: restaurant.isActive,
        isVerified: restaurant.isVerified,
        isAutoAcceptOrders: restaurant.isAutoAcceptOrders,
        logo: restaurant?.logo || "",
        banner: restaurant?.banner || "",
        openingHours: restaurant.openingHours || {
            monday: { open: "09:00", close: "22:00" },
            tuesday: { open: "09:00", close: "22:00" },
            wednesday: { open: "09:00", close: "22:00" },
            thursday: { open: "09:00", close: "22:00" },
            friday: { open: "09:00", close: "23:00" },
            saturday: { open: "10:00", close: "23:00" },
            sunday: { open: "10:00", close: "22:00" },
        }
    });

    const handleImageUpload = async (file: File, type: 'logo' | 'banner') => {
        if (loading) return;
        setUploading(prev => ({ ...prev, [type]: true }));
        const uploadData = new FormData();
        uploadData.append("image", file);
        try {
            const token = Cookies.get("token");
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/uploads/upload-image`, uploadData, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
            });
            setFormData(prev => ({ ...prev, [type]: res.data.imageUrl }));
            toast.success("Image uploaded successfully");
        } catch (err) {
            toast.error("Image upload failed");
        } finally {
            setUploading(prev => ({ ...prev, [type]: false }));
        }
    };

    const handleHourChange = (day: string, field: 'open' | 'close', value: string) => {
        setFormData(prev => ({
            ...prev,
            openingHours: {
                ...prev.openingHours,
                [day]: { ...prev.openingHours[day], [field]: value }
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onUpdate(restaurant.id, formData);
            onClose();
        } catch (err: any) {
            toast.error("Update failed", {
                description: err.message || "Something went wrong.",
                icon: <AlertCircle className="text-red-500" size={18} />
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-3xl shadow-2xl my-auto border border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Edit Restaurant Settings</h2>
                        <p className="text-xs text-gray-500">Updating: {restaurant.name}</p>
                    </div>
                    <button onClick={onClose} disabled={loading} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors disabled:opacity-30">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[75vh] custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <section>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-4">Media Assets</h3>
                                <div className="flex gap-4">
                                    <div className={`relative group w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden ${loading ? 'opacity-50 border-gray-100' : 'border-gray-200 hover:border-orange-500'}`}>
                                        {formData.logo ? (
                                            <img src={formData.logo} className="w-full h-full object-cover" alt="logo" />
                                        ) : (
                                            <Upload className="text-gray-300" size={20} />
                                        )}
                                        {!loading && (
                                            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                                <Upload size={16} className="text-white" />
                                                <input type="file" className="hidden" disabled={loading} onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'logo')} />
                                            </label>
                                        )}
                                    </div>
                                    <div className={`relative group flex-1 h-24 bg-gray-50 dark:bg-white/5 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden ${loading ? 'opacity-50 border-gray-100' : 'border-gray-200 hover:border-orange-500'}`}>
                                        {formData.banner ? (
                                            <img src={formData.banner} className="w-full h-full object-cover" alt="banner" />
                                        ) : (
                                            <Upload className="text-gray-300" size={20} />
                                        )}
                                        {!loading && (
                                            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                                <Upload size={18} className="text-white" />
                                                <input type="file" className="hidden" disabled={loading} onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'banner')} />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-orange-500">General Information</h3>
                                <div className="space-y-1.5">
                                    <Label>Email Address (ReadOnly)</Label>
                                    <Input value={formData.email} disabled className="bg-gray-50 dark:bg-gray-800 opacity-60" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Restaurant Name</Label>
                                    <Input value={formData.name} disabled={loading} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label>Commission (%)</Label>
                                        <Input type="number"
                                            value={isNaN(formData.commissionRate) ? "" : formData.commissionRate}
                                            disabled={loading}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setFormData({
                                                    ...formData,
                                                    commissionRate: val === "" ? 0 : parseFloat(val)
                                                })
                                            }} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Delivery (Min)</Label>
                                        <Input type="number" value={isNaN(formData.deliveryTime) ? "" : formData.deliveryTime} disabled={loading}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setFormData({
                                                    ...formData,
                                                    deliveryTime: val === "" ? 0 : parseInt(val)
                                                })
                                            }} />
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-orange-500">Platform Status</h3>
                                <div className="flex flex-wrap gap-3">
                                    {['isActive', 'isVerified', 'isAutoAcceptOrders'].map(key => (
                                        <button
                                            key={key} type="button" disabled={loading}
                                            onClick={() => setFormData((prev: any) => ({ ...prev, [key]: !prev[key] }))}
                                            className={`px-3 py-2 rounded-xl text-[10px] font-bold border transition-all flex items-center gap-2 ${(formData as any)[key] ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-white dark:bg-gray-800 border-gray-200 text-gray-400'
                                                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <div className={`w-2 h-2 rounded-full ${(formData as any)[key] ? 'bg-orange-500' : 'bg-gray-300'}`} />
                                            {key.replace(/([A-Z])/g, ' $1')}
                                        </button>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className="space-y-6">
                            <section>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-4">Operational Hours</h3>
                                <div className={`space-y-2 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 transition-opacity ${loading ? 'opacity-50' : ''}`}>
                                    {Object.keys(formData.openingHours).map((day) => (
                                        <div key={day} className="flex items-center justify-between gap-4">
                                            <span className="text-[11px] font-bold uppercase text-gray-500 w-20">{day}</span>
                                            <div className="flex items-center gap-2 flex-1">
                                                <input
                                                    type="time" disabled={loading}
                                                    value={formData.openingHours[day].open}
                                                    onChange={(e) => handleHourChange(day, 'open', e.target.value)}
                                                    className="w-full p-1.5 text-xs rounded border border-gray-200 dark:border-gray-700 dark:bg-gray-800 outline-none focus:border-orange-500"
                                                />
                                                <span className="text-gray-300">—</span>
                                                <input
                                                    type="time" disabled={loading}
                                                    value={formData.openingHours[day].close}
                                                    onChange={(e) => handleHourChange(day, 'close', e.target.value)}
                                                    className="w-full p-1.5 text-xs rounded border border-gray-200 dark:border-gray-700 dark:bg-gray-800 outline-none focus:border-orange-500"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                            <section className="space-y-4">
                                <Label>Full Address</Label>
                                <textarea
                                    rows={3} disabled={loading}
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full p-3 text-xs rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 outline-none focus:border-orange-500"
                                />
                            </section>
                        </div>
                    </div>

                    <div className="mt-10 flex gap-3 justify-end sticky bottom-0 bg-white dark:bg-gray-900 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <button type="button" onClick={onClose} disabled={loading} className="px-6 py-2.5 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase disabled:opacity-30">Discard</button>
                        <Button type="submit" variant="newvariant" className="px-10 py-2.5 text-xs font-bold min-w-[160px]" disabled={loading || uploading.logo || uploading.banner}>
                            {loading ? <div className="flex items-center gap-2"><Loader2 className="animate-spin" size={14} /> Saving...</div> : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}