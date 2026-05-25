import React from 'react';
import { ChevronDown } from 'lucide-react';

export const FilterDropdown = ({ icon, label }: { icon: React.ReactNode, label: string }) => {
  return (
    <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100">
      {icon} {label} <ChevronDown size={14} className="text-slate-400" />
    </button>
  );
};
