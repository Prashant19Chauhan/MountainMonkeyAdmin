"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Calendar, Clock, DollarSign, Activity, ChevronLeft, Tags, Info, Save, Loader2 
} from "lucide-react";
import { useRouter } from "next/navigation";

import useDestination from "@/hooks/useDestination";
import useActivity from "@/hooks/useActivity";
import useStay from "@/hooks/useStay";
import usePackage from "@/hooks/usePackage";
import { createPackageSchema, CreatePackageFormValues } from "@/lib/validation/package.validation";

// Sections
import BasicInfoTab from "./sections/BasicInfoTab";
import ItineraryLogisticsTab from "./sections/ItineraryLogisticsTab";
import EntitiesTab from "./sections/EntitiesTab";
import PricingLimitsTab from "./sections/PricingLimitsTab";
import MediaMetadataTab from "./sections/MediaMetadataTab";

export default function PackageForm({
  isUpdate = false,
  packageHook,
}: {
  isUpdate?: boolean;
  packageHook: ReturnType<typeof usePackage> & {
    createPackage: (data: CreatePackageFormValues) => void;
    updatePackage: (payload: { id: string; data: Partial<CreatePackageFormValues> }) => void;
  };
}) {
  const router = useRouter();
  const {
    formData,
    packageId,
    isCreatePackageLoading,
    isUpdatePackageLoading,
  } = packageHook;

  // External data relations
  const { destinationsData } = useDestination();
  const { activitiesData } = useActivity();
  const { staysData } = useStay();

  const destinations = destinationsData?.data || [];
  const activities = activitiesData?.data?.activities || [];
  const accommodationsList = staysData?.data || [];

  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, label: "Basic Info", icon: <Info size={16} /> },
    { id: 1, label: "Itinerary & Logistics", icon: <Calendar size={16} /> },
    { id: 2, label: "Entities", icon: <Activity size={16} /> },
    { id: 3, label: "Pricing & Limits", icon: <DollarSign size={16} /> },
    { id: 4, label: "Media & Metadata", icon: <Tags size={16} /> },
  ];

  const methods = useForm<CreatePackageFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createPackageSchema) as any,
    defaultValues: formData || {},
  });
  const { reset } = methods;

  // Sync form values when hook data changes
  useEffect(() => {
    if (formData) {
      reset(formData);
    }
  }, [formData, reset]);

  const extractId = (val: any) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    return val._id || val.id || "";
  };

  const prepareSubmitData = (data: CreatePackageFormValues) => {
    const submitData = JSON.parse(JSON.stringify(data));
    if (submitData.destination) {
      submitData.destination.id = extractId(submitData.destination.id);
    }
    if (Array.isArray(submitData.activities)) {
      submitData.activities = submitData.activities.map((act: any) => ({
        ...act,
        id: extractId(act.id),
      }));
    }
    if (Array.isArray(submitData.accommodations)) {
      submitData.accommodations = submitData.accommodations.map((acc: any) => ({
        ...acc,
        stayId: extractId(acc.stayId),
      }));
    }
    return submitData;
  };

  const onSubmit: SubmitHandler<CreatePackageFormValues> = (data) => {
    const submitData = prepareSubmitData(data);
    if (isUpdate && packageId) {
      packageHook.updatePackage({ id: packageId, data: submitData });
    } else {
      packageHook.createPackage(submitData);
    }
  };

  const loading = isCreatePackageLoading || isUpdatePackageLoading;

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 pb-20 font-sans text-slate-900">
        {/* Sticky Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 md:px-8 py-4 sticky top-0 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200"
              >
                <ChevronLeft size={22} className="text-slate-600" />
              </button>
              <div className="text-left">
                <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                  {isUpdate ? "Update Package" : "Create New Package"}
                </h1>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  Configure comprehensive multi-day travel bundles
                </p>
              </div>
            </div>

            <div className="flex gap-3 w-full lg:w-auto">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-5 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={methods.handleSubmit(onSubmit)}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:from-slate-800 hover:to-slate-700 transition-all duration-200 shadow-lg shadow-slate-900/20 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} /> {isUpdate ? "Update" : "Save Package"}
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Tabs Navigation Sidebar */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-3xl p-4 border border-slate-200/60 shadow-lg shadow-slate-900/5 sticky top-32 text-left">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 px-2">
                  Configuration Steps
                </h3>
                <nav className="space-y-1">
                  {tabs.map((tab, idx) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(idx)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
                        activeTab === idx
                          ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-500/10"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span className={`${activeTab === idx ? "text-blue-600" : "text-slate-400"}`}>
                        {tab.icon}
                      </span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Form Content Area */}
            <div className="xl:col-span-3">
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/60 shadow-lg shadow-slate-900/5 min-h-[600px]"
              >
                {activeTab === 0 && <BasicInfoTab destinations={destinations} />}
                {activeTab === 1 && <ItineraryLogisticsTab />}
                {activeTab === 2 && (
                  <EntitiesTab activities={activities} accommodationsList={accommodationsList} />
                )}
                {activeTab === 3 && <PricingLimitsTab />}
                {activeTab === 4 && <MediaMetadataTab />}
              </form>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
