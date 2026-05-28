"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { ActivityInput, TIME_SLOT_OPTIONS } from "@/lib/validation/activity.validation";
import { ChevronDown } from "lucide-react";

export default function TimingSection() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ActivityInput>();

  const timeSlots = watch("timeSlotPreference") || [];

  const toggleTimeSlot = (value: string) => {
    const next = (timeSlots as string[]).includes(value)
      ? (timeSlots as string[]).filter((t) => t !== value)
      : [...timeSlots, value];
    setValue("timeSlotPreference", next, { shouldValidate: true });
  };

  return (
    <div className="space-y-4">
      {/* Opening, Closing & Duration */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5 text-left">
          <label className="text-sm font-semibold text-gray-700">Opening Time</label>
          <input
            type="text"
            {...register("timing.openingTime")}
            placeholder="e.g. 09:00 AM"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800 placeholder:text-gray-300"
          />
          {errors.timing?.openingTime?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">
              {String(errors.timing.openingTime.message)}
            </p>
          )}
        </div>

        <div className="space-y-1.5 text-left">
          <label className="text-sm font-semibold text-gray-700">Closing Time</label>
          <input
            type="text"
            {...register("timing.closingTime")}
            placeholder="e.g. 05:30 PM"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800 placeholder:text-gray-300"
          />
          {errors.timing?.closingTime?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">
              {String(errors.timing.closingTime.message)}
            </p>
          )}
        </div>

        <div className="space-y-1.5 text-left">
          <label className="text-sm font-semibold text-gray-700">Duration (mins)</label>
          <input
            type="number"
            {...register("timing.duration", { valueAsNumber: true })}
            placeholder="e.g. 120"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800"
          />
          {errors.timing?.duration?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">
              {String(errors.timing.duration.message)}
            </p>
          )}
        </div>
      </div>

      {/* Best Time to Visit */}
      <div className="space-y-1.5 text-left">
        <label className="text-sm font-semibold text-gray-700">Best Time to Visit</label>
        <input
          type="text"
          {...register("bestTimeToVisit")}
          placeholder="e.g. September to March / Early Morning"
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800 placeholder:text-gray-300"
        />
        {errors.bestTimeToVisit?.message && (
          <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.bestTimeToVisit.message)}</p>
        )}
      </div>

      {/* Time Slot Preference */}
      <div className="space-y-2 text-left bg-amber-50/50 p-4 border border-amber-100 rounded-2xl">
        <label className="text-xs font-bold uppercase tracking-wider text-amber-800">Time Slot Preferences</label>
        <div className="flex flex-wrap gap-1.5 p-3 bg-white border border-amber-100 rounded-xl max-h-40 overflow-y-auto">
          {TIME_SLOT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleTimeSlot(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all duration-300 ${
                (timeSlots as string[]).includes(opt.value)
                  ? "bg-amber-900 text-white border-amber-900 shadow-sm"
                  : "bg-amber-50/50 text-amber-400 border-amber-100/50 hover:bg-amber-100/80"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {errors.timeSlotPreference?.message && (
          <p className="text-red-500 text-xs font-semibold mt-1">
            {String(errors.timeSlotPreference.message)}
          </p>
        )}
      </div>

      {/* Difficulty Level & Age Limits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Difficulty Level */}
        <div className="space-y-1.5 text-left">
          <label className="text-sm font-semibold text-gray-700">Difficulty Level</label>
          <div className="relative">
            <select
              {...register("difficultyLevel")}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm appearance-none bg-white font-medium text-gray-800"
            >
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="hard">Hard</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronDown size={16} />
            </div>
          </div>
          {errors.difficultyLevel?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">
              {String(errors.difficultyLevel.message)}
            </p>
          )}
        </div>

        {/* Age Limits */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5 text-left">
            <label className="text-sm font-semibold text-gray-700">Min Age</label>
            <input
              type="number"
              {...register("ageLimit.min", { valueAsNumber: true })}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800"
            />
            {errors.ageLimit?.min?.message && (
              <p className="text-red-500 text-xs font-semibold mt-1">
                {String(errors.ageLimit.min.message)}
              </p>
            )}
          </div>
          <div className="space-y-1.5 text-left">
            <label className="text-sm font-semibold text-gray-700">Max Age</label>
            <input
              type="number"
              {...register("ageLimit.max", { valueAsNumber: true })}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800"
            />
            {errors.ageLimit?.max?.message && (
              <p className="text-red-500 text-xs font-semibold mt-1">
                {String(errors.ageLimit.max.message)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
