"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { 
  Globe, 
  MapPin, 
  Sparkles, 
  Star, 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Rocket, 
  Plus, 
  Trash2, 
  X, 
  ShieldAlert 
} from "lucide-react";
import { LocalInfoInputType } from "@/lib/validation/localInfo.validation";
import ImageLibrary from "../_imageUpload/imageLibrary";

interface AddLocalInfoFormProps {
  localInfoHook: any; // Type with ReturnType<typeof useLocalInfo>
}

type TabType = "basic" | "foodPlaces" | "cultureSafety" | "extra";

interface SidebarStep {
  id: TabType;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
}

export default function AddLocalInfoForm({ localInfoHook }: AddLocalInfoFormProps) {
  const {
    formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    destinationsData,
    isCreateLoading,
    isUpdateLoading,
    editId,
  } = localInfoHook;

  const [activeTab, setActiveTab] = useState<TabType>("basic");
  const [imageModal, setImageModal] = useState<{
    isOpen: boolean;
    targetPath: { type: "food" | "place"; index: number };
  } | null>(null);

  const isLoading = isCreateLoading || isUpdateLoading;

  // Sidebar Layout Definition
  const steps: SidebarStep[] = [
    { id: "basic", title: "IDENTITY", subtitle: "Name & Story", icon: Globe },
    { id: "foodPlaces", title: "GEOGRAPHY", subtitle: "Food & Places", icon: MapPin },
    { id: "cultureSafety", title: "INTELLIGENCE", subtitle: "Culture & Safety", icon: Sparkles },
    { id: "extra", title: "EXPERIENCES", subtitle: "Extra Details", icon: Star },
  ];

  const tabOrder: TabType[] = ["basic", "foodPlaces", "cultureSafety", "extra"];
  const currentStepIndex = tabOrder.indexOf(activeTab);

  // ==========================================
  // REAL-TIME STEP VALIDATION CRITERIA
  // ==========================================
  const validateCurrentStep = (): { isValid: boolean; reason?: string } => {
    if (activeTab === "basic") {
      if (!formData.destinationId) return { isValid: false, reason: "Please choose a target destination designation." };
      if (!formData.currency) return { isValid: false, reason: "Local Base Currency parameter is required." };
    }
    
    if (activeTab === "foodPlaces") {
      // Validate Famous Food Array values if populated
      for (let i = 0; i < formData.famousFood.length; i++) {
        if (!formData.famousFood[i].name) return { isValid: false, reason: `Food item #${i + 1} requires a valid name descriptor.` };
        if (!formData.famousFood[i].typeOfFood) return { isValid: false, reason: `Please define a category type for "${formData.famousFood[i].name || 'Item'}"` };
      }
      // Validate Places Array values if populated
      for (let i = 0; i < formData.famousPlaces.length; i++) {
        const place = formData.famousPlaces[i];
        if (!place.name) return { isValid: false, reason: `Landmark spot #${i + 1} requires an explicit display name.` };
        if (!place.type) return { isValid: false, reason: `Asset classification type missing on landmark item #${i + 1}.` };
      }
    }

    if (activeTab === "cultureSafety") {
      if (formData.safety?.overallSafety < 1 || formData.safety?.overallSafety > 10) {
        return { isValid: false, reason: "Safety weight scaling metric must be framed between 1 and 10." };
      }
    }

    return { isValid: true };
  };

  const validation = validateCurrentStep();

  // Navigation Controllers
  const handleNext = () => {
    if (!validation.isValid) return;
    if (currentStepIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentStepIndex + 1]);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setActiveTab(tabOrder[currentStepIndex - 1]);
    }
  };

  // Dynamic Visual Progress Percent Calculation
  const calculateProgress = () => {
    return Math.round(((currentStepIndex + 1) / tabOrder.length) * 100);
  };

  // ==========================================
  // ARRAY STATE MODIFIERS
  // ==========================================
  const handleArrayStringChange = (field: "language" | "dos" | "donts" | "localTips", index: number, value: string) => {
    setFormData((prev: any) => {
      const updatedArray = [...prev[field]];
      updatedArray[index] = value;
      return { ...prev, [field]: updatedArray };
    });
  };

  const addArrayStringRow = (field: "language" | "dos" | "donts" | "localTips") => {
    setFormData((prev: any) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayStringRow = (field: "language" | "dos" | "donts" | "localTips", index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index),
    }));
  };

  const handleNestedArrayObjectChange = (arrayField: string, index: number, key: string, value: any) => {
    setFormData((prev: any) => {
      const updatedArray = [...prev[arrayField]];
      updatedArray[index] = { ...updatedArray[index], [key]: value };
      return { ...prev, [arrayField]: updatedArray };
    });
  };

  const handleDeepNestedArrayChange = (parentArray: "famousFood", parentIndex: number, childArray: "bestPlaces", childIndex: number, key: string, value: string) => {
    setFormData((prev: any) => {
      const updatedParent = [...prev[parentArray]];
      const updatedChild = [...updatedParent[parentIndex][childArray]];
      updatedChild[childIndex] = { ...updatedChild[childIndex], [key]: value };
      updatedParent[parentIndex] = { ...updatedParent[parentIndex], [childArray]: updatedChild };
      return { ...prev, [parentArray]: updatedParent };
    });
  };

  const handleImageSelect = (images: { id: string; url: string }[]) => {
    if (!imageModal) return;
    const { type, index } = imageModal.targetPath;
    const arrayField = type === "food" ? "famousFood" : "famousPlaces";

    const imageUrls = images.map((image) => image.url);

    setFormData((prev: any) => {
      const updatedArray = [...prev[arrayField]];
      const currentImages = updatedArray[index].images || [];
      updatedArray[index] = { ...updatedArray[index], images: [...currentImages, ...imageUrls] };
      return { ...prev, [arrayField]: updatedArray };
    });
    setImageModal(null);
  };

  // Framer Motion Animation Settings
  const slideVariants: Variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.25, ease: "easeOut" as const } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.15 } }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-[#0F172A] p-4 md:p-8">
      
      {/* Dynamic Shell Dashboard Toolbar Header */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <span className="text-xs uppercase font-black tracking-widest text-slate-400 flex items-center gap-1.5">
            🗄️ Archival System
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0B132B]">
            {editId ? "Modify Destination Info" : "Create Destination"}
          </h1>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => alert("Draft state cached successfully!")}
            className="flex-1 sm:flex-initial px-5 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold tracking-wide rounded-full text-xs uppercase shadow-sm flex items-center justify-center gap-2 transition-all"
          >
            <Save className="w-3.5 h-3.5" /> Save Draft
          </button>
          <button
            type="submit"
            form="localInfoForm"
            disabled={isLoading || !validateCurrentStep().isValid}
            className="flex-1 sm:flex-initial px-6 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white font-bold tracking-wide rounded-full text-xs uppercase shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Rocket className="w-3.5 h-3.5" /> {isLoading ? "Processing..." : "Launch Destination"}
          </button>
        </div>
      </div>

      {/* Main Structural Layout Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT CARD COLUMN: Tab Progress & Form State Navigation */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center px-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Registry Flow</span>
            <span className="text-xs bg-indigo-50 text-indigo-600 font-black px-2.5 py-0.5 rounded-full transition-all">
              {calculateProgress()}%
            </span>
          </div>

          {/* Form Processing Interactive Tab Sidebar Link Items */}
          <div className="space-y-2">
            {steps.map((step) => {
              const isSelected = activeTab === step.id;
              const StepIcon = step.icon;
              return (
                <button
                  key={step.id}
                  type="button"
                  disabled={tabOrder.indexOf(step.id) > currentStepIndex && !validation.isValid}
                  onClick={() => setActiveTab(step.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all relative ${
                    isSelected
                      ? "bg-[#0F172A] text-white shadow-xl shadow-slate-900/10"
                      : "hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:hover:bg-transparent"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isSelected ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`text-[10px] font-black tracking-widest uppercase ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                      {step.title}
                    </div>
                    <div className={`text-sm font-bold ${isSelected ? "text-white" : "text-slate-700"}`}>
                      {step.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT CARD COLUMN: Animated Dynamic Content Canvas */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm relative overflow-hidden flex flex-col min-h-[600px]">
          {/* Accent Line Block Top Gradient Design Frame Element */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />
          
          <div className="p-8 md:p-10 flex-1 flex flex-col justify-between">
            <form id="localInfoForm" onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  
                  {/* ==========================================
                      STEP 1 CANONICAL FRAME: IDENTITY (BASIC)
                      ========================================== */}
                  {activeTab === "basic" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shadow-inner text-slate-600">
                          <Globe className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-xl font-black text-slate-800 tracking-tight">Core Identity</h2>
                          <p className="text-xs text-slate-400 italic">Establish primary configurations and metrics for this anchor profile location.</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className="text-xs font-black uppercase tracking-wider text-slate-500">Destination Designation *</label>
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Public Core Anchor</span>
                          </div>
                          <select
                            name="destinationId"
                            value={formData.destinationId || ""}
                            onChange={handleInputChange}
                            className="w-full bg-[#F8FAFC] border border-slate-200 text-slate-700 px-4 py-3.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                          >
                            <option value="">e.g. Kyoto, Japan or The Great Pyramids</option>
                            {destinationsData?.data?.map((dest: any) => (
                              <option key={dest._id} value={dest._id}>{dest.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Local Currency Base *</label>
                            <input
                              type="text"
                              name="currency"
                              value={formData.currency}
                              onChange={handleInputChange}
                              className="w-full bg-[#F8FAFC] border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                              placeholder="e.g. INR"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Popularity Weight (0-100)</label>
                            <input
                              type="number"
                              name="popularityScore"
                              value={formData.popularityScore}
                              onChange={handleInputChange}
                              className="w-full bg-[#F8FAFC] border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                              min="0"
                              max="100"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Best Time to Visit Window</label>
                          <input
                            type="text"
                            name="bestTimeToVisit"
                            value={formData.bestTimeToVisit || ""}
                            onChange={handleInputChange}
                            className="w-full bg-[#F8FAFC] border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium placeholder:text-slate-400"
                            placeholder="A high-impact summary matching seasonal cycles..."
                          />
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-3">Languages Spoken</label>
                          <div className="space-y-2">
                            {formData.language.map((lang: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={lang}
                                  onChange={(e) => handleArrayStringChange("language", idx, e.target.value)}
                                  className="flex-1 bg-[#F8FAFC] border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium"
                                  placeholder="Specify primary/regional language dialect"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeArrayStringRow("language", idx)}
                                  className="text-slate-400 hover:text-red-500 p-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addArrayStringRow("language")}
                              className="text-xs font-bold bg-slate-50 text-slate-600 border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-100 inline-flex items-center gap-1.5 transition-all"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add Language Element
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ==========================================
                      STEP 2 CANONICAL FRAME: GEOGRAPHY (FOOD & PLACES)
                      ========================================== */}
                  {activeTab === "foodPlaces" && (
                    <div className="space-y-8">
                      {/* CULINARY ENGINE LAYER */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2 flex items-center gap-2">
                          🍱 Epicurean Highlights & Famous Food
                        </h3>
                        
                        {formData.famousFood.map((food: any, fIdx: number) => (
                          <div key={fIdx} className="p-5 border border-slate-200 rounded-2xl bg-white space-y-4 relative shadow-sm">
                            <button
                              type="button"
                              onClick={() => setFormData((p: any) => ({ ...p, famousFood: p.famousFood.filter((_: any, i: number) => i !== fIdx) }))}
                              className="absolute top-4 right-4 text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-wider"
                            >
                              Remove Dish
                            </button>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <input
                                type="text"
                                placeholder="Dish / Cuisine Name *"
                                value={food.name}
                                onChange={(e) => handleNestedArrayObjectChange("famousFood", fIdx, "name", e.target.value)}
                                className="bg-[#F8FAFC] border border-slate-200 px-4 py-3 rounded-xl text-sm font-semibold"
                              />
                              <select
                                value={food.typeOfFood}
                                onChange={(e) => handleNestedArrayObjectChange("famousFood", fIdx, "typeOfFood", e.target.value)}
                                className="bg-[#F8FAFC] border border-slate-200 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600"
                              >
                                <option value="">Select Category *</option>
                                <option value="veg">Pure Vegetarian</option>
                                <option value="non-veg">Non-Vegetarian</option>
                                <option value="dessert">Sweets & Desserts</option>
                                <option value="street">Street Fare Vendor</option>
                              </select>
                            </div>

                            <textarea
                              placeholder="Provide details about the origins, primary ingredients, or flavor profiling..."
                              value={food.description || ""}
                              onChange={(e) => handleNestedArrayObjectChange("famousFood", fIdx, "description", e.target.value)}
                              className="w-full bg-[#F8FAFC] border border-slate-200 p-4 rounded-xl text-sm min-h-[4.5rem]"
                            />

                            {/* Image Vault Sync Selection UI Row */}
                            <div>
                              <span className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">Visual Gallery Assets</span>
                              <div className="flex flex-wrap gap-2.5">
                                {food.images?.map((imgUrl: string, imgIdx: number) => (
                                  <div key={imgIdx} className="relative w-14 h-14 rounded-xl border border-slate-200 overflow-hidden group/thumb shadow-inner">
                                    <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const filtered = food.images.filter((_: any, i: number) => i !== imgIdx);
                                        handleNestedArrayObjectChange("famousFood", fIdx, "images", filtered);
                                      }}
                                      className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => setImageModal({ isOpen: true, targetPath: { type: "food", index: fIdx } })}
                                  className="w-14 h-14 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 bg-slate-50 hover:bg-slate-100 transition-all text-sm font-bold"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Sub-Nested Object Elements Map */}
                            <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                              <span className="block text-xs font-black uppercase tracking-wider text-slate-500">Acclaimed Local Venues</span>
                              {food.bestPlaces?.map((place: any, bpIdx: number) => (
                                <div key={bpIdx} className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="Establishment Title"
                                    value={place.name}
                                    onChange={(e) => handleDeepNestedArrayChange("famousFood", fIdx, "bestPlaces", bpIdx, "name", e.target.value)}
                                    className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium flex-1"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Address / Location"
                                    value={place.location}
                                    onChange={(e) => handleDeepNestedArrayChange("famousFood", fIdx, "bestPlaces", bpIdx, "location", e.target.value)}
                                    className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium flex-1"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedBP = food.bestPlaces.filter((_: any, i: number) => i !== bpIdx);
                                      handleNestedArrayObjectChange("famousFood", fIdx, "bestPlaces", updatedBP);
                                    }}
                                    className="text-slate-400 hover:text-red-500 text-xs px-1"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedBP = [...(food.bestPlaces || []), { name: "", location: "" }];
                                  handleNestedArrayObjectChange("famousFood", fIdx, "bestPlaces", updatedBP);
                                }}
                                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                              >
                                + Append Venue Entry Object
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setFormData((p: any) => ({ ...p, famousFood: [...p.famousFood, { name: "", description: "", images: [], typeOfFood: "", bestPlaces: [] }] }))}
                          className="w-full py-3 bg-[#F8FAFC] border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-100 text-xs font-black uppercase tracking-wider transition-all"
                        >
                          + Add New Food Record Object
                        </button>
                      </div>

                      {/* LANDMARK ANCHOR ENGINE LAYER */}
                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2 flex items-center gap-2">
                          📍 Notable Landmark Anchors
                        </h3>

                        {formData.famousPlaces.map((place: any, pIdx: number) => (
                          <div key={pIdx} className="p-5 border border-slate-200 rounded-2xl bg-white space-y-4 relative">
                            <button
                              type="button"
                              onClick={() => setFormData((p: any) => ({ ...p, famousPlaces: p.famousPlaces.filter((_: any, i: number) => i !== pIdx) }))}
                              className="absolute top-4 right-4 text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-wider"
                            >
                              Remove Landmark
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <input
                                type="text"
                                placeholder="Landmark Title *"
                                value={place.name}
                                onChange={(e) => handleNestedArrayObjectChange("famousPlaces", pIdx, "name", e.target.value)}
                                className="bg-[#F8FAFC] border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold"
                              />
                              <select
                                value={place.type}
                                onChange={(e) => handleNestedArrayObjectChange("famousPlaces", pIdx, "type", e.target.value)}
                                className="bg-[#F8FAFC] border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600"
                              >
                                <option value="">Select Typology *</option>
                                <option value="tourist_spot">Standard Tourist Hotspot</option>
                                <option value="hidden_gem">Off-Beat Hidden Gem</option>
                                <option value="religious">Sacred / Religious Site</option>
                                <option value="nature">Nature / Outdoors Trek</option>
                                <option value="market">Traditional Local Market</option>
                              </select>
                              <input
                                type="number"
                                placeholder="Tariff Fee (INR)"
                                value={place.entryFee}
                                onChange={(e) => handleNestedArrayObjectChange("famousPlaces", pIdx, "entryFee", Number(e.target.value))}
                                className="bg-[#F8FAFC] border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold"
                              />
                            </div>

                            <textarea
                              placeholder="Comprehensive informational narrative mapping descriptive unique traits and cultural configurations..."
                              value={place.description || ""}
                              onChange={(e) => handleNestedArrayObjectChange("famousPlaces", pIdx, "description", e.target.value)}
                              className="w-full bg-[#F8FAFC] border border-slate-200 p-4 rounded-xl text-sm min-h-[4rem]"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <input
                                type="text"
                                placeholder="Best Time to Visit"
                                value={place.bestTimeToVisit || ""}
                                onChange={(e) => handleNestedArrayObjectChange("famousPlaces", pIdx, "bestTimeToVisit", e.target.value)}
                                className="bg-[#F8FAFC] border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium"
                              />
                              <input
                                type="text"
                                placeholder="Operating Hours"
                                value={place.timings || ""}
                                onChange={(e) => handleNestedArrayObjectChange("famousPlaces", pIdx, "timings", e.target.value)}
                                className="bg-[#F8FAFC] border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium"
                              />
                            </div>

                            {/* Image Gallery for Places */}
                            <div>
                              <span className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">Visual Gallery Assets</span>
                              <div className="flex flex-wrap gap-2.5">
                                {place.images?.map((imgUrl: string, imgIdx: number) => (
                                  <div key={imgIdx} className="relative w-14 h-14 rounded-xl border border-slate-200 overflow-hidden group/thumb shadow-inner">
                                    <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const filtered = place.images.filter((_: any, i: number) => i !== imgIdx);
                                        handleNestedArrayObjectChange("famousPlaces", pIdx, "images", filtered);
                                      }}
                                      className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => setImageModal({ isOpen: true, targetPath: { type: "place", index: pIdx } })}
                                  className="w-14 h-14 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 bg-slate-50 hover:bg-slate-100 transition-all text-sm font-bold"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setFormData((p: any) => ({ ...p, famousPlaces: [...p.famousPlaces, { name: "", description: "", images: [], type: "", bestTimeToVisit: "", entryFee: 0, timings: "" }] }))}
                          className="w-full py-3 bg-[#F8FAFC] border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-100 text-xs font-black uppercase tracking-wider transition-all"
                        >
                          + Add New Landmark Record Block
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ==========================================
                      STEP 3 CANONICAL FRAME: INTELLIGENCE (CULTURE & SAFETY)
                      ========================================== */}
                  {activeTab === "cultureSafety" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shadow-inner text-slate-600">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-xl font-black text-slate-800 tracking-tight">Intelligence Parameters</h2>
                          <p className="text-xs text-slate-400 italic">Configure behavioral compliance rules, crisis networks, and standard dress guidelines.</p>
                        </div>
                      </div>

                      {/* CULTURE SECTION */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">🎭 Cultural Framework</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {["traditions", "festivals", "localEtiquette"].map((field) => (
                            <div key={field} className="space-y-1.5">
                              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 capitalize">
                                {field.replace(/([A-Z])/g, " $1")}
                              </label>
                              <textarea
                                placeholder="Comma-separated rows..."
                                value={(formData.culture as any)?.[field]?.join(", ") || ""}
                                onChange={(e) => setFormData((p: any) => ({
                                  ...p,
                                  culture: { ...p.culture, [field]: e.target.value.split(",").map((s) => s.trim()) }
                                }))}
                                className="w-full bg-[#F8FAFC] border border-slate-200 p-3 rounded-xl text-xs font-medium min-h-[6.5rem] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* SAFETY SECTION */}
                      <div className="p-6 bg-slate-50/70 border border-slate-100 rounded-2xl space-y-4">
                        <span className="block text-xs font-black uppercase tracking-widest text-slate-500">🛡️ Crisis Control & Security Matrix</span>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">Index Core Rating (1-10) *</label>
                            <input
                              type="number"
                              value={formData.safety?.overallSafety}
                              onChange={(e) => setFormData((p: any) => ({ ...p, safety: { ...p.safety, overallSafety: Number(e.target.value) } }))}
                              className="w-full bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700"
                              min="1"
                              max="10"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">Safety Operational Tips</label>
                            <input
                              type="text"
                              value={formData.safety?.tips?.join(", ") || ""}
                              onChange={(e) => setFormData((p: any) => ({ ...p, safety: { ...p.safety, tips: e.target.value.split(",").map((s) => s.trim()) } }))}
                              className="w-full bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-medium"
                              placeholder="Delimited inline criteria strings..."
                            />
                          </div>
                        </div>

                        {/* Emergency Contacts */}
                        <div className="space-y-2">
                          <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400">Emergency Contact Registry</label>
                          {formData.safety?.emergencyContacts?.map((contact: any, idx: number) => (
                            <div key={idx} className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Authority (e.g., Police, Ambulance)"
                                value={contact.authority}
                                onChange={(e) => {
                                  const updated = [...(formData.safety?.emergencyContacts || [])];
                                  updated[idx] = { ...updated[idx], authority: e.target.value };
                                  setFormData((p: any) => ({ ...p, safety: { ...p.safety, emergencyContacts: updated } }));
                                }}
                                className="flex-1 bg-white border border-slate-200 px-3 py-2 rounded-lg text-xs font-medium"
                              />
                              <input
                                type="text"
                                placeholder="Contact Number"
                                value={contact.number}
                                onChange={(e) => {
                                  const updated = [...(formData.safety?.emergencyContacts || [])];
                                  updated[idx] = { ...updated[idx], number: e.target.value };
                                  setFormData((p: any) => ({ ...p, safety: { ...p.safety, emergencyContacts: updated } }));
                                }}
                                className="flex-1 bg-white border border-slate-200 px-3 py-2 rounded-lg text-xs font-medium"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = formData.safety?.emergencyContacts?.filter((_: any, i: number) => i !== idx) || [];
                                  setFormData((p: any) => ({ ...p, safety: { ...p.safety, emergencyContacts: updated } }));
                                }}
                                className="text-slate-400 hover:text-red-500"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...(formData.safety?.emergencyContacts || []), { authority: "", number: "" }];
                              setFormData((p: any) => ({ ...p, safety: { ...p.safety, emergencyContacts: updated } }));
                            }}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                          >
                            + Add Emergency Contact
                          </button>
                        </div>
                      </div>

                      {/* PRECAUTIONS SECTION */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">⚠️ Safety Precautions & Advisories</h3>
                        {formData.precautions?.map((precaution: any, idx: number) => (
                          <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-white space-y-3 relative">
                            <button
                              type="button"
                              onClick={() => setFormData((p: any) => ({ ...p, precautions: p.precautions.filter((_: any, i: number) => i !== idx) }))}
                              className="absolute top-3 right-3 text-slate-400 hover:text-red-500"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <input
                                type="text"
                                placeholder="Precaution Title"
                                value={precaution.title}
                                onChange={(e) => handleNestedArrayObjectChange("precautions", idx, "title", e.target.value)}
                                className="bg-[#F8FAFC] border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold md:col-span-2"
                              />
                              <select
                                value={precaution.severity}
                                onChange={(e) => handleNestedArrayObjectChange("precautions", idx, "severity", e.target.value)}
                                className="bg-[#F8FAFC] border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold"
                              >
                                <option value="low">Low Risk</option>
                                <option value="medium">Medium Risk</option>
                                <option value="high">High Risk</option>
                              </select>
                            </div>
                            <textarea
                              placeholder="Detailed description of the precaution..."
                              value={precaution.description}
                              onChange={(e) => handleNestedArrayObjectChange("precautions", idx, "description", e.target.value)}
                              className="w-full bg-[#F8FAFC] border border-slate-200 p-3 rounded-lg text-xs font-medium min-h-[3rem]"
                            />
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setFormData((p: any) => ({ ...p, precautions: [...(p.precautions || []), { title: "", description: "", severity: "low" }] }))}
                          className="w-full py-2.5 bg-[#F8FAFC] border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-100 text-xs font-black uppercase tracking-wider"
                        >
                          + Add Precaution
                        </button>
                      </div>

                      {/* CLOTHING RECOMMENDATIONS */}
                      <div className="p-6 bg-indigo-50/30 border border-indigo-100 rounded-2xl space-y-4">
                        <span className="block text-xs font-black uppercase tracking-widest text-indigo-900">👔 Clothing & Dress Code Guidelines</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {["summer", "winter", "religiousPlaces", "generalTips"].map((field) => (
                            <div key={field}>
                              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5 capitalize">
                                {field.replace(/([A-Z])/g, " $1")}
                              </label>
                              <textarea
                                placeholder="Comma-separated clothing items..."
                                value={(formData.clothing as any)?.[field]?.join(", ") || ""}
                                onChange={(e) => setFormData((p: any) => ({
                                  ...p,
                                  clothing: { ...p.clothing, [field]: e.target.value.split(",").map((s: string) => s.trim()) }
                                }))}
                                className="w-full bg-white border border-slate-200 p-3 rounded-xl text-xs font-medium min-h-[4rem]"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* MYTHS & STORIES */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">📚 Local Myths & Folklore</h3>
                        {formData.mythsAndStories?.map((myth: any, idx: number) => (
                          <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-white space-y-3 relative">
                            <button
                              type="button"
                              onClick={() => setFormData((p: any) => ({ ...p, mythsAndStories: p.mythsAndStories.filter((_: any, i: number) => i !== idx) }))}
                              className="absolute top-3 right-3 text-slate-400 hover:text-red-500"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <input
                              type="text"
                              placeholder="Myth or Story Title"
                              value={myth.title}
                              onChange={(e) => handleNestedArrayObjectChange("mythsAndStories", idx, "title", e.target.value)}
                              className="w-full bg-[#F8FAFC] border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold"
                            />
                            <textarea
                              placeholder="Tell the story or myth in detail..."
                              value={myth.story}
                              onChange={(e) => handleNestedArrayObjectChange("mythsAndStories", idx, "story", e.target.value)}
                              className="w-full bg-[#F8FAFC] border border-slate-200 p-3 rounded-lg text-xs font-medium min-h-[5rem]"
                            />
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setFormData((p: any) => ({ ...p, mythsAndStories: [...(p.mythsAndStories || []), { title: "", story: "" }] }))}
                          className="w-full py-2.5 bg-[#F8FAFC] border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-100 text-xs font-black uppercase tracking-wider"
                        >
                          + Add Myth or Story
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ==========================================
                      STEP 4 CANONICAL FRAME: EXPERIENCES (EXTRA)
                      ========================================== */}
                  {activeTab === "extra" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-5 bg-emerald-50/40 border border-emerald-100 rounded-2xl space-y-3">
                          <span className="block text-xs font-black uppercase tracking-wider text-emerald-800">🟢 Approved Directives (Do's)</span>
                          {formData.dos.map((item: string, idx: number) => (
                            <div key={idx} className="flex gap-2">
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleArrayStringChange("dos", idx, e.target.value)}
                                className="flex-1 bg-white border border-slate-200 px-3 py-2 rounded-lg text-xs font-medium"
                              />
                              <button type="button" onClick={() => removeArrayStringRow("dos", idx)}><X className="w-3.5 h-3.5 text-slate-400" /></button>
                            </div>
                          ))}
                          <button type="button" onClick={() => addArrayStringRow("dos")} className="text-xs font-bold text-emerald-700 underline">+ Append Clause</button>
                        </div>

                        <div className="p-5 bg-rose-50/40 border border-rose-100 rounded-2xl space-y-3">
                          <span className="block text-xs font-black uppercase tracking-wider text-rose-800">🔴 Critical Violations (Don'ts)</span>
                          {formData.donts.map((item: string, idx: number) => (
                            <div key={idx} className="flex gap-2">
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleArrayStringChange("donts", idx, e.target.value)}
                                className="flex-1 bg-white border border-slate-200 px-3 py-2 rounded-lg text-xs font-medium"
                              />
                              <button type="button" onClick={() => removeArrayStringRow("donts", idx)}><X className="w-3.5 h-3.5 text-slate-400" /></button>
                            </div>
                          ))}
                          <button type="button" onClick={() => addArrayStringRow("donts")} className="text-xs font-bold text-rose-700 underline">+ Append Clause</button>
                        </div>
                      </div>

                      {/* LOCAL TIPS */}
                      <div className="p-5 border border-slate-200 rounded-2xl bg-white space-y-3">
                        <span className="block text-xs font-black uppercase tracking-widest text-slate-400">💡 Insider Tips & Local Wisdom</span>
                        {formData.localTips.map((tip: string, idx: number) => (
                          <div key={idx} className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Share a helpful local tip..."
                              value={tip}
                              onChange={(e) => handleArrayStringChange("localTips", idx, e.target.value)}
                              className="flex-1 bg-[#F8FAFC] border border-slate-200 px-3 py-2 rounded-xl text-xs font-medium"
                            />
                            <button type="button" onClick={() => removeArrayStringRow("localTips", idx)} className="text-slate-400 hover:text-red-500">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button type="button" onClick={() => addArrayStringRow("localTips")} className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
                          + Add Insider Tip
                        </button>
                      </div>

                      {/* USEFUL PHRASES */}
                      <div className="p-5 border border-slate-200 rounded-2xl bg-white space-y-3">
                        <span className="block text-xs font-black uppercase tracking-widest text-slate-400">🗣️ Local Phrasebook Conversions</span>
                        {formData.phrases?.map((phrase: any, idx: number) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              placeholder="Vernacular Dialect Phrase"
                              value={phrase.local}
                              onChange={(e) => handleNestedArrayObjectChange("phrases", idx, "local", e.target.value)}
                              className="bg-[#F8FAFC] border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold flex-1"
                            />
                            <input
                              type="text"
                              placeholder="English Translation Literal"
                              value={phrase.english}
                              onChange={(e) => handleNestedArrayObjectChange("phrases", idx, "english", e.target.value)}
                              className="bg-[#F8FAFC] border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold flex-1"
                            />
                            <button type="button" onClick={() => setFormData((p: any) => ({ ...p, phrases: p.phrases.filter((_: any, i: number) => i !== idx) }))} className="text-slate-400 hover:text-red-500">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button type="button" onClick={() => setFormData((p: any) => ({ ...p, phrases: [...(p.phrases || []), { local: "", english: "" }] }))} className="text-xs font-bold text-indigo-600 block">
                          + Register Linguistic Conversational Element
                        </button>
                      </div>

                      {/* AI SUMMARY */}
                      <div className="p-5 border border-slate-200 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 space-y-3">
                        <span className="block text-xs font-black uppercase tracking-widest text-purple-900">🤖 AI-Generated Summary (Optional)</span>
                        <textarea
                          placeholder="AI-generated summary or analysis of the destination..."
                          value={formData.aiSummary || ""}
                          onChange={(e) => setFormData((p: any) => ({ ...p, aiSummary: e.target.value }))}
                          className="w-full bg-white border border-slate-200 p-4 rounded-xl text-xs font-medium min-h-[6rem]"
                        />
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </form>

            {/* ==========================================
                FOOTER LAYER: CONTROLS & STEP VALIDATION BANNER
                ========================================== */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-4">
              
              {/* Dynamic Warning Inline Alert if Block Criteria Triggered */}
              {!validation.isValid && (
                <motion.div 
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50 text-amber-800 border border-amber-100 text-xs font-bold"
                >
                  <ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-600" />
                  <span>{validation.reason}</span>
                </motion.div>
              )}

              <div className="flex justify-between items-center w-full">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStepIndex === 0}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold rounded-full text-xs uppercase tracking-wide flex items-center gap-2 transition-all disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>

                {currentStepIndex < tabOrder.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!validation.isValid}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full text-xs uppercase tracking-wide flex items-center gap-2 shadow-md shadow-indigo-600/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    form="localInfoForm"
                    disabled={isLoading || !validation.isValid}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full text-xs uppercase tracking-wide flex items-center gap-2 shadow-md shadow-emerald-600/10 transition-all disabled:opacity-40"
                  >
                    <Rocket className="w-3.5 h-3.5" /> {isLoading ? "Launching..." : "Launch Destination"}
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ==========================================
          IMAGE VAULT MODAL FRAME
          ========================================== */}
      <AnimatePresence>
        {imageModal?.isOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2rem] p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-slate-100"
            >
              <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-700">Media Vault Inventory System</h3>
                <button
                  type="button"
                  onClick={() => setImageModal(null)}
                  className="text-slate-400 hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ImageLibrary
                onSelect={(images: { id: string; url: string }[]) => handleImageSelect(images)}
                onClose={() => setImageModal(null)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}