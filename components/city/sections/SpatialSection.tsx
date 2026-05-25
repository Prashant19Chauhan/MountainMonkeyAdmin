"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Compass, MapPin, CheckCircle } from "lucide-react";

export default function SpatialSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const locErrors = errors.locationCoordinates as any;

  return (
    <div className="space-y-8">
      <div className="p-6 md:p-8 bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden text-left">
        <div className="absolute -right-8 -bottom-8 opacity-10">
          <Compass size={160} />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500 rounded-xl">
              <MapPin size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
              Spatial
            </span>
          </div>
          <h3 className="text-lg md:text-xl font-black tracking-tight leading-tight">
            Geographic positioning for mapping services.
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Longitude <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                {...register("locationCoordinates.coordinates.0", { valueAsNumber: true })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-black outline-none focus:bg-white/10 transition-all text-white"
              />
              {locErrors?.coordinates?.[0]?.message && (
                <p className="text-rose-400 text-xs font-semibold mt-1">
                  {String(locErrors.coordinates[0].message)}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Latitude <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                {...register("locationCoordinates.coordinates.1", { valueAsNumber: true })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-black outline-none focus:bg-white/10 transition-all text-white"
              />
              {locErrors?.coordinates?.[1]?.message && (
                <p className="text-rose-400 text-xs font-semibold mt-1">
                  {String(locErrors.coordinates[1].message)}
                </p>
              )}
            </div>
          </div>
          {locErrors?.coordinates?.message && (
            <p className="text-rose-400 text-xs font-semibold mt-1">
              {String(locErrors.coordinates.message)}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4 md:space-y-6">
        <div className="flex items-center justify-between p-4 md:p-6 bg-white border border-slate-200 rounded-3xl shadow-sm text-left">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100">
              <TrendingUpIcon size={20} />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 uppercase tracking-widest">Altitude</div>
              <div className="text-[10px] text-slate-400 font-bold">Sea level (M)</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              {...register("altitude", { valueAsNumber: true })}
              className="w-16 md:w-24 text-right font-black text-base md:text-lg text-slate-900 outline-none"
            />
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">M</span>
          </div>
        </div>
        {errors.altitude?.message && (
          <p className="text-rose-500 text-xs font-semibold mt-1 text-left">{String(errors.altitude.message)}</p>
        )}

        <div className="p-4 md:p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center gap-4 text-left">
          <div className="p-2 bg-white rounded-xl shadow-sm shrink-0">
            <CheckCircle className="text-emerald-500" size={18} />
          </div>
          <p className="text-[11px] md:text-xs font-bold text-emerald-800 leading-snug">
            Geospatial indexing enabled for distance-based search queries.
          </p>
        </div>
      </div>
    </div>
  );
}

function TrendingUpIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  );
}
