"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Info, Shield, ChevronDown } from "lucide-react";

export default function GeneralSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-6">
      {/* City / Location Name */}
      <div className="space-y-1.5 text-left">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          City / Location Name <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          {...register("name")}
          placeholder="e.g. Manali"
          className="w-full rounded-2xl border border-slate-200 px-5 py-3 outline-none focus:ring-2 focus:ring-slate-100 transition-all text-sm font-bold text-slate-800 placeholder:text-slate-300"
        />
        {errors.name?.message && (
          <p className="text-rose-500 text-xs font-semibold mt-1">{String(errors.name.message)}</p>
        )}
      </div>

      {/* City Name */}
      <div className="space-y-1.5 text-left">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          City Name <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          {...register("city")}
          placeholder="e.g. Manali"
          className="w-full rounded-2xl border border-slate-200 px-5 py-3 outline-none focus:ring-2 focus:ring-slate-100 transition-all text-sm font-bold text-slate-800 placeholder:text-slate-300"
        />
        {errors.city?.message && (
          <p className="text-rose-500 text-xs font-semibold mt-1">{String(errors.city.message)}</p>
        )}
      </div>

      {/* Country & State */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5 text-left">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Country <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            {...register("country")}
            placeholder="India"
            className="w-full rounded-2xl border border-slate-200 px-5 py-3 outline-none focus:ring-2 focus:ring-slate-100 transition-all text-sm font-bold text-slate-800 placeholder:text-slate-300"
          />
          {errors.country?.message && (
            <p className="text-rose-500 text-xs font-semibold mt-1">{String(errors.country.message)}</p>
          )}
        </div>

        <div className="space-y-1.5 text-left">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            State / Province <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            {...register("state")}
            placeholder="Himachal Pradesh"
            className="w-full rounded-2xl border border-slate-200 px-5 py-3 outline-none focus:ring-2 focus:ring-slate-100 transition-all text-sm font-bold text-slate-800 placeholder:text-slate-300"
          />
          {errors.state?.message && (
            <p className="text-rose-500 text-xs font-semibold mt-1">{String(errors.state.message)}</p>
          )}
        </div>
      </div>

      {/* Lifecycle Status & Timezone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5 text-left">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Lifecycle Status
          </label>
          <div className="relative">
            <select
              {...register("status")}
              className="w-full rounded-2xl border border-slate-200 px-5 py-3 outline-none focus:ring-2 focus:ring-slate-100 transition-all text-sm font-bold text-slate-800 appearance-none bg-white"
            >
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Inactive">Inactive</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronDown size={16} />
            </div>
          </div>
          {errors.status?.message && (
            <p className="text-rose-500 text-xs font-semibold mt-1">{String(errors.status.message)}</p>
          )}
        </div>

        <div className="space-y-1.5 text-left">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Timezone <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            {...register("timezone")}
            placeholder="Asia/Kolkata"
            className="w-full rounded-2xl border border-slate-200 px-5 py-3 outline-none focus:ring-2 focus:ring-slate-100 transition-all text-sm font-bold text-slate-800 placeholder:text-slate-300"
          />
          {errors.timezone?.message && (
            <p className="text-rose-500 text-xs font-semibold mt-1">{String(errors.timezone.message)}</p>
          )}
        </div>
      </div>

      {/* Brief Description */}
      <div className="space-y-1.5 text-left">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Info size={12} /> Brief Description <span className="text-rose-500">*</span>
        </label>
        <textarea
          {...register("description")}
          rows={4}
          placeholder="Provide a brief overview..."
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-100 transition-all resize-none text-gray-800"
        />
        {errors.description?.message && (
          <p className="text-rose-500 text-xs font-semibold mt-1">{String(errors.description.message)}</p>
        )}
      </div>

      {/* Administrative Info (Landmark) */}
      <div className="p-4 md:p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4 text-left">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Shield size={14} className="text-slate-400" /> Administrative
        </h3>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-700">
            Landmark / Address <span className="text-rose-500">*</span>
          </label>
          <textarea
            {...register("address")}
            rows={2}
            className="w-full bg-white rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none text-gray-800"
            placeholder="Street or landmark..."
          />
          {errors.address?.message && (
            <p className="text-rose-500 text-xs font-semibold mt-1">{String(errors.address.message)}</p>
          )}
        </div>
      </div>
    </div>
  );
}
