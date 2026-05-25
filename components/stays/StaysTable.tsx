import React from 'react';
import Link from 'next/link';
import { Home, MapPin, Star, Eye, Edit2, Edit3, Trash2, Loader2 } from 'lucide-react';

export const StaysTable = ({ stays, isStaysLoading, onDeleteClick }: any) => {
  return (
    <div className="overflow-x-auto min-h-[400px] relative">
      {isStaysLoading && (
        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      )}

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-[10px] uppercase tracking-widest font-black text-slate-400 border-b border-slate-50 bg-slate-50/30">
            <th className="px-6 py-4">Property Identity</th>
            <th className="px-6 py-4">Category & Quality</th>
            <th className="px-6 py-4">Market Pricing</th>
            <th className="px-6 py-4">Visibility</th>
            <th className="px-6 py-4 text-right pr-10">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {stays.length > 0 ? stays.map((property: any) => (
            <tr key={property._id} className="hover:bg-slate-50/50 transition-colors group">
              <td className="px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden shrink-0">
                    {property.images?.[0] ? (
                      <img src={property.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Home className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{property.name}</div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5 font-bold italic">
                      <MapPin className="w-3 h-3 text-slate-400" /> {property.mainCity?.name || "Global Partner"}
                    </div>
                  </div>
                </div>
              </td>

              <td className="px-6 py-5">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold uppercase tracking-tight">
                    <Home className="w-3.5 h-3.5 text-slate-300" /> {property.type}
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < property.starRating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                    ))}
                    <span className="text-[11px] text-slate-400 ml-1.5 font-bold">({property.ratings?.average || 0})</span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-black text-slate-900">₹{property.priceRange?.min || 0} - ₹{property.priceRange?.max || 0}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">Avg. Price / Night</div>
              </td>
              <td className="px-6 py-5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wider border ${property.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}>
                  {property.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/stays/${property._id}`} className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link href={`/metadata?stay=${property._id}`} className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                    <Edit3 className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/stays/update-stay?stayId=${property._id}`}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => onDeleteClick(property._id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={5} className="px-6 py-24 text-center text-slate-400 text-sm italic bg-white">
                {isStaysLoading ? "Fetching properties..." : "No properties found matching your search."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
