import React from 'react';

export const StatCard = ({ label, value, trend, icon, negative }: any) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        <div className="p-1.5 bg-slate-50 rounded-md">{icon}</div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{value}</span>
        <span className={`text-[11px] font-bold ${negative ? 'text-amber-500' : 'text-emerald-500'}`}>
          {trend}
        </span>
      </div>
    </div>
  );
};
