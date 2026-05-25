"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { 
  Navigation, Info, Zap, DollarSign, Clock, Bus, Train, Car, Footprints, 
  MapPin, Target, ChevronLeft, ArrowRight 
} from "lucide-react";

interface StepEditorSectionProps {
  stepIndex: number;
  cities: any[];
}

export default function StepEditorSection({ stepIndex, cities }: StepEditorSectionProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const StepRoutes = watch("StepRoutes") || [];
  const step = StepRoutes[stepIndex];
  if (!step) return null;

  const stepRoutesErrors = errors.StepRoutes as any;
  const rowErrors = stepRoutesErrors?.[stepIndex];
  const isDestinationReached = watch(`StepRoutes.${stepIndex}.isDestinationReached`) || false;
  const mode = watch(`StepRoutes.${stepIndex}.travelDetails.mode`) || "Bus";
  const difficulty = watch(`StepRoutes.${stepIndex}.travelDetails.difficultyInTravelling`) || "Easy";
  const parentStepId = watch(`StepRoutes.${stepIndex}._parentStepId`) || "";

  return (
    <div className="bg-white rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-900/5 overflow-hidden text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Step Header */}
      <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <span className="text-lg font-black">{stepIndex + 1}</span>
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-wide">Configure Step {stepIndex + 1}</h3>
              <p className="text-xs opacity-70 font-medium mt-0.5">Define route segment details</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setValue(`StepRoutes.${stepIndex}.isDestinationReached`, !isDestinationReached, { shouldValidate: true })}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              isDestinationReached
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600"
                : "bg-white/10 text-white/60 border border-white/20 hover:bg-white/20 hover:text-white"
            }`}
          >
            {isDestinationReached ? "✓ Destination" : "Waypoint"}
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="p-6 md:p-8 space-y-8">
        {/* Route Branching */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 ml-1 flex items-center gap-2">
            <Navigation size={14} className="text-blue-500" />
            Route Connection (Optional)
          </label>
          <select
            value={parentStepId}
            onChange={(e) => setValue(`StepRoutes.${stepIndex}._parentStepId`, e.target.value, { shouldValidate: true })}
            className="w-full px-5 py-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-sm font-semibold appearance-none cursor-pointer text-gray-800"
          >
            <option value="">Start from main origin (independent path)</option>
            {StepRoutes.map((s: any, idx: number) => {
              if (idx === stepIndex) return null;
              return (
                <option key={s.stepId || idx} value={s.stepId}>
                  Continue from Step {idx + 1}: {s.from?.name || "?"} → {s.to?.name || "?"}
                </option>
              );
            })}
          </select>
          <p className="text-xs text-blue-600 ml-1 font-medium flex items-start gap-2">
            <Info size={14} className="mt-0.5 flex-shrink-0" />
            <span>Link this step to a previous step to create multi-path routes with branches</span>
          </p>
        </div>

        {/* Location Endpoints */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* From Location */}
          <div className="space-y-4 bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 rounded-2xl border-2 border-slate-200">
            <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-2 text-emerald-500">
              <MapPin size={16} /> From Location
            </h4>
            <div className="space-y-3">
              <input
                type="text"
                {...register(`StepRoutes.${stepIndex}.from.name` as const)}
                placeholder="Location name (e.g., Rishikesh Bus Terminal)"
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-semibold text-gray-800"
              />
              {rowErrors?.from?.name?.message && (
                <p className="text-red-500 text-xs font-semibold">{String(rowErrors.from.name.message)}</p>
              )}

              <input
                type="text"
                {...register(`StepRoutes.${stepIndex}.from.location.address` as const)}
                placeholder="Full address (optional)"
                className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-xs font-medium text-gray-800"
              />

              <select
                {...register(`StepRoutes.${stepIndex}.from.location.mainCity` as const)}
                className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-xs font-medium text-gray-800 cursor-pointer"
              >
                <option value="">Nearby city (optional)</option>
                {cities.map((city: any) => (
                  <option key={city._id} value={city._id}>
                    {city.name}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  step="any"
                  {...register(`StepRoutes.${stepIndex}.from.location.coordinates.latitude` as const, { valueAsNumber: true })}
                  placeholder="Latitude"
                  className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-xs font-medium text-gray-800"
                />
                <input
                  type="number"
                  step="any"
                  {...register(`StepRoutes.${stepIndex}.from.location.coordinates.longitude` as const, { valueAsNumber: true })}
                  placeholder="Longitude"
                  className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-xs font-medium text-gray-800"
                />
              </div>
            </div>
          </div>

          {/* To Location */}
          <div className="space-y-4 bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 rounded-2xl border-2 border-slate-200">
            <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-2 text-rose-500">
              <Target size={16} /> To Location
            </h4>
            <div className="space-y-3">
              <input
                type="text"
                {...register(`StepRoutes.${stepIndex}.to.name` as const)}
                placeholder="Location name (e.g., Rishikesh Bus Terminal)"
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-semibold text-gray-800"
              />
              {rowErrors?.to?.name?.message && (
                <p className="text-red-500 text-xs font-semibold">{String(rowErrors.to.name.message)}</p>
              )}

              <input
                type="text"
                {...register(`StepRoutes.${stepIndex}.to.location.address` as const)}
                placeholder="Full address (optional)"
                className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-xs font-medium text-gray-800"
              />

              <select
                {...register(`StepRoutes.${stepIndex}.to.location.mainCity` as const)}
                className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-xs font-medium text-gray-800 cursor-pointer"
              >
                <option value="">Nearby city (optional)</option>
                {cities.map((city: any) => (
                  <option key={city._id} value={city._id}>
                    {city.name}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  step="any"
                  {...register(`StepRoutes.${stepIndex}.to.location.coordinates.latitude` as const, { valueAsNumber: true })}
                  placeholder="Latitude"
                  className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-xs font-medium text-gray-800"
                />
                <input
                  type="number"
                  step="any"
                  {...register(`StepRoutes.${stepIndex}.to.location.coordinates.longitude` as const, { valueAsNumber: true })}
                  placeholder="Longitude"
                  className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-xs font-medium text-gray-800"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

        {/* Travel Details */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Zap size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wide text-slate-800">Travel Logistics</h3>
              <p className="text-xs text-slate-500 font-medium">Cost, time, and transport details</p>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Min Cost */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 ml-1 text-slate-500">
                <DollarSign size={14} />
                <label className="text-[10px] font-bold uppercase tracking-wider">Min Cost (₹)</label>
              </div>
              <input
                type="number"
                {...register(`StepRoutes.${stepIndex}.travelDetails.minCost` as const, { valueAsNumber: true })}
                placeholder="0"
                className="w-full px-4 py-3 bg-slate-50/80 border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-sm font-bold text-gray-800"
              />
              {rowErrors?.travelDetails?.minCost?.message && (
                <p className="text-red-500 text-[10px] font-semibold">{String(rowErrors.travelDetails.minCost.message)}</p>
              )}
            </div>

            {/* Max Cost */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 ml-1 text-slate-500">
                <DollarSign size={14} />
                <label className="text-[10px] font-bold uppercase tracking-wider">Max Cost (₹)</label>
              </div>
              <input
                type="number"
                {...register(`StepRoutes.${stepIndex}.travelDetails.maxCost` as const, { valueAsNumber: true })}
                placeholder="0"
                className="w-full px-4 py-3 bg-slate-50/80 border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-sm font-bold text-gray-800"
              />
              {rowErrors?.travelDetails?.maxCost?.message && (
                <p className="text-red-500 text-[10px] font-semibold">{String(rowErrors.travelDetails.maxCost.message)}</p>
              )}
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 ml-1 text-slate-500">
                <Clock size={14} />
                <label className="text-[10px] font-bold uppercase tracking-wider">Duration (min)</label>
              </div>
              <input
                type="number"
                {...register(`StepRoutes.${stepIndex}.travelDetails.duration` as const, { valueAsNumber: true })}
                placeholder="0"
                className="w-full px-4 py-3 bg-slate-50/80 border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-sm font-bold text-gray-800"
              />
              {rowErrors?.travelDetails?.duration?.message && (
                <p className="text-red-500 text-[10px] font-semibold">{String(rowErrors.travelDetails.duration.message)}</p>
              )}
            </div>

            {/* Distance */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 ml-1 text-slate-500">
                <Navigation size={14} />
                <label className="text-[10px] font-bold uppercase tracking-wider">Distance (km)</label>
              </div>
              <input
                type="number"
                {...register(`StepRoutes.${stepIndex}.travelDetails.distance` as const, { valueAsNumber: true })}
                placeholder="0"
                className="w-full px-4 py-3 bg-slate-50/80 border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-sm font-bold text-gray-800"
              />
              {rowErrors?.travelDetails?.distance?.message && (
                <p className="text-red-500 text-[10px] font-semibold">{String(rowErrors.travelDetails.distance.message)}</p>
              )}
            </div>
          </div>

          {rowErrors?.travelDetails?.message && (
            <p className="text-red-500 text-xs font-semibold">{String(rowErrors.travelDetails.message)}</p>
          )}

          {/* Provider */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 ml-1">Provider/Operator</label>
            <input
              type="text"
              {...register(`StepRoutes.${stepIndex}.travelDetails.provider` as const)}
              placeholder="e.g., HRTC, Indian Railways, Uber"
              className="w-full px-5 py-3 bg-slate-50/80 border-2 border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-sm font-semibold text-gray-800"
            />
            {rowErrors?.travelDetails?.provider?.message && (
              <p className="text-red-500 text-xs font-semibold">{String(rowErrors.travelDetails.provider.message)}</p>
            )}
          </div>

          {/* Transport Mode Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 ml-1">Transport Mode</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { m: "Bus", icon: <Bus size={18} /> },
                { m: "Train", icon: <Train size={18} /> },
                { m: "Car", icon: <Car size={18} /> },
                { m: "Walk", icon: <Footprints size={18} /> },
                { m: "Flight", icon: <Navigation size={18} /> },
              ].map(({ m, icon }) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setValue(`StepRoutes.${stepIndex}.travelDetails.mode`, m, { shouldValidate: true })}
                  className={`group flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 ${
                    mode === m
                      ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-900 shadow-lg shadow-slate-900/20"
                      : "bg-white text-slate-400 border-slate-200 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  <span className="transition-transform duration-200 group-hover:scale-105">{icon}</span>
                  <span className="text-xs font-black uppercase tracking-wide">{m}</span>
                </button>
              ))}
            </div>
            {rowErrors?.travelDetails?.mode?.message && (
              <p className="text-red-500 text-xs font-semibold">{String(rowErrors.travelDetails.mode.message)}</p>
            )}
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 ml-1">Travel Difficulty</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {["Easy", "Moderate", "Challenging", "Extreme"].map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() =>
                    setValue(`StepRoutes.${stepIndex}.travelDetails.difficultyInTravelling`, diff, {
                      shouldValidate: true,
                    })
                  }
                  className={`px-5 py-3 rounded-xl border-2 transition-all duration-200 ${
                    difficulty === diff
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-lg shadow-blue-600/20"
                      : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <span className="text-xs font-black uppercase tracking-wide">{diff}</span>
                </button>
              ))}
            </div>
            {rowErrors?.travelDetails?.difficultyInTravelling?.message && (
              <p className="text-red-500 text-xs font-semibold">
                {String(rowErrors.travelDetails.difficultyInTravelling.message)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
