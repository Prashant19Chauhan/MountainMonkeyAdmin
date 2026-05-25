"use client";

import React, { useState, useEffect } from 'react';
import { 
  getThemeMetaData, 
  updateThemeMetaData,
  deleteMood 
} from '@/services/theme.service';
import { 
  Palette, 
  Sparkles, 
  Plus, 
  Trash2, 
  Eye, 
  Code,
  Shapes,
  Type,
  Check,
  Save,
  RefreshCcw,
  Layers,
  ChevronRight,
  Monitor,
  Edit3
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeStudioPage() {
  const [metaData, setMetaData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchThemeData = async () => {
    setLoading(true);
    try {
      const data = await getThemeMetaData();
      setMetaData(data);
      if (data.moods?.length > 0 && !selectedMood) {
        setSelectedMood(data.moods[0]);
      }
    } catch (error: any) {
      toast.error("Failed to fetch theme data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThemeData();
  }, []);

  const handleSave = async () => {
    try {
      // Logic to update metaData object with selectedMood changes
      const updatedMoods = metaData.moods.map((m: any) => 
        m.name === selectedMood.name ? selectedMood : m
      );
      
      const payload = { ...metaData, moods: updatedMoods };
      await updateThemeMetaData(payload);
      toast.success("Theme settings saved successfully");
      setIsEditing(false);
      fetchThemeData();
    } catch (error: any) {
      toast.error(error.message || "Save failed");
    }
  };

  const handleCreateNew = () => {
    const newMood = {
      name: "new-mood-" + Date.now(),
      label: "New Vibe",
      bgColor: "#ffffff",
      fgColor: "#1e293b",
      visualElements: []
    };
    setSelectedMood(newMood);
    setIsEditing(true);
  };

  const handleDelete = async (name: string) => {
    if (!window.confirm("Delete this mood forever?")) return;
    try {
      await deleteMood(name);
      toast.success("Mood deleted");
      fetchThemeData();
      setSelectedMood(null);
    } catch (error: any) {
      toast.error(error.message || "Delete failed");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-50/30">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Theme Studio</h1>
          <p className="text-slate-500 font-medium">Design the atmosphere and "vibes" of the user application.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCreateNew}
            className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl"
          >
            <Plus size={18} /> New Mood
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Mood List */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Available Moods</h3>
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="h-20 bg-white rounded-[2rem] animate-pulse border border-slate-100" />)
          ) : (
            metaData?.moods.map((mood: any) => (
              <button
                key={mood.name}
                onClick={() => {
                    setSelectedMood(mood);
                    setIsEditing(false);
                }}
                className={`w-full group p-6 rounded-[2.5rem] border transition-all duration-500 flex items-center justify-between ${
                  selectedMood?.name === mood.name 
                  ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/50 scale-[1.02]' 
                  : 'bg-transparent border-transparent hover:bg-white/50 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-4 text-left">
                  <div 
                    className="w-12 h-12 rounded-2xl shadow-inner border-4 border-white"
                    style={{ backgroundColor: mood.bgColor }}
                  />
                  <div>
                    <h4 className={`font-black text-sm transition-colors ${selectedMood?.name === mood.name ? 'text-slate-900' : 'text-slate-500'}`}>
                        {mood.label}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{mood.name}</p>
                  </div>
                </div>
                <ChevronRight size={18} className={`transition-transform duration-500 ${selectedMood?.name === mood.name ? 'translate-x-0' : '-translate-x-4 opacity-0'}`} />
              </button>
            ))
          )}
        </div>

        {/* Editor / Preview */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedMood ? (
              <motion.div
                key={selectedMood.name}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-8"
              >
                {/* Visual Editor Card */}
                <div className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-sm">
                   <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                          <Palette size={24} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900">{isEditing ? 'Editing Mood' : 'Mood Details'}</h2>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                             <button 
                               onClick={() => setIsEditing(false)}
                               className="px-6 py-2.5 text-xs font-black uppercase text-slate-400 hover:text-slate-600"
                             >
                               Cancel
                             </button>
                             <button 
                               onClick={handleSave}
                               className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-emerald-100"
                             >
                               <Save size={14} /> Save Vibe
                             </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => setIsEditing(true)}
                              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2"
                            >
                              <Edit3 size={14} /> Customize
                            </button>
                            <button 
                               onClick={() => handleDelete(selectedMood.name)}
                               className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Label</label>
                          <input 
                            disabled={!isEditing}
                            type="text" 
                            value={selectedMood.label}
                            onChange={(e) => setSelectedMood({...selectedMood, label: e.target.value})}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 disabled:opacity-60"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">BG Color</label>
                            <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-100 rounded-2xl">
                              <input 
                                disabled={!isEditing}
                                type="color" 
                                value={selectedMood.bgColor}
                                onChange={(e) => setSelectedMood({...selectedMood, bgColor: e.target.value})}
                                className="w-10 h-10 rounded-xl border-none p-0 cursor-pointer overflow-hidden"
                              />
                              <span className="text-xs font-black text-slate-600 uppercase">{selectedMood.bgColor}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Text Color</label>
                            <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-100 rounded-2xl">
                              <input 
                                disabled={!isEditing}
                                type="color" 
                                value={selectedMood.fgColor || '#1e293b'}
                                onChange={(e) => setSelectedMood({...selectedMood, fgColor: e.target.value})}
                                className="w-10 h-10 rounded-xl border-none p-0 cursor-pointer overflow-hidden"
                              />
                              <span className="text-xs font-black text-slate-600 uppercase">{selectedMood.fgColor || '#1e293b'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                         <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                                <Shapes size={14} className="text-indigo-500" /> Visual Elements ({selectedMood.visualElements?.length || 0})
                            </label>
                            {isEditing && (
                              <button className="text-xs font-black text-indigo-500 hover:text-indigo-600">Add Element +</button>
                            )}
                         </div>
                         <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] min-h-[160px] flex flex-col justify-center items-center text-center">
                            <div className="text-slate-300 mb-2">
                              <Code size={32} />
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-[150px]">Element editor coming soon for deep SVG customization</p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Live Mobile Preview */}
                <div className="relative mx-auto w-[320px] aspect-[9/19.5] bg-slate-900 rounded-[3rem] p-4 shadow-2xl shadow-slate-300 ring-[12px] ring-slate-200">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-200 rounded-b-3xl z-20"></div>
                    <div 
                      className="w-full h-full rounded-[2rem] overflow-hidden relative flex flex-col items-center justify-center text-center p-8 transition-colors duration-1000"
                      style={{ backgroundColor: selectedMood.bgColor, color: selectedMood.fgColor }}
                    >
                        <h1 className="text-3xl font-black mb-4 leading-tight">Escape to {selectedMood.label}</h1>
                        <p className="text-sm opacity-60 font-medium mb-8">Plan your dream getaway with Mountain Monkey.</p>
                        <div className="w-full py-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl mb-4"></div>
                        <div className="w-2/3 h-2 bg-white/10 rounded-full"></div>
                    </div>
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2">
                       <Monitor size={14} className="text-slate-400" />
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Preview</span>
                    </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-40 bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
                <Palette size={64} className="text-slate-100 mb-6" />
                <h3 className="text-2xl font-black text-slate-900 mb-2">Select a Mood</h3>
                <p className="text-slate-500 font-medium">Or create a new one to start designing.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
