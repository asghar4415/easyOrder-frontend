"use client";
import React, { useState } from "react";
import { ShieldCheck, Users, Lock, Info, Check, X, ShieldAlert } from "lucide-react";

// Hardcoded for now since you don't have the API yet
// This defines your system's current logic
const SYSTEM_ROLES = [
  { 
    id: "super_admin", 
    name: "SUPER_ADMIN", 
    desc: "Global platform access. Can manage restaurants, all users, and system settings.",
    color: "text-purple-600 bg-purple-50 border-purple-100 dark:bg-purple-900/10"
  },
  { 
    id: "restaurant_admin", 
    name: "RESTAURANT_ADMIN", 
    desc: "Restaurant owner access. Limited to managing their own menu, staff, and orders.",
    color: "text-orange-600 bg-orange-50 border-orange-100 dark:bg-orange-900/10"
  },
  { 
    id: "customer", 
    name: "CUSTOMER", 
    desc: "Standard user access. Can browse restaurants, place orders, and manage profile.",
    color: "text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-900/10"
  },
];

// Mapping of modules to permissions
const PERMISSIONS_MAP = [
  { module: "Restaurants", super: true, admin: false, customer: true, label: "View Directory" },
  { module: "Restaurants", super: true, admin: true, customer: false, label: "Edit Details" },
  { module: "User Management", super: true, admin: true, customer: false, label: "Manage Staff" },
  { module: "Menus", super: true, admin: true, customer: false, label: "Create Items" },
  { module: "Orders", super: false, admin: true, customer: true, label: "Place/Track" },
  { module: "Platform Settings", super: true, admin: false, customer: false, label: "Global Config" },
];

export default function RolesPermissionsPage() {
  const [selectedRole, setSelectedRole] = useState(SYSTEM_ROLES[0]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Roles & Permissions</h1>
        <p className="text-sm text-gray-500">Overview of the system's Role-Based Access Control (RBAC) hierarchy.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: Role Selector */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-2">Current System Roles</h3>
          <div className="space-y-3">
            {SYSTEM_ROLES.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedRole.id === role.id 
                  ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20' 
                  : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-orange-200'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold">{role.name}</span>
                  <Lock size={12} className={selectedRole.id === role.id ? 'text-white/60' : 'text-gray-300'} />
                </div>
                <p className={`text-[11px] leading-tight ${selectedRole.id === role.id ? 'text-orange-50' : 'text-gray-400'}`}>
                  {role.desc}
                </p>
              </button>
            ))}
          </div>

          <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-gray-800 border-dashed">
            <p className="text-[10px] text-gray-400 text-center font-medium uppercase italic">Dynamic roles are currently system-locked.</p>
          </div>
        </div>

        {/* RIGHT: Permission Matrix */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-500/10 text-orange-500 rounded-xl">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white uppercase tracking-tight">{selectedRole.name}</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Hardcoded Security Definitions</p>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-tighter">
                System Core
              </div>
            </div>

            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50 dark:border-gray-800 bg-gray-50/30">
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform Module</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Access Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {PERMISSIONS_MAP.map((p, idx) => {
                    // Logic to check if current selected role has this permission
                    let hasAccess = false;
                    if (selectedRole.id === 'super_admin') hasAccess = p.super;
                    if (selectedRole.id === 'restaurant_admin') hasAccess = p.admin;
                    if (selectedRole.id === 'customer') hasAccess = p.customer;

                    return (
                      <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-0.5">{p.module}</span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{p.label}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          {hasAccess ? (
                            <div className="inline-flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-green-100">
                              <Check size={12} /> Authorized
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 text-gray-400 bg-gray-50 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-gray-100">
                              <X size={12} /> Restricted
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Warning Footer */}
            <div className="p-6 bg-orange-50/30 dark:bg-orange-500/5 border-t border-gray-100 dark:border-gray-800">
               <div className="flex gap-4">
                 <ShieldAlert className="text-orange-500 shrink-0" size={20} />
                 <div className="space-y-1">
                   <p className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-tight">Security Warning</p>
                   <p className="text-[11px] text-gray-500 leading-relaxed">
                     Role definitions are currently coupled with the application's Middleware logic. Changes to the <code>permissions</code> table will not take effect until the Authorization API is integrated.
                   </p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}