"use client";

import React, { useState, useEffect } from 'react';
import { X, BedDouble, HelpCircle, Save, Loader2 } from 'lucide-react';
import { Stay, StayRoom } from '@/types/type';

interface RoomPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  stay: Stay | null;
  isPending: boolean;
  onSave: (slug: string, roomPrices: { typeOfRoom: string; currentPrice: number }[]) => void;
}

export const RoomPriceModal = ({ isOpen, onClose, stay, isPending, onSave }: RoomPriceModalProps) => {
  const [prices, setPrices] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (stay && stay.rooms) {
      const initialPrices: { [key: string]: number } = {};
      stay.rooms.forEach((room: StayRoom) => {
        if (room.typeOfRoom) {
          initialPrices[room.typeOfRoom] = room.currentPrice || 0;
        }
      });
      setPrices(initialPrices);
    }
  }, [stay]);

  if (!isOpen || !stay) return null;

  const handlePriceChange = (roomType: string, value: number) => {
    setPrices((prev) => ({
      ...prev,
      [roomType]: Math.max(0, value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = Object.entries(prices).map(([typeOfRoom, currentPrice]) => ({
      typeOfRoom,
      currentPrice,
    }));
    onSave(stay.slug || '', payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm transition-all duration-300">
      {/* Backdrop click close */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />

      <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 max-w-md w-full shadow-2xl relative font-sans text-slate-800 animate-in fade-in zoom-in duration-200 z-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-600 cursor-pointer border-0"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="mb-6 flex gap-3.5 items-start">
          <div className="bg-blue-50 text-blue-600 w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs shrink-0 mt-0.5">
            <BedDouble size={22} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Room Rate Configuration</h3>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1 truncate max-w-[280px]">
              {stay.name}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Room lists */}
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {stay.rooms && stay.rooms.length > 0 ? (
              stay.rooms.map((room: StayRoom, i: number) => {
                const roomType = room.typeOfRoom || `Room #${i + 1}`;
                return (
                  <div
                    key={roomType}
                    className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-4 hover:border-slate-200 transition-all"
                  >
                    <div className="min-w-0">
                      <span className="text-xs font-black text-slate-800 block truncate">{roomType}</span>
                      <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">
                        Base: ₹{room.pricePerNight?.min || 0} - ₹{room.pricePerNight?.max || 0}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs font-bold text-slate-400">₹</span>
                      <input
                        type="number"
                        required
                        value={prices[roomType] !== undefined ? prices[roomType] : (room.currentPrice || 0)}
                        onChange={(e) => handlePriceChange(roomType, Number(e.target.value))}
                        placeholder="0"
                        className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 text-xs font-black text-slate-800 text-right"
                        min="0"
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-400 text-xs italic text-center py-4">No rooms configured for this stay.</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer border-0"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !stay.rooms || stay.rooms.length === 0}
              className="flex-1 py-3 px-4 bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-slate-900/10 active:scale-[0.98] transition-all cursor-pointer border-0 flex items-center justify-center gap-1.5 disabled:bg-slate-200 disabled:shadow-none"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              ) : (
                <>
                  <Save size={12} />
                  <span>Save Rates</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
