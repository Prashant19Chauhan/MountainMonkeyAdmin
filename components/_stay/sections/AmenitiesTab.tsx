"use client";

import React, { useState, useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Trash2 } from "lucide-react";

export default function AmenitiesTab() {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "policies",
  });

  const amenities: string[] = watch("amenities") || [];
  const [amenitiesText, setAmenitiesText] = useState("");

  // Sync initial string arrays
  useEffect(() => {
    if (amenities.length > 0 && !amenitiesText) {
      setAmenitiesText(amenities.join(", "));
    }
  }, [amenities]);

  const handleAmenitiesBlur = () => {
    const arr = amenitiesText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setValue("amenities", arr, { shouldValidate: true });
  };

  return (
    <div className="space-y-8 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Global Property Amenities */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">
          Global Property Amenities
        </h3>
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-700">
            Enter amenities separated by commas
          </label>
          <textarea
            placeholder="e.g. Free WiFi, Swimming Pool, Parking, Room Service, Gym"
            value={amenitiesText}
            onChange={(e) => setAmenitiesText(e.target.value)}
            onBlur={handleAmenitiesBlur}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800 resize-none"
            rows={3}
          />
          {errors.amenities?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.amenities.message)}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {amenities.map((item: string) => (
              <span
                key={item}
                className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold border border-slate-200"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Policies (Check-in/Out, Rules) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Policies (Check-in/Out, Rules)
          </h3>
          <button
            type="button"
            onClick={() => append({ policyName: "", policyDescription: "" })}
            className="px-3 py-1.5 border border-dashed border-slate-300 rounded-lg text-[9px] font-black text-slate-500 hover:border-slate-400 hover:text-slate-600 transition-all uppercase tracking-widest"
          >
            + ADD POLICY
          </button>
        </div>

        {errors.policies?.message && (
          <p className="text-red-500 text-xs font-semibold">{String(errors.policies.message)}</p>
        )}

        <div className="space-y-3">
          {fields.map((field, idx) => {
            const policiesErrors = errors.policies as any;
            const rowErrors = policiesErrors?.[idx];
            return (
              <div key={field.id} className="p-4 bg-white border border-slate-200 rounded-2xl relative shadow-sm">
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="absolute -top-2 -right-2 bg-white border border-slate-100 text-slate-400 hover:text-red-500 p-1.5 rounded-full shadow-lg transition-colors z-10"
                >
                  <Trash2 size={14} />
                </button>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Policy Title</label>
                  <input
                    type="text"
                    {...register(`policies.${idx}.policyName` as const)}
                    placeholder="e.g. Check-in Policy"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800"
                  />
                  {rowErrors?.policyName?.message && (
                    <p className="text-red-500 text-xs font-semibold mt-1">
                      {String(rowErrors.policyName.message)}
                    </p>
                  )}
                </div>

                <div className="mt-3">
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Policy Description</label>
                  <textarea
                    placeholder="Policy description..."
                    {...register(`policies.${idx}.policyDescription` as const)}
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-slate-200 text-gray-800 resize-none"
                  />
                  {rowErrors?.policyDescription?.message && (
                    <p className="text-red-500 text-xs font-semibold mt-1">
                      {String(rowErrors.policyDescription.message)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
