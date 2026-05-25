import React from 'react';

export const DispatchAction = ({ icon, label }: any) => (
    <button className="w-full flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 border border-white/5 rounded-2xl transition-all group">
        <div className="p-2 bg-white text-slate-900 rounded-lg group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-white/90">{label}</span>
    </button>
);
