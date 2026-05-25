"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { ActivityInput } from "@/lib/validation/activity.validation";

interface LocationSectionProps {
  cities: any[];
}

export default function LocationSection({ cities }: LocationSectionProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<ActivityInput>();

  return (
    <div className="space-y-4">
      {/* Main City Dropdown */}
      <div className="space-y-1.5 text-left">
        <label className="text-sm font-semibold text-gray-700">Main City (Ref)</label>
        <select
          {...register("location.mainCity")}
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm appearance-none bg-white font-medium text-gray-800"
        >
          <option value="">Select City</option>
          {cities.map((c: any) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.location?.mainCity?.message && (
          <p className="text-red-500 text-xs font-semibold mt-1">
            {String(errors.location.mainCity.message)}
          </p>
        )}
      </div>

      {/* Address */}
      <div className="space-y-1.5 text-left">
        <label className="text-sm font-semibold text-gray-700">
          Detailed Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("location.address")}
          placeholder="Specific meeting point or venue address..."
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800 placeholder:text-gray-300"
        />
        {errors.location?.address?.message && (
          <p className="text-red-500 text-xs font-semibold mt-1">
            {String(errors.location.address.message)}
          </p>
        )}
      </div>

      {/* Lat & Lng */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5 text-left">
          <label className="text-sm font-semibold text-gray-700">
            Latitude <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="any"
            {...register("location.coordinates.lat", { valueAsNumber: true })}
            placeholder="0"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800 placeholder:text-gray-300"
          />
          {errors.location?.coordinates?.lat?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">
              {String(errors.location.coordinates.lat.message)}
            </p>
          )}
        </div>

        <div className="space-y-1.5 text-left">
          <label className="text-sm font-semibold text-gray-700">
            Longitude <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="any"
            {...register("location.coordinates.lng", { valueAsNumber: true })}
            placeholder="0"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800 placeholder:text-gray-300"
          />
          {errors.location?.coordinates?.lng?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">
              {String(errors.location.coordinates.lng.message)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
