"use client";
import React, { useState } from "react";
import CreateUserForm from "@/components/admin/users/CreateUserForm";
import AssignOwnerForm from "@/components/admin/users/AssignOwnerForm";
import AddStaffForm from "@/components/admin/users/AddStaffForm"; // Logic same as Assign but with staff API
import { UserCheck, Users, ShieldAlert } from "lucide-react";

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<"owner" | "staff">("owner");
  const [createdEmail, setCreatedEmail] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">User Management</h1>
        <p className="text-sm text-gray-500">Create administrative accounts and assign them to restaurant venues.</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-xl w-fit">
        <button 
          onClick={() => { setActiveTab("owner"); setCreatedEmail(null); }}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "owner" ? "bg-white dark:bg-gray-800 shadow-sm text-orange-500" : "text-gray-500 hover:text-gray-700"}`}
        >
          <UserCheck size={14} /> Restaurant Owners
        </button>
        <button 
          onClick={() => setActiveTab("staff")}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "staff" ? "bg-white dark:bg-gray-800 shadow-sm text-orange-500" : "text-gray-500 hover:text-gray-700"}`}
        >
          <Users size={14} /> Staff Members
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Section 1: Creation/Selection */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          {activeTab === "owner" ? (
            <>
              <h3 className="text-sm font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
                1. Create New Owner Account
              </h3>
              <CreateUserForm onSuccess={(email) => setCreatedEmail(email)} />
            </>
          ) : (
            <>
              <h3 className="text-sm font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
                Assign Existing Staff
              </h3>
              <AddStaffForm />
            </>
          )}
        </div>

        {/* Section 2: Assignment (Step 2 for Owners) */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm border-l-4 border-l-orange-500">
           {activeTab === "owner" ? (
             <>
               <h3 className="text-sm font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
                 2. Link Owner to Restaurant
               </h3>
               {createdEmail ? (
                 <AssignOwnerForm email={createdEmail} />
               ) : (
                 <div className="h-48 flex flex-col items-center justify-center text-center opacity-40">
                    <ShieldAlert size={40} className="mb-2" />
                    <p className="text-xs font-medium">Complete Step 1 to enable assignment</p>
                 </div>
               )}
             </>
           ) : (
             <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                <p className="text-xs text-blue-700 leading-relaxed font-medium">
                  Staff members can be assigned to multiple restaurants. Use this tool to grant staff permissions for kitchen or order management interfaces.
                </p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}