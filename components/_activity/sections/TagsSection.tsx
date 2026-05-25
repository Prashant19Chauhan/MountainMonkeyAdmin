"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Plus, X } from "lucide-react";

export default function TagsSection() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [tagInput, setTagInput] = useState("");
  const [recommendedInput, setRecommendedInput] = useState("");

  const tags: string[] = watch("tags") || [];
  const recommendedFor: string[] = watch("recommendedFor") || [];

  const addTag = () => {
    if (!tagInput.trim()) return;
    if (tags.includes(tagInput.trim())) return;
    setValue("tags", [...tags, tagInput.trim()], { shouldValidate: true });
    setTagInput("");
  };

  const removeTag = (index: number) => {
    setValue("tags", tags.filter((_, i) => i !== index), { shouldValidate: true });
  };

  const addRecommended = () => {
    if (!recommendedInput.trim()) return;
    if (recommendedFor.includes(recommendedInput.trim())) return;
    setValue("recommendedFor", [...recommendedFor, recommendedInput.trim()], { shouldValidate: true });
    setRecommendedInput("");
  };

  const removeRecommended = (index: number) => {
    setValue("recommendedFor", recommendedFor.filter((_, i) => i !== index), { shouldValidate: true });
  };

  return (
    <div className="space-y-4">
      {/* Tags Selection */}
      <div className="space-y-2 text-left">
        <label className="text-sm font-semibold text-gray-700">Tags</label>
        <div className="flex gap-2">
          <select
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800"
          >
            <option value="">Select tag</option>
            <option value="budget">Budget</option>
            <option value="luxury">Luxury</option>
            <option value="family">Family</option>
            <option value="couple">Couple</option>
            <option value="solo">Solo</option>
            <option value="adventure">Adventure</option>
            <option value="relaxing">Relaxing</option>
          </select>
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-black transition-all flex items-center justify-center shrink-0"
          >
            <Plus size={18} />
          </button>
        </div>
        {errors.tags?.message && (
          <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.tags.message)}</p>
        )}
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag: string, idx: number) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(idx)}
                className="hover:text-indigo-900"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Recommended For Selection */}
      <div className="space-y-2 text-left">
        <label className="text-sm font-semibold text-gray-700">Recommended For</label>
        <div className="flex gap-2">
          <select
            value={recommendedInput}
            onChange={(e) => setRecommendedInput(e.target.value)}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800"
          >
            <option value="">Select audience</option>
            <option value="solo">Solo</option>
            <option value="couple">Couple</option>
            <option value="family">Family</option>
            <option value="friends">Friends</option>
            <option value="adventure_seekers">Adventure Seekers</option>
          </select>
          <button
            type="button"
            onClick={addRecommended}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-black transition-all flex items-center justify-center shrink-0"
          >
            <Plus size={18} />
          </button>
        </div>
        {errors.recommendedFor?.message && (
          <p className="text-red-500 text-xs font-semibold mt-1">
            {String(errors.recommendedFor.message)}
          </p>
        )}
        <div className="flex flex-wrap gap-2 mt-2">
          {recommendedFor.map((rec: string, idx: number) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
            >
              {rec.replace("_", " ")}
              <button
                type="button"
                onClick={() => removeRecommended(idx)}
                className="hover:text-green-900"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
