"use client";

import React, { useState, useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Calendar, Navigation, Utensils, Plus, Trash2 } from "lucide-react";

export default function ItineraryLogisticsTab() {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const durationErrors = errors.duration as any;
  const transportErrors = errors.transport as any;
  const mealsErrors = errors.meals as any;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "itinerary",
  });

  const days = watch("duration.days") || 1;
  const nights = watch("duration.nights") || 0;
  const isTransportIncluded = watch("transport.included") || false;
  const isMealsIncluded = watch("meals.included") || false;

  const transportModes: string[] = watch("transport.modes") || [];
  const mealsPlan: string[] = watch("meals.plan") || [];

  const [modesText, setModesText] = useState("");
  const [mealsText, setMealsText] = useState("");

  // Auto-update nights when days changes
  useEffect(() => {
    if (days) {
      setValue("duration.nights", Math.max(0, days - 1), { shouldValidate: true });
    }
  }, [days, setValue]);

  // Sync initial string arrays
  useEffect(() => {
    if (transportModes.length > 0 && !modesText) {
      setModesText(transportModes.join(", "));
    }
  }, [transportModes]);

  useEffect(() => {
    if (mealsPlan.length > 0 && !mealsText) {
      setMealsText(mealsPlan.join(", "));
    }
  }, [mealsPlan]);

  const handleModesBlur = () => {
    const arr = modesText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setValue("transport.modes", arr, { shouldValidate: true });
  };

  const handleMealsBlur = () => {
    const arr = mealsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setValue("meals.plan", arr, { shouldValidate: true });
  };

  const addDay = () => {
    append({ day: fields.length + 1, title: "", description: "" });
  };

  const removeDay = (idx: number) => {
    remove(idx);
    // Re-index days after removal
    const currentItinerary = watch("itinerary") || [];
    currentItinerary.forEach((item: any, i: number) => {
      item.day = i + 1;
    });
    setValue("itinerary", currentItinerary, { shouldValidate: true });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
          <Calendar size={20} />
        </div>
        <div>
          <h2 className="text-lg font-black uppercase tracking-wide text-slate-800">Itinerary & Logistics</h2>
          <p className="text-xs text-slate-500 font-medium">Day-by-day plan and travel modes</p>
        </div>
      </div>

      {/* Duration (Days/Nights) */}
      <div className="grid grid-cols-2 gap-5 p-5 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 ml-1">Days</label>
          <input
            type="number"
            min="1"
            {...register("duration.days", { valueAsNumber: true })}
            className="w-full px-5 py-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-bold text-gray-800"
          />
          {durationErrors?.days?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">
              {String(durationErrors.days.message)}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 ml-1">Nights</label>
          <input
            type="number"
            min="0"
            disabled
            value={nights}
            className="w-full px-5 py-3 bg-slate-100 text-slate-500 border-2 border-slate-200 rounded-xl outline-none text-sm font-bold cursor-not-allowed"
          />
          <p className="text-[10px] text-slate-400 font-medium ml-1">Auto-calculated (Days - 1)</p>
          {durationErrors?.nights?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">
              {String(durationErrors.nights.message)}
            </p>
          )}
        </div>
      </div>

      {/* Transport & Meals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transport */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-2">
            <Navigation size={14} className="text-blue-500" /> Transport
          </h3>
          <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              {...register("transport.included")}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-600"
            />
            <span className="text-sm font-semibold text-slate-700 select-none">Transport Included</span>
          </label>

          {isTransportIncluded && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-500">
                Modes (comma separated) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={modesText}
                onChange={(e) => setModesText(e.target.value)}
                onBlur={handleModesBlur}
                placeholder="Flight, Private Car, Bus..."
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-gray-800"
              />
              {transportErrors?.modes?.message && (
                <p className="text-red-500 text-xs font-semibold mt-1">
                  {String(transportErrors.modes.message)}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Meals */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-2">
            <Utensils size={14} className="text-orange-500" /> Meals
          </h3>
          <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              {...register("meals.included")}
              className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-600"
            />
            <span className="text-sm font-semibold text-slate-700 select-none">Meals Included</span>
          </label>

          {isMealsIncluded && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-500">Meal Plan (comma separated)</label>
              <input
                type="text"
                value={mealsText}
                onChange={(e) => setMealsText(e.target.value)}
                onBlur={handleMealsBlur}
                placeholder="Breakfast, Dinner..."
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-gray-800"
              />
              {mealsErrors?.plan?.message && (
                <p className="text-red-500 text-xs font-semibold mt-1">
                  {String(mealsErrors.plan.message)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-slate-100"></div>

      {/* Itinerary Dynamic Fields */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
            Day-by-Day Itinerary <span className="text-red-500">*</span>
          </h3>
          <button
            type="button"
            onClick={addDay}
            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg hover:bg-emerald-100 transition-colors"
          >
            <Plus size={14} /> Add Day
          </button>
        </div>

        {errors.itinerary?.message && (
          <p className="text-red-500 text-xs font-semibold">{String(errors.itinerary.message)}</p>
        )}

        <div className="space-y-4">
          {fields.length === 0 ? (
            <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-sm font-medium">
              No itinerary days added yet. Click "Add Day".
            </div>
          ) : (
            fields.map((field, idx) => {
              const itineraryErrors = errors.itinerary as any;
              const rowErrors = itineraryErrors?.[idx];
              return (
                <div
                  key={field.id}
                  className="p-5 border-2 border-slate-200 rounded-2xl bg-white space-y-4 relative group"
                >
                  <button
                    type="button"
                    onClick={() => removeDay(idx)}
                    className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-black flex items-center justify-center text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder={`Day ${idx + 1} Title`}
                        {...register(`itinerary.${idx}.title` as const)}
                        className="w-full px-4 py-2 border-b-2 border-transparent hover:border-slate-200 focus:border-emerald-500 outline-none text-base font-bold bg-transparent transition-colors text-gray-800"
                      />
                      {rowErrors?.title?.message && (
                        <p className="text-red-500 text-xs font-semibold mt-1">
                          {String(rowErrors.title.message)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <textarea
                      rows={2}
                      placeholder="Describe the day's activities..."
                      {...register(`itinerary.${idx}.description` as const)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm text-gray-800"
                    />
                    {rowErrors?.description?.message && (
                      <p className="text-red-500 text-xs font-semibold mt-1">
                        {String(rowErrors.description.message)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
