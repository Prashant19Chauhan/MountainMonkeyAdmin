"use client";

import React from 'react';
import { ArrowLeft, Compass, MapPin } from 'lucide-react';
import Link from 'next/link';

import { Activity } from '@/types/type';

interface ActivityHeaderProps {
  activity: Activity;
  onBack: () => void;
}

export default function ActivityHeader({ activity, onBack }: ActivityHeaderProps) {
  return (
    <>
      {/* Top Header Controls */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-all text-xs font-bold uppercase tracking-wider shadow-sm active:scale-95"
        >
          <ArrowLeft size={16} />
          Back to Activities
        </button>

        <Link
          href={`/activities/update-activity?activityId=${activity.slug}`}
          className="px-5 py-2 bg-slate-950 text-white hover:bg-black rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
        >
          Edit Activity
        </Link>
      </div>

      {/* Cover & General Summary */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="relative h-[280px] md:h-[350px] w-full bg-slate-100">
          {activity.images && activity.images.length > 0 ? (
            <img
              src={activity.images[0]}
              alt={activity.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
              <Compass size={64} strokeWidth={1} />
              <p className="text-xs uppercase tracking-widest mt-2">No Visual Asset Attached</p>
            </div>
          )}
          
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/10">
              {activity.type || 'EXPERIENCE'}
            </span>
            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border flex items-center gap-1 shadow-sm ${
              activity.isActive 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                : 'bg-slate-700 text-slate-300 border-slate-600'
            }`}>
              {activity.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <div className="p-6 md:p-8 text-left">
          {/* Category tags */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {activity.category?.map((cat: string) => (
              <span key={cat} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[9px] font-black uppercase tracking-widest rounded-md border border-slate-200">
                {cat}
              </span>
            ))}
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none font-sans">{activity.name}</h1>
          
          <div className="flex items-center gap-1 text-slate-500 mt-2 text-xs font-bold italic">
            <MapPin size={14} className="text-slate-400 shrink-0" />
            <span>{activity.location?.address || 'Global Destination'}</span>
          </div>

          <p className="text-slate-600 mt-5 font-semibold text-xs md:text-sm border-l-2 border-slate-300 pl-3">
            {activity.shortDescription}
          </p>
          
          <div className="text-slate-500 mt-3 text-xs md:text-sm font-medium leading-relaxed whitespace-pre-line">
            {activity.longDescription}
          </div>
        </div>
      </div>
    </>
  );
}
