"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Route, Compass, MapPin, Target, ArrowRight } from "lucide-react";

interface RouteInfoSectionProps {
  cities: any[];
}

export default function RouteInfoSection({ cities }: RouteInfoSectionProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const fromId = watch("from.id") || "";
  const fromName = watch("from.name") || "";
  const toId = watch("to.id") || "";
  const toName = watch("to.name") || "";

  const fromErrors = errors.from as any;
  const toErrors = errors.to as any;

  return (
    <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/60 shadow-lg shadow-slate-900/5 space-y-6 text-left">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-11 h-11 bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
          <Route size={22} />
        </div>
        <div>
          <h2 className="text-base font-black uppercase tracking-wide text-slate-800">Route Information</h2>
          <p className="text-xs text-slate-500 font-medium">Core identity and endpoints</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Route Name */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 ml-1 flex items-center gap-2">
            <Compass size={14} className="text-blue-500" />
            Route Name
          </label>
          <input
            type="text"
            {...register("name")}
            placeholder="e.g., Delhi to Manali Express Route"
            className="w-full px-5 py-3.5 bg-slate-50/80 border-2 border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-sm font-semibold placeholder:text-slate-400"
          />
          {errors.name?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.name.message)}</p>
          )}
        </div>

        {/* Origin & Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Origin City */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 ml-1 flex items-center gap-2">
              <MapPin size={14} className="text-emerald-500" />
              Origin City
            </label>
            <select
              value={fromId}
              onChange={(e) => {
                const city = cities.find((c: any) => c._id === e.target.value);
                setValue("from.id", e.target.value, { shouldValidate: true });
                setValue("from.name", city?.name || "", { shouldValidate: true });
              }}
              className="w-full px-5 py-3.5 bg-slate-50/80 border-2 border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-sm font-semibold appearance-none cursor-pointer"
            >
              <option value="">Select starting point...</option>
              {cities.map((city: any) => (
                <option key={city._id} value={city._id}>
                  {city.name}
                </option>
              ))}
            </select>
            {fromErrors?.id?.message && (
              <p className="text-red-500 text-xs font-semibold mt-1">{String(fromErrors.id.message)}</p>
            )}
            {fromErrors?.name?.message && (
              <p className="text-red-500 text-xs font-semibold mt-1">{String(fromErrors.name.message)}</p>
            )}
          </div>

          {/* Destination City */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 ml-1 flex items-center gap-2">
              <Target size={14} className="text-rose-500" />
              Destination City
            </label>
            <select
              value={toId}
              onChange={(e) => {
                const city = cities.find((c: any) => c._id === e.target.value);
                setValue("to.id", e.target.value, { shouldValidate: true });
                setValue("to.name", city?.name || "", { shouldValidate: true });
              }}
              className="w-full px-5 py-3.5 bg-slate-50/80 border-2 border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-sm font-semibold appearance-none cursor-pointer"
            >
              <option value="">Select destination...</option>
              {cities.map((city: any) => (
                <option key={city._id} value={city._id}>
                  {city.name}
                </option>
              ))}
            </select>
            {toErrors?.id?.message && (
              <p className="text-red-500 text-xs font-semibold mt-1">{String(toErrors.id.message)}</p>
            )}
            {toErrors?.name?.message && (
              <p className="text-red-500 text-xs font-semibold mt-1">{String(toErrors.name.message)}</p>
            )}
          </div>
        </div>

        {/* Path preview */}
        {fromName && toName && (
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <MapPin size={18} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600">From</p>
                  <p className="text-sm font-black text-slate-900">{fromName}</p>
                </div>
              </div>
              <ArrowRight size={20} className="text-blue-400" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Target size={18} className="text-rose-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600">To</p>
                  <p className="text-sm font-black text-slate-900">{toName}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
