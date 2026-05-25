"use client";

import React from "react";
import { useFormContext } from "react-hook-form";

export default function SafetyTab() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const ratingsKeys = [
    { key: "emergencyContact", label: "Emergency Contact" },
    { key: "firstAid", label: "First Aid Kit" },
    { key: "security", label: "Security / Guards" },
    { key: "fireSafety", label: "Fire Safety" },
    { key: "hygiene", label: "Hygiene Standards" },
    { key: "staffTraining", label: "Staff Training" },
    { key: "sanitizationProtocols", label: "Sanitization Protocols" },
  ];

  return (
    <div className="space-y-8 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">
        Safety Ratings (0-5)
      </h3>
      {errors.safetyMeasuresRatings?.message && (
        <p className="text-red-500 text-xs font-semibold">{String(errors.safetyMeasuresRatings.message)}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
        {ratingsKeys.map((item) => {
          const currentRating = watch(`safetyMeasuresRatings.${item.key}`) ?? 5;
          const rowError = (errors.safetyMeasuresRatings as any)?.[item.key];

          return (
            <div key={item.key} className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-600">{item.label}</label>
              <div className="flex gap-1.5">
                {[0, 1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() =>
                      setValue(`safetyMeasuresRatings.${item.key}`, val, {
                        shouldValidate: true,
                      })
                    }
                    className={`flex-1 py-1.5 rounded-md text-[10px] font-black transition-all border ${
                      currentRating === val
                        ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/10"
                        : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
              {rowError?.message && (
                <p className="text-red-500 text-[10px] font-semibold mt-0.5">
                  {String(rowError.message)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
