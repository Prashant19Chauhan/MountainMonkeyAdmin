"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  ChevronLeft, Globe, MapPin, Tag, DollarSign, 
  Image as ImageIcon, Sparkles, Star, Layout, 
  Compass, Zap, ShieldCheck, Save, ArrowRight, Check
} from "lucide-react";
import { useRouter } from "next/navigation";

import useDestination from "@/hooks/useDestination";
import { destinationSchema, destinationInput } from "@/lib/validation/destination.validation";
import useCity from "@/hooks/useCity";

// Sections
import BasicInfoSection from "./sections/BasicInfoSection";
import LocationSection from "./sections/LocationSection";
import ClassificationSection from "./sections/ClassificationSection";
import BudgetSection from "./sections/BudgetSection";
import MediaSection from "./sections/MediaSection";
import AIMetadataSection from "./sections/AIMetadataSection";
import HighlightsSection from "./sections/HighlightsSection";

const SECTIONS = [
  { id: 'basic', label: 'Identity', icon: <Globe size={18} />, sub: 'Name & Story' },
  { id: 'location', label: 'Geography', icon: <MapPin size={18} />, sub: 'Spatial Data' },
  { id: 'classification', label: 'DNA', icon: <Tag size={18} />, sub: 'Categories' },
  { id: 'budget', label: 'Economics', icon: <DollarSign size={18} />, sub: 'Price Tiers' },
  { id: 'media', label: 'Visuals', icon: <ImageIcon size={18} />, sub: 'Gallery' },
  { id: 'ai', label: 'Intelligence', icon: <Sparkles size={18} />, sub: 'ML Metadata' },
  { id: 'highlights', label: 'Experiences', icon: <Star size={18} />, sub: 'Sell Points' },
];

export default function CreateDestination({
  destinationHook,
}: {
  destinationHook: ReturnType<typeof useDestination>;
}) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const {
    formData, 
    createDestination, 
    updateDestination, 
    isCreateDestinationLoading, 
    isUpdateDestinationLoading
  } = destinationHook;
  const { citiesData, isCitiesLoading } = useCity();

  console.log(citiesData)

  const handleNext = () => setCurrentStep(s => Math.min(s + 1, SECTIONS.length - 1));
  const handleBack = () => setCurrentStep(s => Math.max(s - 1, 0));

  const progress = ((currentStep + 1) / SECTIONS.length) * 100;
  const isUpdate = !!formData._id;
  const loading = isCreateDestinationLoading || isUpdateDestinationLoading;

  const methods = useForm<destinationInput>({
    resolver: zodResolver(destinationSchema),
    defaultValues: formData || {},
  });

  // Sync form values once backend data is loaded/updated
  useEffect(() => {
    if (formData) {
      // Flatten mainCity if it is an object
      const doc = { ...formData };
      if (doc.mainCity && typeof doc.mainCity === "object") {
        doc.mainCity = (doc.mainCity as any)._id || "";
      }
      methods.reset(doc);
    }
  }, [formData, methods]);

  const onSubmit = (data: destinationInput) => {
    if (isUpdate) {
      updateDestination(data);
    } else {
      createDestination(data);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-[#FDFDFF] flex flex-col font-sans text-slate-900 overflow-hidden">
        {/* Dynamic Background Accents */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-50/50 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-50/50 blur-[120px] rounded-full" />
        </div>

        {/* Modern Top Header */}
        <header className="relative z-20 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-4 md:px-8 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-6">
            <button 
              type="button"
              onClick={() => router.back()}
              className="group p-2 md:p-2.5 bg-white hover:bg-slate-900 rounded-xl md:rounded-2xl border border-slate-200 transition-all duration-300 shadow-sm"
            >
              <ChevronLeft size={18} className="text-slate-600 group-hover:text-white transition-colors" />
            </button>
            <div className="text-left">
              <div className="flex items-center gap-2 mb-0.5">
                <Layout size={10} className="text-slate-400" />
                <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Archival System</span>
              </div>
              <h1 className="text-sm md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                {isUpdate ? "Optimize Catalog" : "Create Destination"}
                {isUpdate && <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] rounded-md border border-indigo-100">Live Edition</span>}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button 
              type="button"
              onClick={() => router.back()}
              className="hidden sm:flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-white text-slate-600 border border-slate-200 rounded-xl md:rounded-2xl text-xs font-black hover:bg-slate-50 transition-all uppercase tracking-widest"
            >
              Cancel
            </button>
            <button 
              type="button"
              disabled={loading}
              onClick={methods.handleSubmit(onSubmit)}
              className="group flex items-center gap-2 md:gap-3 px-4 md:px-8 py-2.5 md:py-3 bg-slate-900 text-white rounded-xl md:rounded-[1.25rem] text-[10px] md:text-xs font-black hover:bg-black transition-all shadow-xl shadow-slate-900/10 uppercase tracking-widest disabled:opacity-50"
            >
              {loading ? (
                <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <Zap size={14} className="text-yellow-400" />
              )}
              <span className="hidden sm:inline">{isUpdate ? "Update Database" : "Launch Destination"}</span>
              <span className="sm:hidden">{isUpdate ? "Update" : "Launch"}</span>
            </button>
          </div>
        </header>

        {/* Main Grid Layout */}
        <div className="relative z-10 flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-6 gap-8 overflow-hidden">
          {/* Futuristic Sidebar */}
          <aside className="w-full md:w-80 space-y-6 flex flex-col">
            <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-[2.5rem] p-6 shadow-sm flex-1">
              <div className="mb-8 px-2 flex items-center justify-between">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Compass size={14} /> Registry Flow
                </h2>
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{Math.round(progress)}%</span>
              </div>

              <nav className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible no-scrollbar pb-2 md:pb-0">
                {SECTIONS.map((step, index) => (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setCurrentStep(index)}
                    className={`flex-none md:w-full group flex items-center gap-3 md:gap-4 px-3 md:px-4 py-3 md:py-4 rounded-2xl md:rounded-[1.5rem] text-left transition-all duration-500 relative overflow-hidden ${
                      currentStep === index 
                        ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20 md:translate-x-2' 
                        : 'text-slate-500 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <div className={`p-2 md:p-2.5 rounded-xl md:rounded-2xl transition-all duration-300 ${
                      currentStep === index 
                        ? 'bg-white/10 text-white rotate-0' 
                        : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:rotate-12'
                    }`}>
                      {step.icon}
                    </div>
                    <div className="flex-1 min-w-[70px] md:min-w-0 text-left">
                      <div className={`text-[9px] md:text-[11px] font-black uppercase tracking-widest ${currentStep === index ? 'text-white' : 'text-slate-900'}`}>
                        {step.label}
                      </div>
                      <div className={`hidden md:block text-[9px] font-bold mt-0.5 ${currentStep === index ? 'text-slate-400' : 'text-slate-400'}`}>
                        {step.sub}
                      </div>
                    </div>
                    {index < currentStep && (
                      <div className="p-1 bg-emerald-500 rounded-full text-white shrink-0">
                        <Check size={8} />
                      </div>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Quick Context Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-100">
              <Sparkles className="absolute -right-4 -bottom-4 opacity-10" size={140} />
              <div className="relative z-10 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <ShieldCheck size={16} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">Data Integrity</span>
                </div>
                <h4 className="text-lg font-black tracking-tight leading-tight">Optimization Engine</h4>
                <p className="text-[10px] font-bold text-indigo-100 mt-3 leading-relaxed opacity-80">
                  Complete all intelligence fields to maximize the AI matching score for travelers.
                </p>
              </div>
            </div>
          </aside>

          {/* Dynamic Form Content */}
          <main className="flex-1 bg-white border border-slate-200 rounded-[3rem] shadow-sm flex flex-col relative overflow-hidden">
            {/* Visual Accent */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
            
            <form onSubmit={methods.handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
              <div className="p-5 md:p-10 flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-3xl mx-auto py-2 md:py-4">
                  {currentStep === 0 && <BasicInfoSection />}
                  {currentStep === 1 && <LocationSection citiesData={citiesData} isCitiesLoading={isCitiesLoading} />}
                  {currentStep === 2 && <ClassificationSection />}
                  {currentStep === 3 && <BudgetSection />}
                  {currentStep === 4 && <MediaSection />}
                  {currentStep === 5 && <AIMetadataSection />}
                  {currentStep === 6 && <HighlightsSection />}
                </div>
              </div>

              {/* Intelligent Footer Controls */}
              <div className="p-4 md:p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <button 
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="group flex items-center gap-1 md:gap-2 px-4 md:px-6 py-2 md:py-3 text-[9px] md:text-[11px] font-black text-slate-400 hover:text-slate-900 transition-all uppercase tracking-widest disabled:opacity-0 animate-in fade-in"
                >
                  <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back
                </button>
                
                <div className="flex items-center gap-3 md:gap-6">
                  <div className="hidden sm:flex gap-1.5 md:gap-2">
                    {SECTIONS.map((_, i) => (
                      <div key={i} className={`h-1 md:h-1.5 rounded-full transition-all duration-500 ${i === currentStep ? 'w-6 md:w-8 bg-slate-900' : 'w-1 md:w-1.5 bg-slate-200'}`} />
                    ))}
                  </div>
                  {currentStep < SECTIONS.length - 1 ? (
                    <button 
                      type="button"
                      onClick={handleNext}
                      className="group flex items-center gap-2 md:gap-3 px-6 md:px-10 py-3 md:py-4 bg-slate-900 text-white rounded-xl md:rounded-[1.5rem] text-[9px] md:text-[11px] font-black hover:bg-black transition-all shadow-xl shadow-slate-900/20 uppercase tracking-[0.15em]"
                    >
                      Next <span className="hidden xs:inline">Section</span> <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <button 
                      type="submit"
                      disabled={loading}
                      className="group flex items-center gap-2 md:gap-3 px-6 md:px-10 py-3 md:py-4 bg-slate-900 text-white rounded-xl md:rounded-[1.5rem] text-[9px] md:text-[11px] font-black hover:bg-black transition-all shadow-xl shadow-slate-900/20 uppercase tracking-[0.15em] disabled:opacity-50"
                    >
                      {loading ? "SAVING..." : isUpdate ? "UPDATE DATABASE" : "LAUNCH DESTINATION"} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            </form>
          </main>
        </div>
      </div>
    </FormProvider>
  );
}