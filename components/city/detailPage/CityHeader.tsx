"use client";

import React from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';

interface CityHeaderProps {
  city: any;
  onBack: () => void;
}

export default function CityHeader({ city, onBack }: CityHeaderProps) {
  return (
    <>
      {/* Top Header Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-all text-xs font-bold uppercase tracking-wider shadow-sm active:scale-95"
        >
          <ArrowLeft size={16} />
          Back to Cities
        </button>

        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-xs font-sans">
          Geographic Anchor Registry
        </span>
      </div>

      {/* Cover Summary Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden text-left">
        {/* Accent colored lights in background */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-wider rounded-md font-sans">
                {city.country}
              </span>
              <span className="text-slate-300 font-sans">•</span>
              <span className="text-xs font-bold text-slate-500 font-sans">{city.state}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none font-sans">{city.name}</h1>
            
            <div className="flex items-center gap-1.5 text-slate-400 font-medium text-xs mt-3 font-sans">
              <MapPin size={14} className="text-slate-300" />
              <span>{city.address}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest border shadow-sm font-sans ${
              city.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
            }`}>
              {city.status?.toUpperCase() || 'ACTIVE'}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 font-sans">
              ID: <span className="font-mono">{city._id}</span>
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 font-sans">Geographical Narrative</h3>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium font-sans">
              {city.description}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
