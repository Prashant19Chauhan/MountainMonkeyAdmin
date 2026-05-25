import React from 'react';

export const StatCard = ({ label, value, trend, icon, negative }: any) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold">{value}</span>
        <span className={`text-xs font-medium ${negative ? 'text-amber-600' : 'text-emerald-600'}`}>
          {trend}
        </span>
      </div>
    </div>
  );
};
