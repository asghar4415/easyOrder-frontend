"use client";
import React, { useState } from "react";
import { X, Plus, Trash2, Upload, Loader2, Info, Flame, Leaf, Beef } from "lucide-react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { menuService } from "@/services/menuService";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

export default function AddMenuItemModal({ restaurantId, existingCategories, onClose, onSuccess }: any) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState<any>({
    isNewCategory: false,
    categoryId: "",
    categoryName: "",
    categoryDescription: "",
    itemDetails: {
      name: "",
      description: "",
      basePrice: 0,
      image: "",
      isAvailable: true,
      isVegetarian: false,
      isVegan: false,
      isSpicy: false
    },
    variants: [] // { name, type, isRequired, minOptions, maxOptions, options: [{name, price, isDefault}] }
  });

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
      setFormData((prev: any) => ({ ...prev, itemDetails: { ...prev.itemDetails, image: res.data.imageUrl } }));
      toast.success("Image uploaded");
    } catch (err) { toast.error("Upload failed"); } 
    finally { setUploading(false); }
  };

  const addVariant = () => {
    setFormData((prev: any) => ({
      ...prev,
      variants: [...prev.variants, { name: "", type: "SINGLE", isRequired: false, options: [{ name: "", price: 0, isDefault: false }] }]
    }));
  };

  const removeVariant = (idx: number) => {
    const newVars = [...formData.variants];
    newVars.splice(idx, 1);
    setFormData({ ...formData, variants: newVars });
  };

  const addOption = (vIdx: number) => {
    const newVars = [...formData.variants];
    newVars[vIdx].options.push({ name: "", price: 0, isDefault: false });
    setFormData({ ...formData, variants: newVars });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await menuService.createFullMenuItem(restaurantId, formData);
      toast.success("Menu item created successfully");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error("Operation failed. Changes were rolled back.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-3xl shadow-2xl my-auto animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Add New Menu Item</h2>
            <p className="text-xs text-gray-500 italic">Sequential creation: Category → Item → Variants → Options</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar space-y-8">
          
          {/* 1. Category Selection */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-orange-500">1. Category</h3>
              <button 
                type="button" 
                onClick={() => setFormData({...formData, isNewCategory: !formData.isNewCategory})}
                className="text-[10px] font-bold text-orange-500 hover:underline"
              >
                {formData.isNewCategory ? "Use Existing Category" : "+ Create New Category"}
              </button>
            </div>

            {formData.isNewCategory ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                <Input placeholder="Category Name (e.g. Burgers)" value={formData.categoryName} onChange={(e) => setFormData({...formData, categoryName: e.target.value})} required />
                <Input placeholder="Description (Optional)" value={formData.categoryDescription} onChange={(e) => setFormData({...formData, categoryDescription: e.target.value})} />
              </div>
            ) : (
              <select 
                value={formData.categoryId} 
                onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-1 focus:ring-orange-500"
                required
              >
                <option value="">Select Category</option>
                {existingCategories?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            )}
          </section>

          {/* 2. Item Details */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-orange-500">2. Item Details</h3>
            <div className="flex gap-6 items-start">
              <div className={`relative group w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${uploading ? 'opacity-50' : 'hover:border-orange-500'}`}>
                {formData.itemDetails.image ? (
                  <img src={formData.itemDetails.image} className="w-full h-full object-cover" alt="item" />
                ) : (
                  <Upload className="text-gray-300" size={24} />
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Item Name" value={formData.itemDetails.name} onChange={(e) => setFormData({...formData, itemDetails: {...formData.itemDetails, name: e.target.value}})} required />
                  <Input type="number" placeholder="Base Price" value={formData.itemDetails.basePrice || ""} onChange={(e) => setFormData({...formData, itemDetails: {...formData.itemDetails, basePrice: parseFloat(e.target.value) || 0}})} required />
                </div>
                <textarea 
                  placeholder="Item Description" rows={2} 
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-1 focus:ring-orange-500"
                  value={formData.itemDetails.description} onChange={(e) => setFormData({...formData, itemDetails: {...formData.itemDetails, description: e.target.value}})}
                />
              </div>
            </div>
            
            {/* Diet Flags */}
            <div className="flex flex-wrap gap-3">
              {[
                { key: 'isVegetarian', label: 'Vegetarian', icon: <Leaf size={12}/> },
                { key: 'isVegan', label: 'Vegan', icon: <Beef size={12}/> },
                { key: 'isSpicy', label: 'Spicy', icon: <Flame size={12}/> }
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

          {/* 3. Variants & Options */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-orange-500">3. Customization (Variants)</h3>
              <button type="button" onClick={addVariant} className="flex items-center gap-1 text-[10px] font-bold text-orange-500 uppercase tracking-widest hover:underline">
                <Plus size={14}/> Add Variant
              </button>
            </div>

            <div className="space-y-6">
              {formData.variants.map((v: any, vIdx: number) => (
                <div key={vIdx} className="p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4 relative animate-in slide-in-from-left-4">
                  <button type="button" onClick={() => removeVariant(vIdx)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500"><Trash2 size={16}/></button>
                  
                  <div className="grid grid-cols-2 gap-4 pr-10">
                    <Input placeholder="Variant Name (e.g. Size)" value={v.name} onChange={(e) => {
                      const newVars = [...formData.variants];
                      newVars[vIdx].name = e.target.value;
                      setFormData({...formData, variants: newVars});
                    }} />
                    <select 
                      value={v.type} 
                      className="h-11 px-4 bg-white dark:bg-gray-900 border border-gray-200 rounded-xl text-xs outline-none"
                      onChange={(e) => {
                        const newVars = [...formData.variants];
                        newVars[vIdx].type = e.target.value;
                        setFormData({...formData, variants: newVars});
                      }}
                    >
                      <option value="SINGLE">Single Choice</option>
                      <option value="MULTI_SELECT">Multiple Choice</option>
                    </select>
                  </div>

                  {/* Options List */}
                  <div className="space-y-2">
                    <Label className="text-[10px] text-gray-400 font-bold uppercase">Options</Label>
                    {v.options.map((opt: any, oIdx: number) => (
                      <div key={oIdx} className="flex gap-2">
                        <Input placeholder="Option (e.g. Large)" className="flex-1" value={opt.name} onChange={(e) => {
                           const newVars = [...formData.variants];
                           newVars[vIdx].options[oIdx].name = e.target.value;
                           setFormData({...formData, variants: newVars});
                        }} />
                        <Input type="number" placeholder="Extra Price" className="w-32" value={opt.price || ""} onChange={(e) => {
                           const newVars = [...formData.variants];
                           newVars[vIdx].options[oIdx].price = parseFloat(e.target.value) || 0;
                           setFormData({...formData, variants: newVars});
                        }} />
                        <button type="button" onClick={() => {
                           const newVars = [...formData.variants];
                           newVars[vIdx].options.splice(oIdx, 1);
                           setFormData({...formData, variants: newVars});
                        }} className="p-2 text-gray-300 hover:text-red-500"><X size={16}/></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addOption(vIdx)} className="text-[10px] font-bold text-blue-500">+ Add Option</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Footer Actions */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-4 sticky bottom-0 bg-white dark:bg-gray-900">
             <button type="button" onClick={onClose} disabled={loading} className="text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest">Cancel</button>
             <Button type="submit" variant="newvariant" disabled={loading || uploading} className="px-10 py-3 text-xs font-bold">
               {loading ? <div className="flex items-center gap-2"><Loader2 className="animate-spin" size={14}/> Creating Platform Assets...</div> : "Complete Item Creation"}
             </Button>
          </div>
        </form>
      </div>
    </div>
  );
}