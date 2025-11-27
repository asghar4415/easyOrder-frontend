"use client"

import { Menu, X, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"


export function Navbar(){
  const [accountModalOpen, setAccountModalOpen] = useState(false)

  return (
    <>
      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-card shadow-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            {/* Mobile: Back Arrow */}
            <button className="md:hidden p-2 hover:bg-card bg-[#2b2a28]! rounded-lg transition-colors" aria-label="Back">
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-left gap-2">
            
              <span className="hidden md:inline logo">JUST EAT</span>
            </Link>
          </div>

          {/* Center Section - Desktop Search */}
         
          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-4">
        


            <button
              onClick={() => {
                setAccountModalOpen(true)
              }}
              className="p-2 hover:bg-muted rounded-lg transition-colors relative hamburger-menu dark-button-2"
              aria-label="Menu"
            >
                <>
                  <Menu className="h-7 w-7 text-foreground" />
                  {/* <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" /> */}
                </>
            </button>
          </div>
        </div>

     
          {/* <div className="border-t border-border bg-card px-4 py-3 md:hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="Search restaurants..."
                className="w-full rounded-lg border border-border bg-input px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div> */}

      </nav>

      {/* Account Modal */}
     {accountModalOpen && (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
    <div
      className="
        w-full 
        md:max-w-md 
        bg-[#2B2A28] 
        rounded-t-2xl 
        md:rounded-2xl 
        shadow-xl 
        max-h-[90vh] 
        overflow-hidden
        animate-in fade-in zoom-in duration-200
      "
    >
      {/* Header */}
      <div className="sticky top-0 flex items-center justify-between p-4 border-b border-[#686D76] bg-[#2B2A28] z-10">
        <h2 className="text-xl font-bold text-[#EEEEEE]">My account</h2>
        <button
          onClick={() => setAccountModalOpen(false)}
          className="p-2 hover:bg-[#686D76]/40 rounded-lg transition-colors bg-[#2b2a28]!"
        >
          <X className="h-5 w-5 text-[#EEEEEE]" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-70px)]">

        {/* Premium Section */}
        <div className="bg-[#1E2C6B] rounded-xl p-6 space-y-4">
          <h3 className="text-white font-bold text-lg">Join for more perks</h3>
          <ul className="text-white text-sm space-y-1">
            <li className="flex items-center gap-2">✓ Unlock rewards and savings</li>
            <li className="flex items-center gap-2">✓ Order faster</li>
            <li className="flex items-center gap-2">✓ Track orders easily</li>
          </ul>

          <div className="flex gap-2 pt-2">
            <button className="flex-1 bg-white! text-[#0A2A82]! font-semibold py-2 rounded-lg">
              Create account
            </button>
            <button className="flex-1 bg-[#DC5F00]! text-white font-semibold py-2 rounded-lg">
              Log in
            </button>
          </div>
        </div>

        {/* Menu Buttons */}
        <div className="space-y-3">
         
            <button
              className="w-full flex bg-[#2b2a28]! items-center p-1 rounded-lg hover:bg-[#686D76]/30 text-left"
            >
              <span className="text-[#EEEEEE] font-medium">Rewards</span>
            </button>
            
            <button
              className="w-full flex items-center bg-[#2b2a28]! p-1 rounded-lg hover:bg-[#686D76]/30 text-left"
            >
              <span className="text-[#EEEEEE] font-medium">StampCards</span>
            </button>
            <button
              className="w-full flex items-center bg-[#2b2a28]! p-1 rounded-lg hover:bg-[#686D76]/30 text-left"
            >
              <span className="text-[#EEEEEE] font-medium">Need help?</span>
            </button>


      
        </div>

        <div className="h-px bg-[#686D76]" />

        {/* Settings */}
        <div className="space-y-3">

            <button
              className="w-full flex items-center bg-[#2b2a28]! p-1 hover:bg-[#686D76]/30 rounded-lg text-left"
            >
              <span className="text-[#EEEEEE] font-medium">Become a Courier</span>
            </button>
            <button
              className="w-full flex items-center bg-[#2b2a28]! p-1 hover:bg-[#686D76]/30 rounded-lg text-left"
            >
              <span className="text-[#EEEEEE] font-medium">Corporate Ordering</span>
            </button>
            <button
              className="w-full flex items-center bg-[#2b2a28]! p-1 hover:bg-[#686D76]/30 rounded-lg text-left"
            >
              <span className="text-[#EEEEEE] font-medium">Partner with us</span>
            </button>

        </div>

       
      </div>
    </div>
  </div>
)}



      {/* Overlay for modal */}
      {accountModalOpen && (
        <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setAccountModalOpen(false)} />
      )}
    </>
  )
}

export default Navbar
