"use client";

import React from 'react';
import { Star, Sparkles } from 'lucide-react';

import { Activity, ActivityAiScore } from '@/types/type';

interface ActivitySidebarProps {
  activity: Activity;
  destinationName: string;
  mainCityName: string;
}

export default function ActivitySidebar({ activity, destinationName, mainCityName }: ActivitySidebarProps) {
  return (
    <div className="space-y-6">
      {/* Commercial Pricing Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        <div className="relative">
          <span className="px-3 py-1 bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/10">
            Experience Commercial Rate
          </span>

          <div className="mt-6 flex items-baseline gap-1.5 text-white">
            {activity.pricing?.isFree ? (
              <span className="text-4xl font-black tracking-tight">FREE</span>
            ) : (
              <span className="text-4xl font-black tracking-tight">
                {activity.pricing?.currency || 'INR'} {activity.pricing?.price || 0}
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
            Rates per individual entry / experience session
          </p>

          {/* Ratings */}
          {activity.ratings && (
            <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center text-xs text-left">
              <span className="text-slate-400 font-bold">Average Quality Review</span>
              <div className="flex items-center gap-1 font-black text-amber-400">
                <Star size={14} className="fill-amber-400" />
                <span>{activity.ratings.average || 0}</span>
                <span className="text-slate-400 font-normal">({activity.ratings.count || 0} reviews)</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Score Indexes */}
      {activity.aiScore && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 text-left">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 font-sans">AI Experience Scores</h3>
          
          <div className="space-y-3.5">
            {[
              { key: 'experienceQuality', label: 'Experience Quality Index' },
              { key: 'uniqueness', label: 'Uniqueness Factor' },
              { key: 'valueForMoney', label: 'Value-For-Money Score' },
              { key: 'popularity', label: 'Popularity Score' }
            ].map(item => {
              const val = activity.aiScore?.[item.key as keyof ActivityAiScore] || 0;
              return (
                <div key={item.key}>
                  <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1 font-sans">
                    <span>{item.label}</span>
                    <span>{val}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-slate-900 rounded-full transition-all"
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {activity.aiSummary && (
            <div className="pt-3 border-t border-slate-100">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-1.5 font-sans">
                <Sparkles size={12} className="text-amber-500" /> AI Summary Insights
              </h4>
              <p className="text-[11px] text-slate-500 font-medium italic leading-relaxed font-sans">
                "{activity.aiSummary}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* Mapped Destination */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3 text-left">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 font-sans">Region Anchoring</h3>
        
        <div className="space-y-2.5 text-xs font-bold text-slate-600">
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-400 font-sans">Main Destination:</span>
            <span className="text-slate-950 font-sans">
              {destinationName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-sans">Nearest Anchor City:</span>
            <span className="text-slate-955 font-sans">
              {mainCityName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
