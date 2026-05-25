import React from 'react';

export const StatCard = ({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: React.ReactNode }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
    <div className="flex justify-between items-start mb-4">
      <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">{title}</span>
      <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 shadow-inner">
        {icon}
      </div>
    </div>
    <div className="flex items-baseline gap-2">
      <h3 className="text-2xl font-bold text-slate-900 leading-none">{value}</h3>
      {trend && (
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
          {trend}
        </span>
      )}
    </div>
  </div>
);
