"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getFaqPageSections, 
  updateFaqPageSections
} from '@/services/faq.service';
import { 
  HelpCircle, 
  Save, 
  Plus, 
  Trash2, 
  Link as LinkIcon,
  Type,
  RefreshCcw,
  ArrowUp,
  ArrowDown,
  Edit3,
  AlignLeft,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
  link?: {
    text: string;
    url: string;
  };
}

interface FAQSection {
  heading: string;
  faqs: FAQItem[];
}

export default function FAQManagementPage() {
  const [sections, setSections] = useState<FAQSection[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPageData = async () => {
    setLoading(true);
    try {
      const data = await getFaqPageSections();
      if (data && data.sections) {
        setSections(data.sections);
      } else {
        setSections([]);
      }
    } catch (error: any) {
      toast.error("Failed to fetch FAQ page data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  const updateSectionHeading = (sIdx: number, value: string) => {
    const updated = [...sections];
    updated[sIdx].heading = value;
    setSections(updated);
  };

  const createNewSection = () => {
    setSections([
      ...sections,
      {
        heading: 'New FAQ Category',
        faqs: []
      }
    ]);
  };

  const removeSection = (sIdx: number) => {
    if (window.confirm("Are you sure you want to delete this FAQ Category Section and all its FAQs?")) {
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

  // FAQ item operations
  const addNewFAQ = (sIdx: number) => {
    const updated = [...sections];
    updated[sIdx].faqs.push({
      question: 'New Question',
      answer: 'Write the detailed answer here...',
      link: {
        text: '',
        url: ''
      }
    });
    setSections(updated);
  };

  const removeFAQ = (sIdx: number, fIdx: number) => {
    const updated = [...sections];
    updated[sIdx].faqs = updated[sIdx].faqs.filter((_, i) => i !== fIdx);
    setSections(updated);
  };

  const updateFAQField = (sIdx: number, fIdx: number, field: keyof FAQItem, value: any) => {
    const updated = [...sections];
    const faq = updated[sIdx].faqs[fIdx];
    
    if (field === 'link') {
      faq.link = value;
    } else {
      (faq as any)[field] = value;
    }
    setSections(updated);
  };

  const updateFAQLinkField = (sIdx: number, fIdx: number, key: 'text' | 'url', value: string) => {
    const updated = [...sections];
    const faq = updated[sIdx].faqs[fIdx];
    if (!faq.link) {
      faq.link = { text: '', url: '' };
    }
    faq.link[key] = value;
    setSections(updated);
  };

  const moveFAQ = (sIdx: number, fIdx: number, direction: 'up' | 'down') => {
    const faqs = sections[sIdx].faqs;
    const targetIdx = direction === 'up' ? fIdx - 1 : fIdx + 1;
    if (targetIdx < 0 || targetIdx >= faqs.length) return;
    
    const updatedFaqs = [...faqs];
    const temp = updatedFaqs[fIdx];
    updatedFaqs[fIdx] = updatedFaqs[targetIdx];
    updatedFaqs[targetIdx] = temp;

    const updatedSections = [...sections];
    updatedSections[sIdx].faqs = updatedFaqs;
    setSections(updatedSections);
  };

  const handlePageUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Basic validation
      for (const section of sections) {
        if (!section.heading.trim()) {
          toast.error("All FAQ Category headings must be filled.");
          return;
        }
        for (const faq of section.faqs) {
          if (!faq.question.trim() || !faq.answer.trim()) {
            toast.error(`Please fill in all questions and answers in "${section.heading}".`);
            return;
          }
        }
      }

      await updateFaqPageSections({ sections });
      toast.success("FAQ sections saved successfully!");
      fetchPageData();
    } catch (error: any) {
      toast.error(error.message || "Failed to save FAQ sections");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-50/30">
      {/* Header */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-slate-900 p-2.5 rounded-xl shadow-md text-white">
              <HelpCircle size={22} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">FAQ Page CMS Control</h1>
          </div>
          <p className="text-slate-500 font-medium">Create and arrange divided FAQ sections with custom redirection link integrations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/metadata?faq-page=faq-page">
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
          
          {/* Top category creator bar */}
          <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-wide">FAQ Category Sections</h2>
              <p className="text-slate-500 font-medium text-sm mt-1">Design and group your frequently asked questions under distinct category tags.</p>
            </div>
            <button
              type="button"
              onClick={createNewSection}
              className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-100 transition-all flex items-center gap-2 cursor-pointer border-0"
            >
              <Plus size={16} /> Add Category Section
            </button>
          </div>

          {sections.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center text-slate-400 space-y-4 shadow-sm">
              <HelpCircle size={48} className="mx-auto text-slate-300 animate-pulse" />
              <p className="font-bold text-sm uppercase tracking-widest">No FAQ sections created yet</p>
              <p className="text-slate-500 font-medium text-xs max-w-sm mx-auto">Click "Add Category Section" to begin structuring questions, answers, and custom redirect links.</p>
            </div>
          ) : (
            <div className="space-y-12">
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
                      title="Move Category Up"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      type="button"
                      disabled={sIdx === sections.length - 1}
                      onClick={() => moveSection(sIdx, 'down')}
                      className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl disabled:opacity-30 disabled:hover:bg-slate-50 cursor-pointer transition-colors border-0"
                      title="Move Category Down"
                    >
                      <ArrowDown size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSection(sIdx)}
                      className="p-2 bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white rounded-xl cursor-pointer transition-colors border-0"
                      title="Delete Category Section"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 block mb-4">
                    Category Section #{sIdx + 1}
                  </span>

                  <div className="space-y-6">
                    {/* Category Title Heading */}
                    <div className="space-y-2 max-w-xl">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Type size={14} className="text-indigo-500" /> Category Heading / Title
                      </label>
                      <input
                        type="text"
                        required
                        value={section.heading}
                        onChange={(e) => updateSectionHeading(sIdx, e.target.value)}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm"
                        placeholder="e.g. Booking & Cancellation Policies"
                      />
                    </div>

                    {/* FAQ Items Grid Builder */}
                    <div className="pt-6 border-t border-slate-50 space-y-6">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Questions & Answers ({section.faqs.length})</h4>
                        <button
                          type="button"
                          onClick={() => addNewFAQ(sIdx)}
                          className="px-4 py-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer border-0"
                        >
                          <Plus size={12} /> Add FAQ
                        </button>
                      </div>

                      {section.faqs.length === 0 ? (
                        <div className="text-center py-8 bg-slate-50/50 rounded-2xl text-slate-400 text-[11px] font-semibold">
                          No FAQs added to this category yet. Click "Add FAQ" above.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {section.faqs.map((faq, fIdx) => (
                            <div 
                              key={fIdx} 
                              className="bg-slate-50/50 border border-slate-100/80 p-6 rounded-3xl relative group/faq hover:bg-white hover:border-slate-200 transition-all duration-300"
                            >
                              {/* FAQ item controls */}
                              <div className="absolute top-4 right-6 flex items-center gap-1 opacity-0 group-hover/faq:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  disabled={fIdx === 0}
                                  onClick={() => moveFAQ(sIdx, fIdx, 'up')}
                                  className="p-1.5 bg-white text-slate-400 hover:text-slate-800 rounded-lg disabled:opacity-30 cursor-pointer border border-slate-100"
                                >
                                  <ArrowUp size={12} />
                                </button>
                                <button
                                  type="button"
                                  disabled={fIdx === section.faqs.length - 1}
                                  onClick={() => moveFAQ(sIdx, fIdx, 'down')}
                                  className="p-1.5 bg-white text-slate-400 hover:text-slate-800 rounded-lg disabled:opacity-30 cursor-pointer border border-slate-100"
                                >
                                  <ArrowDown size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeFAQ(sIdx, fIdx)}
                                  className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-lg cursor-pointer border border-rose-100"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                                {/* Question & Answer columns */}
                                <div className="lg:col-span-8 space-y-4">
                                  <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                      <MessageSquare size={12} className="text-indigo-500" /> Question text
                                    </label>
                                    <input
                                      type="text"
                                      required
                                      value={faq.question}
                                      onChange={(e) => updateFAQField(sIdx, fIdx, 'question', e.target.value)}
                                      className="w-full px-4 py-2.5 bg-white border border-slate-100 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-slate-200 transition-all text-xs"
                                      placeholder="e.g. Can I cancel my mountain trek?"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                      <AlignLeft size={12} className="text-indigo-500" /> Answer details
                                    </label>
                                    <textarea
                                      required
                                      value={faq.answer}
                                      onChange={(e) => updateFAQField(sIdx, fIdx, 'answer', e.target.value)}
                                      rows={3}
                                      className="w-full px-4 py-2.5 bg-white border border-slate-100 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-slate-200 transition-all text-xs resize-none"
                                      placeholder="Provide the detailed explanation here..."
                                    />
                                  </div>
                                </div>

                                {/* Custom Redirect Link Column */}
                                <div className="lg:col-span-4 space-y-4 bg-white/40 p-4 rounded-2xl border border-slate-100/50">
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <LinkIcon size={12} className="text-indigo-500" /> Redirect Redirect Link (Optional)
                                  </span>

                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      value={faq.link?.text || ''}
                                      onChange={(e) => updateFAQLinkField(sIdx, fIdx, 'text', e.target.value)}
                                      className="w-full px-3 py-2 bg-white border border-slate-100 rounded-lg font-bold text-slate-800 text-[10px] focus:outline-none"
                                      placeholder="Link Text (e.g. Terms & Conditions)"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      value={faq.link?.url || ''}
                                      onChange={(e) => updateFAQLinkField(sIdx, fIdx, 'url', e.target.value)}
                                      className="w-full px-3 py-2 bg-white border border-slate-100 rounded-lg font-bold text-slate-800 text-[10px] focus:outline-none"
                                      placeholder="Target URL (e.g. /terms)"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
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
            <Save size={20} /> Save FAQ Configurations
          </button>
        </form>
      </motion.div>
    </div>
  );
}
