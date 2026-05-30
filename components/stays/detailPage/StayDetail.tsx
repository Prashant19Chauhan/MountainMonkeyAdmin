"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useStay from '@/hooks/useStay';
import { 
  XCircle, Loader2, Plus, Save, Trash2, ArrowUp, ArrowDown, 
  RefreshCcw, Type, Link as LinkIcon, HelpCircle, 
  Image as ImageIcon, Layers 
} from 'lucide-react';
import StayHeader from './StayHeader';
import StayTabs from './StayTabs';
import StaySidebar from './StaySidebar';
import Image from '@/components/ui/Image';
import { getStayDetailSectionsApi, updateStayDetailSectionsApi } from '@/services/stay.service';
import { toast } from 'sonner';

export default function StayDetail() {
  const params = useParams();
  const router = useRouter();
  const stayId = params.stay as string;

  const { setEditId, formData: stay, isSingleLoading: isLoading, citiesData, destinationsData } = useStay();

  // CMS state
  const [customSections, setCustomSections] = useState<any[]>([]);
  const [cmsLoading, setCmsLoading] = useState(false);
  const [newImageUrls, setNewImageUrls] = useState<{[k: number]: string}>({});
  const [newLinkTexts, setNewLinkTexts] = useState<{[k: number]: string}>({});
  const [newLinkUrls, setNewLinkUrls] = useState<{[k: number]: string}>({});
  const [newFaqQuestions, setNewFaqQuestions] = useState<{[k: number]: string}>({});
  const [newFaqAnswers, setNewFaqAnswers] = useState<{[k: number]: string}>({});

  // Fetch CMS sections when stayId (slug) is known
  const fetchCmsSections = async () => {
    if (!stayId) return;
    setCmsLoading(true);
    try {
      const data = await getStayDetailSectionsApi(stayId);
      setCustomSections(data?.customSections || []);
    } catch {
      setCustomSections([]);
    } finally {
      setCmsLoading(false);
    }
  };

  useEffect(() => {
    fetchCmsSections();
  }, [stayId]);

  // CMS helpers
  const updateSectionField = (sIdx: number, field: string, value: any) => {
    const updated = [...customSections];
    updated[sIdx] = { ...updated[sIdx], [field]: value };
    setCustomSections(updated);
  };
  const addImage = (sIdx: number) => {
    const url = newImageUrls[sIdx]?.trim();
    if (!url) return;
    updateSectionField(sIdx, 'images', [...(customSections[sIdx].images || []), url]);
    setNewImageUrls({ ...newImageUrls, [sIdx]: '' });
  };
  const removeImage = (sIdx: number, iIdx: number) =>
    updateSectionField(sIdx, 'images', customSections[sIdx].images.filter((_: any, i: number) => i !== iIdx));

  const addLink = (sIdx: number) => {
    const text = newLinkTexts[sIdx]?.trim();
    const url = newLinkUrls[sIdx]?.trim();
    if (!text || !url) { toast.error('Fill both link text and URL'); return; }
    updateSectionField(sIdx, 'links', [...(customSections[sIdx].links || []), { text, url }]);
    setNewLinkTexts({ ...newLinkTexts, [sIdx]: '' });
    setNewLinkUrls({ ...newLinkUrls, [sIdx]: '' });
  };
  const removeLink = (sIdx: number, lIdx: number) =>
    updateSectionField(sIdx, 'links', customSections[sIdx].links.filter((_: any, i: number) => i !== lIdx));

  const addFaq = (sIdx: number) => {
    const question = newFaqQuestions[sIdx]?.trim();
    const answer = newFaqAnswers[sIdx]?.trim();
    if (!question || !answer) { toast.error('Fill both question and answer'); return; }
    updateSectionField(sIdx, 'faq', [...(customSections[sIdx].faq || []), { question, answer }]);
    setNewFaqQuestions({ ...newFaqQuestions, [sIdx]: '' });
    setNewFaqAnswers({ ...newFaqAnswers, [sIdx]: '' });
  };
  const removeFaq = (sIdx: number, fIdx: number) =>
    updateSectionField(sIdx, 'faq', customSections[sIdx].faq.filter((_: any, i: number) => i !== fIdx));

  const moveSection = (sIdx: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? sIdx - 1 : sIdx + 1;
    if (target < 0 || target >= customSections.length) return;
    const updated = [...customSections];
    [updated[sIdx], updated[target]] = [updated[target], updated[sIdx]];
    setCustomSections(updated);
  };
  const createSection = () =>
    setCustomSections([...customSections, { heading: 'New Section', paragraph: 'Describe this section...', images: [], links: [], faq: [] }]);

  const removeSection = (sIdx: number) => {
    if (window.confirm('Delete this section?')) setCustomSections(customSections.filter((_, i) => i !== sIdx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateStayDetailSectionsApi(stayId, { customSections });
      toast.success('Custom sections saved!');
      fetchCmsSections();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save sections');
    }
  };

  useEffect(() => {
    if (stayId) {
      setEditId(stayId);
    }
  }, [stayId, setEditId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-slate-900" />
        <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Checking In...</p>
      </div>
    );
  }

  if (!stay || !stay.name) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4 p-4 text-center">
        <XCircle className="w-16 h-16 text-rose-500" />
        <h2 className="text-2xl font-black text-slate-800">Failed to load property</h2>
        <p className="text-slate-500 italic text-sm max-w-md">
          The requested accommodation could not be retrieved from the database.
        </p>
        <button
          onClick={() => router.push('/stays')}
          className="mt-4 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all"
        >
          Back to Stays
        </button>
      </div>
    );
  }

  const mainCityAny = stay.mainCity as any;
  const mainCityName = typeof mainCityAny === 'object' ? mainCityAny?.name : (citiesData?.data?.find((c: any) => c._id === stay.mainCity)?.name || 'Global Partner');
  
  const destinationIdAny = stay.destinationId as any;
  const destinationName = typeof destinationIdAny === 'object' ? destinationIdAny?.name : (destinationsData?.data?.find((d: any) => d._id === stay.destinationId)?.name || 'Global Scope');

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Summary Profile */}
        <StayHeader stay={stay} onBack={() => router.push('/stays')} />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
          {/* Main Column */}
          <div className="lg:col-span-2">
            <StayTabs stay={stay} />
          </div>

          {/* Sidebar */}
          <div>
            <StaySidebar stay={stay} mainCityName={mainCityName} destinationName={destinationName} />
          </div>
        </div>

        {/* === CMS: Custom Detail Sections Editor === */}
        <div className="mt-10 pb-10">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-md">
                <Layers size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Custom Detail Sections</h2>
                <p className="text-slate-500 font-medium text-sm">Add rich content blocks shown at the bottom of this stay&apos;s detail page.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={fetchCmsSections} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-indigo-600 transition-all shadow-sm cursor-pointer border-0">
                <RefreshCcw size={18} className={cmsLoading ? 'animate-spin' : ''} />
              </button>
              <button type="button" onClick={createSection} className="px-5 py-2.5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 cursor-pointer border-0">
                <Plus size={15} /> Add Block
              </button>
            </div>
          </div>

          {customSections.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-14 text-center text-slate-400 shadow-sm space-y-3">
              <Layers size={44} className="mx-auto text-slate-300 animate-pulse" />
              <p className="font-bold text-sm uppercase tracking-widest">No custom sections yet</p>
              <p className="text-slate-500 text-xs font-medium max-w-xs mx-auto">Click &quot;Add Block&quot; to build engaging content for this stay&apos;s detail page.</p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-8">
              {customSections.map((section, sIdx) => (
                <div key={sIdx} className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative">
                  {/* Controls */}
                  <div className="absolute top-6 right-8 flex items-center gap-2 z-10">
                    <button type="button" disabled={sIdx === 0} onClick={() => moveSection(sIdx, 'up')} className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl disabled:opacity-30 border-0 cursor-pointer">
                      <ArrowUp size={15} />
                    </button>
                    <button type="button" disabled={sIdx === customSections.length - 1} onClick={() => moveSection(sIdx, 'down')} className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl disabled:opacity-30 border-0 cursor-pointer">
                      <ArrowDown size={15} />
                    </button>
                    <button type="button" onClick={() => removeSection(sIdx)} className="p-2 bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white rounded-xl border-0 cursor-pointer transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 block mb-5">Block #{sIdx + 1}</span>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Text + Images */}
                    <div className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Type size={13} className="text-indigo-500" /> Heading</label>
                        <input type="text" required value={section.heading} onChange={(e) => updateSectionField(sIdx, 'heading', e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10" placeholder="Section heading..." />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paragraph</label>
                        <textarea required value={section.paragraph} onChange={(e) => updateSectionField(sIdx, 'paragraph', e.target.value)} rows={4} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 resize-none" placeholder="Section paragraph..." />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={13} className="text-indigo-500" /> Images</label>
                        <div className="flex gap-2">
                          <input type="text" value={newImageUrls[sIdx] || ''} onChange={(e) => setNewImageUrls({ ...newImageUrls, [sIdx]: e.target.value })} className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-800 focus:outline-none" placeholder="Image URL..." onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage(sIdx))} />
                          <button type="button" onClick={() => addImage(sIdx)} className="px-4 bg-indigo-500 text-white rounded-xl text-xs font-black border-0 cursor-pointer hover:bg-indigo-600">Add</button>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {(section.images || []).map((img: string, iIdx: number) => (
                            <div key={iIdx} className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group/img">
                              <Image src={img} className="w-full h-full object-cover" />
                              <button type="button" onClick={() => removeImage(sIdx, iIdx)} className="absolute inset-0 bg-rose-600/80 flex items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-opacity border-0 cursor-pointer">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Links + FAQs */}
                    <div className="space-y-5">
                      <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><LinkIcon size={13} className="text-indigo-500" /> Links</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input type="text" value={newLinkTexts[sIdx] || ''} onChange={(e) => setNewLinkTexts({ ...newLinkTexts, [sIdx]: e.target.value })} className="px-3.5 py-2.5 bg-white border border-slate-100 rounded-xl font-bold text-slate-800 text-[11px] focus:outline-none" placeholder="Label" />
                          <input type="text" value={newLinkUrls[sIdx] || ''} onChange={(e) => setNewLinkUrls({ ...newLinkUrls, [sIdx]: e.target.value })} className="px-3.5 py-2.5 bg-white border border-slate-100 rounded-xl font-bold text-slate-800 text-[11px] focus:outline-none" placeholder="URL" />
                        </div>
                        <button type="button" onClick={() => addLink(sIdx)} className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1 border-0 cursor-pointer">
                          <Plus size={11} /> Add Link
                        </button>
                        <div className="flex flex-wrap gap-1.5">
                          {(section.links || []).map((link: any, lIdx: number) => (
                            <span key={lIdx} className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                              <span className="font-extrabold">{link.text}</span>: {link.url}
                              <button type="button" onClick={() => removeLink(sIdx, lIdx)} className="text-rose-500 hover:text-rose-700 border-0 bg-transparent p-0 cursor-pointer"><Trash2 size={9} /></button>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><HelpCircle size={13} className="text-indigo-500" /> FAQ Pairs</label>
                        <div className="space-y-2">
                          <input type="text" value={newFaqQuestions[sIdx] || ''} onChange={(e) => setNewFaqQuestions({ ...newFaqQuestions, [sIdx]: e.target.value })} className="w-full px-3.5 py-2.5 bg-white border border-slate-100 rounded-xl font-bold text-slate-800 text-[11px] focus:outline-none" placeholder="Question..." />
                          <textarea value={newFaqAnswers[sIdx] || ''} onChange={(e) => setNewFaqAnswers({ ...newFaqAnswers, [sIdx]: e.target.value })} rows={2} className="w-full px-3.5 py-2.5 bg-white border border-slate-100 rounded-xl font-bold text-slate-800 text-[11px] resize-none focus:outline-none" placeholder="Answer..." />
                        </div>
                        <button type="button" onClick={() => addFaq(sIdx)} className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1 border-0 cursor-pointer">
                          <Plus size={11} /> Add FAQ
                        </button>
                        <div className="space-y-1.5 max-h-32 overflow-y-auto">
                          {(section.faq || []).map((faq: any, fIdx: number) => (
                            <div key={fIdx} className="bg-white border border-slate-200 p-2 rounded-xl flex justify-between items-start gap-3 text-[10px]">
                              <div><p className="font-black text-slate-800">Q: {faq.question}</p><p className="text-slate-500 mt-0.5">A: {faq.answer}</p></div>
                              <button type="button" onClick={() => removeFaq(sIdx, fIdx)} className="text-rose-500 hover:text-rose-700 p-0.5 border-0 bg-transparent cursor-pointer shrink-0"><Trash2 size={9} /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer border-0">
                <Save size={19} /> Save Custom Sections
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
