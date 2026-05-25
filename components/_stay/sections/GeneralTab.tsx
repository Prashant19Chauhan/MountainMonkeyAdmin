"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Star, ChevronDown, Building2 } from "lucide-react";

interface GeneralTabProps {
  destinations: any[];
  cities: any[];
}

export default function GeneralTab({ destinations, cities }: GeneralTabProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const starRating = watch("starRating") || 3;

  return (
    <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Property Name */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-slate-700">
          Property Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("name")}
          placeholder="e.g. Grand Vista Resort"
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800"
        />
        {errors.name?.message && (
          <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.name.message)}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Property Type */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-700">Property Type</label>
          <div className="relative">
            <select
              {...register("type")}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 text-sm appearance-none bg-white font-medium text-gray-800"
            >
              <option value="hotel">Hotel</option>
              <option value="hostel">Hostel</option>
              <option value="homestay">Homestay</option>
              <option value="resort">Resort</option>
              <option value="villa">Villa</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronDown size={16} />
            </div>
          </div>
          {errors.type?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.type.message)}</p>
          )}
        </div>

        {/* Star Rating */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-700">Star Rating</label>
          <div className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl overflow-x-auto">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setValue("starRating", star, { shouldValidate: true })}
                className="transition-transform hover:scale-110 shrink-0"
              >
                <Star
                  size={20}
                  className={`${
                    starRating >= star ? "text-amber-400 fill-amber-400" : "text-slate-200"
                  }`}
                />
              </button>
            ))}
          </div>
          {errors.starRating?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.starRating.message)}</p>
          )}
        </div>
      </div>

      {/* Short Catchphrase */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-slate-700">Short Catchphrase</label>
        <input
          type="text"
          {...register("shortDescription")}
          placeholder="e.g. Luxury stay with a view of the Himalayas"
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800"
        />
        {errors.shortDescription?.message && (
          <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.shortDescription.message)}</p>
        )}
      </div>

      {/* Detailed Description */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-slate-700">Detailed Description</label>
        <textarea
          {...register("longDescription")}
          rows={4}
          placeholder="Complete overview of the property, services, and guest experience..."
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-200 resize-none transition-all text-gray-800"
        />
        {errors.longDescription?.message && (
          <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.longDescription.message)}</p>
        )}
      </div>

      {/* Destinations & Cities linking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Destination dropdown */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-700">Destination</label>
          <div className="relative">
            <select
              {...register("destinationId")}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 text-sm appearance-none bg-white font-medium text-gray-800"
            >
              <option value="">Select Destination</option>
              {destinations.map((d: any) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronDown size={16} />
            </div>
          </div>
          {errors.destinationId?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.destinationId.message)}</p>
          )}
        </div>

        {/* City dropdown */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-700">Main City (Ref)</label>
          <div className="relative">
            <select
              {...register("mainCity")}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 text-sm appearance-none bg-white font-medium text-gray-800"
            >
              <option value="">Select City</option>
              {cities.map((c: any) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronDown size={16} />
            </div>
          </div>
          {errors.mainCity?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.mainCity.message)}</p>
          )}
        </div>
      </div>
    </div>
  );
}
