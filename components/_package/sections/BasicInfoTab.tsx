"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { MapPin, FileText } from "lucide-react";

interface BasicInfoTabProps {
  destinations: any[];
}

export default function BasicInfoTab({ destinations }: BasicInfoTabProps) {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  const destinationErrors = errors.destination as any;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
          <FileText size={20} />
        </div>
        <div className="text-left">
          <h2 className="text-lg font-black uppercase tracking-wide text-slate-800">Basic Information</h2>
          <p className="text-xs text-slate-500 font-medium">Core details and destination linking</p>
        </div>
      </div>

      <div className="space-y-5 text-left">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 ml-1">
            Package Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("title")}
            placeholder="e.g., Ultimate Bali Gateway"
            className="w-full px-5 py-3.5 bg-slate-50/80 border-2 border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-semibold text-gray-800"
          />
          {errors.title?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.title.message)}</p>
          )}
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 ml-1">
            Short Description <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("shortDescription")}
            placeholder="Brief summary for cards and lists..."
            className="w-full px-5 py-3.5 bg-slate-50/80 border-2 border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-semibold text-gray-800"
          />
          {errors.shortDescription?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.shortDescription.message)}</p>
          )}
        </div>

        {/* Full Description */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 ml-1">
            Full Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            {...register("description")}
            placeholder="Detailed markdown-supported description of the package..."
            className="w-full px-5 py-3.5 bg-slate-50/80 border-2 border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-semibold text-gray-800 custom-scrollbar resize-none"
          />
          {errors.description?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.description.message)}</p>
          )}
        </div>

        {/* Destination & Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Primary Destination */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 ml-1 flex items-center gap-1">
              <MapPin size={14} className="text-emerald-500" /> Primary Destination <span className="text-red-500">*</span>
            </label>
            <select
              {...register("destination.id", {
                onChange: (e) => {
                  const destId = e.target.value;
                  const dest = destinations.find((d: any) => d._id === destId);
                  if (dest && dest.location?.coordinates) {
                    setValue("destination.coordinates.lat", dest.location.coordinates.lat || 0);
                    setValue("destination.coordinates.lng", dest.location.coordinates.lng || 0);
                  }
                },
              })}
              className="w-full px-5 py-3.5 bg-slate-50/80 border-2 border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-semibold text-gray-800 bg-white"
            >
              <option value="">Select a destination...</option>
              {destinations.map((d: any) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
            {destinationErrors?.id?.message && (
              <p className="text-red-500 text-xs font-semibold mt-1">{String(destinationErrors.id.message)}</p>
            )}
          </div>

          {/* URL Slug */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 ml-1">
              URL Slug (Optional)
            </label>
            <input
              type="text"
              {...register("slug")}
              placeholder="leave empty to auto-generate"
              className="w-full px-5 py-3.5 bg-slate-50/80 border-2 border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-semibold text-gray-800"
            />
            {errors.slug?.message && (
              <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.slug.message)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
