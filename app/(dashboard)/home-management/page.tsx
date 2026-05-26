"use client";

import Image from "@/components/ui/Image";
import React, { useState, useEffect } from 'react';
import { 
  getHomeHeroSection, 
  updateHomeHeroSection,
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
  Palette
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
        ) : (
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
        )}
      </AnimatePresence>
    </div>
  );
}
