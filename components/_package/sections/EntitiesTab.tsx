"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Activity, Home, Plus, Trash2 } from "lucide-react";

interface EntitiesTabProps {
  activities: any[];
  accommodationsList: any[];
}

export default function EntitiesTab({ activities, accommodationsList }: EntitiesTabProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const {
    fields: activityFields,
    append: appendActivity,
    remove: removeActivity,
  } = useFieldArray({
    control,
    name: "activities",
  });

  const {
    fields: accommodationFields,
    append: appendAccommodation,
    remove: removeAccommodation,
  } = useFieldArray({
    control,
    name: "accommodations",
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
          <Activity size={20} />
        </div>
        <div>
          <h2 className="text-lg font-black uppercase tracking-wide text-slate-800">Linked Experiences</h2>
          <p className="text-xs text-slate-500 font-medium">Map activities and accommodations</p>
        </div>
      </div>

      {/* Included Activities */}
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Activity size={16} className="text-indigo-500" /> Included Activities
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">Activities part of this package</p>
          </div>
          <button
            type="button"
            onClick={() => appendActivity({ id: "", priceRangeForPackage: { min: 0, max: 0 } })}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg hover:bg-indigo-200 transition-colors"
          >
            <Plus size={14} /> Add Activity
          </button>
        </div>

        {errors.activities?.message && (
          <p className="text-red-500 text-xs font-semibold">{String(errors.activities.message)}</p>
        )}

        <div className="space-y-3">
          {activityFields.map((field, idx) => {
            const activitiesErrors = errors.activities as any;
            const rowErrors = activitiesErrors?.[idx];
            return (
              <div
                key={field.id}
                className="flex flex-wrap md:flex-nowrap items-center gap-3 p-4 border border-slate-200 rounded-xl bg-white"
              >
                <div className="flex-1 min-w-[200px]">
                  <select
                    {...register(`activities.${idx}.id` as const)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-indigo-500 text-gray-800 bg-white"
                  >
                    <option value="">Select Activity...</option>
                    {activities.map((a: any) => (
                      <option key={a._id} value={a._id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                  {rowErrors?.id?.message && (
                    <p className="text-red-500 text-xs font-semibold mt-1">
                      {String(rowErrors.id.message)}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="space-y-1">
                    <input
                      type="number"
                      placeholder="Min Cost"
                      {...register(`activities.${idx}.priceRangeForPackage.min` as const, {
                        valueAsNumber: true,
                      })}
                      className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-gray-800"
                    />
                    {rowErrors?.priceRangeForPackage?.min?.message && (
                      <p className="text-red-500 text-[10px] font-semibold">
                        {String(rowErrors.priceRangeForPackage.min.message)}
                      </p>
                    )}
                  </div>
                  <span className="text-slate-400">-</span>
                  <div className="space-y-1">
                    <input
                      type="number"
                      placeholder="Max Cost"
                      {...register(`activities.${idx}.priceRangeForPackage.max` as const, {
                        valueAsNumber: true,
                      })}
                      className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-gray-800"
                    />
                    {rowErrors?.priceRangeForPackage?.max?.message && (
                      <p className="text-red-500 text-[10px] font-semibold">
                        {String(rowErrors.priceRangeForPackage.max.message)}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeActivity(idx)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-slate-100"></div>

      {/* Accommodations */}
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Home size={16} className="text-rose-500" /> Accommodations
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">Hotels/Stays included in package</p>
          </div>
          <button
            type="button"
            onClick={() => appendAccommodation({ stayId: "", priceRangeForPackage: { min: 0, max: 0 } })}
            className="flex items-center gap-1 px-3 py-1.5 bg-rose-100 text-rose-700 text-xs font-bold rounded-lg hover:bg-rose-200 transition-colors"
          >
            <Plus size={14} /> Add Stay
          </button>
        </div>

        {errors.accommodations?.message && (
          <p className="text-red-500 text-xs font-semibold">{String(errors.accommodations.message)}</p>
        )}

        <div className="space-y-3">
          {accommodationFields.map((field, idx) => {
            const accommodationsErrors = errors.accommodations as any;
            const rowErrors = accommodationsErrors?.[idx];
            return (
              <div
                key={field.id}
                className="flex flex-wrap md:flex-nowrap items-center gap-3 p-4 border border-slate-200 rounded-xl bg-white"
              >
                <div className="flex-1 min-w-[200px]">
                  <select
                    {...register(`accommodations.${idx}.stayId` as const)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-rose-500 text-gray-800 bg-white"
                  >
                    <option value="">Select Accommodation...</option>
                    {accommodationsList.map((a: any) => (
                      <option key={a._id} value={a._id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                  {rowErrors?.stayId?.message && (
                    <p className="text-red-500 text-xs font-semibold mt-1">
                      {String(rowErrors.stayId.message)}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="space-y-1">
                    <input
                      type="number"
                      placeholder="Min Cost"
                      {...register(`accommodations.${idx}.priceRangeForPackage.min` as const, {
                        valueAsNumber: true,
                      })}
                      className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-gray-800"
                    />
                    {rowErrors?.priceRangeForPackage?.min?.message && (
                      <p className="text-red-500 text-[10px] font-semibold">
                        {String(rowErrors.priceRangeForPackage.min.message)}
                      </p>
                    )}
                  </div>
                  <span className="text-slate-400">-</span>
                  <div className="space-y-1">
                    <input
                      type="number"
                      placeholder="Max Cost"
                      {...register(`accommodations.${idx}.priceRangeForPackage.max` as const, {
                        valueAsNumber: true,
                      })}
                      className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-gray-800"
                    />
                    {rowErrors?.priceRangeForPackage?.max?.message && (
                      <p className="text-red-500 text-[10px] font-semibold">
                        {String(rowErrors.priceRangeForPackage.max.message)}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeAccommodation(idx)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
