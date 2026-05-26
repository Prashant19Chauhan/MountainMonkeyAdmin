"use client";

import React, { useState } from 'react';
import {
  Utensils,
  MapPin,
  BookOpen,
  ShieldCheck,
  Coffee,
  CheckCircle,
  XCircle,
  Phone
} from 'lucide-react';

import { LocalInfo, LocalFoodItem, FoodBestPlace, FamousPlaceItem, PrecautionItem, EmergencyContact } from '@/types/type';

interface LocalInfoTabsProps {
  info: LocalInfo;
}

export default function LocalInfoTabs({ info }: LocalInfoTabsProps) {
  const [activeTab, setActiveTab] = useState<'food' | 'places' | 'culture' | 'safety'>('food');

  return (
    <div className="space-y-6">
      {/* Section Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-1">
        {[
          { id: 'food', label: 'Local Food Delicacies', icon: <Utensils size={14} /> },
          { id: 'places', label: 'Famous Sights', icon: <MapPin size={14} /> },
          { id: 'culture', label: 'Culture & Etiquette', icon: <BookOpen size={14} /> },
          { id: 'safety', label: 'Safety & Advisories', icon: <ShieldCheck size={14} /> }
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

      {/* Dynamic Details Panel */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm min-h-[300px]">
        
        {/* TAB: FOOD DELICACIES */}
        {activeTab === 'food' && (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="text-lg font-black text-slate-900 font-sans">Famous Local Food & Delicacies</h3>
              <p className="text-slate-400 text-xs mt-0.5 font-sans">Highly recommended regional items and famous vendor locations.</p>
            </div>

            {info.famousFood && info.famousFood.length > 0 ? (
              <div className="space-y-6 font-sans">
                {info.famousFood.map((food: LocalFoodItem, idx: number) => (
                  <div key={idx} className="p-5 bg-slate-50 border border-slate-200/55 rounded-2xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="text-sm font-black text-slate-900 uppercase flex items-center gap-1.5 font-sans">
                        <Coffee className="text-amber-500" size={16} /> {food.name}
                      </h4>
                      <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md border w-fit font-sans ${
                        food.typeOfFood === 'veg' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : food.typeOfFood === 'non-veg' 
                          ? 'bg-rose-50 text-rose-600 border-rose-100'
                          : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {food.typeOfFood}
                      </span>
                    </div>

                    {food.description && (
                      <p className="text-xs text-slate-600 font-medium leading-relaxed font-sans">
                        {food.description}
                      </p>
                    )}

                    {/* Best places to eat it */}
                    {food.bestPlaces && food.bestPlaces.length > 0 && (
                      <div className="pt-2 border-t border-slate-200/50">
                        <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 font-sans">Best Venues to Try It</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {food.bestPlaces.map((place: FoodBestPlace, pIdx: number) => (
                            <div key={pIdx} className="p-2.5 bg-white border border-slate-200/40 rounded-xl text-xs font-bold text-slate-700 flex flex-col justify-center font-sans">
                              <span className="text-slate-900 font-bold">{place.name}</span>
                              <span className="text-[10px] text-slate-400 font-normal italic mt-0.5 flex items-center gap-1">
                                <MapPin size={10} /> {place.location}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 italic text-xs bg-slate-50 rounded-2xl border border-slate-100 font-sans">
                No culinary highlights registered.
              </div>
            )}
          </div>
        )}

        {/* TAB: FAMOUS SIGHTS */}
        {activeTab === 'places' && (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="text-lg font-black text-slate-900 font-sans">Famous Tourist Sights & Landmarks</h3>
              <p className="text-slate-400 text-xs mt-0.5 font-sans">Renowned tourist spots, historical monuments, and hidden regional gems.</p>
            </div>

            {info.famousPlaces && info.famousPlaces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {info.famousPlaces.map((place: FamousPlaceItem, idx: number) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 flex flex-col justify-between space-y-4 font-sans">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[9px] font-black uppercase tracking-wider rounded-md font-sans">
                          {place.type?.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase font-sans">
                          Fee: {place.entryFee && place.entryFee > 0 ? `₹${place.entryFee}` : 'Free'}
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-slate-900 mt-2.5 font-sans">{place.name}</h4>
                      
                      {place.description && (
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1.5 font-sans">
                          {place.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5 border-t border-slate-200/50 pt-3 text-[11px] font-bold text-slate-600 font-sans">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Timings:</span>
                        <span>{place.timings || 'Always Open'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Best Season:</span>
                        <span>{place.bestTimeToVisit || 'All Seasons'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 italic text-xs bg-slate-50 rounded-2xl border border-slate-100 font-sans">
                No tourist landmarks registered.
              </div>
            )}
          </div>
        )}

        {/* TAB: CULTURE & ETIQUETTE */}
        {activeTab === 'culture' && (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="text-lg font-black text-slate-900 font-sans">Culture & Cultural Etiquette</h3>
              <p className="text-slate-400 text-xs mt-0.5 font-sans">Explore local traditions, traditional clothing tips, and dos/don'ts.</p>
            </div>

            {/* Culture Details */}
            {info.culture && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {info.culture.traditions && info.culture.traditions.length > 0 && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/40">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 font-sans">Regional Traditions</h4>
                    <ul className="space-y-1 text-xs font-bold text-slate-700 font-sans">
                      {info.culture.traditions.map((t: string, idx: number) => (
                        <li key={idx} className="flex gap-2 items-center">
                          <span className="w-1.5 h-1.5 bg-slate-900 rounded-full"></span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {info.culture.festivals && info.culture.festivals.length > 0 && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/40">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 font-sans">Cultural Festivals</h4>
                    <ul className="space-y-1 text-xs font-bold text-slate-700 font-sans">
                      {info.culture.festivals.map((f: string, idx: number) => (
                        <li key={idx} className="flex gap-2 items-center">
                          <span className="w-1.5 h-1.5 bg-slate-900 rounded-full"></span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Clothing details */}
            {info.clothing && (
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3 font-sans">Traditional Clothing Tips</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 text-xs font-bold text-slate-700 font-sans">
                    <div>
                      <span className="text-[10px] text-slate-400 font-black uppercase block">Summer Season</span>
                      <span className="text-slate-800">{info.clothing.summer?.join(', ') || 'Standard summer clothing'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-black uppercase block">Winter Season</span>
                      <span className="text-slate-800">{info.clothing.winter?.join(', ') || 'Heavy woolens'}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-bold text-slate-700 font-sans">
                    <div>
                      <span className="text-[10px] text-slate-400 font-black uppercase block">Religious Sights</span>
                      <span className="text-slate-800">{info.clothing.religiousPlaces?.join(', ') || 'Modest clothing cover'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Do's & Don'ts */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 mb-3 flex items-center gap-1 font-sans">
                  <CheckCircle size={14} className="text-emerald-500" /> Regional Do's
                </h4>
                <ul className="space-y-2">
                  {info.dos?.map((item: string, idx: number) => (
                    <li key={idx} className="flex gap-2 items-start text-xs font-medium text-slate-700 font-sans">
                      <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-rose-600 mb-3 flex items-center gap-1 font-sans">
                  <XCircle size={14} className="text-rose-500" /> Regional Don'ts
                </h4>
                <ul className="space-y-2">
                  {info.donts?.map((item: string, idx: number) => (
                    <li key={idx} className="flex gap-2 items-start text-xs font-medium text-slate-700 font-sans">
                      <XCircle size={14} className="text-rose-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB: SAFETY & ADVISORIES */}
        {activeTab === 'safety' && (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="text-lg font-black text-slate-900 font-sans">Safety Index & Advisories</h3>
              <p className="text-slate-400 text-xs mt-0.5 font-sans">Critical guidelines, precautionary warnings, and emergency support agency directories.</p>
            </div>

            {/* Safety Overall Index */}
            {info.safety && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/40 font-sans">
                <div className="flex justify-between text-xs font-black text-slate-700 mb-2 font-sans">
                  <span>OVERALL REGIONAL SAFETY LEVEL</span>
                  <span>{info.safety.overallSafety || 0} / 10 Index</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      (info.safety.overallSafety || 5) >= 7 ? 'bg-emerald-500' : (info.safety.overallSafety || 5) >= 5 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${(info.safety.overallSafety || 5) * 10}%` }}
                  />
                </div>
              </div>
            )}

            {/* Precaution advisories list */}
            {info.precautions && info.precautions.length > 0 && (
              <div className="pt-2">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3 font-sans">Precautionary Alerts</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {info.precautions.map((prec: PrecautionItem, idx: number) => (
                    <div key={idx} className={`p-4 rounded-2xl border flex flex-col justify-between space-y-2 font-sans ${
                      prec.severity === 'high' 
                        ? 'bg-rose-50 border-rose-100 text-rose-900' 
                        : prec.severity === 'medium' 
                        ? 'bg-amber-50 border-amber-100 text-amber-900' 
                        : 'bg-slate-50 border-slate-200/40 text-slate-800'
                    }`}>
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-black uppercase tracking-wider font-sans">{prec.title}</span>
                          <span className="text-[9px] font-black uppercase font-mono">{prec.severity} severity</span>
                        </div>
                        <p className="text-[11px] font-medium leading-relaxed mt-1.5 font-sans">
                          {prec.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Emergency Contacts Directory */}
            {info.safety?.emergencyContacts && info.safety.emergencyContacts.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3 font-sans">Emergency Support Contacts</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {info.safety.emergencyContacts.map((c: EmergencyContact, idx: number) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200/40 rounded-xl text-xs font-bold text-slate-700 flex justify-between items-center font-sans">
                      <span>{c.authority}</span>
                      <span className="text-slate-900 font-mono flex items-center gap-1 bg-white border border-slate-100 px-2 py-0.5 rounded-md">
                        <Phone size={10} className="text-slate-400" /> {c.number}
                      </span>
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
