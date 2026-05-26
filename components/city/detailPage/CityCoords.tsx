"use client";

import React from 'react';
import { Compass, Navigation } from 'lucide-react';

interface CityCoordsProps {
  latitude: number;
  longitude: number;
}

export default function CityCoords({ latitude, longitude }: CityCoordsProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 text-left h-full">
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-1 font-sans">
          <Navigation size={12} /> Mapping coordinates
        </h3>
        <p className="text-slate-400 text-[11px] mt-0.5 font-bold uppercase tracking-tight font-sans">Geographic point details in standard DB format.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-2xl">
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-sans">Latitude (Y)</div>
          <div className="text-lg font-black text-slate-800 font-mono mt-1">{latitude.toFixed(6)}°</div>
        </div>
        <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-2xl">
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-sans">Longitude (X)</div>
          <div className="text-lg font-black text-slate-800 font-mono mt-1">{longitude.toFixed(6)}°</div>
        </div>
      </div>

      <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5 pt-1 font-sans">
        <Compass size={12} /> DB Mapped System: EPSG 4326 (WGS 84 Point)
      </div>
    </div>
  );
}
