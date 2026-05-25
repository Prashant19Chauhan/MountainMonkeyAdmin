"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Plus, X } from "lucide-react";

interface PrimaryInfoSectionProps {
  destinations: any[];
}

export default function PrimaryInfoSection({ destinations }: PrimaryInfoSectionProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [categoryInput, setCategoryInput] = useState("");
  const categories: string[] = watch("category") || [];

  const addCategory = () => {
    if (!categoryInput.trim()) return;
    if (categories.includes(categoryInput.trim())) return;
    setValue("category", [...categories, categoryInput.trim()], { shouldValidate: true });
    setCategoryInput("");
  };

  const removeCategory = (index: number) => {
    setValue("category", categories.filter((_, i) => i !== index), { shouldValidate: true });
  };

  return (
    <div className="space-y-4">
      {/* Name */}
      <div className="space-y-1.5 text-left">
        <label className="text-sm font-semibold text-gray-700">
          Activity Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("name")}
          placeholder="e.g. River Rafting in Rishikesh"
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800 placeholder:text-gray-300"
        />
        {errors.name?.message && (
          <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.name.message)}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Destination Dropdown */}
        <div className="space-y-1.5 text-left">
          <label className="text-sm font-semibold text-gray-700">Destination</label>
          <select
            {...register("destinationId")}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm appearance-none bg-white font-medium text-gray-800"
          >
            <option value="">Select Destination</option>
            {destinations.map((d: any) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>
          {errors.destinationId?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.destinationId.message)}</p>
          )}
        </div>

        {/* Activity Type */}
        <div className="space-y-1.5 text-left">
          <label className="text-sm font-semibold text-gray-700">Activity Type</label>
          <input
            type="text"
            {...register("type")}
            placeholder="e.g. Adventure"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800 placeholder:text-gray-300"
          />
          {errors.type?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.type.message)}</p>
          )}
        </div>
      </div>

      {/* Category Array */}
      <div className="space-y-2 text-left">
        <label className="text-sm font-semibold text-gray-700">Categories</label>
        <div className="flex gap-2">
          <select
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800"
          >
            <option value="">Select category</option>
            <option value="trekking">Trekking</option>
            <option value="paragliding">Paragliding</option>
            <option value="museum">Museum</option>
            <option value="temple">Temple</option>
            <option value="street_food">Street Food</option>
            <option value="market">Market</option>
          </select>
          <button
            type="button"
            onClick={addCategory}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-black transition-all flex items-center justify-center shrink-0"
          >
            <Plus size={18} />
          </button>
        </div>
        {errors.category?.message && (
          <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.category.message)}</p>
        )}
        <div className="flex flex-wrap gap-2 mt-2">
          {categories.map((cat: string, idx: number) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
            >
              {cat}
              <button
                type="button"
                onClick={() => removeCategory(idx)}
                className="hover:text-blue-900"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Short Description */}
      <div className="space-y-1.5 text-left">
        <label className="text-sm font-semibold text-gray-700">Short Description</label>
        <textarea
          {...register("shortDescription")}
          rows={2}
          placeholder="Brief highlight (min 10 chars)..."
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 resize-none transition-all text-sm font-medium text-gray-800"
        />
        {errors.shortDescription?.message && (
          <p className="text-red-500 text-xs font-semibold mt-1">
            {String(errors.shortDescription.message)}
          </p>
        )}
      </div>

      {/* Long Description */}
      <div className="space-y-1.5 text-left">
        <label className="text-sm font-semibold text-gray-700">Long Description</label>
        <textarea
          {...register("longDescription")}
          rows={4}
          placeholder="Detailed overview of the experience (min 20 chars)..."
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 resize-none transition-all text-sm font-medium text-gray-800"
        />
        {errors.longDescription?.message && (
          <p className="text-red-500 text-xs font-semibold mt-1">
            {String(errors.longDescription.message)}
          </p>
        )}
      </div>
    </div>
  );
}
