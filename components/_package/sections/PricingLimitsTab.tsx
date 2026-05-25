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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pricing Setup */}
        <div className="space-y-5 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2">
            Pricing Setup
          </h3>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Base Price</label>
            <input
              type="number"
              min="0"
              {...register("pricing.basePrice", { valueAsNumber: true })}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-500 text-sm font-bold text-gray-800"
            />
            {pricingErrors?.basePrice?.message && (
              <p className="text-red-500 text-xs font-semibold mt-1">
                {String(pricingErrors.basePrice.message)}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Discounted Price (Optional)
            </label>
            <input
              type="number"
              min="0"
              {...register("pricing.discountedPrice", { valueAsNumber: true })}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-500 text-sm font-bold text-amber-600"
            />
            {pricingErrors?.discountedPrice?.message && (
              <p className="text-red-500 text-xs font-semibold mt-1">
                {String(pricingErrors.discountedPrice.message)}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("pricing.perPerson")}
                className="rounded text-amber-600 focus:ring-amber-600"
              />
              <span className="text-xs font-bold text-slate-700 uppercase select-none">Per Person</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("pricing.taxesIncluded")}
                className="rounded text-amber-600 focus:ring-amber-600"
              />
              <span className="text-xs font-bold text-slate-700 uppercase select-none">Taxes Inc.</span>
            </label>
          </div>
          {pricingErrors?.message && (
            <p className="text-red-500 text-xs font-semibold">{String(pricingErrors.message)}</p>
          )}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Currency</label>
            <select
              {...register("pricing.currency")}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none font-bold text-gray-800"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>

        {/* Availability Settings */}
        <div className="space-y-5 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2">
            Availability Settings
          </h3>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Start Date</label>
            <input
              type="date"
              {...register("availability.startDate")}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-500 text-sm font-bold text-gray-800"
            />
            {availabilityErrors?.startDate?.message && (
              <p className="text-red-500 text-xs font-semibold mt-1">
                {String(availabilityErrors.startDate.message)}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">End Date</label>
            <input
              type="date"
              {...register("availability.endDate")}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-500 text-sm font-bold text-gray-800"
            />
            {availabilityErrors?.endDate?.message && (
              <p className="text-red-500 text-xs font-semibold mt-1">
                {String(availabilityErrors.endDate.message)}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Max Seats</label>
              <input
                type="number"
                {...register("availability.maxSeats", { valueAsNumber: true })}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-gray-800"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Available</label>
              <input
                type="number"
                {...register("availability.availableSeats", { valueAsNumber: true })}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-gray-800"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Inclusions & Exclusions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Inclusions */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              <CheckCircle size={14} className="inline text-emerald-500 mr-1" /> Inclusions
            </label>
          </div>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={incInput}
              onChange={(e) => setIncInput(e.target.value)}
              placeholder="e.g. Hotel stay for 3 nights"
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-gray-800"
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
              className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-200"
            >
              Add
            </button>
          </div>
          {errors.inclusions?.message && (
            <p className="text-red-500 text-xs font-semibold mb-2">{String(errors.inclusions.message)}</p>
          )}
          <div className="space-y-2">
            {inclusionFields.map((item, idx) => (
              <div key={item.id} className="flex gap-2 items-center bg-slate-50 p-2 rounded-lg border">
                <span className="flex-1 text-sm font-medium text-gray-800">
                  {watch(`inclusions.${idx}`)}
                </span>
                <button
                  type="button"
                  onClick={() => removeInclusion(idx)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Exclusions */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              <CheckCircle size={14} className="inline text-red-500 mr-1" /> Exclusions
            </label>
          </div>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={excInput}
              onChange={(e) => setExcInput(e.target.value)}
              placeholder="e.g. Flight tickets"
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-gray-800"
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
              className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200"
            >
              Add
            </button>
          </div>
          {errors.exclusions?.message && (
            <p className="text-red-500 text-xs font-semibold mb-2">{String(errors.exclusions.message)}</p>
          )}
          <div className="space-y-2">
            {exclusionFields.map((item, idx) => (
              <div key={item.id} className="flex gap-2 items-center bg-slate-50 p-2 rounded-lg border">
                <span className="flex-1 text-sm font-medium text-gray-800">
                  {watch(`exclusions.${idx}`)}
                </span>
                <button
                  type="button"
                  onClick={() => removeExclusion(idx)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
