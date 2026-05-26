"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { MapPin, ChevronRight, Mountain, Compass } from "lucide-react";
import { CityInput } from "@/lib/validation/city.validation";

const FieldHeader = ({ title, subtitle, icon }: { title: string; subtitle: string; icon: React.ReactNode }) => (
  <div className="mb-10 flex items-start gap-6">
    <div className="w-14 h-14 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-900 border border-slate-100 shadow-sm">
      {icon}
    </div>
    <div>
      <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{title}</h3>
      <p className="text-slate-400 text-sm font-medium mt-1 italic">{subtitle}</p>
    </div>
  </div>
);

const FormLabel = ({ children, required, hint }: { children: React.ReactNode; required?: boolean; hint?: string }) => (
  <div className="flex justify-between items-center mb-2.5">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
      {children} {required && <span className="text-rose-500">*</span>}
    </label>
    {hint && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{hint}</span>}
  </div>
);

const InputStyle = "w-full p-4 bg-slate-50/50 border border-slate-200 rounded-[1.25rem] text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-400 focus:bg-white transition-all placeholder:text-slate-400";

interface LocationSectionProps {
  citiesData: any;
  isCitiesLoading: boolean;
}

export default function LocationSection({ citiesData, isCitiesLoading }: LocationSectionProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const locationErrors = errors.location as any;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <FieldHeader
        title="Spatial Geography"
        icon={<MapPin size={24} />}
        subtitle="Map the precise coordinates and administrative region for global navigation."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Regional Hub / City */}
        <div className="col-span-1">
          <FormLabel required>Regional Hub / City</FormLabel>
          <div className="relative">
            <select
              {...register("mainCity")}
              className={`${InputStyle} appearance-none bg-slate-50/50`}
            >
              <option value="">Select major region...</option>
              {isCitiesLoading && <option>Loading archival data...</option>}
              {citiesData?.data?.map((city: CityInput) => (
                <option key={city._id} value={city._id}>
                  {city.name}
                </option>
              ))}
            </select>
            <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
          </div>
          {errors.mainCity?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.mainCity.message)}</p>
          )}
        </div>

        {/* Regional Archive Code (Pin) */}
        <div className="col-span-1">
          <FormLabel>Regional Archive Code (Pin)</FormLabel>
          <input
            type="text"
            placeholder="e.g. 175131"
            className={InputStyle}
            {...register("location.pinCode")}
          />
          {locationErrors?.pinCode?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">{String(locationErrors.pinCode.message)}</p>
          )}
        </div>

        {/* Full Spatial Address */}
        <div className="col-span-2">
          <FormLabel hint="Landmark level precision">Full Spatial Address</FormLabel>
          <input
            type="text"
            className={InputStyle}
            placeholder="Specific street address or landmark identifier..."
            {...register("location.address")}
          />
          {locationErrors?.address?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">{String(locationErrors.address.message)}</p>
          )}
        </div>

        {/* GPS Intelligence Panel */}
        <div className="col-span-2 p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
          <Mountain className="absolute -right-6 -bottom-6 opacity-10" size={120} />
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500 rounded-xl">
              <Compass size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">GPS Intelligence</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Latitude */}
            <div className="space-y-2">
              <FormLabel hint="WGS84">Latitude</FormLabel>
              <input
                type="number"
                step="any"
                className="w-full bg-white/5 border border-white/10 rounded-[1rem] p-3.5 text-sm font-black outline-none focus:bg-white/10 transition-all text-white"
                {...register("location.coordinates.lat", { valueAsNumber: true })}
              />
              {locationErrors?.coordinates?.lat?.message && (
                <p className="text-red-400 text-[10px] font-semibold mt-1">
                  {String(locationErrors.coordinates.lat.message)}
                </p>
              )}
            </div>

            {/* Longitude */}
            <div className="space-y-2">
              <FormLabel hint="WGS84">Longitude</FormLabel>
              <input
                type="number"
                step="any"
                className="w-full bg-white/5 border border-white/10 rounded-[1rem] p-3.5 text-sm font-black outline-none focus:bg-white/10 transition-all text-white"
                {...register("location.coordinates.lng", { valueAsNumber: true })}
              />
              {locationErrors?.coordinates?.lng?.message && (
                <p className="text-red-400 text-[10px] font-semibold mt-1">
                  {String(locationErrors.coordinates.lng.message)}
                </p>
              )}
            </div>

            {/* Altitude */}
            <div className="space-y-2">
              <FormLabel hint="MSL (m)">Altitude</FormLabel>
              <input
                type="number"
                className="w-full bg-white/5 border border-white/10 rounded-[1rem] p-3.5 text-sm font-black outline-none focus:bg-white/10 transition-all text-white"
                {...register("location.altitude", { valueAsNumber: true })}
              />
              {locationErrors?.altitude?.message && (
                <p className="text-red-400 text-[10px] font-semibold mt-1">
                  {String(locationErrors.altitude.message)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
