import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const ActivitiesPagination = ({ page, setPage, totalPages }: any) => {
  return (
    <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest order-2 sm:order-1 italic">
        Page {page} of {totalPages || 1}
      </span>
      <div className="flex items-center gap-1 order-1 sm:order-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl disabled:opacity-20 transition-all border border-transparent hover:border-slate-200"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1 overflow-x-auto max-w-[150px] sm:max-w-none no-scrollbar">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 shrink-0 flex items-center justify-center text-[10px] font-black rounded-xl transition-all ${page === p ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20" : "text-slate-400 hover:bg-white border border-transparent hover:border-slate-200"
                }`}
            >
              {p}
            </button>
          ))}
        </div>
        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
          className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl disabled:opacity-20 transition-all border border-transparent hover:border-slate-200"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
