import React from 'react';

export const TimelineItem = ({ title, time, status }: any) => (
  <div className="flex gap-4 relative group">
    <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full mt-1.5 transition-colors ${status === 'Ready' ? 'bg-emerald-500' : status === 'Pending' ? 'bg-orange-500' : 'bg-slate-300'}`} />
        <div className="w-[1px] flex-1 bg-slate-100 my-2" />
    </div>
    <div className="pb-6">
      <h4 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{title}</h4>
      <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{time}</p>
    </div>
    <div className="ml-auto">
        <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border ${status === 'Ready' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
            {status}
        </span>
    </div>
  </div>
);
