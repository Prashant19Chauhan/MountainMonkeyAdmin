"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Globe } from "lucide-react";

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

const InputStyle = "w-full p-4 bg-slate-50/50 border border-slate-200 rounded-[1.25rem] text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-400 focus:bg-white transition-all placeholder:text-slate-400";

export default function BasicInfoSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <FieldHeader
        title="Core Identity"
        icon={<Globe size={24} />}
        subtitle="Establish the primary name and narrative description of this travel anchor."
      />
      
      <div className="space-y-8">
        {/* Destination Designation */}
        <div>
          <FormLabel required hint="Publicly visible name">Destination Designation</FormLabel>
          <input
            type="text"
            {...register("name")}
            placeholder="e.g. Kyoto, Japan or The Great Pyramids"
            className={InputStyle}
          />
          {errors.name?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.name.message)}</p>
          )}
        </div>

        {/* Executive Summary */}
        <div>
          <FormLabel required hint="SEO optimized summary">Executive Summary</FormLabel>
          <textarea
            {...register("shortDescription")}
            placeholder="A high-impact 160 character summary..."
            className={`${InputStyle} min-h-[100px] resize-none`}
          />
          {errors.shortDescription?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.shortDescription.message)}</p>
          )}
        </div>

        {/* Comprehensive Narrative */}
        <div>
          <FormLabel required hint="Markdown support enabled">Comprehensive Narrative</FormLabel>
          <textarea
            {...register("description")}
            placeholder="Describe history, culture, and unique selling points..."
            className={`${InputStyle} min-h-[200px] resize-none`}
          />
          {errors.description?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.description.message)}</p>
          )}
        </div>
      </div>
    </div>
  );
}
