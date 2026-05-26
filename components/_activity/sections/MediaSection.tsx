"use client";

import Image from "@/components/ui/Image";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Plus, X, Image as ImageIcon } from "lucide-react";
import ImageLibrary from "@/components/_imageUpload/imageLibrary";

export default function MediaSection() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [showImageLibrary, setShowImageLibrary] = useState(false);
  const images: string[] = watch("images") || [];

  const handleImageSelect = (selected: { id: string; url: string }[]) => {
    const urls = selected.map((img) => img.url);
    // Combine existing and new select
    const combined = Array.from(new Set([...images, ...urls]));
    setValue("images", combined, { shouldValidate: true });
    setShowImageLibrary(false);
  };

  const removeImage = (url: string) => {
    setValue(
      "images",
      images.filter((img) => img !== url),
      { shouldValidate: true }
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setShowImageLibrary(true)}
          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-400 hover:bg-pink-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-pink-600"
        >
          <Plus size={20} />
          <span className="font-semibold">Add Images from Library</span>
        </button>

        {errors.images?.message && (
          <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.images.message)}</p>
        )}

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((img, index) => (
              <div key={index} className="relative group">
                <Image
                  src={img}
                  alt="Activity image"
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(img)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Library Modal */}
      {showImageLibrary && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ImageIcon className="text-pink-500" /> Select Images
              </h3>
              <button
                type="button"
                onClick={() => setShowImageLibrary(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <ImageLibrary
                onSelect={handleImageSelect}
                onClose={() => setShowImageLibrary(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
