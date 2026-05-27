"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Navigation, Save, ChevronLeft, Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";

import useTravelRoute from "@/hooks/useTravelRoute";
import { travelRouteSchema, TravelRouteInput } from "@/lib/validation/travelRoute.validation";

// Sections
import RouteInfoSection from "./sections/RouteInfoSection";
import StepNavigator from "./sections/StepNavigator";
import StepEditorSection from "./sections/StepEditorSection";
import RouteVisualizerModal from "./sections/RouteVisualizerModal";

export default function TravelRouteForm({ 
  isUpdate = false, 
  travelRouteHook 
}: { 
  isUpdate?: boolean; 
  travelRouteHook: ReturnType<typeof useTravelRoute>; 
}) {
  const router = useRouter();
  const { 
    formData, 
    isCreateLoading, 
    isUpdateLoading,
    isUpdateSuccess,
    citiesData,
    createRoute,
    updateRoute
  } = travelRouteHook;

  const cities = citiesData?.locations || [];

  const [activeStepTab, setActiveStepTab] = useState(0);
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);

  const methods = useForm<TravelRouteInput>({
    resolver: zodResolver(travelRouteSchema),
    defaultValues: formData || {},
  });
  const { reset } = methods;

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "StepRoutes",
  });

  // Sync form values once backend data is loaded/updated
  useEffect(() => {
    if (formData) {
      reset(formData);
    }
  }, [formData, reset]);

  if (isUpdateSuccess) {
    router.push('/travel-routes');
  }

  const addStep = () => {
    const newStep = {
      stepId: `step-${Date.now()}`,
      from: { name: "", location: { address: "", mainCity: "" } },
      to: { name: "", location: { address: "", mainCity: "" } },
      travelDetails: { 
        mode: "Bus", 
        minCost: 0, 
        maxCost: 0, 
        duration: 0, 
        distance: 0, 
        difficultyInTravelling: "Easy",
        provider: ""
      },
      previousRoutesTrack: [],
      _parentStepId: "",
      isDestinationReached: false,
      totalMinCost: 0,
      totalMaxCost: 0,
      totalDuration: 0,
      totalDistance: 0,
      totalStops: 0
    };
    append(newStep);
    setActiveStepTab(fields.length);
  };

  const removeStep = (index: number) => {
    remove(index);
    if (activeStepTab >= fields.length - 1) {
      setActiveStepTab(Math.max(0, fields.length - 2));
    }
  };

  const onSubmit = (data: TravelRouteInput) => {
    // Auto-calculate cumulative totals for each step based on previousRoutesTrack
    const finalFormData = JSON.parse(JSON.stringify(data));
    finalFormData.StepRoutes = (finalFormData.StepRoutes || []).map((step: any) => {
       const getAncestors = (currentStepId: string): any[] => {
          const currentStep = finalFormData.StepRoutes.find((s: any) => s.stepId === currentStepId);
          if (!currentStep || !currentStep._parentStepId) return [];
          const parent = finalFormData.StepRoutes.find((s: any) => s.stepId === currentStep._parentStepId);
          if (!parent) return [];
          return [...getAncestors(parent.stepId), parent];
       };

       const ancestors = getAncestors(step.stepId).filter(Boolean);
       const previousRoutesTrack = [...ancestors.map(a => a.stepId), step.stepId];

       let totalMinCost = step.travelDetails.minCost || 0;
       let totalMaxCost = step.travelDetails.maxCost || 0;
       let totalDuration = step.travelDetails.duration || 0;
       let totalDistance = step.travelDetails.distance || 0;
       let totalStops = ancestors.length;

       ancestors.forEach((s: any) => {
           totalMinCost += (s.travelDetails.minCost || 0);
           totalMaxCost += (s.travelDetails.maxCost || 0);
           totalDuration += (s.travelDetails.duration || 0);
           totalDistance += (s.travelDetails.distance || 0);
       });

       const finalStep = {
           ...step,
           previousRoutesTrack,
           totalMinCost,
           totalMaxCost,
           totalDuration,
           totalDistance,
           totalStops
       };

       delete finalStep._parentStepId;
       return finalStep;
    });

    if (isUpdate && finalFormData._id) {
      updateRoute(finalFormData);
    } else {
      createRoute(finalFormData);
    }
  };

  const loading = isCreateLoading || isUpdateLoading;

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
                className="p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <ChevronLeft size={22} className="text-slate-600" />
              </button>
              <div className="text-left">
                <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                  {isUpdate ? "Update Travel Route" : "Create New Itinerary"}
                </h1>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  Configure multi-stop travel routes with detailed logistics
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 w-full lg:w-auto">
              <button 
                type="button"
                onClick={() => setIsVisualizerOpen(true)}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 active:scale-95"
              >
                <Navigation size={16} />
                Visualize Route
              </button>
              <button 
                type="button"
                onClick={() => router.back()}
                className="flex-1 lg:flex-none px-5 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="travel-route-form"
                disabled={loading}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:from-slate-800 hover:to-slate-700 transition-all duration-200 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {isUpdate ? "Update" : "Save Route"}
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        <form 
          id="travel-route-form" 
          onSubmit={methods.handleSubmit(onSubmit)} 
          className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6"
        >
          {/* Route Overview Card */}
          <RouteInfoSection cities={cities} />

          {/* Transit Steps Section */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
              <div>
                <h2 className="text-lg font-black uppercase tracking-wide text-slate-800">Transit Steps</h2>
                <p className="text-xs text-slate-500 font-semibold">Define each leg of your journey</p>
              </div>
              <button 
                type="button"
                onClick={addStep}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-105 active:scale-95"
              >
                + Add New Step
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Steps Navigator */}
              <div className="xl:col-span-4 space-y-3">
                <StepNavigator
                  activeStepTab={activeStepTab}
                  setActiveStepTab={setActiveStepTab}
                  addStep={addStep}
                  removeStep={removeStep}
                />
              </div>

              {/* Step Editor */}
              <div className="xl:col-span-8">
                {fields[activeStepTab] ? (
                  <StepEditorSection
                    stepIndex={activeStepTab}
                    cities={cities}
                  />
                ) : (
                  <div className="h-full min-h-[600px] bg-gradient-to-br from-slate-50 to-blue-50/30 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-slate-900/5">
                      <Navigation size={40} className="text-slate-300" />
                    </div>
                    <h3 className="text-base font-black uppercase tracking-wide text-slate-800 mb-2">Step Editor</h3>
                    <p className="text-sm text-slate-500 max-w-md">
                      Select a step from the navigator or add a new step to start configuring your route
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </form>

        <RouteVisualizerModal 
          isOpen={isVisualizerOpen} 
          onClose={() => setIsVisualizerOpen(false)} 
          formData={methods.watch()} 
        />
      </div>
    </FormProvider>
  );
}