"use client";

import Image from "@/components/ui/Image";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getActivitiesPageSections, 
  updateActivitiesPageSections
} from '@/services/activities.service';
import { 
  LayoutDashboard, 
  Save, 
  Plus, 
  Trash2, 
  Link as LinkIcon,
  Image as ImageIcon,
  Type,
  RefreshCcw,
  ArrowUp,
  ArrowDown,
  HelpCircle,
  Activity,
  Edit3
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function ActivitiesManagementPage() {
  const [customSections, setCustomSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [newImageUrls, setNewImageUrls] = useState<{[key: number]: string}>({});
  const [newLinkTexts, setNewLinkTexts] = useState<{[key: number]: string}>({});
  const [newLinkUrls, setNewLinkUrls] = useState<{[key: number]: string}>({});
  const [newFaqQuestions, setNewFaqQuestions] = useState<{[key: number]: string}>({});
  const [newFaqAnswers, setNewFaqAnswers] = useState<{[key: number]: string}>({});

  const fetchPageData = async () => {
    setLoading(true);
    try {
      const data = await getActivitiesPageSections();
      if (data && data.customSections) {
        setCustomSections(data.customSections);
      } else {
        setCustomSections([]);
      }
    } catch (error: any) {
      toast.error("Failed to fetch activities page data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  const updateSectionField = (sIdx: number, field: string, value: any) => {
    const updated = [...customSections];
    updated[sIdx] = { ...updated[sIdx], [field]: value };
    setCustomSections(updated);
  };

  const addImageToSection = (sIdx: number) => {
    const url = newImageUrls[sIdx]?.trim();
    if (!url) return;
    const section = customSections[sIdx];
    const updatedImages = [...(section.images || []), url];
    updateSectionField(sIdx, 'images', updatedImages);
    setNewImageUrls({ ...newImageUrls, [sIdx]: '' });
  };

  const removeImageFromSection = (sIdx: number, imgIdx: number) => {
    const section = customSections[sIdx];
    const updatedImages = section.images.filter((_: any, i: number) => i !== imgIdx);
    updateSectionField(sIdx, 'images', updatedImages);
  };

  const addLinkToSection = (sIdx: number) => {
    const text = newLinkTexts[sIdx]?.trim();
    const url = newLinkUrls[sIdx]?.trim();
    if (!text || !url) {
      toast.error("Please fill in both Link Text and Target URL.");
      return;
    }
    const section = customSections[sIdx];
    const updatedLinks = [...(section.links || []), { text, url }];
    updateSectionField(sIdx, 'links', updatedLinks);
    setNewLinkTexts({ ...newLinkTexts, [sIdx]: '' });
    setNewLinkUrls({ ...newLinkUrls, [sIdx]: '' });
  };

  const removeLinkFromSection = (sIdx: number, linkIdx: number) => {
    const section = customSections[sIdx];
    const updatedLinks = section.links.filter((_: any, i: number) => i !== linkIdx);
    updateSectionField(sIdx, 'links', updatedLinks);
  };

  const addFaqToSection = (sIdx: number) => {
    const question = newFaqQuestions[sIdx]?.trim();
    const answer = newFaqAnswers[sIdx]?.trim();
    if (!question || !answer) {
      toast.error("Please fill in both Question and Answer fields.");
      return;
    }
    const section = customSections[sIdx];
    const updatedFaqs = [...(section.faq || []), { question, answer }];
    updateSectionField(sIdx, 'faq', updatedFaqs);
    setNewFaqQuestions({ ...newFaqQuestions, [sIdx]: '' });
    setNewFaqAnswers({ ...newFaqAnswers, [sIdx]: '' });
  };

  const removeFaqFromSection = (sIdx: number, faqIdx: number) => {
    const section = customSections[sIdx];
    const updatedFaqs = section.faq.filter((_: any, i: number) => i !== faqIdx);
    updateSectionField(sIdx, 'faq', updatedFaqs);
  };

  const createNewCustomSection = () => {
    setCustomSections([
      ...customSections,
      {
        heading: 'New Section Heading',
        paragraph: 'Describe what this section is about...',
        images: [],
        links: [],
        faq: []
      }
    ]);
  };

  const removeCustomSection = (sIdx: number) => {
    if (window.confirm("Are you sure you want to delete this content section block?")) {
      const updated = customSections.filter((_, i) => i !== sIdx);
      setCustomSections(updated);
    }
  };

  const moveSection = (sIdx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? sIdx - 1 : sIdx + 1;
    if (targetIdx < 0 || targetIdx >= customSections.length) return;
    const updated = [...customSections];
    const temp = updated[sIdx];
    updated[sIdx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setCustomSections(updated);
  };

  const handleCustomSectionsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateActivitiesPageSections({ customSections });
      toast.success("Activities page custom content sections saved successfully!");
      fetchPageData();
    } catch (error: any) {
      toast.error(error.message || "Failed to save content sections");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-50/30">
      {/* Header */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-slate-900 p-2.5 rounded-xl shadow-md text-white">
              <Activity size={22} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Activities Hub Control</h1>
          </div>
          <p className="text-slate-500 font-medium">Manage experiential content and FAQ accordions for the all-activities list page.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/metadata?activities-page=activities-page">
            <button className="px-4 py-2.5 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 cursor-pointer border-0">
              <Edit3 size={14} /> SEO Meta
            </button>
          </Link>
          <button 
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
        {/* Top Bar for Custom Sections */}
        <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-wide">Activities Page Custom Sections</h2>
            <p className="text-slate-500 font-medium text-sm mt-1">Design and arrange layout blocks below the activities list.</p>
          </div>
          <button
            type="button"
            onClick={createNewCustomSection}
            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-100 transition-all flex items-center gap-2 cursor-pointer border-0"
          >
            <Plus size={16} /> Add Section Block
          </button>
        </div>

        {customSections.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center text-slate-400 space-y-4 shadow-sm">
            <LayoutDashboard size={48} className="mx-auto text-slate-300 animate-pulse" />
            <p className="font-bold text-sm uppercase tracking-widest">No custom sections created yet</p>
            <p className="text-slate-500 font-medium text-xs max-w-sm mx-auto">Click "Add Section Block" to create headings, paragraphs, accordions, and action buttons dynamically.</p>
          </div>
        ) : (
          <form onSubmit={handleCustomSectionsUpdate} className="space-y-10">
            <div className="space-y-8">
              {customSections.map((section, sIdx) => (
                <div 
                  key={sIdx} 
                  className="bg-white p-8 sm:p-10 rounded-[3rem] border border-slate-100 shadow-sm relative group overflow-hidden"
                >
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
                      disabled={sIdx === customSections.length - 1}
                      onClick={() => moveSection(sIdx, 'down')}
                      className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl disabled:opacity-30 disabled:hover:bg-slate-50 cursor-pointer transition-colors border-0"
                      title="Move Section Down"
                    >
                      <ArrowDown size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeCustomSection(sIdx)}
                      className="p-2 bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white rounded-xl cursor-pointer transition-colors border-0"
                      title="Delete Section Block"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 block mb-6">
                    Section Block #{sIdx + 1}
                  </span>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Type size={14} className="text-indigo-500" /> Heading Text
                        </label>
                        <input
                          type="text"
                          required
                          value={section.heading}
                          onChange={(e) => updateSectionField(sIdx, 'heading', e.target.value)}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm"
                          placeholder="e.g. Thrilling Himalayan Adventures Await"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <LayoutDashboard size={14} className="text-indigo-500" /> Paragraph Text
                        </label>
                        <textarea
                          required
                          value={section.paragraph}
                          onChange={(e) => updateSectionField(sIdx, 'paragraph', e.target.value)}
                          rows={4}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none text-sm leading-relaxed"
                          placeholder="Add descriptive content here for adventurers..."
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <ImageIcon size={14} className="text-indigo-500" /> Images (URLs)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newImageUrls[sIdx] || ''}
                            onChange={(e) => setNewImageUrls({ ...newImageUrls, [sIdx]: e.target.value })}
                            className="flex-1 px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-800 text-xs focus:outline-none"
                            placeholder="Paste image URL here..."
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImageToSection(sIdx))}
                          />
                          <button
                            type="button"
                            onClick={() => addImageToSection(sIdx)}
                            className="px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-colors text-xs font-black uppercase tracking-wider shrink-0 border-0 cursor-pointer"
                          >
                            Add Image
                          </button>
                        </div>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {(section.images || []).map((img: string, iIdx: number) => (
                            <div key={iIdx} className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 group/img border border-slate-200">
                              <Image src={img} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removeImageFromSection(sIdx, iIdx)}
                                className="absolute inset-0 bg-rose-600/80 flex items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer duration-200 border-0"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <LinkIcon size={14} className="text-indigo-500" /> Action Links
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={newLinkTexts[sIdx] || ''}
                            onChange={(e) => setNewLinkTexts({ ...newLinkTexts, [sIdx]: e.target.value })}
                            className="px-4 py-2.5 bg-white border border-slate-100 rounded-xl font-bold text-slate-800 text-[11px] focus:outline-none"
                            placeholder="Link Label (e.g. Book Activity)"
                          />
                          <input
                            type="text"
                            value={newLinkUrls[sIdx] || ''}
                            onChange={(e) => setNewLinkUrls({ ...newLinkUrls, [sIdx]: e.target.value })}
                            className="px-4 py-2.5 bg-white border border-slate-100 rounded-xl font-bold text-slate-800 text-[11px] focus:outline-none"
                            placeholder="URL (e.g. /activities)"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => addLinkToSection(sIdx)}
                          className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-all text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1 border-0 cursor-pointer"
                        >
                          <Plus size={12} /> Add Link Pill
                        </button>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {(section.links || []).map((link: any, lIdx: number) => (
                            <span key={lIdx} className="group/link flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-bold">
                              <span className="font-extrabold text-slate-900">{link.text}</span>: {link.url}
                              <button type="button" onClick={() => removeLinkFromSection(sIdx, lIdx)} className="text-rose-500 hover:text-rose-700 border-0 bg-transparent p-0 cursor-pointer">
                                <Trash2 size={10} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <HelpCircle size={14} className="text-indigo-500" /> FAQ Accordion Pairs
                        </label>
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={newFaqQuestions[sIdx] || ''}
                            onChange={(e) => setNewFaqQuestions({ ...newFaqQuestions, [sIdx]: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white border border-slate-100 rounded-xl font-bold text-slate-800 text-[11px] focus:outline-none"
                            placeholder="Question (e.g. Is gear provided?)"
                          />
                          <textarea
                            value={newFaqAnswers[sIdx] || ''}
                            onChange={(e) => setNewFaqAnswers({ ...newFaqAnswers, [sIdx]: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-2.5 bg-white border border-slate-100 rounded-xl font-bold text-slate-800 text-[11px] resize-none focus:outline-none"
                            placeholder="Answer details..."
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => addFaqToSection(sIdx)}
                          className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-all text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1 border-0 cursor-pointer"
                        >
                          <Plus size={12} /> Add FAQ Pair
                        </button>
                        <div className="space-y-1.5 mt-2 max-h-36 overflow-y-auto no-scrollbar scrollbar-none">
                          {(section.faq || []).map((faq: any, fIdx: number) => (
                            <div key={fIdx} className="bg-white border border-slate-200 p-2.5 rounded-xl flex justify-between items-start gap-4 text-[10px] shadow-2xs">
                              <div className="font-semibold text-slate-600">
                                <p className="font-black text-slate-800">Q: {faq.question}</p>
                                <p className="mt-1">A: {faq.answer}</p>
                              </div>
                              <button type="button" onClick={() => removeFaqFromSection(sIdx, fIdx)} className="text-rose-500 hover:text-rose-700 shrink-0 p-1 bg-slate-50 rounded-md border-0 cursor-pointer">
                                <Trash2 size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-10 cursor-pointer border-0"
            >
              <Save size={20} /> Save CMS Content
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
