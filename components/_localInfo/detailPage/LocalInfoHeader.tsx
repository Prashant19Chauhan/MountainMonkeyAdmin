"use client";

import React from 'react';
import { ArrowLeft, Globe, DollarSign, Calendar } from 'lucide-react';
import Link from 'next/link';

import { LocalInfo } from '@/types/type';

interface LocalInfoHeaderProps {
  info: LocalInfo;
  destinationName: string;
  onBack: () => void;
}

export default function LocalInfoHeader({ info, destinationName, onBack }: LocalInfoHeaderProps) {
  return (
    <>
      {/* Top Header Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-all text-xs font-bold uppercase tracking-wider shadow-sm active:scale-95"
        >
          <ArrowLeft size={16} />
          Back to Guides
        </button>

        <Link
          href={`/local-informations/update-local-information?id=${info._id}`}
          className="px-5 py-2 bg-slate-950 text-white hover:bg-black rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
        >
          Edit Guide
        </Link>
      </div>

      {/* Header Summary Profile */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden text-left">
        {/* Visual background lights */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-200 font-sans">
              Destination Guide
            </span>
            <span className="text-slate-300 font-sans">•</span>
            <span className="text-xs font-bold text-slate-400 font-sans">
              Last Updated: {info.updatedAt ? new Date(info.updatedAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight font-sans">
            {destinationName}
          </h1>
          
          {/* Primary Facts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 text-slate-400 shrink-0">
                <Globe size={18} />
              </div>
              <div>
                <div className="text-[9px] text-slate-400 font-black uppercase font-sans">Languages</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5 truncate max-w-[130px] font-sans" title={info.language?.join(', ')}>
                  {info.language?.join(', ') || 'N/A'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 text-slate-400 shrink-0">
                <DollarSign size={18} />
              </div>
              <div>
                <div className="text-[9px] text-slate-400 font-black uppercase font-sans">Local Currency</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5 font-sans">{info.currency || 'INR'}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 text-slate-400 shrink-0">
                <Calendar size={18} />
              </div>
              <div>
                <div className="text-[9px] text-slate-400 font-black uppercase font-sans">Best Time to Visit</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5 truncate max-w-[130px] font-sans">{info.bestTimeToVisit || 'Year-round'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
