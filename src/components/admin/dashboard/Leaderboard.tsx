import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";

export const Leaderboard = ({ restaurants }: { restaurants: any[] }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
      <Star size={14} className="text-yellow-500" /> Top Performers
    </h3>
    <div className="space-y-5">
      {restaurants?.map((res, idx) => (
        <div key={res.id} className="flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 flex items-center justify-center overflow-hidden">
                {res.logo ? <img src={res.logo} className="w-full h-full object-cover" alt="" /> : <span className="text-sm font-bold text-orange-500">{res.name[0]}</span>}
              </div>
              <span className="absolute -top-2 -left-2 w-5 h-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center text-[10px] font-black text-gray-400 shadow-sm">{idx + 1}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800 dark:text-white truncate max-w-[140px]">{res.name}</p>
              <p className="text-[10px] font-medium text-gray-400 uppercase">{res._count.orders} Orders</p>
            </div>
          </div>
          <Link href={`/admin/restaurants/${res.id}`} className="p-2 hover:bg-orange-500 hover:text-white rounded-xl transition-all">
            <ArrowRight size={14} />
          </Link>
        </div>
      ))}
    </div>
  </div>
);