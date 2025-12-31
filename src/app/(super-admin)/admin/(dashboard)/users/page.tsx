"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import CreateUserForm from "@/components/admin/users/CreateUserForm";
import CreateStaffForm from "@/components/admin/users/CreateStaffForm";
import AssignOwnerForm from "@/components/admin/users/AssignOwnerForm";
import AddStaffForm from "@/components/admin/users/AddStaffForm";
import Label from "@/components/form/Label";
import { UserCheck, Users, ShieldAlert, UserSearch, UserPlus } from "lucide-react";

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<"owner" | "staff">("owner");
  const [mode, setMode] = useState<"create" | "existing">("create");
  const [targetEmail, setTargetEmail] = useState<string | null>(null);
  
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);

  // Fetch Logic based on current Tab
  useEffect(() => {
    if (mode === "existing") {
      const fetchUsers = async () => {
        try {
          const token = Cookies.get("token");
          const endpoint = activeTab === "owner" ? "/users/unassigned-admins" : "/users/staff";
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAvailableUsers(res.data.users);
        } catch (err) { console.error("Fetch failed"); }
      };
      fetchUsers();
    }
  }, [mode, activeTab]);

  const resetState = (newTab: "owner" | "staff") => {
    setActiveTab(newTab);
    setMode("create");
    setTargetEmail(null);
    setAvailableUsers([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">User Management</h1>
        <p className="text-sm text-gray-500">Configure platform roles and venue access controls.</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-xl w-fit">
        <button onClick={() => resetState("owner")} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "owner" ? "bg-white dark:bg-gray-800 shadow-sm text-orange-500" : "text-gray-400"}`}>
          <UserCheck size={14} /> Owners
        </button>
        <button onClick={() => resetState("staff")} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "staff" ? "bg-white dark:bg-gray-800 shadow-sm text-orange-500" : "text-gray-400"}`}>
          <Users size={14} /> Staff
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT PANEL: INPUT/SELECTION */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex gap-2 border-b border-gray-50 dark:border-gray-800 pb-4 mb-6">
            <button onClick={() => { setMode("create"); setTargetEmail(null); }} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase border ${mode === "create" ? 'bg-orange-50 border-orange-200 text-orange-600' : 'text-gray-400 border-transparent'}`}>
              <UserPlus size={14} className="mx-auto mb-1"/> New Account
            </button>
            <button onClick={() => { setMode("existing"); setTargetEmail(null); }} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase border ${mode === "existing" ? 'bg-orange-50 border-orange-200 text-orange-600' : 'text-gray-400 border-transparent'}`}>
              <UserSearch size={14} className="mx-auto mb-1"/> Existing User
            </button>
          </div>

          {mode === "create" ? (
            activeTab === "owner" ? <CreateUserForm onSuccess={setTargetEmail} /> : <CreateStaffForm onSuccess={setTargetEmail} />
          ) : (
            <div className="space-y-4">
               <Label>Available {activeTab === "owner" ? "Admins" : "Staff"}</Label>
               <select onChange={(e) => setTargetEmail(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 rounded-xl text-sm">
                 <option value="">Select a user...</option>
                 {availableUsers.map(u => <option key={u.id} value={u.email}>{u.email}</option>)}
               </select>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: LINKING */}
        <div className={`bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm border-l-4 ${activeTab === 'owner' ? 'border-l-orange-500' : 'border-l-blue-500'}`}>
            <h3 className="text-sm font-bold mb-6 text-gray-800 dark:text-white">Venue Assignment</h3>
            {targetEmail ? (
              activeTab === "owner" ? <AssignOwnerForm email={targetEmail} /> : <AddStaffForm email={targetEmail} />
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center opacity-30">
                <ShieldAlert size={40} className="mb-2" />
                <p className="text-[10px] font-black uppercase tracking-widest">Select a user to begin linking</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}