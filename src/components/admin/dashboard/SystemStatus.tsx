export const SystemStatus = () => (
  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 text-white shadow-xl">
    <p className="text-[10px] font-bold uppercase opacity-80 mb-4 tracking-widest">Platform Infrastructure</p>
    <div className="space-y-4">
      {[ { l: "API Gateway", s: "Operational" }, { l: "Payment Engine", s: "Active" }].map((item, i) => (
        <div key={i} className="flex justify-between items-center border-b border-white/10 pb-3 last:border-0">
          <span className="text-xs font-semibold">{item.l}</span>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-black tracking-tighter">{item.s.toUpperCase()}</span>
        </div>
      ))}
      <p className="text-[11px] leading-relaxed opacity-90 pt-2">
        Platform is currently healthy. No system outages detected in the last 24 hours.
      </p>
    </div>
  </div>
);