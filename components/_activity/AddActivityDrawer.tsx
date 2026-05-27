"use client";

import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, MapPin, Clock, Shield, Tag, Image as ImageIcon, Users, Sparkles, Calendar } from "lucide-react";

import useActivity from "@/hooks/useActivity";
import { activityValidationSchema, ActivityInput } from "@/lib/validation/activity.validation";

// Sections
import PrimaryInfoSection from "./sections/PrimaryInfoSection";
import LocationSection from "./sections/LocationSection";
import TimingSection from "./sections/TimingSection";
import SafetySection from "./sections/SafetySection";
import PricingSection from "./sections/PricingSection";
import MediaSection from "./sections/MediaSection";
import TagsSection from "./sections/TagsSection";
import AIScoreSection from "./sections/AIScoreSection";
import ProvidersSection from "./sections/ProvidersSection";

export default function AddActivityDrawer({
  activityHook,
}: {
  activityHook: ReturnType<typeof useActivity> & {
    createActivity: (data: ActivityInput) => void;
    updateActivity: (data: ActivityInput) => void;
  };
}) {
  const {
    formData,
    isCreateLoading,
    isUpdateLoading,
    editActivityId,
    citiesData,
    destinationsData,
  } = activityHook;

  const loading = isCreateLoading || isUpdateLoading;
  const cities: any[] = citiesData?.data || [];
  const destinations: any[] = destinationsData?.data || [];

  const methods = useForm<ActivityInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(activityValidationSchema) as any,
    defaultValues: formData || {},
  });
  const { reset } = methods;

  // Sync form values once backend data is loaded/updated
  useEffect(() => {
    if (formData) {
      reset(formData);
    }
  }, [formData, reset]);

  const onSubmit = (data: ActivityInput) => {
    if (editActivityId) {
      activityHook.updateActivity(data);
    } else {
      activityHook.createActivity(data);
    }
  };

  return (
    <FormProvider {...methods}>
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 md:px-6 py-3 md:py-4 bg-white sticky top-0 z-10">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            {editActivityId ? "Edit Activity" : "Add New Activity"}
          </h2>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 space-y-8 md:space-y-10 pb-24">
          {/* 1. Primary Information */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-4">
              <Globe size={18} className="text-blue-500" />
              <span className="uppercase tracking-wider">Primary Information</span>
            </div>
            <PrimaryInfoSection destinations={destinations} />
          </section>

          {/* 2. Location Details */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-4">
              <MapPin size={18} className="text-red-500" />
              <span className="uppercase tracking-wider">Location Details</span>
            </div>
            <LocationSection cities={cities} />
          </section>

          {/* 3. Logistics & Timing */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-4">
              <Clock size={18} className="text-amber-500" />
              <span className="uppercase tracking-wider">Logistics & Timing</span>
            </div>
            <TimingSection />
          </section>

          {/* 4. Safety & Requirements */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-4">
              <Shield size={18} className="text-emerald-500" />
              <span className="uppercase tracking-wider">Safety & Requirements</span>
            </div>
            <SafetySection />
          </section>

          {/* 5. Pricing & Availability */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-4">
              <Tag size={18} className="text-purple-500" />
              <span className="uppercase tracking-wider">Pricing & Availability</span>
            </div>
            <PricingSection />
          </section>

          {/* 6. Media & Images */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-4">
              <ImageIcon size={18} className="text-pink-500" />
              <span className="uppercase tracking-wider">Media & Images</span>
            </div>
            <MediaSection />
          </section>

          {/* 7. Tags & Recommendations */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-4">
              <Users size={18} className="text-indigo-500" />
              <span className="uppercase tracking-wider">Tags & Recommendations</span>
            </div>
            <TagsSection />
          </section>

          {/* 8. AI & Analytics */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-4">
              <Sparkles size={18} className="text-yellow-500" />
              <span className="uppercase tracking-wider">AI & Analytics</span>
            </div>
            <AIScoreSection />
          </section>

          {/* 9. Providers */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-4">
              <Calendar size={18} className="text-cyan-500" />
              <span className="uppercase tracking-wider">Service Providers</span>
            </div>
            <ProvidersSection />
          </section>
        </div>

        {/* Footer */}
        <div className="border-t p-4 md:p-6 flex gap-3 bg-white sticky bottom-0 border-t-slate-100 z-10">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-xl bg-slate-900 py-2.5 md:py-3 text-sm font-bold text-white hover:bg-black transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
          >
            {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? "Processing..." : editActivityId ? "Update Activity" : "Create Activity"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}