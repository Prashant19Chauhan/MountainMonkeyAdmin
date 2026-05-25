"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { ActivityInput } from "@/lib/validation/activity.validation";

export default function AIScoreSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ActivityInput>();

  return (
    <div className="space-y-4">
      {/* AI Scores Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1.5 text-left">
          <label className="text-sm font-semibold text-gray-700">Popularity</label>
          <input
            type="number"
            {...register("aiScore.popularity", { valueAsNumber: true })}
            placeholder="0-100"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800"
          />
          {errors.aiScore?.popularity?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">
              {String(errors.aiScore.popularity.message)}
            </p>
          )}
        </div>

        <div className="space-y-1.5 text-left">
          <label className="text-sm font-semibold text-gray-700">Experience Quality</label>
          <input
            type="number"
            {...register("aiScore.experienceQuality", { valueAsNumber: true })}
            placeholder="0-100"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800"
          />
          {errors.aiScore?.experienceQuality?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">
              {String(errors.aiScore.experienceQuality.message)}
            </p>
          )}
        </div>

        <div className="space-y-1.5 text-left">
          <label className="text-sm font-semibold text-gray-700">Value for Money</label>
          <input
            type="number"
            {...register("aiScore.valueForMoney", { valueAsNumber: true })}
            placeholder="0-100"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800"
          />
          {errors.aiScore?.valueForMoney?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">
              {String(errors.aiScore.valueForMoney.message)}
            </p>
          )}
        </div>

        <div className="space-y-1.5 text-left">
          <label className="text-sm font-semibold text-gray-700">Uniqueness</label>
          <input
            type="number"
            {...register("aiScore.uniqueness", { valueAsNumber: true })}
            placeholder="0-100"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800"
          />
          {errors.aiScore?.uniqueness?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">
              {String(errors.aiScore.uniqueness.message)}
            </p>
          )}
        </div>
      </div>

      {/* AI Summary */}
      <div className="space-y-1.5 text-left">
        <label className="text-sm font-semibold text-gray-700">AI Summary</label>
        <textarea
          {...register("aiSummary")}
          rows={3}
          placeholder="AI-generated summary of the activity..."
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 resize-none transition-all text-sm font-medium text-gray-800"
        />
        {errors.aiSummary?.message && (
          <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.aiSummary.message)}</p>
        )}
      </div>

      {/* Popularity Score */}
      <div className="space-y-1.5 text-left">
        <label className="text-sm font-semibold text-gray-700">Popularity Score</label>
        <input
          type="number"
          {...register("popularityScore", { valueAsNumber: true })}
          placeholder="0-100"
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800"
        />
        {errors.popularityScore?.message && (
          <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.popularityScore.message)}</p>
        )}
      </div>
    </div>
  );
}
