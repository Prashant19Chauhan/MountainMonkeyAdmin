"use client";

import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { ActivityInput } from "@/lib/validation/activity.validation";
import { Plus, X, ChevronDown } from "lucide-react";

export default function SafetySection() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ActivityInput>();

  const [precautionInput, setPrecautionInput] = useState("");
  const precautions: string[] = watch("safetyInfo.precautions") || [];
  const requiredItems: string[] = watch("requiredItems") || [];
  const [itemsText, setItemsText] = useState("");

  // Populate items text initially
  useEffect(() => {
    if (requiredItems && requiredItems.length > 0 && !itemsText) {
      setItemsText(requiredItems.join(", "));
    }
  }, [requiredItems]);

  const addPrecaution = () => {
    if (!precautionInput.trim()) return;
    if (precautions.includes(precautionInput.trim())) return;
    setValue("safetyInfo.precautions", [...precautions, precautionInput.trim()], { shouldValidate: true });
    setPrecautionInput("");
  };

  const removePrecaution = (index: number) => {
    setValue("safetyInfo.precautions", precautions.filter((_, i) => i !== index), { shouldValidate: true });
  };

  const handleItemsBlur = () => {
    const items = itemsText
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i);
    setValue("requiredItems", items, { shouldValidate: true });
  };

  return (
    <div className="space-y-4">
      {/* Risk Level */}
      <div className="space-y-1.5 text-left">
        <label className="text-sm font-semibold text-gray-700">Risk Level</label>
        <div className="relative">
          <select
            {...register("safetyInfo.riskLevel")}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm appearance-none bg-white font-medium text-gray-800"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <ChevronDown size={16} />
          </div>
        </div>
        {errors.safetyInfo?.riskLevel?.message && (
          <p className="text-red-500 text-xs font-semibold mt-1">
            {String(errors.safetyInfo.riskLevel.message)}
          </p>
        )}
      </div>

      {/* Safety Precautions Array */}
      <div className="space-y-2 text-left">
        <label className="text-sm font-semibold text-gray-700">Safety Precautions</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={precautionInput}
            onChange={(e) => setPrecautionInput(e.target.value)}
            placeholder="Add a safety precaution..."
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addPrecaution();
              }
            }}
          />
          <button
            type="button"
            onClick={addPrecaution}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-black transition-all flex items-center justify-center shrink-0"
          >
            <Plus size={18} />
          </button>
        </div>
        {errors.safetyInfo?.precautions?.message && (
          <p className="text-red-500 text-xs font-semibold mt-1">
            {String(errors.safetyInfo.precautions.message)}
          </p>
        )}
        <div className="space-y-2 mt-2">
          {precautions.map((precaution: string, idx: number) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-emerald-50 rounded-lg">
              <span className="text-xs text-emerald-800 font-medium">{precaution}</span>
              <button
                type="button"
                onClick={() => removePrecaution(idx)}
                className="text-emerald-600 hover:text-emerald-900"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Required Items */}
      <div className="space-y-1.5 text-left">
        <label className="text-sm font-semibold text-gray-700">Required Items (Comma separated)</label>
        <input
          type="text"
          value={itemsText}
          onChange={(e) => setItemsText(e.target.value)}
          onBlur={handleItemsBlur}
          placeholder="e.g. Hiking shoes, Water, Sunscreen"
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800 placeholder:text-gray-300"
        />
        {errors.requiredItems?.message && (
          <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.requiredItems.message)}</p>
        )}
      </div>
    </div>
  );
}
