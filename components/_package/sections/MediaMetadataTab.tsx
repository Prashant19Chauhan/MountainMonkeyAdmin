"use client";

import Image from "@/components/ui/Image";
import React, { useState, useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Tags, Briefcase, Image as ImageIcon, Trash2, Plus, X } from "lucide-react";
import ImageLibrary from "../../_imageUpload/imageLibrary";

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

  // Comma-separated metadata states
  const [tagsText, setTagsText] = useState("");
  const [moodText, setMoodText] = useState("");
  const [suitableText, setSuitableText] = useState("");
  const [seasonText, setSeasonText] = useState("");
  const [highlightsText, setHighlightsText] = useState("");
  const [langsText, setLangsText] = useState("");

  const tags: string[] = watch("aiMetadata.tags") || [];
  const mood: string[] = watch("aiMetadata.mood") || [];
  const suitableFor: string[] = watch("aiMetadata.suitableFor") || [];
  const bestSeason: string[] = watch("aiMetadata.bestSeason") || [];
  const highlights: string[] = watch("aiMetadata.highlights") || [];
  const languagesSupported: string[] = watch("aiMetadata.languagesSupported") || [];

  useEffect(() => {
    if (tags.length > 0 && !tagsText) setTagsText(tags.join(", "));
  }, [tags]);

  useEffect(() => {
    if (mood.length > 0 && !moodText) setMoodText(mood.join(", "));
  }, [mood]);

  useEffect(() => {
    if (suitableFor.length > 0 && !suitableText) setSuitableText(suitableFor.join(", "));
  }, [suitableFor]);

  useEffect(() => {
    if (bestSeason.length > 0 && !seasonText) setSeasonText(bestSeason.join(", "));
  }, [bestSeason]);

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

  const handleCategoryChange = (cat: string, checked: boolean) => {
    if (checked) {
      setValue("categories", [...categories, cat], { shouldValidate: true });
    } else {
      setValue("categories", categories.filter((c) => c !== cat), { shouldValidate: true });
    }
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
        <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600">
          <Tags size={20} />
        </div>
        <div>
          <h2 className="text-lg font-black uppercase tracking-wide text-slate-800">Media & Metadata</h2>
          <p className="text-xs text-slate-500 font-medium">Categorization, images, and system states</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Metadata section */}
        <div className="space-y-5">
          {/* Status */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Status</label>
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
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Difficulty Level</label>
            <select
              {...register("aiMetadata.difficultyLevel")}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none font-bold text-gray-800"
            >
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Categories <span className="text-red-500">*</span>
            </label>
            {errors.categories?.message && (
              <p className="text-red-500 text-xs font-semibold">{String(errors.categories.message)}</p>
            )}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {["honeymoon", "adventure", "family", "solo", "luxury", "budget", "spiritual", "wildlife"].map(
                (cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100"
                  >
                    <input
                      type="checkbox"
                      checked={categories.includes(cat)}
                      onChange={(e) => handleCategoryChange(cat, e.target.checked)}
                      className="rounded text-pink-600 focus:ring-pink-600"
                    />
                    <span className="text-xs font-bold text-slate-700 capitalize select-none">{cat}</span>
                  </label>
                )
              )}
            </div>
          </div>

          {/* Featured */}
          <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100">
            <input
              type="checkbox"
              {...register("isFeatured")}
              className="w-4 h-4 text-pink-600 rounded focus:ring-pink-600"
            />
            <span className="text-sm font-bold text-slate-700 select-none">
              Feature this package on homepage
            </span>
          </label>
        </div>

        {/* AI Metadata Extended */}
        <div className="space-y-5 bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
          <h3 className="text-xs font-black uppercase tracking-wider text-indigo-800 border-b border-indigo-100 pb-2">
            AI & Search Metadata
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Tags (comma sep)</label>
              <input
                type="text"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                onBlur={() => handleBlurField("aiMetadata.tags", tagsText)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-gray-800"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Mood (comma sep)</label>
              <input
                type="text"
                value={moodText}
                onChange={(e) => setMoodText(e.target.value)}
                onBlur={() => handleBlurField("aiMetadata.mood", moodText)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-gray-800"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Suitable For (comma sep)
              </label>
              <input
                type="text"
                value={suitableText}
                onChange={(e) => setSuitableText(e.target.value)}
                onBlur={() => handleBlurField("aiMetadata.suitableFor", suitableText)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-gray-800"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Best Season (comma sep)
              </label>
              <input
                type="text"
                value={seasonText}
                onChange={(e) => setSeasonText(e.target.value)}
                onBlur={() => handleBlurField("aiMetadata.bestSeason", seasonText)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-gray-800"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Highlights (comma sep)
              </label>
              <input
                type="text"
                value={highlightsText}
                onChange={(e) => setHighlightsText(e.target.value)}
                onBlur={() => handleBlurField("aiMetadata.highlights", highlightsText)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-gray-800"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Languages (comma sep)
              </label>
              <input
                type="text"
                value={langsText}
                onChange={(e) => setLangsText(e.target.value)}
                onBlur={() => handleBlurField("aiMetadata.languagesSupported", langsText)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-gray-800"
              />
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
              Popularity Score (0-100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              {...register("aiMetadata.popularityScore", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-gray-800"
            />
          </div>
        </div>
      </div>

      {/* Vendor & Media */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Vendor Details */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2">
            <Briefcase size={14} className="inline mr-1" /> Vendor Details
          </h3>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Vendor Name"
              {...register("vendor.name")}
              className="w-full px-4 py-2 border rounded-lg text-sm font-semibold text-gray-800"
            />
            {vendorErrors?.name?.message && (
              <p className="text-red-500 text-xs font-semibold">{String(vendorErrors.name.message)}</p>
            )}
          </div>
          <div className="space-y-2">
            <input
              type="email"
              placeholder="Vendor Email"
              {...register("vendor.contactEmail")}
              className="w-full px-4 py-2 border rounded-lg text-sm font-semibold text-gray-800"
            />
            {vendorErrors?.contactEmail?.message && (
              <p className="text-red-500 text-xs font-semibold">{String(vendorErrors.contactEmail.message)}</p>
            )}
          </div>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Vendor Phone"
              {...register("vendor.contactPhone")}
              className="w-full px-4 py-2 border rounded-lg text-sm font-semibold text-gray-800"
            />
            {vendorErrors?.contactPhone?.message && (
              <p className="text-red-500 text-xs font-semibold">{String(vendorErrors.contactPhone.message)}</p>
            )}
          </div>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Vendor ID (MongoDB ObjectID)"
              {...register("vendor.vendorId")}
              className="w-full px-4 py-2 border rounded-lg text-sm font-semibold text-gray-800"
            />
            {vendorErrors?.vendorId?.message && (
              <p className="text-red-500 text-xs font-semibold">{String(vendorErrors.vendorId.message)}</p>
            )}
          </div>
        </div>

        {/* Media (Images & Videos) */}
        <div className="space-y-6">
          {/* Images */}
          <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                <ImageIcon size={14} className="inline mr-1" /> Images (URLs)
              </label>
              <button
                type="button"
                onClick={() => setImageLibraryOpen(true)}
                className="text-[10px] bg-slate-200 text-slate-700 px-2 py-1 rounded font-bold hover:bg-slate-300"
              >
                Add Image
              </button>
            </div>
            {errors.images?.message && (
              <p className="text-red-500 text-xs font-semibold">{String(errors.images.message)}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {images.map((img, idx) => (
                <div key={idx} className="w-32 h-32 relative group border border-gray-200 rounded-lg overflow-hidden">
                  <Image src={img} alt="Package image" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Videos */}
          <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                <ImageIcon size={14} className="inline mr-1" /> Videos (URLs)
              </label>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={videoInput}
                onChange={(e) => setVideoInput(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-gray-800"
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
                className="text-[10px] bg-slate-200 text-slate-700 px-3 py-2 rounded font-bold hover:bg-slate-300"
              >
                Add Video
              </button>
            </div>
            {errors.videos?.message && (
              <p className="text-red-500 text-xs font-semibold">{String(errors.videos.message)}</p>
            )}
            <div className="space-y-2">
              {videoFields.map((item, idx) => (
                <div key={item.id} className="flex gap-2 items-center bg-white p-2 rounded-lg border">
                  <span className="flex-1 text-sm font-semibold text-gray-800 truncate">
                    {watch(`videos.${idx}`)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeVideo(idx)}
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
