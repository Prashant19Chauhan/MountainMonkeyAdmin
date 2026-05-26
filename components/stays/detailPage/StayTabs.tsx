"use client";

import React, { useState } from 'react';
import {
  Home,
  Sparkles,
  ShieldCheck,
  Plane,
  Check,
  Train,
  Map,
  Star
} from 'lucide-react';

import { Stay, StayRoom, ConnectivityPopularPlace } from '@/types/type';

interface StayTabsProps {
  stay: Stay;
}

export default function StayTabs({ stay }: StayTabsProps) {
  const [activeTab, setActiveTab] = useState<'rooms' | 'amenities' | 'safety' | 'connectivity'>('rooms');

  return (
    <div className="space-y-6">
      {/* Section Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-1">
        {[
          { id: 'rooms', label: 'Rooms & Lodgings', icon: <Home size={14} /> },
          { id: 'amenities', label: 'General Amenities', icon: <Sparkles size={14} /> },
          { id: 'safety', label: 'Safety & Ratings', icon: <ShieldCheck size={14} /> },
          { id: 'connectivity', label: 'Transit & Landmarks', icon: <Plane size={14} /> }
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

      {/* Dynamic Tab Panel */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm min-h-[300px]">
        
        {/* TAB: ROOMS */}
        {activeTab === 'rooms' && (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="text-lg font-black text-slate-900 font-sans">Configured Lodging Options</h3>
              <p className="text-slate-400 text-xs mt-0.5 font-sans">Explore configured rooms, rates, and occupancy ceilings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stay.rooms && stay.rooms.length > 0 ? (
                stay.rooms.map((room: StayRoom, index: number) => (
                  <div key={index} className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="px-2 py-0.5 bg-blue-50 border border-blue-100 text-blue-600 text-[9px] font-black uppercase tracking-wider rounded-md font-sans">
                          Option {index + 1}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase font-sans">
                          Max Occupancy: {room.capacity}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 mt-2 font-sans">{room.typeOfRoom}</h4>
                      
                      {/* Price */}
                      <div className="mt-3 flex items-baseline gap-1 text-slate-800">
                        <span className="text-lg font-black">₹{room.pricePerNight?.min} - ₹{room.pricePerNight?.max}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">/ night</span>
                      </div>

                      {/* Room Availability */}
                      {room.availability && (
                        <div className="text-[11px] text-slate-500 mt-2 font-bold flex items-center gap-1.5 font-sans">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Rooms: {room.availability.availableRooms} Available / {room.availability.totalRooms} Total
                        </div>
                      )}
                    </div>

                    {/* Room Amenities */}
                    {room.amenities && room.amenities.length > 0 && (
                      <div className="border-t border-slate-200/50 pt-3 flex flex-wrap gap-1">
                        {room.amenities.map((a: string, aIdx: number) => (
                          <span key={aIdx} className="text-[9px] px-2 py-0.5 bg-white text-slate-600 border border-slate-200 rounded-md font-bold font-sans">
                            {a}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-12 text-slate-400 italic text-xs font-sans">
                  No lodgings configured. Add rooms within editing parameters.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: AMENITIES */}
        {activeTab === 'amenities' && (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="text-lg font-black text-slate-900 font-sans">Property General Amenities</h3>
              <p className="text-slate-400 text-xs mt-0.5 font-sans">Comprehensive services offered to corporate and solo guests.</p>
            </div>

            {stay.amenities && stay.amenities.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {stay.amenities.map((a: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200/40 rounded-xl text-xs font-bold text-slate-700">
                    <Check size={14} className="text-emerald-500 shrink-0" />
                    <span>{a}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 italic text-xs bg-slate-50 rounded-2xl border border-slate-100 font-sans">
                No amenities registered.
              </div>
            )}
          </div>
        )}

        {/* TAB: SAFETY */}
        {activeTab === 'safety' && (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="text-lg font-black text-slate-900 font-sans">Safety Measures & Ratings</h3>
              <p className="text-slate-400 text-xs mt-0.5 font-sans">Semi-quantitative ratings (out of 5) measuring property protocols.</p>
            </div>

            {stay.safetyMeasuresRatings ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: 'security', label: 'Security & Surveillance' },
                  { key: 'fireSafety', label: 'Fire Safety Standard' },
                  { key: 'hygiene', label: 'Hygiene & Cleanliness' },
                  { key: 'firstAid', label: 'Medical & First Aid' },
                  { key: 'emergencyContact', label: 'Emergency Contact Speed' },
                  { key: 'staffTraining', label: 'Staff Crisis Training' }
                ].map(item => {
                  const rating = stay.safetyMeasuresRatings?.[item.key as keyof typeof stay.safetyMeasuresRatings] || 0;
                  return (
                    <div key={item.key} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-700 font-sans">
                        <span>{item.label}</span>
                        <span>{rating} / 5</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            rating >= 4 ? 'bg-emerald-500' : rating >= 3 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${(rating / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 italic text-xs bg-slate-50 rounded-2xl border border-slate-100 font-sans">
                No safety rating catalog details registered.
              </div>
            )}
          </div>
        )}

        {/* TAB: CONNECTIVITY */}
        {activeTab === 'connectivity' && (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="text-lg font-black text-slate-900 font-sans">Transit Connectivity & Landmarks</h3>
              <p className="text-slate-400 text-xs mt-0.5 font-sans">Important details showing arrival points and geographical convenience.</p>
            </div>

            {/* Arrival Terminals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-2xl flex gap-3 items-center">
                <Plane className="text-sky-500 shrink-0" size={20} />
                <div className="min-w-0">
                  <div className="text-[10px] font-black text-slate-400 uppercase font-sans">Nearest Airport</div>
                  <div className="text-xs font-bold text-slate-800 truncate mt-0.5 font-sans">
                    {stay.connectivity?.nearestAirport || 'Not Specified'}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-2xl flex gap-3 items-center">
                <Train className="text-indigo-500 shrink-0" size={20} />
                <div className="min-w-0">
                  <div className="text-[10px] font-black text-slate-400 uppercase font-sans">Nearest Railway</div>
                  <div className="text-xs font-bold text-slate-800 truncate mt-0.5 font-sans">
                    {stay.connectivity?.nearestRailway || 'Not Specified'}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-2xl flex gap-3 items-center">
                <Map className="text-amber-500 shrink-0" size={20} />
                <div className="min-w-0">
                  <div className="text-[10px] font-black text-slate-400 uppercase font-sans">Nearest Bus Stop</div>
                  <div className="text-xs font-bold text-slate-800 truncate mt-0.5 font-sans">
                    {stay.connectivity?.nearestBusStop || 'Not Specified'}
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Landmarks */}
            {stay.connectivity?.popularPlaces && stay.connectivity.popularPlaces.length > 0 && (
              <div className="pt-4">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3 font-sans">Popular Surrounding Locations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {stay.connectivity.popularPlaces.map((place: ConnectivityPopularPlace, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200/40 text-xs font-bold text-slate-700">
                      <span>{place.name}</span>
                      <span className="text-slate-400 font-sans">{place.distance} km away</span>
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
