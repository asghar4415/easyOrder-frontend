"use client";
import React, { useState, useEffect } from "react";
import { Clock, AlertCircle } from "lucide-react";

interface OrderTimerProps {
  createdAt: string | Date;
  durationMinutes: number; // e.g., 30
}

export default function OrderTimer({ createdAt, durationMinutes }: OrderTimerProps) {
  const [minutesLeft, setMinutesLeft] = useState<number | null>(null);

  useEffect(() => {
    const calculateTime = () => {
      const createdTime = new Date(createdAt).getTime();
      const targetTime = createdTime + durationMinutes * 60 * 1000;
      const now = new Date().getTime();
      const diffMs = targetTime - now;
      
      // Round down to nearest minute
      setMinutesLeft(Math.floor(diffMs / 60000));
    };

    calculateTime();
    // Update every 30 seconds to stay accurate
    const interval = setInterval(calculateTime, 30000); 

    return () => clearInterval(interval);
  }, [createdAt, durationMinutes]);

  if (minutesLeft === null) return <span className="text-xs">Loading...</span>;

  // --- Logic for Colors ---
  let bgClass = "bg-green-100 text-green-700 border-green-200";
  let icon = <Clock size={14} />;
  let label = `${minutesLeft} min left`;

  if (minutesLeft <= 10 && minutesLeft > 0) {
    // Warning Zone (Yellow)
    bgClass = "bg-yellow-100 text-yellow-700 border-yellow-200";
  } else if (minutesLeft <= 0) {
    // Overdue Zone (Red)
    bgClass = "bg-red-100 text-red-700 border-red-200 animate-pulse";
    icon = <AlertCircle size={14} />;
    label = `Late by ${Math.abs(minutesLeft)} min`;
  }

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${bgClass}`}>
      {icon}
      <span>{label}</span>
    </div>
  );
}