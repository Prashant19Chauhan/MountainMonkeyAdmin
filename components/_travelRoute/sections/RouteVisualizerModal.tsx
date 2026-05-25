"use client";

import React from "react";
import { 
  Navigation, X, Train, Bus, Car, Footprints, MapPin, Target, ArrowRight 
} from "lucide-react";

interface RouteVisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
}

export default function RouteVisualizerModal({ isOpen, onClose, formData }: RouteVisualizerModalProps) {
  if (!isOpen) return null;

  const steps = formData.StepRoutes || [];
  const rootSteps = steps.filter((s: any) => !s._parentStepId);

  const renderNode = (step: any, depth: number = 0) => {
    const children = steps.filter((s: any) => s._parentStepId === step.stepId);
    
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
      <div key={step.stepId} className="flex flex-col items-center">
        {/* Node Card */}
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-5 shadow-2xl w-64 z-10 relative hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between mb-3 text-left">
            <div className="flex items-center gap-2">
              <span className="text-slate-600">{getModeIcon(step.travelDetails?.mode)}</span>
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                {step.travelDetails?.mode || "Transit"}
              </span>
            </div>
            {step.travelDetails?.difficultyInTravelling && (
              <span className={`text-[9px] font-black px-2 py-1 rounded-lg ${
                step.travelDetails.difficultyInTravelling === "Easy" ? "bg-emerald-100 text-emerald-700" :
                step.travelDetails.difficultyInTravelling === "Moderate" ? "bg-blue-100 text-blue-700" :
                step.travelDetails.difficultyInTravelling === "Challenging" ? "bg-amber-100 text-amber-700" :
                "bg-rose-100 text-rose-700"
              }`}>
                {step.travelDetails.difficultyInTravelling}
              </span>
            )}
          </div>
          
          <div className="space-y-2 mb-4 text-left">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-emerald-500 flex-shrink-0" />
              <span className="text-sm font-bold text-slate-800 truncate">{step.from?.name || "Origin"}</span>
            </div>
            <div className="flex items-center justify-center py-1">
              <ArrowRight size={16} className="text-slate-300" />
            </div>
            <div className="flex items-center gap-2">
              <Target size={14} className="text-rose-500 flex-shrink-0" />
              <span className="text-sm font-bold text-slate-800 truncate">{step.to?.name || "Destination"}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-left">
            <div className="text-center">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Cost</p>
              <p className="text-xs font-black text-slate-700">
                {step.travelDetails?.minCost ? `₹${step.travelDetails.minCost}` : "—"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Time</p>
              <p className="text-xs font-black text-slate-700">
                {step.travelDetails?.duration ? `${step.travelDetails.duration}m` : "—"}
              </p>
            </div>
          </div>
          
          {step.isDestinationReached && (
            <div className="absolute -top-3 -right-3 bg-emerald-500 text-white text-[9px] font-black tracking-widest px-4 py-1.5 rounded-full border-4 border-white shadow-lg flex items-center gap-1">
              <Target size={12} />
              DESTINATION
            </div>
          )}
        </div>
        
        {/* Connections to Children */}
        {children.length > 0 && (
          <div className="flex flex-col items-center">
            <div className="w-1 h-8 bg-gradient-to-b from-slate-400 to-slate-300 rounded-full"></div>
            <div className="flex gap-12 relative">
              {children.map((child: any, idx: number) => (
                <div key={child.stepId} className="flex flex-col items-center relative px-4">
                  {children.length > 1 && (
                    <div className={`absolute top-0 h-1 bg-slate-300 rounded-full
                      ${idx === 0 ? "left-[50%] right-0" : ""}
                      ${idx === children.length - 1 ? "left-0 right-[50%]" : ""}
                      ${idx > 0 && idx < children.length - 1 ? "left-0 right-0" : ""}
                    `}></div>
                  )}
                  <div className="w-1 h-8 bg-gradient-to-b from-slate-300 to-slate-400 rounded-full"></div>
                  {renderNode(child, depth + 1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-6xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-50 to-blue-50/50 shrink-0 text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/25">
              <Navigation size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">Route Visualizer</h2>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Interactive path hierarchy</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-2.5 bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <X size={22} />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-12 bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50">
          {rootSteps.length > 0 ? (
            <div className="flex gap-20 justify-center items-start min-h-[500px]">
              {rootSteps.map((root: any) => renderNode(root))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
                <Navigation size={48} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-2">No Route Steps Yet</h3>
              <p className="text-sm text-slate-500 max-w-md">
                Add transit steps to your route to visualize the complete journey path
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
