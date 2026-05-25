"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Building2, MapPin, Bed, Shield, Settings, 
  Image as ImageIcon, DollarSign, Tag
} from "lucide-react";

import useStay from "@/hooks/useStay";
import { staySchemaValidation, StayInputType } from "@/lib/validation/stay.validation";

// Sections
import GeneralTab from "./sections/GeneralTab";
import LocationTab from "./sections/LocationTab";
import RoomsTab from "./sections/RoomsTab";
import PricingTab from "./sections/PricingTab";
import AmenitiesTab from "./sections/AmenitiesTab";
import SafetyTab from "./sections/SafetyTab";
import AIMetaTab from "./sections/AIMetaTab";
import ImagesTab from "./sections/ImagesTab";

type TabId = "basic" | "location" | "rooms" | "pricing" | "amenities" | "safety" | "ai-meta" | "images";

export default function AddStayDrawer({
  stayHook,
}: {
  stayHook: ReturnType<typeof useStay>;
}) {
  const {
    formData, 
    isCreateLoading, 
    isUpdateLoading, 
    editId,
    citiesData,
    destinationsData,
    createStay,
    updateStay,
  } = stayHook;

  const [activeTab, setActiveTab] = useState<TabId>("basic");

  const loading = isCreateLoading || isUpdateLoading;
  const cities = citiesData?.locations || [];
  const destinations = destinationsData?.data || [];

  const tabs = [
    { id: "basic" as const, label: "General", icon: <Building2 size={16}/> },
    { id: "location" as const, label: "Location", icon: <MapPin size={16}/> },
    { id: "rooms" as const, label: "Rooms", icon: <Bed size={16}/> },
    { id: "pricing" as const, label: "Pricing", icon: <DollarSign size={16}/> },
    { id: "amenities" as const, label: "Amenities", icon: <Settings size={16}/> },
    { id: "safety" as const, label: "Safety", icon: <Shield size={16}/> },
    { id: "ai-meta" as const, label: "AI Meta", icon: <Tag size={16}/> },
    { id: "images" as const, label: "Images", icon: <ImageIcon size={16}/> },
  ];

  const methods = useForm<StayInputType>({
    resolver: zodResolver(staySchemaValidation),
    defaultValues: formData || {},
  });

  // Sync form values once backend data is loaded/updated
  useEffect(() => {
    if (formData) {
      methods.reset(formData);
    }
  }, [formData, methods]);

  const onSubmit = (data: StayInputType) => {
    if (editId) {
      updateStay(data);
    } else {
      createStay(data);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col h-full bg-slate-50/10">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 md:px-6 py-4 bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-lg md:text-xl font-black text-slate-900">
              {editId ? "Edit Property" : "Add New Property"}
            </h2>
            <p className="text-[10px] md:text-xs text-slate-500 mt-1 font-black uppercase tracking-widest italic">
              {editId ? "Modify existing accommodation details" : "Register a new partner stay on the platform"}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex px-4 md:px-6 border-b border-slate-100 bg-white overflow-x-auto no-scrollbar whitespace-nowrap">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3.5 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 shrink-0 ${
                activeTab === tab.id 
                  ? 'border-slate-900 text-slate-900 bg-white shadow-[0_-4px_0_inset_#0f172a]' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-y-auto bg-slate-50/10">
          <div className="p-4 md:p-6 space-y-8 md:space-y-10 pb-32">
            {activeTab === "basic" && <GeneralTab destinations={destinations} cities={cities} />}
            {activeTab === "location" && <LocationTab />}
            {activeTab === "rooms" && <RoomsTab />}
            {activeTab === "pricing" && <PricingTab />}
            {activeTab === "amenities" && <AmenitiesTab />}
            {activeTab === "safety" && <SafetyTab />}
            {activeTab === "ai-meta" && <AIMetaTab />}
            {activeTab === "images" && <ImagesTab />}
          </div>

          {/* Footer */}
          <div className="border-t p-4 md:p-6 flex flex-col sm:flex-row gap-3 bg-white sticky bottom-0 border-t-slate-100 z-10">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 rounded-2xl bg-slate-900 py-3.5 font-black text-white hover:bg-black transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10 uppercase text-[10px] md:text-xs tracking-widest"
            >
              {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? "PROCESSING..." : editId ? "UPDATE PROPERTY" : "REGISTER STAY"}
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}