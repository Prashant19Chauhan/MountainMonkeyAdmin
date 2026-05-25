import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const PackagesPagination = ({ page, setPage, totalPages, totalPackages, packagesLength }: any) => {
  return (
    <div className="p-4 md:p-5 border-t border-slate-50 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic order-2 sm:order-1">
        Showing {packagesLength} of {totalPackages} packages
      </p>
      <div className="flex items-center gap-2 sm:gap-3 order-1 sm:order-2">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all disabled:opacity-20"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-1 overflow-x-auto max-w-[150px] sm:max-w-none no-scrollbar">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-xl text-xs font-black transition-all ${page === i + 1
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-200'
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all disabled:opacity-20"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
