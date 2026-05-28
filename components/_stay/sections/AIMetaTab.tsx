"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Tag, TrendingUp } from "lucide-react";
import {
  STAY_TAGS_OPTIONS,
  STAY_SUITABLE_FOR_OPTIONS,
  STAY_TYPE_OPTIONS
} from "@/lib/validation/stay.validation";

export default function AIMetaTab() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const aiScoreErrors = errors.aiScore as any;
  const aiMetaDataErrors = errors.aiMetaData as any;

  const tags: string[] = watch("aiMetaData.tags") || [];
  const suitableFor: string[] = watch("aiMetaData.suitableFor") || [];
  const stayType: string[] = watch("aiMetaData.stayType") || [];

  const toggleItem = (fieldPath: string, currentList: string[], item: string) => {
    const next = currentList.includes(item)
      ? currentList.filter((m) => m !== item)
      : [...currentList, item];
    setValue(fieldPath, next, { shouldValidate: true });
  };

  return (
    <div className="space-y-8 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* AI Metadata Box */}
      <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-3xl space-y-6">
        <h3 className="text-sm font-black text-purple-900 uppercase tracking-widest flex items-center gap-2">
          <Tag size={16} /> AI Metadata
        </h3>

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-purple-800">Tags</label>
          <div className="flex flex-wrap gap-1.5 p-3 bg-white border border-purple-100 rounded-2xl max-h-40 overflow-y-auto">
            {STAY_TAGS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleItem("aiMetaData.tags", tags, opt.value)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all duration-300 ${
                  tags.includes(opt.value)
                    ? "bg-purple-900 text-white border-purple-900 shadow-sm"
                    : "bg-purple-50/50 text-purple-400 border-purple-100/50 hover:bg-purple-100/80"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {aiMetaDataErrors?.tags?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">{String(aiMetaDataErrors.tags.message)}</p>
          )}
        </div>

        {/* Suitable For */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-purple-800">Suitable For</label>
          <div className="flex flex-wrap gap-1.5 p-3 bg-white border border-purple-100 rounded-2xl max-h-40 overflow-y-auto">
            {STAY_SUITABLE_FOR_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleItem("aiMetaData.suitableFor", suitableFor, opt.value)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all duration-300 ${
                  suitableFor.includes(opt.value)
                    ? "bg-purple-900 text-white border-purple-900 shadow-sm"
                    : "bg-purple-50/50 text-purple-400 border-purple-100/50 hover:bg-purple-100/80"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {aiMetaDataErrors?.suitableFor?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">{String(aiMetaDataErrors.suitableFor.message)}</p>
          )}
        </div>

        {/* Stay Type */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-purple-800">Stay Type</label>
          <div className="flex flex-wrap gap-1.5 p-3 bg-white border border-purple-100 rounded-2xl max-h-40 overflow-y-auto">
            {STAY_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleItem("aiMetaData.stayType", stayType, opt.value)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all duration-300 ${
                  stayType.includes(opt.value)
                    ? "bg-purple-900 text-white border-purple-900 shadow-sm"
                    : "bg-purple-50/50 text-purple-400 border-purple-100/50 hover:bg-purple-100/80"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {aiMetaDataErrors?.stayType?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">{String(aiMetaDataErrors.stayType.message)}</p>
          )}
        </div>
      </div>

      {/* AI Quality Scores */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2 flex items-center gap-2">
          <TrendingUp size={14} /> AI Quality Scores (0-100)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Value for Money</label>
            <input
              type="number"
              {...register("aiScore.valueForMoney", { valueAsNumber: true })}
              placeholder="0-100"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800 bg-white"
            />
            {aiScoreErrors?.valueForMoney?.message && (
              <p className="text-red-500 text-[10px] font-semibold mt-1">
                {String(aiScoreErrors.valueForMoney.message)}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Location Score</label>
            <input
              type="number"
              {...register("aiScore.locationScore", { valueAsNumber: true })}
              placeholder="0-100"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800 bg-white"
            />
            {aiScoreErrors?.locationScore?.message && (
              <p className="text-red-500 text-[10px] font-semibold mt-1">
                {String(aiScoreErrors.locationScore.message)}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Cleanliness</label>
            <input
              type="number"
              {...register("aiScore.cleanliness", { valueAsNumber: true })}
              placeholder="0-100"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800 bg-white"
            />
            {aiScoreErrors?.cleanliness?.message && (
              <p className="text-red-500 text-[10px] font-semibold mt-1">
                {String(aiScoreErrors.cleanliness.message)}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Overall Score</label>
            <input
              type="number"
              {...register("aiScore.overall", { valueAsNumber: true })}
              placeholder="0-100"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800 bg-white"
            />
            {aiScoreErrors?.overall?.message && (
              <p className="text-red-500 text-[10px] font-semibold mt-1">
                {String(aiScoreErrors.overall.message)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
