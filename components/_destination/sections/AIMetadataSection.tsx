"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { destinationInput } from "@/lib/validation/destination.validation";
import { Sparkles } from "lucide-react";

const FieldHeader = ({ title, subtitle, icon }: { title: string; subtitle: string; icon: React.ReactNode }) => (
  <div className="mb-10 flex items-start gap-6">
    <div className="w-14 h-14 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-900 border border-slate-100 shadow-sm">
      {icon}
    </div>
    <div>
      <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{title}</h3>
      <p className="text-slate-400 text-sm font-medium mt-1 italic">{subtitle}</p>
    </div>
  </div>
);

const FormLabel = ({ children, required, hint }: { children: React.ReactNode; required?: boolean; hint?: string }) => (
  <div className="flex justify-between items-center mb-2.5">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
      {children} {required && <span className="text-rose-500">*</span>}
    </label>
    {hint && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{hint}</span>}
  </div>
);

export default function AIMetadataSection() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<destinationInput>();

  const mood: string[] = watch("aiMetadata.mood") || [];
  const travelStyle: string[] = watch("aiMetadata.travelStyle") || [];
  const suitableFor: string[] = watch("aiMetadata.suitableFor") || [];
  const tags: string[] = watch("aiMetadata.tags") || [];

  const toggleItem = (
    path: "aiMetadata.mood" | "aiMetadata.travelStyle" | "aiMetadata.suitableFor" | "aiMetadata.tags",
    currentList: string[],
    item: string
  ) => {
    const next = currentList.includes(item)
      ? currentList.filter((m) => m !== item)
      : [...currentList, item];
    setValue(path, next, { shouldValidate: true });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <FieldHeader
        title="AI Intelligence"
        icon={<Sparkles size={24} />}
        subtitle="Calibrate the semantic metadata used for deep travel matching."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Dominant Mood */}
        <div className="space-y-4">
          <FormLabel>Dominant Mood</FormLabel>
          <div className="flex flex-wrap gap-2">
            {["Relaxing", "Adventure", "Soulful", "Nature", "Luxury", "Vibrant", "Ethereal"].map((item) => (
              <button
                key={item}
                type="button"
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
                  mood.includes(item)
                    ? "bg-slate-900 text-white border-slate-900 shadow-md"
                    : "bg-white text-slate-400 border-slate-100 hover:bg-slate-50"
                }`}
                onClick={() => toggleItem("aiMetadata.mood", mood, item)}
              >
                {item}
              </button>
            ))}
          </div>
          {errors.aiMetadata?.mood?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.aiMetadata.mood.message)}</p>
          )}
        </div>

        {/* Travel Architecture */}
        <div className="space-y-4">
          <FormLabel>Travel Architecture</FormLabel>
          <div className="flex flex-wrap gap-2">
            {["Backpacking", "Fast-paced", "Slow Travel", "Eco-focus", "Luxury"].map((item) => (
              <button
                key={item}
                type="button"
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
                  travelStyle.includes(item)
                    ? "bg-slate-900 text-white border-slate-900 shadow-md"
                    : "bg-white text-slate-400 border-slate-100 hover:bg-slate-50"
                }`}
                onClick={() => toggleItem("aiMetadata.travelStyle", travelStyle, item)}
              >
                {item}
              </button>
            ))}
          </div>
          {errors.aiMetadata?.travelStyle?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.aiMetadata.travelStyle.message)}</p>
          )}
        </div>

        {/* Suitability Index */}
        <div className="space-y-4">
          <FormLabel>Suitability Index</FormLabel>
          <div className="flex flex-wrap gap-2">
            {["Solo", "Couples", "Families", "Groups", "Digital Nomads"].map((item) => (
              <button
                key={item}
                type="button"
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
                  suitableFor.includes(item)
                    ? "bg-slate-900 text-white border-slate-900 shadow-md"
                    : "bg-white text-slate-400 border-slate-100 hover:bg-slate-50"
                }`}
                onClick={() => toggleItem("aiMetadata.suitableFor", suitableFor, item)}
              >
                {item}
              </button>
            ))}
          </div>
          {errors.aiMetadata?.suitableFor?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.aiMetadata.suitableFor.message)}</p>
          )}
        </div>

        {/* Semantic Registry (Tags) */}
        <div className="space-y-4">
          <FormLabel>Semantic Registry (Tags)</FormLabel>
          <div className="flex flex-wrap gap-2">
            {["Alpine", "Tropical", "Urban", "Desert", "Ancient", "Spiritual"].map((item) => (
              <button
                key={item}
                type="button"
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
                  tags.includes(item)
                    ? "bg-slate-900 text-white border-slate-900 shadow-md"
                    : "bg-white text-slate-400 border-slate-100 hover:bg-slate-50"
                }`}
                onClick={() => toggleItem("aiMetadata.tags", tags, item)}
              >
                {item}
              </button>
            ))}
          </div>
          {errors.aiMetadata?.tags?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.aiMetadata.tags.message)}</p>
          )}
        </div>
      </div>
    </div>
  );
}
