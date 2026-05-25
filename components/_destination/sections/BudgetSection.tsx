"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { destinationInput } from "@/lib/validation/destination.validation";
import { DollarSign, Zap, Layout, Star, Info } from "lucide-react";

const FieldHeader = ({ title, subtitle, icon }: { title: string; subtitle: string; icon: React.ReactNode }) => (
  <div className="mb-10 flex items-start gap-6">
    <div className="w-14 h-14 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-900 border border-slate-100 shadow-sm">
      {icon}
    </div>
    <div>
      <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{title}</h3>
      <p className="text-slate-400 text-sm font-medium mt-1 italic">{subtitle}</p>
    </div>
  </div>
);

const FormLabel = ({ children, required, hint }: { children: React.ReactNode; required?: boolean; hint?: string }) => (
  <div className="flex justify-between items-center mb-2.5">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
      {children} {required && <span className="text-rose-500">*</span>}
    </label>
    {hint && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{hint}</span>}
  </div>
);

export default function BudgetSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<destinationInput>();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <FieldHeader
        title="Travel Economics"
        icon={<DollarSign size={24} />}
        subtitle="Establish financial benchmarks for standard and luxury travel experiences."
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Daily Average */}
        <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
            <Zap size={20} />
          </div>
          <div>
            <FormLabel>Daily Average</FormLabel>
            <div className="relative flex justify-center items-center">
              <span className="text-2xl font-black text-slate-300 mr-1">$</span>
              <input
                type="number"
                {...register("budgetEstimate.dailyAvg", { valueAsNumber: true })}
                className="w-24 text-center text-3xl font-black text-slate-900 outline-none bg-transparent"
                placeholder="0"
              />
            </div>
            {errors.budgetEstimate?.dailyAvg?.message && (
              <p className="text-red-500 text-[10px] font-semibold mt-1">
                {String(errors.budgetEstimate.dailyAvg.message)}
              </p>
            )}
          </div>
        </div>

        {/* Budget Entry */}
        <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
            <Layout size={20} />
          </div>
          <div>
            <FormLabel>Budget Entry</FormLabel>
            <div className="relative flex justify-center items-center">
              <span className="text-2xl font-black text-slate-300 mr-1">$</span>
              <input
                type="number"
                {...register("budgetEstimate.budget", { valueAsNumber: true })}
                className="w-24 text-center text-3xl font-black text-slate-900 outline-none bg-transparent"
                placeholder="0"
              />
            </div>
            {errors.budgetEstimate?.budget?.message && (
              <p className="text-red-500 text-[10px] font-semibold mt-1">
                {String(errors.budgetEstimate.budget.message)}
              </p>
            )}
          </div>
        </div>

        {/* Luxury Peak */}
        <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center border border-purple-100">
            <Star size={20} />
          </div>
          <div>
            <FormLabel>Luxury Peak</FormLabel>
            <div className="relative flex justify-center items-center">
              <span className="text-2xl font-black text-slate-300 mr-1">$</span>
              <input
                type="number"
                {...register("budgetEstimate.luxury", { valueAsNumber: true })}
                className="w-24 text-center text-3xl font-black text-slate-900 outline-none bg-transparent"
                placeholder="0"
              />
            </div>
            {errors.budgetEstimate?.luxury?.message && (
              <p className="text-red-500 text-[10px] font-semibold mt-1">
                {String(errors.budgetEstimate.luxury.message)}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-10 p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex gap-4">
        <Info className="text-slate-400 shrink-0" size={18} />
        <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic">
          These values are utilized by the algorithmic matching engine to align travelers with locations that suit their financial profile.
        </p>
      </div>
    </div>
  );
}
