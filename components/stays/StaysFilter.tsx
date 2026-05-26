import React from 'react';
import { Search, MapPin, Home, Star } from 'lucide-react';

interface StaysFilterProps {
  search: string;
  setSearch: (search: string) => void;
}

export const StaysFilter = ({ search, setSearch }: StaysFilterProps) => {
  return (
    <div className="p-4 md:p-5 border-b border-slate-100 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center bg-white">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search stays..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-100 transition-all">
          <MapPin className="w-4 h-4" /> Location
        </button>
        <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-100 transition-all">
          <Home className="w-4 h-4" /> Type
        </button>
        <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-100 transition-all">
          <Star className="w-4 h-4" /> Rating
        </button>
      </div>
    </div>
  );
};
