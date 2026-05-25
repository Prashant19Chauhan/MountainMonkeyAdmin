"use client";

import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { ActivityInput } from "@/lib/validation/activity.validation";

export default function PricingSection() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ActivityInput>();

  const isFree = watch("pricing.isFree");

  // Automatically set price to 0 if marked as free
  useEffect(() => {
    if (isFree) {
      setValue("pricing.price", 0, { shouldValidate: true });
    }
  }, [isFree, setValue]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Base Price */}
        <div className="space-y-1.5 text-left">
          <label className="text-sm font-semibold text-gray-700">Base Price</label>
          <input
            type="number"
            disabled={isFree}
            {...register("pricing.price", { valueAsNumber: true })}
            placeholder="0"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800 disabled:bg-gray-100 disabled:text-gray-400"
          />
          {errors.pricing?.price?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">
              {String(errors.pricing.price.message)}
            </p>
          )}
        </div>

        {/* Currency */}
        <div className="space-y-1.5 text-left">
          <label className="text-sm font-semibold text-gray-700">Currency</label>
          <input
            type="text"
            {...register("pricing.currency")}
            placeholder="INR"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800"
          />
          {errors.pricing?.currency?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">
              {String(errors.pricing.currency.message)}
            </p>
          )}
        </div>

        {/* Free Checkbox */}
        <div className="flex items-center gap-2 pt-0 sm:pt-8 text-left">
          <input
            type="checkbox"
            id="isFree"
            {...register("pricing.isFree")}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="isFree" className="text-sm font-semibold text-gray-700 select-none">
            Mark as Free
          </label>
        </div>
      </div>

      {errors.pricing?.message && (
        <p className="text-red-500 text-xs font-semibold">{String(errors.pricing.message)}</p>
      )}

      {/* Publish to Platform (isActive) */}
      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 text-left">
        <input
          type="checkbox"
          id="isActive"
          {...register("isActive")}
          className="w-5 h-5 rounded border-gray-300 text-slate-900 focus:ring-slate-500"
        />
        <div>
          <label htmlFor="isActive" className="text-sm font-bold text-slate-900 select-none">
            Publish to Platform
          </label>
          <p className="text-[11px] text-slate-500">Make this activity visible to users immediately</p>
        </div>
      </div>
    </div>
  );
}
