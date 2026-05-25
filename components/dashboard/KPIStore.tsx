import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

export const KPIStore = ({ label, value, trend, positive, icon, color }: any) => {
    const colors: any = {
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        orange: "bg-orange-50 text-orange-600 border-orange-100",
        blue: "bg-blue-50 text-blue-600 border-blue-100",
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm group hover:border-slate-200 transition-all"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-xl border ${colors[color]}`}>
                    {icon}
                </div>
                <button className="p-1 text-slate-300 hover:text-slate-900 transition-colors">
                    <MoreHorizontal size={14} />
                </button>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <div className="flex items-end justify-between">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
                <div className={`flex items-center gap-1 text-[11px] font-black ${positive ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {trend}
                </div>
            </div>
        </motion.div>
    );
};
