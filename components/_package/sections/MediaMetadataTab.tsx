"use client";

import Image from "@/components/ui/Image";
import React, { useState, useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Tags, Briefcase, Image as ImageIcon, Trash2, Plus, X } from "lucide-react";
import ImageLibrary from "../../_imageUpload/imageLibrary";
import {
  PKG_CATEGORY_OPTIONS,
  PKG_TAGS_OPTIONS,
  PKG_MOOD_OPTIONS,
  PKG_SUITABLE_FOR_OPTIONS,
  PKG_BEST_SEASON_OPTIONS
} from "@/lib/validation/package.validation";

export default function MediaMetadataTab() {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const vendorErrors = errors.vendor as any;

  const [imageLibraryOpen, setImageLibraryOpen] = useState(false);
  const [videoInput, setVideoInput] = useState("");

  const categories: string[] = watch("categories") || [];
  const images: string[] = watch("images") || [];

  const {
    fields: videoFields,
    append: appendVideo,
    remove: removeVideo,
  } = useFieldArray({
    control,
    name: "videos",
  });

  // Comma-separated metadata states for highlights and languages
  const [highlightsText, setHighlightsText] = useState("");
  const [langsText, setLangsText] = useState("");

  const tags: string[] = watch("aiMetadata.tags") || [];
  const mood: string[] = watch("aiMetadata.mood") || [];
  const suitableFor: string[] = watch("aiMetadata.suitableFor") || [];
  const bestSeason: string[] = watch("aiMetadata.bestSeason") || [];
  const highlights: string[] = watch("aiMetadata.highlights") || [];
  const languagesSupported: string[] = watch("aiMetadata.languagesSupported") || [];

  useEffect(() => {
    if (highlights.length > 0 && !highlightsText) setHighlightsText(highlights.join(", "));
  }, [highlights]);

  useEffect(() => {
    if (languagesSupported.length > 0 && !langsText) setLangsText(languagesSupported.join(", "));
  }, [languagesSupported]);

  const handleBlurField = (fieldPath: string, text: string) => {
    const arr = text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setValue(fieldPath, arr, { shouldValidate: true });
  };



  const toggleItem = (fieldPath: string, currentList: string[], item: string) => {
    const next = currentList.includes(item)
      ? currentList.filter((m) => m !== item)
      : [...currentList, item];
    setValue(fieldPath, next, { shouldValidate: true });
  };

  const handleImageSelect = (selected: { id: string; url: string }[]) => {
    const urls = selected.map((img) => img.url);
    const combined = Array.from(new Set([...images, ...urls]));
    setValue("images", combined, { shouldValidate: true });
    setImageLibraryOpen(false);
  };

  const handleImageRemove = (idx: number) => {
    setValue("images", images.filter((_, i) => i !== idx), { shouldValidate: true });
  };

  const addVideo = () => {
    if (!videoInput.trim()) return;
    appendVideo(videoInput.trim());
    setVideoInput("");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 animate-pulse">
          <Tags size={20} />
        </div>
        <div>
          <h2 className="text-lg font-black uppercase tracking-wide text-slate-800">Media & Metadata</h2>
          <p className="text-xs text-slate-500 font-medium">Categorization, images, and system states</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Metadata section */}
        <div className="space-y-6 bg-slate-50 p-6 rounded-3xl border border-slate-200">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200/60 pb-3">
            Package Classification & Status
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Status</label>
              <select
                {...register("status")}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none font-bold text-gray-800"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Difficulty Level */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Difficulty Level</label>
              <select
                {...register("aiMetadata.difficultyLevel")}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none font-bold text-gray-800"
              >
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200/60">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500">
              Categories <span className="text-red-500">*</span>
            </label>
            {errors.categories?.message && (
              <p className="text-red-500 text-xs font-semibold">{String(errors.categories.message)}</p>
            )}
            <div className="flex flex-wrap gap-2 p-4 bg-slate-50 border border-slate-200/60 rounded-2xl">
              {PKG_CATEGORY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleItem("categories", categories, opt.value)}
                  className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all duration-300 ${
                    categories.includes(opt.value)
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Featured */}
          <label className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200/60 cursor-pointer hover:bg-slate-50 transition-colors select-none">
            <input
              type="checkbox"
              {...register("isFeatured")}
              className="w-4 h-4 text-pink-600 rounded focus:ring-pink-600"
            />
            <span className="text-xs font-black uppercase tracking-wider text-slate-600">
              Feature this package on homepage
            </span>
          </label>
        </div>

        {/* AI Metadata Extended - Restructured to 1 in a row format without fixed height limits */}
        <div className="space-y-6 bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100">
          <h3 className="text-xs font-black uppercase tracking-wider text-indigo-800 border-b border-indigo-100 pb-3">
            AI & Search Metadata
          </h3>

          <div className="space-y-6">
            {/* Tags (Toggle Buttons) */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 ml-1">Tags</label>
              <div className="flex flex-wrap gap-2 p-4 bg-white border border-slate-200 rounded-2xl">
                {PKG_TAGS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleItem("aiMetadata.tags", tags, opt.value)}
                    className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all duration-300 ${
                      tags.includes(opt.value)
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood (Toggle Buttons) */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 ml-1">Mood Vibe</label>
              <div className="flex flex-wrap gap-2 p-4 bg-white border border-slate-200 rounded-2xl">
                {PKG_MOOD_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleItem("aiMetadata.mood", mood, opt.value)}
                    className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all duration-300 ${
                      mood.includes(opt.value)
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Suitable For (Toggle Buttons) */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 ml-1">Suitable For</label>
              <div className="flex flex-wrap gap-2 p-4 bg-white border border-slate-200 rounded-2xl">
                {PKG_SUITABLE_FOR_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleItem("aiMetadata.suitableFor", suitableFor, opt.value)}
                    className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all duration-300 ${
                      suitableFor.includes(opt.value)
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Best Season (Toggle Buttons) */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 ml-1">Best Season</label>
              <div className="flex flex-wrap gap-2 p-4 bg-white border border-slate-200 rounded-2xl">
                {PKG_BEST_SEASON_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleItem("aiMetadata.bestSeason", bestSeason, opt.value)}
                    className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all duration-300 ${
                      bestSeason.includes(opt.value)
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Highlights (Comma Separated) */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-500 ml-1">Highlights (comma sep)</label>
                <input
                  type="text"
                  value={highlightsText}
                  onChange={(e) => setHighlightsText(e.target.value)}
                  onBlur={() => handleBlurField("aiMetadata.highlights", highlightsText)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all bg-white"
                />
              </div>

              {/* Languages (Comma Separated) */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-500 ml-1">Languages (comma sep)</label>
                <input
                  type="text"
                  value={langsText}
                  onChange={(e) => setLangsText(e.target.value)}
                  onBlur={() => handleBlurField("aiMetadata.languagesSupported", langsText)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all bg-white"
                />
              </div>

              {/* Popularity Score */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-500 ml-1">Popularity Score (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  {...register("aiMetadata.popularityScore", { valueAsNumber: true })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor & Media */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vendor Details */}
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-3 flex items-center gap-2">
            <Briefcase size={16} className="text-slate-600" /> Vendor Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block ml-1 mb-1">Vendor Name</label>
              <input
                type="text"
                placeholder="Vendor name"
                {...register("vendor.name")}
                className="w-full px-4 py-2.5 border rounded-xl text-sm font-semibold text-gray-800"
              />
              {vendorErrors?.name?.message && (
                <p className="text-red-500 text-xs font-semibold mt-1">{String(vendorErrors.name.message)}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block ml-1 mb-1">Vendor Email</label>
              <input
                type="email"
                placeholder="vendor@company.com"
                {...register("vendor.contactEmail")}
                className="w-full px-4 py-2.5 border rounded-xl text-sm font-semibold text-gray-800"
              />
              {vendorErrors?.contactEmail?.message && (
                <p className="text-red-500 text-xs font-semibold mt-1">{String(vendorErrors.contactEmail.message)}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block ml-1 mb-1">Vendor Phone</label>
              <input
                type="text"
                placeholder="+91..."
                {...register("vendor.contactPhone")}
                className="w-full px-4 py-2.5 border rounded-xl text-sm font-semibold text-gray-800"
              />
              {vendorErrors?.contactPhone?.message && (
                <p className="text-red-500 text-xs font-semibold mt-1">{String(vendorErrors.contactPhone.message)}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block ml-1 mb-1">Vendor ID</label>
              <input
                type="text"
                placeholder="MongoDB ObjectID"
                {...register("vendor.vendorId")}
                className="w-full px-4 py-2.5 border rounded-xl text-sm font-semibold text-gray-800"
              />
              {vendorErrors?.vendorId?.message && (
                <p className="text-red-500 text-xs font-semibold mt-1">{String(vendorErrors.vendorId.message)}</p>
              )}
            </div>
          </div>
        </div>

        {/* Media (Images & Videos) */}
        <div className="space-y-6">
          {/* Images */}
          <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-200">
            <div className="flex justify-between items-center bg-white p-3 border border-slate-200 rounded-2xl animate-in fade-in">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <ImageIcon size={16} className="text-pink-500 animate-bounce" /> Package Gallery
              </label>
              <button
                type="button"
                onClick={() => setImageLibraryOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider rounded-xl transition-all"
              >
                Select Images
              </button>
            </div>
            {errors.images?.message && (
              <p className="text-red-500 text-xs font-semibold">{String(errors.images.message)}</p>
            )}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
              {images.map((img, idx) => (
                <div key={idx} className="w-full aspect-square relative group border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <Image src={img} alt="Package image" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Videos */}
          <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-200">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <ImageIcon size={16} className="text-blue-500" /> Videos Registry
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={videoInput}
                onChange={(e) => setVideoInput(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-gray-800 bg-white"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addVideo();
                  }
                }}
              />
              <button
                type="button"
                onClick={addVideo}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all"
              >
                Add Video
              </button>
            </div>
            {errors.videos?.message && (
              <p className="text-red-500 text-xs font-semibold">{String(errors.videos.message)}</p>
            )}
            <div className="space-y-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
              {videoFields.map((item, idx) => (
                <div key={item.id} className="flex gap-2 items-center bg-white p-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-all shadow-sm">
                  <span className="flex-1 text-xs font-bold text-gray-800 truncate">
                    {watch(`videos.${idx}`)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeVideo(idx)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {imageLibraryOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ImageIcon className="text-pink-500" /> Select Images
              </h3>
              <button
                type="button"
                onClick={() => setImageLibraryOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <ImageLibrary
                onClose={() => setImageLibraryOpen(false)}
                onSelect={handleImageSelect}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
