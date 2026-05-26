"use client";

import React from 'react';
import { Clock } from 'lucide-react';

interface CitySidebarProps {
  city: any;
}

export default function CitySidebar({ city }: CitySidebarProps) {
  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md border border-slate-800 flex flex-col justify-between space-y-6 relative overflow-hidden text-left h-full">
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
      
      <div>
        <span className="px-2.5 py-0.5 bg-white/10 rounded text-[9px] font-black uppercase tracking-wider border border-white/10 font-sans">
          Location Metrics
        </span>
        
        <div className="mt-5 space-y-4">
          {/* Elevation */}
          <div>
            <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest font-sans">Elevation altitude</div>
            <div className="text-2xl font-black mt-1 flex items-baseline gap-1.5 font-sans">
              {city.altitude || 0}
              <span className="text-xs text-slate-400 font-bold uppercase">Meters</span>
            </div>
          </div>

          {/* Timezone */}
          <div>
            <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest font-sans">Local timezone</div>
            <div className="text-xs font-black mt-1 flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl w-fit font-sans">
              <Clock size={12} className="text-slate-400" />
              <span>{city.timezone || 'GMT+5:30'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest border-t border-white/5 pt-3 font-sans">
        Anchor established in DB
      </div>
    </div>
  );
}
