"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Image as ImageIcon, X } from "lucide-react";
import ImageLibrary from "@/components/_imageUpload/imageLibrary";

export default function ImagesTab() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const images: string[] = watch("images") || [];
  const [imageLibraryOpen, setImageLibraryOpen] = useState(false);

  const handleImageSelect = (selected: { id: string; url: string }[]) => {
    const newUrls = selected.map((img) => img.url);
    setValue("images", [...images, ...newUrls], { shouldValidate: true });
    setImageLibraryOpen(false);
  };

  const removePropertyImage = (index: number) => {
    setValue(
      "images",
      images.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">
          Property Images
        </h3>
        
        <button
          type="button"
          onClick={() => setImageLibraryOpen(true)}
          className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-sm font-black text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
        >
          <ImageIcon size={18} /> ADD PROPERTY IMAGE
        </button>

        {errors.images?.message && (
          <p className="text-red-500 text-xs font-semibold mt-1">
            {String(errors.images.message)}
          </p>
        )}

        {images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {images.map((imageUrl, index) => (
              <div key={index} className="relative group overflow-hidden rounded-xl">
                <img
                  src={imageUrl}
                  alt={`Property ${index + 1}`}
                  className="w-full h-32 object-cover rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all"
                />
                <button
                  type="button"
                  onClick={() => removePropertyImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                >
                  <X size={14} />
                </button>
                <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                  Image {index + 1}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-sm font-medium">
            No images added yet
          </div>
        )}
      </div>

      {imageLibraryOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ImageIcon className="text-pink-500" /> Select Property Images
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
