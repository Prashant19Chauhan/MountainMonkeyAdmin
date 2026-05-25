"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { DollarSign, Trash2 } from "lucide-react";

export default function PricingTab() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const priceRangeErrors = errors.priceRange as any;
  const cancellationErrors = errors.cancellationPolicy as any;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "cancellationPolicy",
  });

  return (
    <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Property Price Range */}
      <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl space-y-4">
        <h3 className="text-sm font-black text-emerald-900 uppercase tracking-widest flex items-center gap-2">
          <DollarSign size={16} /> Property Price Range
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Minimum Price</label>
            <input
              type="number"
              {...register("priceRange.min", { valueAsNumber: true })}
              placeholder="0"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800 bg-white"
            />
            {priceRangeErrors?.min?.message && (
              <p className="text-red-500 text-[10px] font-semibold mt-1">
                {String(priceRangeErrors.min.message)}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Maximum Price</label>
            <input
              type="number"
              {...register("priceRange.max", { valueAsNumber: true })}
              placeholder="0"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800 bg-white"
            />
            {priceRangeErrors?.max?.message && (
              <p className="text-red-500 text-[10px] font-semibold mt-1">
                {String(priceRangeErrors.max.message)}
              </p>
            )}
          </div>
        </div>
        {priceRangeErrors?.message && (
          <p className="text-red-500 text-xs font-semibold">{String(priceRangeErrors.message)}</p>
        )}
        <p className="text-xs text-emerald-700 font-medium font-sans">
          This represents the overall price range across all room types
        </p>
      </div>

      {/* Cancellation Policies */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Cancellation Policies
          </h3>
          <button
            type="button"
            onClick={() => append({ policyName: "", policyDescription: "" })}
            className="px-3 py-1.5 border border-dashed border-slate-300 rounded-lg text-[9px] font-black text-slate-500 hover:border-slate-400 hover:text-slate-600 transition-all uppercase tracking-widest"
          >
            + ADD POLICY
          </button>
        </div>

        {cancellationErrors?.message && (
          <p className="text-red-500 text-xs font-semibold">{String(cancellationErrors.message)}</p>
        )}

        <div className="space-y-3">
          {fields.map((field, idx) => {
            const rowErrors = cancellationErrors?.[idx];
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
                  <label className="text-xs font-bold text-slate-700">Policy Name</label>
                  <input
                    type="text"
                    {...register(`cancellationPolicy.${idx}.policyName` as const)}
                    placeholder="e.g. Free cancellation up to 24 hours"
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
                    placeholder="Detailed cancellation terms..."
                    {...register(`cancellationPolicy.${idx}.policyDescription` as const)}
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

      {/* Popularity Score */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">
          Popularity Score
        </h3>
        <input
          type="number"
          {...register("popularityScore", { valueAsNumber: true })}
          placeholder="0"
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-bold text-gray-800 bg-white"
        />
        {errors.popularityScore?.message && (
          <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.popularityScore.message)}</p>
        )}
        <p className="text-xs text-slate-500 font-medium">
          Higher scores indicate more popular properties
        </p>
      </div>
    </div>
  );
}
