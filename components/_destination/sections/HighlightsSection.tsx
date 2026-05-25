"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { destinationInput } from "@/lib/validation/destination.validation";
import { Star, Plus, Trash2 } from "lucide-react";

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

export default function HighlightsSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<destinationInput>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "aiMetadata.highlights",
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <FieldHeader
        title="Experiences"
        icon={<Star size={24} />}
        subtitle="Define the unique experiential highlights that make this destination a primary travel anchor."
      />
      
      <div className="space-y-6">
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={() => append({ title: "", description: "" })}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg"
          >
            <Plus size={16} /> New Experience Highlight
          </button>
        </div>

        {errors.aiMetadata?.highlights?.message && (
          <p className="text-red-500 text-xs font-semibold">{String(errors.aiMetadata.highlights.message)}</p>
        )}

        {fields.map((field, index) => {
          const rowErrors = errors.aiMetadata?.highlights?.[index] as any;
          return (
            <div
              key={field.id}
              className="p-8 bg-white border border-slate-200 rounded-[2.5rem] relative group hover:border-slate-400 transition-all shadow-sm"
            >
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash2 size={18} />
              </button>

              <div className="space-y-6 pr-10">
                <div>
                  <FormLabel required>Highlight Title</FormLabel>
                  <input
                    type="text"
                    {...register(`aiMetadata.highlights.${index}.title` as const)}
                    className={InputStyle}
                    placeholder="e.g. Ancient Temple at Dawn"
                  />
                  {rowErrors?.title?.message && (
                    <p className="text-red-500 text-xs font-semibold mt-1">{String(rowErrors.title.message)}</p>
                  )}
                </div>

                <div>
                  <FormLabel required>Experiential Detail</FormLabel>
                  <textarea
                    {...register(`aiMetadata.highlights.${index}.description` as const)}
                    className={`${InputStyle} min-h-[100px] resize-none`}
                    placeholder="Describe the atmosphere, significance, or activity..."
                  />
                  {rowErrors?.description?.message && (
                    <p className="text-red-500 text-xs font-semibold mt-1">{String(rowErrors.description.message)}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {fields.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-white rounded-[2rem] flex items-center justify-center text-slate-200 border border-slate-100 mb-4 shadow-sm">
              <Star size={32} />
            </div>
            <h5 className="text-sm font-black text-slate-900 uppercase tracking-widest">No Experience Data</h5>
            <p className="text-xs text-slate-400 mt-1 max-w-[200px] italic">Establish at least one highlight for premium visibility.</p>
          </div>
        )}
      </div>
    </div>
  );
}
