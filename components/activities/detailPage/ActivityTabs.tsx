"use client";

import React, { useState } from 'react';
import {
  Clock,
  ShieldAlert,
  Contact,
  Sparkles,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

import { Activity, ActivityProvider } from '@/types/type';

interface ActivityTabsProps {
  activity: Activity;
}

export default function ActivityTabs({ activity }: ActivityTabsProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'safety' | 'providers'>('details');

  return (
    <div className="space-y-6">
      {/* Tab Navigation Controls */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-1">
        {[
          { id: 'details', label: 'Guidelines & Timings', icon: <Clock size={14} /> },
          { id: 'safety', label: 'Safety & Required Items', icon: <ShieldAlert size={14} /> },
          { id: 'providers', label: 'Service Operators', icon: <Contact size={14} /> }
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

      {/* Tab Panel */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm min-h-[260px]">
        
        {/* TAB: DETAILS */}
        {activeTab === 'details' && (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-1.5 font-sans">
                <Clock size={14} className="text-slate-400" /> Opening Hours & Timings
              </h3>
              <p className="text-slate-400 text-xs mt-0.5 font-sans">Operating schedules and best times for peak quality experiences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/40">
                <div className="text-[10px] font-black text-slate-400 uppercase font-sans">Operational Hours</div>
                <div className="text-xs font-bold text-slate-800 mt-1 font-sans">
                  {activity.timing?.openingTime && activity.timing?.closingTime 
                    ? `${activity.timing.openingTime} - ${activity.timing.closingTime}` 
                    : 'Flexible / Sunrise to Sunset'}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/40">
                <div className="text-[10px] font-black text-slate-400 uppercase font-sans">Best Season / Time</div>
                <div className="text-xs font-bold text-slate-800 mt-1 font-sans">
                  {activity.bestTimeToVisit || 'Year-round enjoyment'}
                </div>
              </div>
            </div>

            {activity.timeSlotPreference && activity.timeSlotPreference.length > 0 && (
              <div className="pt-2">
                <h4 className="text-[11px] font-black text-slate-400 uppercase mb-2 font-sans">Recommended Time Slots</h4>
                <div className="flex flex-wrap gap-1.5">
                  {activity.timeSlotPreference.map((slot: string) => (
                    <span key={slot} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-wider rounded-lg border border-slate-200 font-sans">
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: SAFETY */}
        {activeTab === 'safety' && (
          <div className="space-y-6 text-left">
            {/* Required Items */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center gap-1.5 font-sans">
                <Sparkles size={14} className="text-amber-500" /> Mandatory & Recommended Items
              </h4>
              {activity.requiredItems && activity.requiredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {activity.requiredItems.map((item: string, idx: number) => (
                    <div key={idx} className="flex gap-2.5 items-center p-3 bg-slate-50 border border-slate-200/40 rounded-xl text-xs font-bold text-slate-700">
                      <CheckCircle size={14} className="text-slate-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-400 italic font-sans">
                  No specific equipment or items required.
                </div>
              )}
            </div>

            {/* Precautions */}
            {activity.safetyInfo?.precautions && activity.safetyInfo.precautions.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center gap-1.5 font-sans">
                  <AlertTriangle size={14} className="text-rose-500" /> Safety Precautions & Warnings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {activity.safetyInfo.precautions.map((prec: string, idx: number) => (
                    <div key={idx} className="flex gap-2.5 items-start p-3 bg-rose-50/50 border border-rose-100/50 rounded-xl text-xs font-medium text-slate-700">
                      <AlertTriangle size={14} className="text-rose-500 shrink-0 mt-0.5" />
                      <span>{prec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: PROVIDERS */}
        {activeTab === 'providers' && (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-1.5 font-sans">
                <Contact size={14} className="text-slate-400" /> Mapped Services Operators
              </h3>
              <p className="text-slate-400 text-xs mt-0.5 font-sans">Authorized corporate event hosts or local adventure providers.</p>
            </div>

            {activity.providers && activity.providers.length > 0 ? (
              <div className="space-y-4">
                {activity.providers.map((prov: ActivityProvider, idx: number) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200/50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase font-sans">{prov.name || 'Anonymous Vendor'}</h4>
                      <div className="text-[10px] text-slate-400 font-bold mt-0.5 font-sans">Support hotline: {prov.contact || 'No hotline provided'}</div>
                    </div>

                    {prov.website && (
                      <a
                        href={prov.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-center uppercase tracking-widest text-slate-600 hover:bg-slate-950 hover:text-white transition-all shadow-xs font-sans"
                      >
                        Visit Website
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 italic text-xs bg-slate-50 rounded-2xl border border-slate-100 font-sans">
                No operators currently registered.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
