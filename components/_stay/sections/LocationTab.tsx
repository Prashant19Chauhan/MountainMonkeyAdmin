"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Info, Plus, Trash2 } from "lucide-react";

export default function LocationTab() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "connectivity.popularPlaces",
  });

  const locationErrors = errors.location as any;
  const connectivityErrors = errors.connectivity as any;

  return (
    <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Full Address */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-slate-700">Full Address</label>
        <input
          type="text"
          {...register("location.address")}
          placeholder="Street, Landmark, City..."
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800"
        />
        {locationErrors?.address?.message && (
          <p className="text-red-500 text-xs font-semibold mt-1">
            {String(locationErrors.address.message)}
          </p>
        )}
      </div>

      {/* Lat/Lng/Altitude */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-700">Latitude</label>
          <input
            type="number"
            step="any"
            {...register("location.coordinates.lat", { valueAsNumber: true })}
            placeholder="0"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800"
          />
          {locationErrors?.coordinates?.lat?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">
              {String(locationErrors.coordinates.lat.message)}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-700">Longitude</label>
          <input
            type="number"
            step="any"
            {...register("location.coordinates.lng", { valueAsNumber: true })}
            placeholder="0"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800"
          />
          {locationErrors?.coordinates?.lng?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">
              {String(locationErrors.coordinates.lng.message)}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-700">Altitude (m)</label>
          <input
            type="number"
            {...register("location.altitude", { valueAsNumber: true })}
            placeholder="0"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800"
          />
          {locationErrors?.altitude?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">
              {String(locationErrors.altitude.message)}
            </p>
          )}
        </div>
      </div>

      {/* Connectivity Details Container */}
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl space-y-4">
        <h3 className="text-xs font-black text-blue-900 uppercase tracking-widest flex items-center gap-2">
          <Info size={14} /> Connectivity Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Airport</label>
            <input
              type="text"
              {...register("connectivity.nearestAirport")}
              placeholder="e.g. IGI Airport"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 outline-none"
            />
            {connectivityErrors?.nearestAirport?.message && (
              <p className="text-red-500 text-[10px] font-semibold mt-1">
                {String(connectivityErrors.nearestAirport.message)}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Railway</label>
            <input
              type="text"
              {...register("connectivity.nearestRailway")}
              placeholder="e.g. New Delhi Station"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 outline-none"
            />
            {connectivityErrors?.nearestRailway?.message && (
              <p className="text-red-500 text-[10px] font-semibold mt-1">
                {String(connectivityErrors.nearestRailway.message)}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Bus Stop</label>
            <input
              type="text"
              {...register("connectivity.nearestBusStop")}
              placeholder="e.g. ISBT"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 outline-none"
            />
            {connectivityErrors?.nearestBusStop?.message && (
              <p className="text-red-500 text-[10px] font-semibold mt-1">
                {String(connectivityErrors.nearestBusStop.message)}
              </p>
            )}
          </div>
        </div>

        {/* Popular Nearby Places */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center">
            <h4 className="text-[10px] font-black text-blue-800 uppercase tracking-widest">
              Popular Nearby Places
            </h4>
            <button
              type="button"
              onClick={() => append({ name: "", distance: 0 })}
              className="text-[9px] font-black bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 transition-all flex items-center gap-1"
            >
              <Plus size={12} /> ADD
            </button>
          </div>

          <div className="space-y-2">
            {fields.map((field, idx) => {
              const popularPlacesErrors = errors.connectivity as any;
              const rowErrors = popularPlacesErrors?.popularPlaces?.[idx];
              return (
                <div key={field.id} className="grid grid-cols-[1fr_120px_auto] gap-2 items-end">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-blue-800">Place Name</label>
                    <input
                      type="text"
                      {...register(`connectivity.popularPlaces.${idx}.name` as const)}
                      placeholder="e.g. India Gate"
                      className="w-full bg-white rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-gray-800 outline-none"
                    />
                    {rowErrors?.name?.message && (
                      <p className="text-red-500 text-[10px] font-semibold mt-1">
                        {String(rowErrors.name.message)}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-blue-800">Distance (km)</label>
                    <input
                      type="number"
                      step="0.1"
                      {...register(`connectivity.popularPlaces.${idx}.distance` as const, {
                        valueAsNumber: true,
                      })}
                      placeholder="0"
                      className="w-full bg-white rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-gray-800 outline-none"
                    />
                    {rowErrors?.distance?.message && (
                      <p className="text-red-500 text-[10px] font-semibold mt-1">
                        {String(rowErrors.distance.message)}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="mb-2 text-red-500 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
