import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const TravelRoutesPagination = ({ filteredRoutesLength }: any) => {
  return (
    <div className="p-4 md:p-5 border-t border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic order-2 sm:order-1 text-center sm:text-left">
        Showing {filteredRoutesLength} Route Profiles
      </p>
      <div className="flex items-center gap-2 sm:gap-3 order-1 sm:order-2">
        <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all">
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-xl text-xs font-black bg-slate-900 text-white shadow-lg shadow-slate-900/10">1</button>
        </div>
        <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
