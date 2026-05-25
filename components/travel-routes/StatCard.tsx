import React from 'react';
import { Zap } from 'lucide-react';

export const StatCard = ({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: React.ReactNode }) => {
  const isPositive = trend.includes('+');
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <span className="text-slate-500 text-xs font-bold">{title}</span>
        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-3">
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
        <span className={`text-[10px] font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
          <Zap size={10} className="inline mr-1" /> {trend}
        </span>
      </div>
    </div>
  );
};
