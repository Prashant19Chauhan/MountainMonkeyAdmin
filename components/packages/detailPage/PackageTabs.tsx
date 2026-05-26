"use client";

import React, { useState } from 'react';
import {
  Compass,
  Calendar,
  Home,
  ShieldCheck,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Activity,
  CheckCircle,
  XCircle
} from 'lucide-react';

import { TourPackage, ItineraryDay, PackageAccommodationInfo, PackageActivityInfo } from '@/types/type';

interface PackageTabsProps {
  pkg: TourPackage;
}

export default function PackageTabs({ pkg }: PackageTabsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'accommodations' | 'inclusions'>('overview');
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  const toggleDay = (dayNum: number) => {
    if (expandedDay === dayNum) {
      setExpandedDay(null);
    } else {
      setExpandedDay(dayNum);
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-1">
        {[
          { id: 'overview', label: 'Overview', icon: <Compass size={14} /> },
          { id: 'itinerary', label: 'Day Itinerary', icon: <Calendar size={14} /> },
          { id: 'accommodations', label: 'Stays & Activities', icon: <Home size={14} /> },
          { id: 'inclusions', label: 'Inclusions & Rules', icon: <ShieldCheck size={14} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id
                ? 'bg-slate-950 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm min-h-[300px]">
        
        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3 font-sans text-left">About the Experience</h3>
              <div className="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-line font-medium text-left">
                {pkg.description}
              </div>
            </div>

            {/* AI Metadata Tags */}
            {pkg.aiMetadata && (
              <div className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                {pkg.aiMetadata.highlights && pkg.aiMetadata.highlights.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5 font-sans">
                      <TrendingUp size={12} className="text-amber-500" /> Tour Highlights
                    </h4>
                    <ul className="space-y-1.5">
                      {pkg.aiMetadata.highlights.map((h: string, idx: number) => (
                        <li key={idx} className="text-xs font-bold text-slate-700 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-slate-900 rounded-full"></span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-sans">Stamina & Fit</h4>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-[10px] font-black uppercase tracking-wider">
                      Difficulty: {pkg.aiMetadata.difficultyLevel}
                    </span>
                    {pkg.aiMetadata.mood?.map((m: string) => (
                      <span key={m} className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-100 rounded-lg text-[10px] font-black uppercase tracking-wider">
                        {m}
                      </span>
                    ))}
                    {pkg.aiMetadata.suitableFor?.map((s: string) => (
                      <span key={s} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-[10px] font-black uppercase tracking-wider">
                        Ideal: {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: ITINERARY */}
        {activeTab === 'itinerary' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <div className="text-left">
                <h3 className="text-lg font-black text-slate-900 font-sans">Timeline Outline</h3>
                <p className="text-slate-400 text-xs mt-0.5">Explore the structured day-by-day scheduled programs.</p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 font-sans">
                {pkg.itinerary?.length || 0} Scheduled Days
              </span>
            </div>

            <div className="relative border-l border-slate-100 pl-6 space-y-6 ml-3 text-left">
              {pkg.itinerary?.map((day: ItineraryDay) => {
                const isExpanded = expandedDay === day.day;
                return (
                  <div key={day.day} className="relative group">
                    <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 bg-white transition-all duration-300 flex items-center justify-center ${
                      isExpanded ? 'border-slate-900 ring-4 ring-slate-100' : 'border-slate-200'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${isExpanded ? 'bg-slate-950' : 'bg-slate-300'}`} />
                    </div>

                    <div className="border border-slate-100 rounded-2xl overflow-hidden hover:border-slate-200 transition-all shadow-xs">
                      <button
                        onClick={() => {
                          if (day.day !== undefined) {
                            toggleDay(day.day);
                          }
                        }}
                        className="w-full text-left p-4 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors"
                      >
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 font-sans">Day {day.day}</span>
                          <h4 className="text-sm font-black text-slate-900 mt-0.5 font-sans">{day.title}</h4>
                        </div>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>

                      {isExpanded && (
                        <div className="p-4 bg-white text-xs md:text-sm text-slate-600 leading-relaxed font-medium border-t border-slate-50 whitespace-pre-line">
                          {day.description}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: ACCOMMODATIONS & ACTIVITIES */}
        {activeTab === 'accommodations' && (
          <div className="space-y-8 text-left">
            {/* Accommodations */}
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-1.5 font-sans">
                  <Home size={14} className="text-slate-400" /> Stays & Lodgings
                </h3>
                <p className="text-slate-400 text-xs italic">Selected hotel/resort accommodations planned for this package.</p>
              </div>

              {pkg.accommodations && pkg.accommodations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pkg.accommodations.map((acc: PackageAccommodationInfo, idx: number) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl flex gap-3 items-center">
                      <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 shrink-0 shadow-xs">
                        <Home size={20} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-black text-slate-900 truncate">
                          {typeof acc.stayId === 'object' ? acc.stayId?.name : `Stay ID: ${acc.stayId}`}
                        </div>
                        <div className="text-[10px] font-bold text-slate-500 mt-0.5 uppercase tracking-wide">
                          Price Range: {pkg.pricing?.currency || '$'}{acc.priceRangeForPackage?.min} - {acc.priceRangeForPackage?.max}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center text-xs text-slate-400 italic">
                  No specific accommodations mapped to this package.
                </div>
              )}
            </div>

            {/* Activities */}
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-1.5 font-sans">
                  <Activity size={14} className="text-slate-400" /> Scheduled Activities
                </h3>
                <p className="text-slate-400 text-xs italic">Tours, trekking, and adventures built into this holiday package.</p>
              </div>

              {pkg.activities && pkg.activities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pkg.activities.map((act: PackageActivityInfo, idx: number) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl flex gap-3 items-center">
                      <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 shrink-0 shadow-xs">
                        <Activity size={20} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-black text-slate-900 truncate">
                          {typeof act.id === 'object' ? act.id?.name : `Activity ID: ${act.id}`}
                        </div>
                        <div className="text-[10px] font-bold text-slate-500 mt-0.5 uppercase tracking-wide">
                          Est. Package Cost: {pkg.pricing?.currency || '$'}{act.priceRangeForPackage?.min} - {act.priceRangeForPackage?.max}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center text-xs text-slate-400 italic">
                  No specific activities mapped to this package.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: INCLUSIONS & RULES */}
        {activeTab === 'inclusions' && (
          <div className="space-y-6 text-left">
            {/* Inclusions */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center gap-1 font-sans">
                <CheckCircle size={14} className="text-emerald-500" /> What's Included
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pkg.inclusions?.map((inc: string, idx: number) => (
                  <div key={idx} className="flex gap-2.5 items-start p-3 bg-emerald-50/50 border border-emerald-100/50 rounded-xl text-xs font-medium text-slate-700">
                    <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Exclusions */}
            {pkg.exclusions && pkg.exclusions.length > 0 && (
              <div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center gap-1 font-sans">
                  <XCircle size={14} className="text-rose-500" /> What's Excluded
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pkg.exclusions.map((exc: string, idx: number) => (
                    <div key={idx} className="flex gap-2.5 items-start p-3 bg-rose-50/50 border border-rose-100/50 rounded-xl text-xs font-medium text-slate-700">
                      <XCircle size={14} className="text-rose-500 shrink-0 mt-0.5" />
                      <span>{exc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
