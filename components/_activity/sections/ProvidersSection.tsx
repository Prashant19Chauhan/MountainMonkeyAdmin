"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { ActivityInput } from "@/lib/validation/activity.validation";
import { X, Plus } from "lucide-react";

export default function ProvidersSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ActivityInput>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "providers",
  });

  return (
    <div className="space-y-4">
      {fields.map((field, idx) => {
        const rowErrors = errors.providers?.[idx] as any;

        return (
          <div key={field.id} className="p-4 bg-gray-50 rounded-lg space-y-3 relative text-left">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700">Provider {idx + 1}</span>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="text-red-500 hover:text-red-700 transition-all"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Provider Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">Name</label>
                <input
                  type="text"
                  {...register(`providers.${idx}.name` as const)}
                  placeholder="Provider name"
                  className="w-full bg-white rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-200 transition-all text-gray-800"
                />
                {rowErrors?.name?.message && (
                  <p className="text-red-500 text-[11px] font-semibold mt-1">
                    {String(rowErrors.name.message)}
                  </p>
                )}
              </div>

              {/* Provider Contact */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">Contact</label>
                <input
                  type="text"
                  {...register(`providers.${idx}.contact` as const)}
                  placeholder="Phone/Email"
                  className="w-full bg-white rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-200 transition-all text-gray-800"
                />
                {rowErrors?.contact?.message && (
                  <p className="text-red-500 text-[11px] font-semibold mt-1">
                    {String(rowErrors.contact.message)}
                  </p>
                )}
              </div>

              {/* Provider Website */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">Website</label>
                <input
                  type="text"
                  {...register(`providers.${idx}.website` as const)}
                  placeholder="https://..."
                  className="w-full bg-white rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-200 transition-all text-gray-800"
                />
                {rowErrors?.website?.message && (
                  <p className="text-red-500 text-[11px] font-semibold mt-1">
                    {String(rowErrors.website.message)}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => append({ name: "", contact: "", website: "" })}
        className="w-full px-4 py-2 border border-dashed border-gray-300 rounded-lg hover:border-cyan-400 hover:bg-cyan-50 transition-all text-sm font-medium text-gray-600 hover:text-cyan-600 flex items-center justify-center gap-1"
      >
        <Plus size={16} /> Add Provider
      </button>
    </div>
  );
}
