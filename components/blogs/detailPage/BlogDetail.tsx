"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  XCircle, Loader2, Plus, Save, Trash2, ArrowUp, ArrowDown, 
  RefreshCcw, Type, Link as LinkIcon, HelpCircle, 
  Image as ImageIcon, Layers, FileText, Calendar, User, Edit3
} from 'lucide-react';
import Image from '@/components/ui/Image';
import { getBlogApi, getBlogDetailSectionsApi, updateBlogDetailSectionsApi } from '@/services/blog.service';
import { toast } from 'sonner';
import Link from 'next/link';

export default function BlogDetail() {
  const params = useParams();
  const router = useRouter();
  const blogId = params.blog as string;

  // Blog Info state
  const [blog, setBlog] = useState<any>(null);
  const [blogLoading, setBlogLoading] = useState(true);

  // CMS state
  const [customSections, setCustomSections] = useState<any[]>([]);
  const [cmsLoading, setCmsLoading] = useState(false);
  const [newImageUrls, setNewImageUrls] = useState<{[k: number]: string}>({});
  const [newLinkTexts, setNewLinkTexts] = useState<{[k: number]: string}>({});
  const [newLinkUrls, setNewLinkUrls] = useState<{[k: number]: string}>({});
  const [newFaqQuestions, setNewFaqQuestions] = useState<{[k: number]: string}>({});
  const [newFaqAnswers, setNewFaqAnswers] = useState<{[k: number]: string}>({});

  const fetchBlogData = async () => {
    if (!blogId) return;
    setBlogLoading(true);
    try {
      const res = await getBlogApi(blogId);
      if (res && res.data) {
        setBlog(res.data);
      }
    } catch (err: any) {
      toast.error("Failed to load blog article parameters");
    } finally {
      setBlogLoading(false);
    }
  };

  const fetchCmsSections = async () => {
    if (!blogId) return;
    setCmsLoading(true);
    try {
      const data = await getBlogDetailSectionsApi(blogId);
      setCustomSections(data?.data?.customSections || data?.customSections || []);
    } catch {
      setCustomSections([]);
    } finally {
      setCmsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogData();
    fetchCmsSections();
  }, [blogId]);

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
    setCustomSections([...customSections, { heading: 'New Rich Detail Block', paragraph: 'Describe this details block...', images: [], links: [], faq: [] }]);

  const removeSection = (sIdx: number) => {
    if (window.confirm('Delete this section block?')) setCustomSections(customSections.filter((_, i) => i !== sIdx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateBlogDetailSectionsApi(blogId, customSections);
      toast.success('Blog custom sections saved successfully!');
      fetchCmsSections();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save sections');
    }
  };

  if (blogLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-slate-900" />
        <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Opening Article Workspace...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4 p-4 text-center">
        <XCircle className="w-16 h-16 text-rose-500" />
        <h2 className="text-2xl font-black text-slate-800">Failed to load article</h2>
        <p className="text-slate-500 italic text-sm max-w-md">
          The requested article could not be retrieved from the database registry.
        </p>
        <button
          onClick={() => router.push('/blogs')}
          className="mt-4 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all border-0 cursor-pointer"
        >
          Back to Articles
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-800 text-left">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Block */}
        <div className="bg-white p-6 sm:p-8 rounded-[3rem] border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-16 rounded-2xl border border-slate-100 overflow-hidden shadow-2xs bg-slate-100 shrink-0">
              {blog.coverImage ? (
                <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
              ) : (
                <FileText className="w-full h-full p-4 text-slate-300" />
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-lg text-indigo-600">
                  {blog.category}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg text-slate-500">
                  {blog.status}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight max-w-xl">{blog.title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Link href={`/metadata?blog=${blog._id}`} className="flex-1 md:flex-initial">
              <button className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all flex items-center justify-center gap-2 cursor-pointer">
                <Edit3 size={15} /> SEO Meta
              </button>
            </Link>
            <button
              onClick={() => router.push('/blogs')}
              className="flex-1 md:flex-initial px-5 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all cursor-pointer border-0"
            >
              Back to Articles
            </button>
          </div>
        </div>

        {/* Article Summary Sidebar info in Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-indigo-500">
              <User size={18} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Author Profile</p>
              <p className="font-extrabold text-sm text-slate-800">{blog.author || "MountainMonkey"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-indigo-500">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Publish Date</p>
              <p className="font-extrabold text-sm text-slate-800">
                {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-indigo-500">
              <FileText size={18} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Catchphrase Description</p>
              <p className="font-bold text-xs text-slate-500 truncate max-w-[250px]" title={blog.shortDescription}>{blog.shortDescription}</p>
            </div>
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
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Blog Narrative Sections CMS</h2>
                <p className="text-slate-500 font-medium text-sm">Add rich paragraphs, image galleries, action links, and FAQs mapping to this blog post.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={fetchCmsSections} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-indigo-600 transition-all shadow-sm cursor-pointer border-0">
                <RefreshCcw size={18} className={cmsLoading ? 'animate-spin' : ''} />
              </button>
              <button type="button" onClick={createSection} className="px-5 py-2.5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 cursor-pointer border-0">
                <Plus size={15} /> Add Detail Section
              </button>
            </div>
          </div>

          {customSections.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-14 text-center text-slate-400 shadow-sm space-y-3">
              <Layers size={44} className="mx-auto text-slate-300 animate-pulse" />
              <p className="font-bold text-sm uppercase tracking-widest">No custom sections yet</p>
              <p className="text-slate-500 text-xs font-medium max-w-xs mx-auto">Click &quot;Add Detail Section&quot; to build rich layouts (checklists, faq details, galleries) below the main blog narrative.</p>
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

                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 block mb-5">Section Block #{sIdx + 1}</span>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Text + Images */}
                    <div className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Type size={13} className="text-indigo-500" /> Heading</label>
                        <input type="text" required value={section.heading} onChange={(e) => updateSectionField(sIdx, 'heading', e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10" placeholder="e.g. Essential Gear Guide..." />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paragraph Content</label>
                        <textarea required value={section.paragraph} onChange={(e) => updateSectionField(sIdx, 'paragraph', e.target.value)} rows={4} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 resize-none" placeholder="Provide details, safety warnings, altitude highlights..." />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={13} className="text-indigo-500" /> Gallery Images</label>
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
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><LinkIcon size={13} className="text-indigo-500" /> Action Links Badges</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input type="text" value={newLinkTexts[sIdx] || ''} onChange={(e) => setNewLinkTexts({ ...newLinkTexts, [sIdx]: e.target.value })} className="px-3.5 py-2.5 bg-white border border-slate-100 rounded-xl font-bold text-slate-800 text-[11px] focus:outline-none" placeholder="Link Label (e.g., Get Trekking Permits)" />
                          <input type="text" value={newLinkUrls[sIdx] || ''} onChange={(e) => setNewLinkUrls({ ...newLinkUrls, [sIdx]: e.target.value })} className="px-3.5 py-2.5 bg-white border border-slate-100 rounded-xl font-bold text-slate-800 text-[11px] focus:outline-none" placeholder="Target URL" />
                        </div>
                        <button type="button" onClick={() => addLink(sIdx)} className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1 border-0 cursor-pointer">
                          <Plus size={11} /> Add Action badge
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
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><HelpCircle size={13} className="text-indigo-500" /> Q&A FAQ Accordion pairs</label>
                        <div className="space-y-2">
                          <input type="text" value={newFaqQuestions[sIdx] || ''} onChange={(e) => setNewFaqQuestions({ ...newFaqQuestions, [sIdx]: e.target.value })} className="w-full px-3.5 py-2.5 bg-white border border-slate-100 rounded-xl font-bold text-slate-800 text-[11px] focus:outline-none" placeholder="Question?" />
                          <textarea value={newFaqAnswers[sIdx] || ''} onChange={(e) => setNewFaqAnswers({ ...newFaqAnswers, [sIdx]: e.target.value })} rows={2} className="w-full px-3.5 py-2.5 bg-white border border-slate-100 rounded-xl font-bold text-slate-800 text-[11px] resize-none focus:outline-none" placeholder="Answer..." />
                        </div>
                        <button type="button" onClick={() => addFaq(sIdx)} className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1 border-0 cursor-pointer">
                          <Plus size={11} /> Add Q&A Accordion
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
                <Save size={19} /> Save Detail Sections
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
