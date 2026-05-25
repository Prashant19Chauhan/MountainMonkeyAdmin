import React from 'react';

export const ModuleCard = ({ icon, label, count, color }: any) => (
    <button className="p-6 bg-white border border-slate-100 rounded-[2rem] text-left hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100 transition-all group">
        <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center transition-all duration-300 group-hover:scale-110
            ${color === 'blue' ? 'bg-blue-50 text-blue-500' : 
              color === 'indigo' ? 'bg-indigo-50 text-indigo-500' : 
              color === 'emerald' ? 'bg-emerald-50 text-emerald-500' : 
              'bg-purple-50 text-purple-500'}`}
        >
            {icon}
        </div>
        <h4 className="text-sm font-black text-slate-900">{count}</h4>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{label}</p>
    </button>
);
