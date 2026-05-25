import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const StaysPagination = ({ page, setPage, totalPages }: any) => {
  return (
    <div className="p-4 md:p-5 bg-slate-50/30 flex flex-col sm:flex-row justify-between items-center border-t border-slate-50 gap-4">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic order-2 sm:order-1 text-center sm:text-left">
        Showing Page {page} of {totalPages || 1} Registry Entries
      </span>
      <div className="flex items-center gap-2 sm:gap-3 order-1 sm:order-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all disabled:opacity-20"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1 overflow-x-auto max-w-[150px] sm:max-w-none no-scrollbar">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 shrink-0 flex items-center justify-center text-xs font-black rounded-xl transition-all ${page === p
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-200'
                }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
          className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all disabled:opacity-20"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
