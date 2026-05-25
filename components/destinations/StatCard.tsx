import React from 'react';

export const StatCard = ({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: React.ReactNode }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md group">
      <div className="flex justify-between items-start mb-4">
        <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{title}</span>
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-3">
        <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{value}</h3>
        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
          {trend}
        </span>
      </div>
    </div>
  );
};
