"use client";

import Image from "@/components/ui/Image";
import React, { useState, useEffect } from 'react';
import { 
  getHomeHeroSection, 
  updateHomeHeroSection,
  updateHomeCustomSections,
  getAllAdvertisements,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement
} from '@/services/home.service';
import { getThemeMetaData } from '@/services/theme.service';
import { 
  LayoutDashboard, 
  Sparkles, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  Link as LinkIcon,
  Image as ImageIcon,
  Type,
  Layers,
  ArrowRight,
  RefreshCcw,
  Tag,
  Palette,
  ArrowUp,
  ArrowDown,
  HelpCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomeManagementPage() {
  const [activeTab, setActiveTab] = useState('hero');
  const [homeDoc, setHomeDoc] = useState<any>(null);
  const [heroData, setHeroData] = useState({
    title: '',
    tagline: '',
    searchBarPrompt: '',
    metaTitle: '',
    metaDescription: '',
    categories: [] as string[],
    mood: 'default'
  });
  const [moods, setMoods] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');

  // CMS customSections states
  const [customSections, setCustomSections] = useState<any[]>([]);
  const [newImageUrls, setNewImageUrls] = useState<{[key: number]: string}>({});
  const [newLinkTexts, setNewLinkTexts] = useState<{[key: number]: string}>({});
  const [newLinkUrls, setNewLinkUrls] = useState<{[key: number]: string}>({});
  const [newFaqQuestions, setNewFaqQuestions] = useState<{[key: number]: string}>({});
  const [newFaqAnswers, setNewFaqAnswers] = useState<{[key: number]: string}>({});

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
      await updateHomeCustomSections({ customSections });
      toast.success("Home custom content sections saved successfully!");
      fetchHomeData();
    } catch (error: any) {
      toast.error(error.message || "Failed to save content sections");
    }
  };

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      const home = await getHomeHeroSection();
      setHomeDoc(home);
      
      // Fetch moods
      const themeData = await getThemeMetaData();
      setMoods(themeData.moods || []);

      // Set initial hero data (default or first available)
      if (home && home.heroSection?.length > 0) {
        const defaultHero = home.heroSection.find((h: any) => h.mood === 'default') || home.heroSection[0];
        setHeroData(defaultHero);
      }

      if (home && home.customSections) {
        setCustomSections(home.customSections);
      }
      
      const advertisements = await getAllAdvertisements();
      setAds(advertisements);
    } catch (error: any) {
      toast.error("Failed to fetch home data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const handleMoodChange = (moodName: string) => {
    const existingHero = homeDoc?.heroSection?.find((h: any) => h.mood === moodName);
    if (existingHero) {
      setHeroData(existingHero);
    } else {
      setHeroData({
        title: '',
        tagline: '',
        searchBarPrompt: '',
        metaTitle: '',
        metaDescription: '',
        categories: [],
        mood: moodName
      });
    }
  };

  const handleHeroUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateHomeHeroSection(heroData);
      toast.success(`Hero section for '${heroData.mood}' updated successfully`);
      fetchHomeData();
    } catch (error: any) {
      toast.error(error.message || "Update failed");
    }
  };

  const addCategory = () => {
    if (!newCategory.trim()) return;
    setHeroData({ ...heroData, categories: [...heroData.categories, newCategory.trim()] });
    setNewCategory('');
  };

  const removeCategory = (index: number) => {
    const updated = heroData.categories.filter((_, i) => i !== index);
    setHeroData({ ...heroData, categories: updated });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-50/30">
      {/* Header */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Home Control Center</h1>
          <p className="text-slate-500 font-medium">Manage exactly what users see when they land on Mountain Monkey.</p>
        </div>
        <button 
          onClick={fetchHomeData}
          className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-indigo-600 transition-all shadow-sm"
        >
          <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 border border-slate-200 rounded-[2.5rem] mb-10 w-fit shadow-sm">
        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all ${
            activeTab === 'hero' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Sparkles size={18} /> Hero Content
        </button>
        <button
          onClick={() => setActiveTab('ads')}
          className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all ${
            activeTab === 'ads' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Layers size={18} /> Advertisements
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all ${
            activeTab === 'custom' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Edit3 size={18} /> Custom Sections
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'hero' ? (
          <motion.div
            key="hero"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10"
          >
            {/* Form */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <form onSubmit={handleHeroUpdate} className="space-y-8">
                
                {/* Mood Selector */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Palette size={14} className="text-indigo-500" /> Target Theme / Mood
                  </label>
                  <select 
                    value={heroData.mood}
                    onChange={(e) => handleMoodChange(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer"
                  >
                    <option value="default">Default Theme</option>
                    {moods.map((m) => (
                      <option key={m.name} value={m.name}>{m.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Type size={14} className="text-indigo-500" /> Hero Title
                  </label>
                  <input 
                    type="text" 
                    value={heroData.title}
                    onChange={(e) => setHeroData({...heroData, title: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    placeholder="e.g. Discover the Unexplored"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <LayoutDashboard size={14} className="text-indigo-500" /> Tagline
                  </label>
                  <textarea 
                    value={heroData.tagline}
                    onChange={(e) => setHeroData({...heroData, tagline: e.target.value})}
                    rows={2}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"
                    placeholder="Describe the magic..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <ArrowRight size={14} className="text-indigo-500" /> Search Placeholder
                    </label>
                    <input 
                      type="text" 
                      value={heroData.searchBarPrompt}
                      onChange={(e) => setHeroData({...heroData, searchBarPrompt: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                      placeholder="Search prompt..."
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Edit3 size={14} className="text-indigo-500" /> Meta Title
                    </label>
                    <input 
                      type="text" 
                      value={heroData.metaTitle || ''}
                      onChange={(e) => setHeroData({...heroData, metaTitle: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                      placeholder="SEO Title..."
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Type size={14} className="text-indigo-500" />  Meta Description
                    </label>
                    <input 
                      type="text" 
                      value={heroData.metaDescription || ''}
                      onChange={(e) => setHeroData({...heroData, metaDescription: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                      placeholder="SEO Description..."
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Tag size={14} className="text-indigo-500" /> Popular Categories
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="flex-1 px-6 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-800"
                      placeholder="Add new tag..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                    />
                    <button 
                      type="button"
                      onClick={addCategory}
                      className="p-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-100"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {heroData.categories.map((cat, idx) => (
                      <span key={idx} className="group flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-xs font-black transition-all hover:bg-rose-50 hover:text-rose-600">
                        {cat}
                        <button type="button" onClick={() => removeCategory(idx)}>
                          <Trash2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-10"
                >
                  <Save size={20} /> Save Mood Content
                </button>
              </form>
            </div>

            {/* Preview Card */}
            <div className="hidden lg:block sticky top-8">
               <div className="bg-slate-900 p-8 rounded-[4rem] text-white aspect-square flex flex-col justify-center relative overflow-hidden group shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)]">
                  {/* Dynamic BG matching mood if possible */}
                  {moods.find(m => m.name === heroData.mood)?.bgColor && (
                    <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundColor: moods.find(m => m.name === heroData.mood).bgColor }}></div>
                  )}
                  <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-indigo-500/20 rounded-full blur-[120px] group-hover:bg-rose-500/20 transition-all duration-1000"></div>
                  <div className="relative z-10 text-center space-y-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Preview: {heroData.mood}</span>
                    <h1 className="text-5xl font-black leading-tight">{heroData.title || "Your Title Here"}</h1>
                    <p className="text-lg text-slate-400 font-medium max-w-sm mx-auto">{heroData.tagline || "Your tagline will appear here to inspire travelers."}</p>
                    <div className="max-w-md mx-auto h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center px-6">
                      <span className="text-white/40 text-sm font-bold">{heroData.searchBarPrompt || "Search prompt..."}</span>
                    </div>
                  </div>
               </div>
               <p className="text-center mt-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Live Preview for: <span className="text-indigo-600">{heroData.mood}</span></p>
            </div>
          </motion.div>
        ) : activeTab === 'ads' ? (
          <motion.div
            key="ads"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Ad Grid - Keep existing logic */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <button 
                type="button"
                className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-10 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-500 hover:text-indigo-500 transition-all group aspect-square lg:aspect-auto"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-50 transition-all">
                  <Plus size={32} />
                </div>
                <span className="font-black uppercase tracking-widest text-xs">Create New Ad</span>
              </button>

              {ads.map((ad) => (
                <div key={ad._id} className="group bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                  <div className="relative aspect-video bg-slate-100 rounded-[2rem] overflow-hidden mb-6">
                    {ad.imageUrl ? (
                      <Image src={ad.imageUrl} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-200">
                        <ImageIcon size={48} />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-900 mb-2">{ad.title}</h3>
                  <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-6">{ad.description}</p>
                  
                  <div className="flex items-center gap-2 mb-8">
                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">{ad.type}</span>
                    <span className="bg-slate-50 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">{ad.placement}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-auto">
                    <button className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-2xl font-black text-xs hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2">
                      <Edit3 size={14} /> Edit
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                         if(window.confirm("Delete this ad?")) {
                           deleteAdvertisement(ad._id).then(() => {
                             toast.success("Ad deleted");
                             fetchHomeData();
                           });
                         }
                      }}
                      className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="custom"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            {/* Top Bar for Custom Sections */}
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
              <div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-wide">Homepage Custom Content Sections</h2>
                <p className="text-slate-500 font-medium text-sm mt-1">Design and manage modular section blocks below the Travel Modes strip.</p>
              </div>
              <button
                type="button"
                onClick={createNewCustomSection}
                className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-100 transition-all flex items-center gap-2 cursor-pointer border-0"
              >
                <Plus size={16} /> Add Section Block
              </button>
            </div>

            {/* List of Custom Sections */}
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
                      {/* Section Controls (Move Up/Down, Delete) */}
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

                      {/* Header Title */}
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 block mb-6">
                        Section Block #{sIdx + 1}
                      </span>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Side: General Fields */}
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
                              placeholder="e.g. Unleash Your Peak Adventure"
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
                              placeholder="Add descriptive content here for travelers..."
                            />
                          </div>

                          {/* Image URL adding */}
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
                            
                            {/* Images Grid Thumbnail Preview */}
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

                        {/* Right Side: Links & FAQs */}
                        <div className="space-y-6">
                          {/* Links Creator */}
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
                                placeholder="Link Label (e.g. View Packages)"
                              />
                              <input
                                type="text"
                                value={newLinkUrls[sIdx] || ''}
                                onChange={(e) => setNewLinkUrls({ ...newLinkUrls, [sIdx]: e.target.value })}
                                className="px-4 py-2.5 bg-white border border-slate-100 rounded-xl font-bold text-slate-800 text-[11px] focus:outline-none"
                                placeholder="URL (e.g. /packages)"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => addLinkToSection(sIdx)}
                              className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-all text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1 border-0 cursor-pointer"
                            >
                              <Plus size={12} /> Add Link Pill
                            </button>

                            {/* Links display list */}
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

                          {/* FAQs Creator */}
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
                                placeholder="Question (e.g. Is trekking experience required?)"
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

                            {/* FAQs display list */}
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

                {/* Save Button */}
                <button
                  type="submit"
                  className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-10 cursor-pointer border-0"
                >
                  <Save size={20} /> Save CMS Content
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
