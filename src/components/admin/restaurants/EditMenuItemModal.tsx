"use client";
import React, { useState, useEffect } from "react";
import { X, Upload, Plus, Trash2, Loader2, Flame, Leaf, Beef, Settings2 } from "lucide-react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { menuService } from "@/services/menuService";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

export default function EditMenuItemModal({ item, categories, onClose, onSuccess }: any) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categoryMode, setCategoryMode] = useState<"MOVE" | "UPDATE" | "NEW">("MOVE");

  // Initial State Mapping from the deep JSON item
  const [formData, setFormData] = useState<any>({
    restaurantId: item.restaurantId,
    categoryId: item.categoryId,
    categoryData: {
      name: "",
      description: "",
      updateExisting: false
    },
    itemDetails: {
      name: item.name,
      description: item.description || "",
      basePrice: item.basePrice,
      image: item.image || "",
      isAvailable: item.isAvailable,
      isVegetarian: item.isVegetarian,
      isVegan: item.isVegan,
      isSpicy: item.isSpicy
    },
    // Map existing variants and their options
    variants: item.variants?.map((v: any) => ({
      id: v.id, // Important for backend syncing
      name: v.name,
      type: v.type,
      isRequired: v.isRequired,
      options: v.options?.map((o: any) => ({
        id: o.id, // Important for backend syncing
        name: o.name,
        price: o.price,
        isDefault: o.isDefault
      })) || []
    })) || []
  });

  // --- Dynamic Handlers ---

  const addVariant = () => {
    setFormData((prev: any) => ({
      ...prev,
      variants: [...prev.variants, { name: "", type: "SINGLE", isRequired: false, options: [{ name: "", price: 0, isDefault: false }] }]
    }));
  };

  const removeVariant = (vIdx: number) => {
    const updated = [...formData.variants];
    updated.splice(vIdx, 1);
    setFormData({ ...formData, variants: updated });
  };

  const addOption = (vIdx: number) => {
    const updated = [...formData.variants];
    updated[vIdx].options.push({ name: "", price: 0, isDefault: false });
    setFormData({ ...formData, variants: updated });
  };

  const removeOption = (vIdx: number, oIdx: number) => {
    const updated = [...formData.variants];
    updated[vIdx].options.splice(oIdx, 1);
    setFormData({ ...formData, variants: updated });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append("image", file);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/uploads/upload-image`, data, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${Cookies.get("token")}` }
      });
      setFormData((p: any) => ({ ...p, itemDetails: { ...p.itemDetails, image: res.data.imageUrl } }));
      toast.success("Image updated");
    } catch (err) { toast.error("Upload failed"); } 
    finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Final payload formatting
      const payload = {
        ...formData,
        categoryId: categoryMode === "NEW" ? "NEW" : formData.categoryId,
        categoryData: {
          ...formData.categoryData,
          updateExisting: categoryMode === "UPDATE"
        }
      };

      await menuService.syncMenuItem(item.id, payload);
      toast.success("Menu updated successfully");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Sync failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto h-full">
      <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-3xl shadow-2xl my-auto animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-white/5">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-orange-100 dark:bg-orange-500/10 text-orange-500 rounded-xl"><Settings2 size={20}/></div>
             <div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Update Menu Item</h2>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Item ID: {item.id}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar space-y-10">
          
          {/* 1. Category Management */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-orange-500">1. Category Assignment</h3>
              <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-lg">
                 {["MOVE", "UPDATE", "NEW"].map((mode: any) => (
                   <button 
                    key={mode} type="button" onClick={() => setCategoryMode(mode)}
                    className={`px-3 py-1 text-[9px] font-bold rounded-md transition-all ${categoryMode === mode ? 'bg-white dark:bg-gray-800 text-orange-500 shadow-sm' : 'text-gray-400'}`}
                   >
                     {mode}
                   </button>
                 ))}
              </div>
            </div>

            {categoryMode === "MOVE" && (
              <select 
                value={formData.categoryId} 
                onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-1 focus:ring-orange-500"
              >
                {categories?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            )}

            {(categoryMode === "NEW" || categoryMode === "UPDATE") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1">
                 <Input 
                   placeholder={categoryMode === "NEW" ? "New Category Name" : "Update Current Name"} 
                   value={formData.categoryData.name} 
                   onChange={(e) => setFormData({...formData, categoryData: {...formData.categoryData, name: e.target.value}})}
                   required 
                 />
                 <Input 
                   placeholder="Category Description" 
                   value={formData.categoryData.description} 
                   onChange={(e) => setFormData({...formData, categoryData: {...formData.categoryData, description: e.target.value}})}
                 />
              </div>
            )}
          </section>

          {/* 2. Core Details */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-orange-500">2. Base Item Configuration</h3>
            <div className="flex gap-6 items-start">
               <div className={`relative w-28 h-28 bg-gray-50 dark:bg-white/5 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${uploading ? 'opacity-50' : 'hover:border-orange-500 cursor-pointer'}`}>
                  {formData.itemDetails.image ? (
                    <img src={formData.itemDetails.image} className="w-full h-full object-cover" alt="item" />
                  ) : (
                    <Upload className="text-gray-300" size={24} />
                  )}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
               </div>
               <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input value={formData.itemDetails.name} onChange={(e) => setFormData({...formData, itemDetails: {...formData.itemDetails, name: e.target.value}})} required />
                    <Input type="number" value={formData.itemDetails.basePrice} onChange={(e) => setFormData({...formData, itemDetails: {...formData.itemDetails, basePrice: parseFloat(e.target.value)}})} required />
                  </div>
                  <textarea 
                    rows={2} value={formData.itemDetails.description} 
                    onChange={(e) => setFormData({...formData, itemDetails: {...formData.itemDetails, description: e.target.value}})}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-1 focus:ring-orange-500"
                  />
               </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'isVegetarian', label: 'Veg', icon: <Leaf size={10}/> },
                { key: 'isVegan', label: 'Vegan', icon: <Beef size={10}/> },
                { key: 'isSpicy', label: 'Spicy', icon: <Flame size={10}/> }
              ].map(flag => (
                <button 
                  key={flag.key} type="button"
                  onClick={() => setFormData({...formData, itemDetails: {...formData.itemDetails, [flag.key]: !formData.itemDetails[flag.key]}})}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all flex items-center gap-1.5 ${formData.itemDetails[flag.key] ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white dark:bg-gray-800 border-gray-200 text-gray-400'}`}
                >
                  {flag.icon} {flag.label}
                </button>
              ))}
            </div>
          </section>

          {/* 3. Dynamic Variants Sync */}
          <section className="space-y-4 pb-10">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-orange-500">3. Customization Schema</h3>
              <button type="button" onClick={addVariant} className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 dark:bg-orange-500/10 text-orange-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-orange-100 transition-all">
                <Plus size={14}/> Add New Variant
              </button>
            </div>

            <div className="space-y-6">
              {formData.variants.map((v: any, vIdx: number) => (
                <div key={vIdx} className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-5 relative group/var animate-in slide-in-from-right-4">
                  <button type="button" onClick={() => removeVariant(vIdx)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-10">
                    <div className="space-y-1">
                        <Label className="text-[9px] uppercase font-black text-gray-400">Variant Name</Label>
                        <Input value={v.name} onChange={(e) => {
                            const updated = [...formData.variants];
                            updated[vIdx].name = e.target.value;
                            setFormData({...formData, variants: updated});
                        }} />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[9px] uppercase font-black text-gray-400">Input Type</Label>
                        <select 
                            value={v.type} className="w-full h-11 px-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs"
                            onChange={(e) => {
                                const updated = [...formData.variants];
                                updated[vIdx].type = e.target.value;
                                setFormData({...formData, variants: updated});
                            }}
                        >
                            <option value="SINGLE">Single Selection (Radio)</option>
                            <option value="MULTI_SELECT">Multiple Selection (Checkbox)</option>
                        </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-[9px] text-gray-400 font-black uppercase">Option Set</Label>
                        <button type="button" onClick={() => addOption(vIdx)} className="text-[10px] font-bold text-blue-500 hover:underline">+ New Option</button>
                    </div>
                    {v.options.map((opt: any, oIdx: number) => (
                      <div key={oIdx} className="flex gap-3 items-center animate-in fade-in">
                        <Input placeholder="Option Title" className="flex-1" value={opt.name} onChange={(e) => {
                           const updated = [...formData.variants];
                           updated[vIdx].options[oIdx].name = e.target.value;
                           setFormData({...formData, variants: updated});
                        }} />
                        <div className="w-32 relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">$</span>
                            <Input type="number" placeholder="Price" className="pl-6" value={opt.price} onChange={(e) => {
                                const updated = [...formData.variants];
                                updated[vIdx].options[oIdx].price = parseFloat(e.target.value) || 0;
                                setFormData({...formData, variants: updated});
                            }} />
                        </div>
                        <button type="button" onClick={() => removeOption(vIdx, oIdx)} className="p-2 text-gray-300 hover:text-red-500"><X size={16}/></button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-4 sticky bottom-0 bg-white dark:bg-gray-900 rounded-b-3xl">
           <button type="button" onClick={onClose} disabled={loading} className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4">Discard</button>
           <Button type="submit" variant="newvariant" disabled={loading || uploading} onClick={handleSubmit} className="px-12 py-3 text-xs font-bold">
             {loading ? <div className="flex items-center gap-2"><Loader2 className="animate-spin" size={14}/> Updating Menu Item...</div> : "Save & Sync Menu"}
           </Button>
        </div>
      </div>
    </div>
  );
}