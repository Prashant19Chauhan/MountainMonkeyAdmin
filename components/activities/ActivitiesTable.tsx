import Image from "@/components/ui/Image";
import React, { useState } from 'react';
import Link from 'next/link';
import { Globe, MapPin, Filter, Clock, Star, Eye, Edit2, Edit3, Trash2, Loader2, Check, X } from 'lucide-react';
import { Activity } from '@/types/type';

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

interface ActivitiesTableProps {
  activities: Activity[];
  isActivitiesLoading: boolean;
  onDeleteClick: (slug: string) => void;
  onUpdatePrice: (slug: string, price: number) => void;
}

export const ActivitiesTable = ({ activities, isActivitiesLoading, onDeleteClick, onUpdatePrice }: ActivitiesTableProps) => {
  return (
    <div className="overflow-x-auto min-h-[400px] relative">
      {isActivitiesLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : null}

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-50 bg-slate-50/50">
            <th className="px-6 py-4 font-bold">Activity & Destination</th>
            <th className="px-6 py-4 font-bold">Location</th>
            <th className="px-6 py-4 font-bold">Logistics</th>
            <th className="px-6 py-4 font-bold">Base Price</th>
            <th className="px-6 py-4 font-bold">Current Price</th>
            <th className="px-6 py-4 font-bold">Status</th>
            <th className="px-6 py-4 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {activities.length > 0 ? activities.map((item: Activity) => (
            <tr key={item._id} className="group hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                    {item.images && item.images[0] ? (
                      <Image src={item.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Globe className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.name}</div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                      <span className="font-medium">{item.destinationId?.name || "Global"}</span>
                      <span className="text-slate-300">•</span>
                      <span>{item.type || "Experience"}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {item.location?.mainCity?.name || "Multiple Cities"}
                  </div>
                  <div className="text-[11px] text-slate-400 ml-5 truncate max-w-[150px]">{item.location?.address}</div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                    <Filter className="w-3 h-3 text-slate-400" /> {item.category?.join(", ") || "General"}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 italic">
                    <Clock className="w-3 h-3 text-slate-400" /> {item.timing?.duration ? `${item.timing.duration} mins` : "Flexible"}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-slate-500">
                    {item.pricing?.isFree ? "FREE" : `${item.pricing?.currency || "INR"} ${item.pricing?.price || 0}`}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-bold">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-slate-700">{item.ratings?.average || 0}</span>
                    <span className="text-slate-300 font-normal">({item.ratings?.count || 0})</span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <InlinePriceUpdater 
                  id={item.slug || ""} 
                  initialPrice={item.currentPrice || 0} 
                  currency={item.pricing?.currency || "INR"} 
                  onUpdate={onUpdatePrice}
                />
                <div className="text-[10px] text-slate-400 font-medium mt-0.5">Active Rate</div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-wide border ${item.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}>
                  {item.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center gap-1 justify-end">
                  <Link
                    href={`/activities/${item.slug}`}
                    className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/metadata/?activity=${item._id}`}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>

                  <Link
                    href={`/activities/update-activity?activityId=${item.slug}`}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => onDeleteClick(item.slug || "")}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={7} className="px-6 py-24 text-center text-slate-400 text-sm italic bg-white">
                {isActivitiesLoading ? "Retrieving activities from database..." : "No activities match your search criteria."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
