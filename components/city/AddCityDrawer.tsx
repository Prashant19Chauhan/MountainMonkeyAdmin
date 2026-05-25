"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Globe, Compass, Info, Save } from "lucide-react";

import useCity from "@/hooks/useCity";
import { citySchema, CityInput } from "@/lib/validation/city.validation";

// Sections
import GeneralSection from "./sections/GeneralSection";
import SpatialSection from "./sections/SpatialSection";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cityHook: ReturnType<typeof useCity>;
}

export default function AddCityDrawer({ isOpen, onClose, cityHook }: Props) {
  const {
    formData,
    loading,
    error,
    isUpdateSuccess,
    resetForm,
  } = cityHook;

  const [activeTab, setActiveTab] = useState<"basic" | "coordinates">("basic");

  const methods = useForm<CityInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(citySchema) as any,
    defaultValues: formData || {},
  });

  // Sync form values once backend data is loaded
  useEffect(() => {
    if (formData) {
      methods.reset(formData);
    }
  }, [formData, methods]);

  // Handle drawer close after successful mutation
  useEffect(() => {
    if (isUpdateSuccess) {
      onClose();
    }
  }, [isUpdateSuccess, onClose]);

  const editMode = !!formData?._id;

  const onSubmit = (data: CityInput) => {
    if (editMode) {
      cityHook.updateCity(data);
    } else {
      cityHook.createCity(data);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-lg bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-5 md:px-8 py-4 md:py-6 bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-lg md:text-2xl font-black text-slate-900 tracking-tight">
                  {editMode ? "Update City" : "Register City"}
                </h2>
                <p className="text-[9px] md:text-[10px] text-slate-400 mt-0.5 md:mt-1 font-black uppercase tracking-[0.2em]">
                  {editMode ? "Modifying existing hub" : "Establishing new geographic anchor"}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-300 hover:text-slate-600 p-1.5 md:p-2 hover:bg-slate-50 rounded-xl transition-all"
              >
                <X size={20} className="md:w-6 md:h-6" />
              </button>
            </div>

            <FormProvider {...methods}>
              {/* Navigation Tabs */}
              <div className="flex px-4 md:px-6 border-b border-slate-50 bg-slate-50/30 overflow-x-auto no-scrollbar">
                {[
                  { id: "basic", label: "General", icon: <Globe size={14} /> },
                  { id: "coordinates", label: "Spatial", icon: <Compass size={14} /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-slate-900 text-slate-900 bg-white"
                        : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {/* Form */}
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="flex flex-col flex-1 overflow-y-auto bg-white"
              >
                <div className="p-5 md:p-8 space-y-6 md:space-y-8 pb-32">
                  {activeTab === "basic" && <GeneralSection />}
                  {activeTab === "coordinates" && <SpatialSection />}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3"
                    >
                      <Info className="text-rose-500 shrink-0" size={18} />
                      <p className="text-xs font-bold text-rose-600">{String(error)}</p>
                    </motion.div>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t p-5 md:p-8 flex gap-3 bg-white sticky bottom-0 z-10">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      methods.reset();
                      onClose();
                    }}
                    className="flex-1 rounded-2xl border border-slate-200 bg-white py-3 md:py-4 font-black text-slate-500 hover:bg-slate-50 transition-all uppercase text-[9px] md:text-[10px] tracking-[0.2em]"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-2 rounded-2xl bg-slate-900 py-3 md:py-4 px-6 md:px-10 font-black text-white hover:bg-black transition-all disabled:opacity-60 flex items-center justify-center gap-2 md:gap-3 shadow-xl shadow-slate-900/10 uppercase text-[9px] md:text-[10px] tracking-[0.2em]"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save size={14} />
                    )}
                    <span className="hidden xs:inline">
                      {loading ? "Processing..." : editMode ? "Update Archive" : "Establish City"}
                    </span>
                    <span className="xs:hidden">
                      {loading ? "Wait..." : editMode ? "Update" : "Establish"}
                    </span>
                  </button>
                </div>
              </form>
            </FormProvider>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}