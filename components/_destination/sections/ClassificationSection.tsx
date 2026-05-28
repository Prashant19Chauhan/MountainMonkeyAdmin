"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Tag } from "lucide-react";
import { PLACE_TYPE_OPTIONS, DEST_CATEGORY_OPTIONS } from "@/lib/validation/destination.validation";

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

export default function ClassificationSection() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const placeType = watch("placeType") || "";
  const categories: string[] = watch("categories") || [];

  const handlePlaceTypeClick = (type: string) => {
    setValue("placeType", type, { shouldValidate: true });
  };

  const handleCategoryClick = (cat: string) => {
    const next = categories.includes(cat)
      ? categories.filter((c) => c !== cat)
      : [...categories, cat];
    setValue("categories", next, { shouldValidate: true });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <FieldHeader
        title="DNA Classification"
        icon={<Tag size={24} />}
        subtitle="Categorize the fundamental nature of this location for archival discovery."
      />
      
      <div className="space-y-10">
        {/* Primary Typology */}
        <div>
          <FormLabel required>Primary Typology</FormLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PLACE_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handlePlaceTypeClick(opt.value)}
                className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
                  placeType === opt.value
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                    : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {errors.placeType?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.placeType.message)}</p>
          )}
        </div>

        {/* Travel Genres */}
        <div>
          <FormLabel hint="Multi-selection enabled">Travel Genres</FormLabel>
          <div className="flex flex-wrap gap-2">
            {DEST_CATEGORY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all duration-300 ${
                  categories.includes(opt.value)
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                onClick={() => handleCategoryClick(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {errors.categories?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.categories.message)}</p>
          )}
        </div>
      </div>
    </div>
  );
}
