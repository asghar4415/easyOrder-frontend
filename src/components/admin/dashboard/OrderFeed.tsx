import { ShoppingBag } from "lucide-react";

export const OrderFeed = ({ orders }: { orders: any[] }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
    <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Live Order Feed</h3>
      <button className="text-[10px] font-black text-orange-500 uppercase tracking-wider hover:text-orange-600">Open Monitor</button>
    </div>
    <div className="divide-y divide-gray-50 dark:divide-gray-800">
      {orders?.map((order) => (
        <div key={order.id} className="flex items-center justify-between p-5 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600">
              <ShoppingBag size={18}/>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-gray-800 dark:text-white uppercase">#{order.id.slice(-6)}</p>
                <span className="text-[9px] px-1.5 py-0.5 rounded font-black bg-blue-100 text-blue-600 uppercase">{order.status}</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">At <span className="font-semibold">{order.restaurant.name}</span></p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-gray-900 dark:text-white">
              {order.totalAmount.toLocaleString('en-US', { style: 'currency', currency: order.currency || 'USD' })}
            </p>
            <span className="text-[10px] font-medium text-gray-400">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);