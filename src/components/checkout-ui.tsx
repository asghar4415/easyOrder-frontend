import { Edit2, X } from "lucide-react"
import type React from "react"

// --- Constants ---
export const COLORS = {
  primary: "#DC5F00",
  text: "#EEEEEE",
  bgCard: "#2b2a28",
}

// --- Generic Modal ---
export function Modal({ onClose, title, children }: { onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4 backdrop-blur-sm md:overflow-hidden overflow-auto  md:pt-6 md:pb-6 pt-20">
      <div className={`bg-[${COLORS.bgCard}] rounded-lg w-full max-w-md p-6 relative shadow-lg border border-white/10`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold" style={{ color: COLORS.text }}>{title}</h3>
          <button onClick={onClose} className={`p-1 hover:bg-white/10 rounded-full transition bg-[${COLORS.bgCard}]!`}>
            <X size={20} color={COLORS.primary} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// --- Section Card Wrapper ---
interface SectionProps {
  title: string
  icon: React.ReactNode
  onEdit: () => void
  children: React.ReactNode
}

export function CheckoutSection({ title, icon, onEdit, children }: SectionProps) {
  return (
    <div className={`bg-[${COLORS.bgCard}] rounded-lg p-5`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: COLORS.text }}>
          {icon} {title}
        </h2>
        <button onClick={onEdit} className={`text-sm flex items-center gap-1 hover:opacity-80 transition bg-[${COLORS.bgCard}]!`} style={{ color: COLORS.text }}>
          <Edit2 size={16} color={COLORS.primary} /> Edit
        </button>
      </div>
      {children}
      <div className="border-t border-white/10 mt-4"></div>
    </div>
  )
}