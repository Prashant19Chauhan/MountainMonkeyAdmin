"use client";

import React from 'react';
import { Truck, Coffee, User, CheckCircle } from 'lucide-react';
import { TourPackage } from '@/types/type';

interface PackageSidebarProps {
  pkg: TourPackage;
}

export default function PackageSidebar({ pkg }: PackageSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Pricing & Commercial Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full blur-xl" />

        <div className="relative">
          <span className="px-3 py-1 bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/10">
            Commercial Package Rate
          </span>
          
          <div className="mt-6 flex items-baseline gap-2">
            {pkg.pricing?.discountedPrice ? (
              <>
                <span className="text-4xl font-black tracking-tight">{pkg.pricing.currency || '$'}{pkg.pricing.discountedPrice}</span>
                <span className="text-lg line-through text-slate-400 font-bold">{pkg.pricing.currency || '$'}{pkg.pricing.basePrice}</span>
              </>
            ) : (
              <span className="text-4xl font-black tracking-tight">{pkg.pricing?.currency || '$'}{pkg.pricing?.basePrice}</span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
            {pkg.pricing?.perPerson ? 'Per Person rate' : 'Total Package rate'} • {pkg.pricing?.taxesIncluded ? 'Taxes Included' : 'Local Taxes Excluded'}
          </p>

          {/* Status Badge */}
          <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center text-xs">
            <span className="text-slate-400 font-bold">Lifecycle Status</span>
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-black tracking-widest uppercase border ${
              pkg.status === 'active' 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                : pkg.status === 'draft' 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-slate-700 text-slate-300 border-slate-600'
            }`}>
              {pkg.status}
            </span>
          </div>

          {/* Seats Booking Scale */}
          {pkg.availability && (
            <div className="mt-5 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Available Capacity</span>
                <span>{pkg.availability.availableSeats || 0} / {pkg.availability.maxSeats || 10} Seats</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-400 transition-all" 
                  style={{ width: `${(((pkg?.availability?.maxSeats || 10) - (pkg?.availability?.availableSeats || 10)) / (pkg?.availability?.maxSeats || 10)) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transport & Catering Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Logistics & Amenities</h3>
        
        {/* Transport */}
        <div className="flex gap-3.5 items-start">
          <div className="w-9 h-9 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0 shadow-xs">
            <Truck size={18} />
          </div>
          <div>
            <div className="text-xs font-black text-slate-900 uppercase">Transit Logistical Travel</div>
            <div className="text-xs text-slate-500 font-bold mt-0.5">
              {pkg.transport?.included ? (
                <span className="text-emerald-600 flex items-center gap-1 text-[11px] font-bold">
                  <CheckCircle size={12} /> Included: {pkg.transport.modes?.join(', ')}
                </span>
              ) : (
                <span className="text-slate-400">Excludes transport provisions</span>
              )}
            </div>
          </div>
        </div>

        {/* Meals */}
        <div className="flex gap-3.5 items-start">
          <div className="w-9 h-9 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0 shadow-xs">
            <Coffee size={18} />
          </div>
          <div>
            <div className="text-xs font-black text-slate-900 uppercase">Catering & Meals plan</div>
            <div className="text-xs text-slate-500 font-bold mt-0.5">
              {pkg.meals?.included ? (
                <span className="text-emerald-600 flex items-center gap-1 text-[11px] font-bold">
                  <CheckCircle size={12} /> Included: {pkg.meals.plan?.join(', ') || 'Standard Menu'}
                </span>
              ) : (
                <span className="text-slate-400">Excludes meals catering plan</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Information Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Corporate Host Support</h3>
        
        {pkg.vendor ? (
          <div className="space-y-3">
            <div className="flex gap-3 items-center">
              <div className="w-9 h-9 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-400 shrink-0">
                <User size={18} />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">{pkg.vendor.name}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Local Operator Vendor</div>
              </div>
            </div>

            <div className="space-y-1.5 border-t border-slate-100 pt-3 text-xs font-bold text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Vendor Support:</span>
                <span className="text-slate-850">{pkg.vendor.contactEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hotline:</span>
                <span className="text-slate-850">{pkg.vendor.contactPhone}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400 italic">No vendor info linked.</div>
        )}
      </div>
    </div>
  );
}
