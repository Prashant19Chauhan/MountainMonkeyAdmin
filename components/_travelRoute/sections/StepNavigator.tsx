"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { 
  Route, Info, Plus, Trash2, Train, Bus, Car, Footprints, Navigation, 
  MapPin, Target, ArrowRight, ChevronLeft, DollarSign, Clock 
} from "lucide-react";

interface StepNavigatorProps {
  activeStepTab: number;
  setActiveStepTab: React.Dispatch<React.SetStateAction<number>>;
  addStep: () => void;
  removeStep: (index: number) => void;
}

export default function StepNavigator({
  activeStepTab,
  setActiveStepTab,
  addStep,
  removeStep,
}: StepNavigatorProps) {
  const {
    watch,
    formState: { errors },
  } = useFormContext();

  const StepRoutes: any[] = watch("StepRoutes") || [];

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "Train":
        return <Train size={16} />;
      case "Bus":
        return <Bus size={16} />;
      case "Car":
        return <Car size={16} />;
      case "Walk":
        return <Footprints size={16} />;
      default:
        return <Navigation size={16} />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-lg shadow-slate-900/5 text-left">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-2">
          <Route size={14} className="text-blue-500" />
          Step Navigator ({StepRoutes.length})
        </h3>
        <button
          type="button"
          onClick={addStep}
          className="text-[9px] font-black bg-emerald-600 text-white px-2 py-1 rounded-md hover:bg-emerald-700 transition-all flex items-center gap-1"
        >
          <Plus size={12} /> ADD
        </button>
      </div>

      {errors.StepRoutes?.message && (
        <p className="text-red-500 text-xs font-semibold mb-2">{String(errors.StepRoutes.message)}</p>
      )}

      <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar p-2">
        {StepRoutes.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
            <Info size={32} className="mx-auto mb-3 text-slate-300" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">No steps yet</p>
            <p className="text-xs text-slate-400 mt-1">Click "+ ADD" above</p>
          </div>
        ) : (
          StepRoutes.map((step: any, index: number) => {
            const isActive = activeStepTab === index;
            const parentStepNumber = step._parentStepId
              ? StepRoutes.findIndex((s: any) => s.stepId === step._parentStepId) + 1
              : null;

            return (
              <div
                key={step.stepId || index}
                onClick={() => setActiveStepTab(index)}
                className={`group relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-400 shadow-lg shadow-blue-500/10 scale-[1.02]"
                    : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black transition-all ${
                        isActive ? "bg-blue-600 text-white shadow-md" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`transition-colors ${isActive ? "text-blue-600" : "text-slate-400"}`}>
                          {getModeIcon(step.travelDetails?.mode)}
                        </span>
                        <h4 className="text-xs font-black text-slate-800 uppercase">
                          {step.travelDetails?.mode || "Transit"}
                        </h4>
                      </div>
                      {step.isDestinationReached && (
                        <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-100 text-emerald-700 font-black px-2 py-0.5 rounded-full border border-emerald-200 mt-1">
                          <Target size={10} /> Destination
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeStep(index);
                    }}
                    className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="space-y-2 text-xs flex justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin size={12} className="text-emerald-500 flex-shrink-0" />
                    <span className="font-semibold truncate">{step.from?.name || "Not set"}</span>
                  </div>
                  <div className="flex items-center gap-2 pl-5">
                    <ArrowRight size={12} className="text-slate-300" />
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Target size={12} className="text-rose-500 flex-shrink-0" />
                    <span className="font-semibold truncate">{step.to?.name || "Not set"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500">
                    <span className="flex items-center gap-1">
                      <DollarSign size={10} />
                      {step.travelDetails?.minCost ? `₹${step.travelDetails.minCost}` : "—"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {step.travelDetails?.duration ? `${step.travelDetails.duration}m` : "—"}
                    </span>
                  </div>
                </div>

                {parentStepNumber && parentStepNumber > 0 && (
                  <div className="mt-2">
                    <span className="text-[9px] bg-blue-100 text-blue-600 font-black px-2 py-1 rounded-lg border border-blue-200 inline-flex items-center gap-1">
                      <ChevronLeft size={10} /> From Step {parentStepNumber}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
