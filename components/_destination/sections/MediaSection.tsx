"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import ImageLibrary from "@/components/_imageUpload/imageLibrary";

const FieldHeader = ({ title, subtitle, icon }: { title: string; subtitle: string; icon: React.ReactNode }) => (
  <div className="mb-10 flex items-start gap-6">
    <div className="w-14 h-14 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-900 border border-slate-100 shadow-sm">
      {icon}
    </div>
    <div>
      <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{title}</h3>
      <p className="text-slate-400 text-sm font-medium mt-1 italic">{subtitle}</p>
    </div>
  </div>
);

const FormLabel = ({ children, required, hint }: { children: React.ReactNode; required?: boolean; hint?: string }) => (
  <div className="flex justify-between items-center mb-2.5">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
      {children} {required && <span className="text-rose-500">*</span>}
    </label>
    {hint && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{hint}</span>}
  </div>
);

const InputStyle = "w-full p-4 bg-slate-50/50 border border-slate-200 rounded-[1.25rem] text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-400 focus:bg-white transition-all placeholder:text-slate-400";

export default function MediaSection() {
  const {
    watch,
    setValue,
    register,
    formState: { errors },
  } = useFormContext();

  const images: string[] = watch("images") || [];
  const [imageLibraryOpen, setImageLibraryOpen] = useState(false);

  const handleImageSelect = (selected: { id: string; url: string }[]) => {
    const newUrls = selected.map((img) => img.url);
    setValue("images", [...images, ...newUrls], { shouldValidate: true });
    setImageLibraryOpen(false);
  };

  const removeImage = (index: number) => {
    setValue(
      "images",
      images.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <FieldHeader
        title="Visual Archive"
        icon={<ImageIcon size={24} />}
        subtitle="Deploy high-resolution visual assets to establish the aesthetic profile."
      />
      
      <div className="space-y-8">
        <div>
          <FormLabel hint="Max 8 files, 16:9 aspect ratio">Deploy Cinematic Stills</FormLabel>
          <div className="group border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 md:p-14 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all relative overflow-hidden">
            <button
              type="button"
              onClick={() => setImageLibraryOpen(true)}
              className="p-5 bg-white rounded-[2rem] shadow-xl mb-4 group-hover:scale-105 transition-transform border border-slate-100 relative z-10 text-blue-600 flex items-center justify-center"
            >
              <Upload size={32} />
            </button>
            <p className="font-black text-slate-900 text-sm tracking-tight relative z-10 text-center">
              Click button above to browse from Image Library
            </p>
            <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest relative z-10 text-center">
              Recommended: 1920×1080px (Max 5MB)
            </p>

            {images.length > 0 && (
              <div className="flex gap-3 flex-wrap mt-6 relative z-10 justify-center">
                {images.map((img, index) => (
                  <div key={index} className="relative group/img overflow-hidden rounded-xl">
                    <img
                      src={img}
                      alt={`Still ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-xl border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity shadow-lg"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
          {errors.images?.message && (
            <p className="text-red-500 text-xs font-semibold mt-1">{String(errors.images.message)}</p>
          )}
        </div>

        <div>
          <FormLabel hint="YouTube / Vimeo / Direct">Cinematic Intelligence URL</FormLabel>
          <input
            type="text"
            placeholder="Paste the cinematic link for video background..."
            className={InputStyle}
            {...register("videos.0")}
          />
        </div>
      </div>

      {imageLibraryOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ImageIcon className="text-pink-500" /> Select Destination Images
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
