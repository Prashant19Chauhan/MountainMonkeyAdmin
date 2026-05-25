"use client";

import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Tag, TrendingUp } from "lucide-react";

export default function AIMetaTab() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const tags: string[] = watch("aiMetaData.tags") || [];
  const suitableFor: string[] = watch("aiMetaData.suitableFor") || [];
  const stayType: string[] = watch("aiMetaData.stayType") || [];

  const aiScoreErrors = errors.aiScore as any;

  const [tagsText, setTagsText] = useState("");
  const [suitableText, setSuitableText] = useState("");
  const [stayTypeText, setStayTypeText] = useState("");

  useEffect(() => {
    if (tags.length > 0 && !tagsText) setTagsText(tags.join(", "));
  }, [tags]);

  useEffect(() => {
    if (suitableFor.length > 0 && !suitableText) setSuitableText(suitableFor.join(", "));
  }, [suitableFor]);

  useEffect(() => {
    if (stayType.length > 0 && !stayTypeText) setStayTypeText(stayType.join(", "));
  }, [stayType]);

  const handleBlurField = (fieldPath: string, text: string) => {
    const arr = text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setValue(fieldPath, arr, { shouldValidate: true });
  };

  return (
    <div className="space-y-8 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* AI Metadata Box */}
      <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-3xl space-y-4">
        <h3 className="text-sm font-black text-purple-900 uppercase tracking-widest flex items-center gap-2">
          <Tag size={16} /> AI Metadata
        </h3>

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-purple-800">Tags (comma-separated)</label>
          <input
            type="text"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            onBlur={() => handleBlurField("aiMetaData.tags", tagsText)}
            placeholder="e.g. luxury, mountain-view, family-friendly"
            className="w-full rounded-xl border border-purple-200 px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-purple-200 bg-white text-gray-800"
          />
          <div className="flex flex-wrap gap-1.5 mt-1">
            {tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-md text-[10px] font-bold">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Suitable For */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-purple-800">Suitable For (comma-separated)</label>
          <input
            type="text"
            value={suitableText}
            onChange={(e) => setSuitableText(e.target.value)}
            onBlur={() => handleBlurField("aiMetaData.suitableFor", suitableText)}
            placeholder="e.g. couples, families, business travelers"
            className="w-full rounded-xl border border-purple-200 px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-purple-200 bg-white text-gray-800"
          />
          <div className="flex flex-wrap gap-1.5 mt-1">
            {suitableFor.map((item) => (
              <span key={item} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-md text-[10px] font-bold">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Stay Type */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-purple-800">Stay Type (comma-separated)</label>
          <input
            type="text"
            value={stayTypeText}
            onChange={(e) => setStayTypeText(e.target.value)}
            onBlur={() => handleBlurField("aiMetaData.stayType", stayTypeText)}
            placeholder="e.g. boutique, heritage, resort, glamping"
            className="w-full rounded-xl border border-purple-200 px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-purple-200 bg-white text-gray-800"
          />
          <div className="flex flex-wrap gap-1.5 mt-1">
            {stayType.map((type) => (
              <span key={type} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-md text-[10px] font-bold">
                {type}
              </span>
            ))}
          </div>
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
