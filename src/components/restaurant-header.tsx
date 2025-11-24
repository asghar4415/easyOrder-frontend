"use client";

import Image from "next/image";
import { Star, MapPin, Clock, Bike, UtensilsCrossed, Users } from "lucide-react";

interface RestaurantHeaderProps {
  deliveryMode: "delivery" | "collection";
  setDeliveryMode: (mode: "delivery" | "collection") => void;
}

export default function RestaurantHeader({
  deliveryMode,
  setDeliveryMode,
}: RestaurantHeaderProps) {
  return (
    <div className="w-full bg-[#1c1a17] text-[#EEEEEE] pb-6">
      
      {/* COVER IMAGE */}
      <div className="relative w-full h-48 md:h-64">
        <Image
          src="/images/restaurant/cover-1.png"
          alt="Restaurant Cover"
          fill
          className="object-cover"
        />

        {/* DARK GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* FLOATING LOGO */}
        <div className="absolute bottom-[-32px] left-6 flex items-center gap-3">
          <div className="h-20 w-20 rounded-full border-4 border-[#2b2a28] overflow-hidden shadow-xl">
            <Image
              src="/images/restaurant/logo-1.png"
              alt="Restaurant Logo"
              width={80}
              height={80}
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* RESTAURANT DETAILS */}
      <div className="px-6 mt-10 gap-3 flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col">
        
        <h1 className="text-3xl font-bold">India Gate Portsmouth</h1>

        {/* Ratings + Address */}
       
        <div className="flex items-center gap-2 text-sm text-[#EEEEEE]/70">
          <Star size={16} className="fill-[#DC5F00] text-[#DC5F00]" />
          <span>0 reviews</span>
          <span>•</span>
          <MapPin size={14} />
          <span>13 Kingston Road</span>
        </div>
        </div>
         <button className="self-start flex items-center gap-2 px-4 py-2 button2 transition">
          <Users size={16} color="#DC5F00" />
          Group order
        </button>

</div>
        

      {/* BOTTOM INFO SECTION (optional) */}
      <div className="px-6 mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-[#DC5F00]" />
          <div>
            <p className="text-xs text-[#EEEEEE]/60">Delivery time</p>
            <p className="font-semibold">20–30 mins</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Bike size={18} className="text-[#DC5F00]" />
          <div>
            <p className="text-xs text-[#EEEEEE]/60">Delivery fee</p>
            <p className="font-semibold">From $2.00</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-[#DC5F00]" />
          <div>
            <p className="text-xs text-[#EEEEEE]/60">Min order</p>
            <p className="font-semibold">$15.00</p>
          </div>
        </div>
      </div>
    </div>
  );
}
