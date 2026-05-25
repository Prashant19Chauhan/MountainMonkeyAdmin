import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const StreamItem = ({ user, action, target, time, initials, accent }: any) => {
    const accents: any = {
        rose: "bg-rose-100 text-rose-600",
        indigo: "bg-indigo-100 text-indigo-600",
        emerald: "bg-emerald-100 text-emerald-600",
        orange: "bg-orange-100 text-orange-600",
    };

    return (
        <div className="flex items-center justify-between p-6 hover:bg-slate-50/50 transition-all group">
            <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm ${accents[accent]}`}>
                    {initials}
                </div>
                <div>
                    <p className="text-[13px] font-medium text-slate-900 leading-tight">
                        <span className="font-black">{user}</span> {action} <span className="font-black italic">{target}</span>
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{time}</p>
                </div>
            </div>
            <button className="p-2 text-slate-200 hover:text-slate-900 transition-colors">
                <ArrowUpRight size={18} />
            </button>
        </div>
    );
};
