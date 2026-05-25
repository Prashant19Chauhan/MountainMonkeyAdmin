import React from 'react';
import { Search, Filter } from 'lucide-react';

export const PackagesFilter = ({ status, setStatus }: any) => {
  return (
    <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center bg-white">
      <div className="relative flex-1 min-w-[300px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by package name or ID..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-slate-100 outline-none"
        />
      </div>
      <select
        value={status || ""}
        onChange={(e) => setStatus(e.target.value || undefined)}
        className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 outline-none"
      >
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="inactive">Inactive</option>
      </select>
      <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
        <Filter className="w-4 h-4" /> More Filters
      </button>
    </div>
  );
};
