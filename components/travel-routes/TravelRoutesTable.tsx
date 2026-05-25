import React from 'react';
import Link from 'next/link';
import { Map, Clock, Zap, Star, Eye, Edit2, Edit3, Trash2, Loader2 } from 'lucide-react';

export const TravelRoutesTable = ({ filteredRoutes, isTravelRoutesLoading, onDeleteClick }: any) => {
  return (
    <div className="overflow-x-auto min-h-[400px] relative">
      {isTravelRoutesLoading && (
        <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      )}

      <table className="w-full text-left min-w-[800px] lg:min-w-0">
        <thead>
          <tr className="text-[10px] uppercase tracking-widest text-slate-400 font-black border-b border-slate-50 bg-slate-50/30">
            <th className="px-6 py-4">Route Profile</th>
            <th className="px-6 py-4 text-center">Travel Path</th>
            <th className="px-6 py-4">Metrics</th>
            <th className="px-6 py-4">Smart Tags</th>
            <th className="px-6 py-4 text-right pr-10">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {filteredRoutes.length > 0 ? filteredRoutes.map((route: any) => (
            <tr key={route._id} className="hover:bg-slate-50/50 transition-colors group">
              <td className="px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-10 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-slate-300">
                    <Map size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors">{route.name}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{route._id.substring(0, 8)}</div>
                    <span className="inline-block mt-1.5 text-[9px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md font-black uppercase tracking-tighter">
                      {route.smartRoutes?.[0]?.routeType?.[0] || "Standard"}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center min-w-[80px]">
                    <div className="text-[9px] text-slate-300 font-black uppercase mb-1 tracking-widest">Origin</div>
                    <div className="text-xs font-black text-slate-700">{route.from?.name?.split(',')[0]}</div>
                    <div className="text-[9px] text-slate-400 font-bold">{route.from?.name?.split(',')[1]}</div>
                  </div>
                  <div className="flex flex-col items-center flex-1 max-w-[120px]">
                    <div className="w-full h-[1px] bg-slate-200 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                        {route.routes?.length || 0} STEPS
                      </div>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t border-r border-slate-300 rotate-45" />
                    </div>
                  </div>
                  <div className="text-center min-w-[80px]">
                    <div className="text-[9px] text-slate-300 font-black uppercase mb-1 tracking-widest">Dest</div>
                    <div className="text-xs font-black text-slate-700">{route.to?.name?.split(',')[0]}</div>
                    <div className="text-[9px] text-slate-400 font-bold">{route.to?.name?.split(',')[1]}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[11px] font-black text-slate-600 uppercase tracking-tight">
                    <Clock size={14} className="text-slate-300" /> {route.smartRoutes?.[0]?.totalDuration || 0}m
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-black text-slate-600 uppercase tracking-tight">
                    <Zap size={14} className="text-slate-300" /> ₹{route.smartRoutes?.[0]?.totalMinCost || 0}
                  </div>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="flex flex-wrap gap-1">
                  {route.smartRoutes?.[0]?.modesUsed?.slice(0, 2).map((mode: string) => (
                    <span key={mode} className="text-[8px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase border border-slate-200">
                      {mode}
                    </span>
                  )) || <span className="text-[9px] text-slate-300 italic">No tags</span>}
                </div>
                <div className="flex items-center gap-1 mt-2.5 text-xs font-black text-slate-700 italic">
                  <Star size={12} className="text-amber-400 fill-amber-400" /> {route.popularityScore?.toFixed(1) || "5.0"}
                </div>
              </td>
              <td className="px-6 py-5 text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/travel-routes/${route._id}`}>
                    <button className="p-2 text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                      <Eye size={16} />
                    </button>
                  </Link>
                  <Link href={`/metadata?route=${route._id}`}>
                    <button className="p-2 text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                      <Edit3 size={16} />
                    </button>
                  </Link>
                  <Link href={`/travel-routes/update-travel-route?id=${route._id}`}>
                    <button
                      className="p-2 text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                  </Link>
                  <button
                    onClick={() => onDeleteClick(route._id)}
                    className="p-2 text-slate-400 hover:text-rose-500 border border-transparent hover:border-slate-200 rounded-xl hover:bg-rose-50 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={5} className="px-6 py-20 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                    <Map size={24} />
                  </div>
                  <p className="text-sm font-bold text-slate-400 italic">No travel routes found in the registry.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
