"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getTermsPageSections, 
  updateTermsPageSections
} from '@/services/terms.service';
import { 
  FileText, 
  Save, 
  Plus, 
  Trash2, 
  Type,
  RefreshCcw,
  ArrowUp,
  ArrowDown,
  Edit3,
  AlignLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface TermsSection {
  heading: string;
  content: string;
}

export default function TermsManagementPage() {
  const [sections, setSections] = useState<TermsSection[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPageData = async () => {
    setLoading(true);
    try {
      const data = await getTermsPageSections();
      if (data && data.sections) {
        setSections(data.sections);
      } else {
        setSections([]);
      }
    } catch (error: any) {
      toast.error("Failed to fetch Terms page data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  const updateSectionField = (sIdx: number, field: keyof TermsSection, value: string) => {
    const updated = [...sections];
    updated[sIdx][field] = value;
    setSections(updated);
  };

  const createNewSection = () => {
    setSections([
      ...sections,
      {
        heading: 'New Policy Section',
        content: 'Write the detailed legal content or agreement terms here...'
      }
    ]);
  };

  const removeSection = (sIdx: number) => {
    if (window.confirm("Are you sure you want to delete this Policy Section?")) {
      const updated = sections.filter((_, i) => i !== sIdx);
      setSections(updated);
    }
  };

  const moveSection = (sIdx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? sIdx - 1 : sIdx + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;
    const updated = [...sections];
    const temp = updated[sIdx];
    updated[sIdx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setSections(updated);
  };

  const handlePageUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Basic validation
      for (const section of sections) {
        if (!section.heading.trim()) {
          toast.error("All Policy Section headings must be filled.");
          return;
        }
        if (!section.content.trim()) {
          toast.error(`Please fill in content for the section titled "${section.heading}".`);
          return;
        }
      }

      await updateTermsPageSections({ sections });
      toast.success("Terms sections saved successfully!");
      fetchPageData();
    } catch (error: any) {
      toast.error(error.message || "Failed to save Terms sections");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-50/30">
      {/* Header */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-slate-900 p-2.5 rounded-xl shadow-md text-white">
              <FileText size={22} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Terms & Conditions CMS</h1>
          </div>
          <p className="text-slate-500 font-medium">Manage corporate terms, adventure reservation agreements, cancellation parameters, and guidelines.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/metadata?terms-page=terms-page">
            <button className="px-4 py-2.5 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 cursor-pointer border-0">
              <Edit3 size={14} /> SEO Meta
            </button>
          </Link>
          <button 
            type="button"
            onClick={fetchPageData}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-indigo-600 transition-all shadow-sm cursor-pointer border-0"
          >
            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-10"
      >
        <form onSubmit={handlePageUpdate} className="space-y-10">
          
          {/* Top section creator bar */}
          <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-wide">Agreement Sections</h2>
              <p className="text-slate-500 font-medium text-sm mt-1">Add and re-order sections dynamically to control which policies populate the user terms page.</p>
            </div>
            <button
              type="button"
              onClick={createNewSection}
              className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-100 transition-all flex items-center gap-2 cursor-pointer border-0"
            >
              <Plus size={16} /> Add Policy Section
            </button>
          </div>

          {sections.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center text-slate-400 space-y-4 shadow-sm">
              <FileText size={48} className="mx-auto text-slate-300 animate-pulse" />
              <p className="font-bold text-sm uppercase tracking-widest">No terms sections created yet</p>
              <p className="text-slate-500 font-medium text-xs max-w-sm mx-auto">Click "Add Policy Section" to begin drafting terms, conditions, cancellation models, and rules.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {sections.map((section, sIdx) => (
                <div 
                  key={sIdx} 
                  className="bg-white p-8 sm:p-10 rounded-[3rem] border border-slate-100 shadow-sm relative group overflow-hidden"
                >
                  {/* Category Controls */}
                  <div className="absolute top-6 right-8 flex items-center gap-2 z-20">
                    <button
                      type="button"
                      disabled={sIdx === 0}
                      onClick={() => moveSection(sIdx, 'up')}
                      className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl disabled:opacity-30 disabled:hover:bg-slate-50 cursor-pointer transition-colors border-0"
                      title="Move Section Up"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      type="button"
                      disabled={sIdx === sections.length - 1}
                      onClick={() => moveSection(sIdx, 'down')}
                      className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl disabled:opacity-30 disabled:hover:bg-slate-50 cursor-pointer transition-colors border-0"
                      title="Move Section Down"
                    >
                      <ArrowDown size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSection(sIdx)}
                      className="p-2 bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white rounded-xl cursor-pointer transition-colors border-0"
                      title="Delete Policy Section"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 block mb-4">
                    Policy Section #{sIdx + 1}
                  </span>

                  <div className="space-y-6">
                    {/* Heading input */}
                    <div className="space-y-2 max-w-xl">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Type size={14} className="text-indigo-500" /> Section Heading / Title
                      </label>
                      <input
                        type="text"
                        required
                        value={section.heading}
                        onChange={(e) => updateSectionField(sIdx, 'heading', e.target.value)}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm"
                        placeholder="e.g. Section 1. Scope of Services"
                      />
                    </div>

                    {/* Content text area */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <AlignLeft size={14} className="text-indigo-500" /> Detailed policy content
                      </label>
                      <textarea
                        required
                        value={section.content}
                        onChange={(e) => updateSectionField(sIdx, 'content', e.target.value)}
                        rows={6}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm resize-y"
                        placeholder="Write the detailed policy paragraphs here..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-10 cursor-pointer border-0 animate-pulse hover:animate-none"
          >
            <Save size={20} /> Save Terms Configurations
          </button>
        </form>
      </motion.div>
    </div>
  );
}
