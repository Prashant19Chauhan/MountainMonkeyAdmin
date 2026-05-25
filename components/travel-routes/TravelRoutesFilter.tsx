import React from 'react';
import { Search, Map, Zap, Filter } from 'lucide-react';
import { FilterDropdown } from './FilterDropdown';

export const TravelRoutesFilter = ({ search, setSearch }: any) => {
  return (
    <div className="p-4 md:p-5 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between border-b border-slate-100">
      <div className="relative flex-1 max-w-2xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search routes by name, origin, or destination..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-slate-100 transition-all"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <FilterDropdown icon={<Map size={16} />} label="Route Type" />
        <FilterDropdown icon={<Zap size={16} />} label="Difficulty" />
        <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all">
          <Filter size={16} /> Filters
        </button>
      </div>
    </div>
  );
};
