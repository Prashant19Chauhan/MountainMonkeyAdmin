import React from 'react';
import Link from 'next/link';
import { MapPin, Star, Package, Eye, Edit3, Trash2, Edit2 } from 'lucide-react';

export const DestinationsTable = ({ destinations, onDeleteClick }: any) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-[10px] uppercase tracking-widest font-black text-slate-400 border-b border-slate-50 bg-slate-50/30">
            <th className="px-6 py-4">Destination Profile</th>
            <th className="px-6 py-4">Metadata</th>
            <th className="px-6 py-4">Performance</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right pr-10">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {destinations.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-20 text-slate-400 font-medium italic">
                No destinations found matching your criteria.
              </td>
            </tr>
          ) : (
            destinations.map((dest: any) => (
              <tr key={dest._id} className="hover:bg-slate-50/50 transition-all group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      <img
                        src={dest?.images?.[0]}
                        alt={dest?.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{dest.name}</h3>
                      <p className="text-[11px] text-slate-400 font-bold flex items-center gap-1 mt-0.5">
                        <MapPin size={10} /> {dest.location?.address?.substring(0, 30)}...
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 uppercase tracking-tighter">
                      {dest.placeType || 'Global'}
                    </span>
                    <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">ID: {dest._id.substring(0, 10)}</div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1 text-xs text-slate-900 font-black">
                      <Star size={14} className="text-amber-400 fill-amber-400" /> {dest.ratings?.average || '0.0'}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                      <Package size={12} className="text-slate-300" /> 0 Packages
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest border shadow-sm ${dest.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>
                    {dest.status?.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-end gap-2 pr-4">
                    <Link href={`/destinations/${dest._id}`}>
                      <button className='p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200'>
                        <Eye size={18} />
                      </button>
                    </Link>
                    <Link href={`/metadata?destination=${dest._id}`}>
                      <button className='p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200'>
                        <Edit3 size={18} />
                      </button>
                    </Link>
                    <Link href={`/destinations/update-destination?id=${dest._id}`}>
                      <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100">
                        <Edit2 size={18} />
                      </button>
                    </Link>
                    <button
                      onClick={() => onDeleteClick(dest._id)}
                      className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
