"use client";

import React from 'react';
import { Stay, StayRoom, StayAiScore } from '@/types/type';

interface StaySidebarProps {
  stay: Stay;
  mainCityName: string;
  destinationName: string;
}

export default function StaySidebar({ stay, mainCityName, destinationName }: StaySidebarProps) {
  return (
    <div className="space-y-6">
      {/* Main Pricing Breakdown Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-880 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        <div className="relative">
          <span className="px-3 py-1 bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/10">
            Average Market Pricing
          </span>

          <div className="mt-6 flex items-baseline gap-1.5 text-white">
            <span className="text-3xl font-black">₹{stay.priceRange?.min || 0} - ₹{stay.priceRange?.max || 0}</span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
            Average rates per night for standard booking
          </p>

          <div className="mt-6 pt-6 border-t border-white/10 space-y-3.5 text-xs text-left">
            <div className="flex justify-between font-bold">
              <span className="text-slate-400">Total Rooms:</span>
              <span className="text-slate-200">{stay.rooms?.reduce((acc: number, r: StayRoom) => acc + (r.availability?.totalRooms || 0), 0) || 0} Rooms</span>
            </div>
            <div className="flex justify-between font-bold">
              <span className="text-slate-400">Available Rooms:</span>
              <span className="text-slate-200">{stay.rooms?.reduce((acc: number, r: StayRoom) => acc + (r.availability?.availableRooms || 0), 0) || 0} Rooms</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Metadata & Constraint Scores */}
      {stay.aiScore && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 text-left">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 font-sans">AI Quality Indexes</h3>
          
          <div className="space-y-3.5">
            {[
              { key: 'overall', label: 'Overall Stay Index' },
              { key: 'cleanliness', label: 'Cleanliness Rating' },
              { key: 'valueForMoney', label: 'Value-For-Money Score' },
              { key: 'locationScore', label: 'Location Convenience' }
            ].map(item => {
              const val = stay.aiScore?.[item.key as keyof StayAiScore] || 0;
              return (
                <div key={item.key}>
                  <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
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
        </div>
      )}

      {/* Geography / Relations */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3 text-left">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 font-sans">Geographic Profile</h3>
        
        <div className="space-y-2.5 text-xs font-bold text-slate-600">
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-400 font-sans">Main Region Anchor:</span>
            <span className="text-slate-900">
              {destinationName}
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-400 font-sans">Primary Anchor City:</span>
            <span className="text-slate-900">
              {mainCityName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-sans">Altitude Level:</span>
            <span className="text-slate-950 font-sans">{stay.location?.altitude || 0} meters elevation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
