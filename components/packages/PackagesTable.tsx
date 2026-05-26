import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Clock, Users, Eye, Edit2, Edit3, Trash2, Package, Check, X } from 'lucide-react';
import { TourPackage } from '@/types/type';
import Image from '../ui/Image';

interface InlinePriceUpdaterProps {
  id: string;
  initialPrice: number;
  currency: string;
  onUpdate: (id: string, price: number) => void;
}

export const InlinePriceUpdater = ({ id, initialPrice, currency, onUpdate }: InlinePriceUpdaterProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [price, setPrice] = useState(initialPrice);

  const handleSave = () => {
    onUpdate(id, Number(price));
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <span className="text-xs font-bold text-slate-400">{currency}</span>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-16 px-1.5 py-0.5 border border-slate-200 rounded text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-900 font-sans"
          min="0"
        />
        <button onClick={handleSave} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded">
          <Check size={12} strokeWidth={3} />
        </button>
        <button onClick={() => { setPrice(initialPrice); setIsEditing(false); }} className="p-1 text-rose-600 hover:bg-rose-50 rounded">
          <X size={12} strokeWidth={3} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group/price font-sans">
      <div className="font-black text-slate-950">{currency} {price || 0}</div>
      <button 
        onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
        className="opacity-0 group-hover/price:opacity-100 p-1 text-slate-400 hover:text-slate-900 rounded transition-all active:scale-90"
      >
        <Edit2 size={10} />
      </button>
    </div>
  );
};

interface PackagesTableProps {
  packages: TourPackage[];
  isPackagesLoading: boolean;
  onPageChange?: (page: number) => void;
  page?: number;
  totalPages?: number;
  totalPackages?: number;
  onDeleteClick: (slug: string) => void;
  onUpdatePrice: (slug: string, price: number) => void;
}

export const PackagesTable = ({ packages, isPackagesLoading, onPageChange, page, totalPages, totalPackages, onDeleteClick, onUpdatePrice }: PackagesTableProps) => {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-50">
              <th className="px-6 py-4 font-bold">Package Details</th>
              <th className="px-6 py-4 font-bold">Duration & Capacity</th>
              <th className="px-6 py-4 font-bold">Base Price</th>
              <th className="px-6 py-4 font-bold">Current Price</th>
              <th className="px-6 py-4 font-bold">Views</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {isPackagesLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                  Loading packages...
                </td>
              </tr>
            ) : packages.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                  No packages found.
                </td>
              </tr>
            ) : (
              packages.map((pkg: TourPackage) => (
                <tr key={pkg._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {pkg.images?.[0] ? (
                        <Image src={pkg.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-100" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
                          <Package className="w-5 h-5 text-slate-400" />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-slate-600 transition-colors" title={pkg.title}>
                          {pkg.title}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 font-medium">
                         <MapPin className="w-3 h-3" /> Dest: <span className="">{pkg.destination?.id?.name}</span> • <span className="font-mono text-[10px] bg-slate-100 px-1 rounded">{pkg.slug}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {pkg.duration?.days} Days / {pkg.duration?.nights} Nights
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <Users className="w-3.5 h-3.5 text-slate-400" /> Max {pkg.availability?.maxSeats || 'N/A'} Seats
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-500">{pkg.pricing?.currency || 'INR'} {pkg.pricing?.basePrice}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Original</div>
                  </td>
                  <td className="px-6 py-4">
                    <InlinePriceUpdater 
                      id={pkg.slug || ""} 
                      initialPrice={pkg.currentPrice || 0} 
                      currency={pkg.pricing?.currency || 'INR'} 
                      onUpdate={onUpdatePrice}
                    />
                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Active Rate</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-slate-700">{pkg.analytics?.views || 0}</div>
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Views</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide border uppercase ${pkg.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      pkg.status === 'draft' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                      {pkg.status || 'DRAFT'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/packages/${pkg.slug}`} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/metadata?package=${pkg._id}`}
                        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/packages/update-package?id=${pkg.slug}`}
                        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => onDeleteClick(pkg.slug || "")}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
