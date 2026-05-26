"use client";

import React from 'react';
import { Flame, Info, Sparkles } from 'lucide-react';

import { LocalInfo, MythOrStory } from '@/types/type';

interface LocalInfoSidebarProps {
  info: LocalInfo;
}

export default function LocalInfoSidebar({ info }: LocalInfoSidebarProps) {
  return (
    <div className="space-y-6 text-left">
      {/* AI Guide Insights */}
      {info.aiSummary && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-850 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative">
            <span className="px-3 py-1 bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-1.5 w-fit font-sans">
              <Sparkles size={12} className="text-amber-400 fill-amber-400" />
              AI Local Summary
            </span>
            
            <p className="mt-5 text-xs font-medium italic text-slate-300 leading-relaxed font-sans">
              "{info.aiSummary}"
            </p>
          </div>
        </div>
      )}

      {/* Myths & Folk legends */}
      {info.mythsAndStories && info.mythsAndStories.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-1 font-sans">
            <Flame size={12} className="text-slate-400" /> Regional Legends & Lore
          </h3>
          
          <div className="space-y-4">
            {info.mythsAndStories.map((myth: MythOrStory, idx: number) => (
              <div key={idx} className="space-y-1.5">
                <h4 className="text-xs font-black text-slate-900 uppercase font-sans">{myth.title}</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed font-sans">
                  {myth.story}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick local tips list */}
      {info.localTips && info.localTips.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 font-sans">Local Guide Travel Tips</h3>
          <ul className="space-y-2">
            {info.localTips.map((tip: string, idx: number) => (
              <li key={idx} className="flex gap-2 items-start text-xs font-medium text-slate-600 leading-relaxed font-sans">
                <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Popularity indexes */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2 text-xs font-bold text-slate-600">
        <div className="flex justify-between items-center font-sans">
          <span className="text-slate-400">Popularity Score:</span>
          <span className="text-slate-955 font-black">{info.popularityScore || 0}% rating</span>
        </div>
      </div>
    </div>
  );
}
