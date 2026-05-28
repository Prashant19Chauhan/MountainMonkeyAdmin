"use client";

import React, { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { DollarSign, CheckCircle, Plus, Trash2 } from "lucide-react";

export default function PricingLimitsTab() {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const pricingErrors = errors.pricing as any;
  const availabilityErrors = errors.availability as any;

  const {
    fields: inclusionFields,
    append: appendInclusion,
    remove: removeInclusion,
  } = useFieldArray({
    control,
    name: "inclusions",
  });

  const {
    fields: exclusionFields,
    append: appendExclusion,
    remove: removeExclusion,
  } = useFieldArray({
    control,
    name: "exclusions",
  });

  const [incInput, setIncInput] = useState("");
  const [excInput, setExcInput] = useState("");

  const addInclusion = () => {
    if (!incInput.trim()) return;
    appendInclusion(incInput.trim());
    setIncInput("");
  };

  const addExclusion = () => {
    if (!excInput.trim()) return;
    appendExclusion(excInput.trim());
    setExcInput("");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
          <DollarSign size={20} />
        </div>
        <div>
          <h2 className="text-lg font-black uppercase tracking-wide text-slate-800">Pricing & Limits</h2>
          <p className="text-xs text-slate-500 font-medium">Financial details and availability</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
        {/* Pricing Setup */}
        <div className="space-y-6 bg-slate-50 p-6 rounded-3xl border border-slate-200">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200/60 pb-3">
            Pricing Configuration
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Base Price</label>
              <input
                type="number"
                min="0"
                {...register("pricing.basePrice", { valueAsNumber: true })}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-500 text-sm font-bold text-gray-800"
              />
              {pricingErrors?.basePrice?.message && (
                <p className="text-red-500 text-[10px] font-semibold mt-1">
                  {String(pricingErrors.basePrice.message)}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">
                Discounted Price (Optional)
              </label>
              <input
                type="number"
                min="0"
                {...register("pricing.discountedPrice", { valueAsNumber: true })}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-500 text-sm font-bold text-amber-600"
              />
              {pricingErrors?.discountedPrice?.message && (
                <p className="text-red-500 text-[10px] font-semibold mt-1">
                  {String(pricingErrors.discountedPrice.message)}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Currency</label>
              <select
                {...register("pricing.currency")}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none font-bold text-gray-800"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div className="flex gap-4 sm:pt-4 pl-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register("pricing.perPerson")}
                  className="w-4 h-4 rounded text-amber-600 border-slate-300 focus:ring-amber-600"
                />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">Per Person</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register("pricing.taxesIncluded")}
                  className="w-4 h-4 rounded text-amber-600 border-slate-300 focus:ring-amber-600"
                />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">Taxes Inc.</span>
              </label>
            </div>
          </div>
          {pricingErrors?.message && (
            <p className="text-red-500 text-xs font-semibold">{String(pricingErrors.message)}</p>
          )}
        </div>

        {/* Availability Settings */}
        <div className="space-y-6 bg-slate-50 p-6 rounded-3xl border border-slate-200">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200/60 pb-3">
            Availability & Capacity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Start Date</label>
              <input
                type="date"
                {...register("availability.startDate")}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-500 text-sm font-bold text-gray-800"
              />
              {availabilityErrors?.startDate?.message && (
                <p className="text-red-500 text-[10px] font-semibold mt-1">
                  {String(availabilityErrors.startDate.message)}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">End Date</label>
              <input
                type="date"
                {...register("availability.endDate")}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-500 text-sm font-bold text-gray-800"
              />
              {availabilityErrors?.endDate?.message && (
                <p className="text-red-500 text-[10px] font-semibold mt-1">
                  {String(availabilityErrors.endDate.message)}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Max Seats Capacity</label>
              <input
                type="number"
                {...register("availability.maxSeats", { valueAsNumber: true })}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-gray-800"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Available Seats</label>
              <input
                type="number"
                {...register("availability.availableSeats", { valueAsNumber: true })}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-gray-800"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Inclusions & Exclusions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
        {/* Inclusions */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
          <label className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-500" /> Package Inclusions <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={incInput}
              onChange={(e) => setIncInput(e.target.value)}
              placeholder="e.g. Premium hotel stay for 3 nights"
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-gray-800 bg-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addInclusion();
                }
              }}
            />
            <button
              type="button"
              onClick={addInclusion}
              className="px-4 py-2 bg-emerald-600 text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-emerald-700 transition-colors shrink-0 shadow-sm"
            >
              Add
            </button>
          </div>
          {errors.inclusions?.message && (
            <p className="text-red-500 text-xs font-semibold mb-2">{String(errors.inclusions.message)}</p>
          )}
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
            {inclusionFields.length === 0 ? (
              <p className="text-xs text-slate-400 font-semibold italic text-center py-4">No inclusions specified yet.</p>
            ) : (
              inclusionFields.map((item, idx) => (
                <div key={item.id} className="flex gap-2 items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
                  <span className="flex-1 text-xs font-bold text-gray-800">
                    {watch(`inclusions.${idx}`)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeInclusion(idx)}
                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Exclusions */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
          <label className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <CheckCircle size={16} className="text-red-500" /> Package Exclusions
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={excInput}
              onChange={(e) => setExcInput(e.target.value)}
              placeholder="e.g. Flight tickets, visa fees, etc."
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-gray-800 bg-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addExclusion();
                }
              }}
            />
            <button
              type="button"
              onClick={addExclusion}
              className="px-4 py-2 bg-red-600 text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-red-700 transition-colors shrink-0 shadow-sm"
            >
              Add
            </button>
          </div>
          {errors.exclusions?.message && (
            <p className="text-red-500 text-xs font-semibold mb-2">{String(errors.exclusions.message)}</p>
          )}
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
            {exclusionFields.length === 0 ? (
              <p className="text-xs text-slate-400 font-semibold italic text-center py-4">No exclusions specified yet.</p>
            ) : (
              exclusionFields.map((item, idx) => (
                <div key={item.id} className="flex gap-2 items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
                  <span className="flex-1 text-xs font-bold text-gray-800">
                    {watch(`exclusions.${idx}`)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeExclusion(idx)}
                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
