import React from 'react';
import { Search, Filter } from 'lucide-react';

export const DestinationsFilter = ({ localSearch, setLocalSearch, totalItems }: any) => {
  return (
    <div className="p-4 md:p-5 border-b border-slate-50 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-white">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center flex-1 max-w-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search destinations..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-100 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all">
          <Filter size={16} className="text-slate-400" />
          Filters
        </button>
      </div>
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 text-center sm:text-left">
        {totalItems} ENTRIES FOUND
      </div>
    </div>
  );
};
