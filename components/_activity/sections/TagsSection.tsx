"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { TAGS_OPTIONS, RECOMMENDED_FOR_OPTIONS } from "@/lib/validation/activity.validation";

export default function TagsSection() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const tags: string[] = watch("tags") || [];
  const recommendedFor: string[] = watch("recommendedFor") || [];

  const toggleTag = (value: string) => {
    const next = tags.includes(value)
      ? tags.filter((t) => t !== value)
      : [...tags, value];
    setValue("tags", next, { shouldValidate: true });
  };

  const toggleRecommended = (value: string) => {
    const next = recommendedFor.includes(value)
      ? recommendedFor.filter((r) => r !== value)
      : [...recommendedFor, value];
    setValue("recommendedFor", next, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      {/* Tags Selection */}
      <div className="space-y-2 text-left bg-indigo-50/50 p-4 border border-indigo-100 rounded-2xl">
        <label className="text-xs font-bold uppercase tracking-wider text-indigo-800">Tags</label>
        <div className="flex flex-wrap gap-1.5 p-3 bg-white border border-indigo-100 rounded-xl max-h-40 overflow-y-auto">
          {TAGS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleTag(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all duration-300 ${
                tags.includes(opt.value)
                  ? "bg-indigo-900 text-white border-indigo-900 shadow-sm"
                  : "bg-indigo-50/50 text-indigo-400 border-indigo-100/50 hover:bg-indigo-100/80"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {errors.tags?.message && (
          <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.tags.message)}</p>
        )}
      </div>

      {/* Recommended For Selection */}
      <div className="space-y-2 text-left bg-green-50/50 p-4 border border-green-100 rounded-2xl">
        <label className="text-xs font-bold uppercase tracking-wider text-green-800">Recommended For</label>
        <div className="flex flex-wrap gap-1.5 p-3 bg-white border border-green-100 rounded-xl max-h-40 overflow-y-auto">
          {RECOMMENDED_FOR_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleRecommended(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all duration-300 ${
                recommendedFor.includes(opt.value)
                  ? "bg-green-900 text-white border-green-900 shadow-sm"
                  : "bg-green-50/50 text-green-400 border-green-100/50 hover:bg-green-100/80"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {errors.recommendedFor?.message && (
          <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.recommendedFor.message)}</p>
        )}
      </div>
    </div>
  );
}
