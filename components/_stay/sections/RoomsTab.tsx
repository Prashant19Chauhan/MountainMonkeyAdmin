"use client";

import React, { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Bed, Image as ImageIcon, X } from "lucide-react";
import ImageLibrary from "../../_imageUpload/imageLibrary";

export default function RoomsTab() {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rooms",
  });

  const [imageLibraryOpen, setImageLibraryOpen] = useState(false);
  const [activeRoomIdx, setActiveRoomIdx] = useState<number | null>(null);

  const openImageLibrary = (roomIdx: number) => {
    setActiveRoomIdx(roomIdx);
    setImageLibraryOpen(true);
  };

  const handleImageSelect = (selected: { id: string; url: string }[]) => {
    if (activeRoomIdx !== null) {
      const current = watch(`rooms.${activeRoomIdx}.roomImages`) || [];
      const newUrls = selected.map((img) => img.url);
      setValue(`rooms.${activeRoomIdx}.roomImages`, [...current, ...newUrls], { shouldValidate: true });
    }
    setImageLibraryOpen(false);
  };

  const removeRoomImage = (roomIdx: number, imgIdx: number) => {
    const current = watch(`rooms.${roomIdx}.roomImages`) || [];
    setValue(
      `rooms.${roomIdx}.roomImages`,
      current.filter((_: string, i: number) => i !== imgIdx),
      { shouldValidate: true }
    );
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Available Room Categories
        </h3>
        <button
          type="button"
          onClick={() =>
            append({
              typeOfRoom: "Deluxe",
              pricePerNight: { min: 0, max: 0 },
              capacity: 2,
              amenities: [],
              availability: { totalRooms: 5, availableRooms: 5 },
              roomImages: [],
            })
          }
          className="text-[10px] font-black bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-black transition-all flex items-center gap-1.5 shadow-lg shadow-slate-900/10"
        >
          <Plus size={14} /> ADD ROOM TYPE
        </button>
      </div>

      {errors.rooms?.message && (
        <p className="text-red-500 text-xs font-semibold">{String(errors.rooms.message)}</p>
      )}

      {fields.map((field, idx) => {
        const roomsErrors = errors.rooms as any;
        const rowErrors = roomsErrors?.[idx];
        const roomImages = watch(`rooms.${idx}.roomImages`) || [];
        const amenities = watch(`rooms.${idx}.amenities`) || [];

        return (
          <div
            key={field.id}
            className="p-5 bg-white border border-slate-200 rounded-3xl relative shadow-sm hover:shadow-md transition-shadow space-y-4"
          >
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(idx)}
                className="absolute -top-2 -right-2 bg-white border border-slate-100 text-slate-400 hover:text-red-500 p-1.5 rounded-full shadow-lg transition-colors z-10"
              >
                <Trash2 size={16} />
              </button>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Category</label>
                <input
                  type="text"
                  {...register(`rooms.${idx}.typeOfRoom` as const)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800"
                />
                {rowErrors?.typeOfRoom?.message && (
                  <p className="text-red-500 text-xs font-semibold mt-1">
                    {String(rowErrors.typeOfRoom.message)}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Max Capacity</label>
                <input
                  type="number"
                  {...register(`rooms.${idx}.capacity` as const, { valueAsNumber: true })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800"
                />
                {rowErrors?.capacity?.message && (
                  <p className="text-red-500 text-xs font-semibold mt-1">
                    {String(rowErrors.capacity.message)}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Min Price</label>
                  <input
                    type="number"
                    {...register(`rooms.${idx}.pricePerNight.min` as const, { valueAsNumber: true })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800"
                  />
                  {rowErrors?.pricePerNight?.min?.message && (
                    <p className="text-red-500 text-[10px] font-semibold">
                      {String(rowErrors.pricePerNight.min.message)}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Max Price</label>
                  <input
                    type="number"
                    {...register(`rooms.${idx}.pricePerNight.max` as const, { valueAsNumber: true })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800"
                  />
                  {rowErrors?.pricePerNight?.max?.message && (
                    <p className="text-red-500 text-[10px] font-semibold">
                      {String(rowErrors.pricePerNight.max.message)}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Total Inventory</label>
                  <input
                    type="number"
                    {...register(`rooms.${idx}.availability.totalRooms` as const, {
                      valueAsNumber: true,
                    })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800"
                  />
                  {rowErrors?.availability?.totalRooms?.message && (
                    <p className="text-red-500 text-[10px] font-semibold">
                      {String(rowErrors.availability.totalRooms.message)}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Available Now</label>
                  <input
                    type="number"
                    {...register(`rooms.${idx}.availability.availableRooms` as const, {
                      valueAsNumber: true,
                    })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium text-gray-800"
                  />
                  {rowErrors?.availability?.availableRooms?.message && (
                    <p className="text-red-500 text-[10px] font-semibold">
                      {String(rowErrors.availability.availableRooms.message)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {rowErrors?.pricePerNight?.message && (
              <p className="text-red-500 text-xs font-semibold">{String(rowErrors.pricePerNight.message)}</p>
            )}
            {rowErrors?.availability?.message && (
              <p className="text-red-500 text-xs font-semibold">{String(rowErrors.availability.message)}</p>
            )}

            {/* Room Amenities */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">
                Room Amenities (comma-separated)
              </label>
              <input
                placeholder="e.g. AC, TV, Mini Bar, Balcony"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-200 text-gray-800"
                defaultValue={amenities.join(", ")}
                onBlur={(e) => {
                  const items = e.target.value
                    .split(",")
                    .map((i) => i.trim())
                    .filter(Boolean);
                  setValue(`rooms.${idx}.amenities`, items, { shouldValidate: true });
                }}
              />
              <div className="flex flex-wrap gap-1.5 mt-1">
                {amenities.map((item: string) => (
                  <span
                    key={item}
                    className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold border border-slate-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Room Images */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Room Images</label>
              <button
                type="button"
                onClick={() => openImageLibrary(idx)}
                className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-[10px] font-black text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <ImageIcon size={14} /> ADD IMAGE
              </button>

              {roomImages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {roomImages.map((imageUrl: string, imgIdx: number) => (
                    <div key={imgIdx} className="relative group overflow-hidden rounded-lg">
                      <img
                        src={imageUrl}
                        alt={`Room type ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeRoomImage(idx, imgIdx)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {imageLibraryOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ImageIcon className="text-pink-500" /> Select Room Images
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
