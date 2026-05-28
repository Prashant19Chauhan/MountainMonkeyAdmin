"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Plus, X } from "lucide-react";
import { CATEGORY_OPTIONS } from "@/lib/validation/activity.validation";

interface PrimaryInfoSectionProps {
  destinations: any[];
}

export default function PrimaryInfoSection({ destinations }: PrimaryInfoSectionProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const categories: string[] = watch("category") || [];

  const toggleCategory = (value: string) => {
    const next = categories.includes(value)
      ? categories.filter((c) => c !== value)
      : [...categories, value];
    setValue("category", next, { shouldValidate: true });
  };

  return (
    <div className="space-y-4">
      {/* Name */}
      <div className="space-y-1.5 text-left">
        <label className="text-sm font-semibold text-gray-700">
          Activity Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("name")}
          placeholder="e.g. River Rafting in Rishikesh"
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800 placeholder:text-gray-300"
        />
        {errors.name?.message && (
          <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.name.message)}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Destination Dropdown */}
        <div className="space-y-1.5 text-left">
          <label className="text-sm font-semibold text-gray-700">Destination</label>
          <select
            {...register("destinationId")}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm appearance-none bg-white font-medium text-gray-800"
          >
            <option value="">Select Destination</option>
            {destinations.map((d: any) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>
          {errors.destinationId?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.destinationId.message)}</p>
          )}
        </div>

        {/* Activity Type */}
        <div className="space-y-1.5 text-left">
          <label className="text-sm font-semibold text-gray-700">Activity Type</label>
          <input
            type="text"
            {...register("type")}
            placeholder="e.g. Adventure"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800 placeholder:text-gray-300"
          />
          {errors.type?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.type.message)}</p>
          )}
        </div>
      </div>

      {/* Category Array */}
      <div className="space-y-2 text-left bg-blue-50/50 p-4 border border-blue-100 rounded-2xl">
        <label className="text-xs font-bold uppercase tracking-wider text-blue-800">Categories</label>
        <div className="flex flex-wrap gap-1.5 p-3 bg-white border border-blue-100 rounded-xl max-h-40 overflow-y-auto">
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleCategory(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all duration-300 ${
                categories.includes(opt.value)
                  ? "bg-blue-900 text-white border-blue-900 shadow-sm"
                  : "bg-blue-50/50 text-blue-400 border-blue-100/50 hover:bg-blue-100/80"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {errors.category?.message && (
          <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.category.message)}</p>
        )}
      </div>

      {/* Short Description */}
      <div className="space-y-1.5 text-left">
        <label className="text-sm font-semibold text-gray-700">Short Description</label>
        <textarea
          {...register("shortDescription")}
          rows={2}
          placeholder="Brief highlight (min 10 chars)..."
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 resize-none transition-all text-sm font-medium text-gray-800"
        />
        {errors.shortDescription?.message && (
          <p className="text-red-500 text-xs font-semibold mt-1">
            {String(errors.shortDescription.message)}
          </p>
        )}
      </div>

      {/* Long Description */}
      <div className="space-y-1.5 text-left">
        <label className="text-sm font-semibold text-gray-700">Long Description</label>
        <textarea
          {...register("longDescription")}
          rows={4}
          placeholder="Detailed overview of the experience (min 20 chars)..."
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 resize-none transition-all text-sm font-medium text-gray-800"
        />
        {errors.longDescription?.message && (
          <p className="text-red-500 text-xs font-semibold mt-1">
            {String(errors.longDescription.message)}
          </p>
        )}
      </div>
    </div>
  );
}
