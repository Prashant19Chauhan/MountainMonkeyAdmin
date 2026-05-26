"use client";

import React from 'react';
import { ArrowLeft, Package, TrendingUp } from 'lucide-react';
import Link from 'next/link';

import { TourPackage } from '@/types/type';

interface PackageHeaderProps {
  pkg: TourPackage;
  onBack: () => void;
}

export default function PackageHeader({ pkg, onBack }: PackageHeaderProps) {
  return (
    <>
      {/* Top Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-all text-xs font-bold uppercase tracking-wider shadow-sm active:scale-95"
        >
          <ArrowLeft size={16} />
          Back to Packages
        </button>

        <div className="flex gap-2">
          <Link
            href={`/packages/update-package?id=${pkg.slug}`}
            className="px-5 py-2 bg-slate-950 text-white hover:bg-black rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
          >
            Edit Package
          </Link>
        </div>
      </div>

      {/* Cover Section */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="relative h-[320px] md:h-[400px] w-full bg-slate-100">
          {pkg.images && pkg.images.length > 0 ? (
            <img
              src={pkg.images[0]}
              alt={pkg.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
              <Package size={80} strokeWidth={1} />
              <p className="text-xs uppercase tracking-widest mt-2">No Visual Asset Attached</p>
            </div>
          )}
          {/* Overlay Glassmorphic Badge */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/10">
              {pkg.duration?.days} Days / {pkg.duration?.nights} Nights
            </span>
            {pkg.isFeatured && (
              <span className="px-3 py-1 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1 shadow-md">
                <TrendingUp size={12} />
                Featured
              </span>
            )}
          </div>
        </div>
        
        {/* Title & Short Description */}
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {pkg.categories?.map((cat: string) => (
              <span key={cat} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[9px] font-black uppercase tracking-widest rounded-md border border-slate-200">
                {cat}
              </span>
            ))}
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">{pkg.title}</h1>
          <p className="text-slate-500 mt-2 font-medium italic text-sm md:text-base border-l-2 border-slate-300 pl-3">
            "{pkg.shortDescription}"
          </p>
        </div>
      </div>
    </>
  );
}
