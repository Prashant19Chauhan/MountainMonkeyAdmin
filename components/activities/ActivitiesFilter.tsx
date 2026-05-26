import React from 'react';
import { Search, Globe, ChevronDown } from 'lucide-react';

interface ActivitiesFilterProps {
  search: string;
  setSearch: (search: string) => void;
}

export const ActivitiesFilter = ({ search, setSearch }: ActivitiesFilterProps) => {
  return (
    <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center bg-white">
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search activities..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
        />
      </div>
      <div className="flex gap-2">
        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 rounded-lg text-[10px] font-black text-slate-600 border border-slate-100 uppercase tracking-widest whitespace-nowrap">
          <Globe className="w-4 h-4 text-slate-400" />
          <span className="hidden xs:inline">All Destinations</span>
          <span className="xs:hidden">Global</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 rounded-lg text-[10px] font-black text-slate-600 border border-slate-100 uppercase tracking-widest whitespace-nowrap">
          Category <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
