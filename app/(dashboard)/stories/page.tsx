"use client";

import React, { useState, useEffect } from 'react';
import { 
  getAllStories, 
  updateStoryStatus, 
  deleteStory,
  checkSlugAvailability
} from '@/services/story.service';
import { 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Clock, 
  User, 
  Calendar,
  ExternalLink,
  Search,
  Sparkles,
  RefreshCcw,
  BookOpen,
  MapPin,
  Mail,
  FileText,
  AlertTriangle,
  X,
  Star
} from 'lucide-react';
import Image from "@/components/ui/Image";
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function StoriesModerationPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states for full view and rejection reason
  const [selectedStory, setSelectedStory] = useState<any | null>(null);
  const [rejectionModalStory, setRejectionModalStory] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [submittingRejection, setSubmittingRejection] = useState(false);

  // Form states for slug & metadata editing
  const [slugInput, setSlugInput] = useState('');
  const [metaTitleInput, setMetaTitleInput] = useState('');
  const [metaDescriptionInput, setMetaDescriptionInput] = useState('');
  const [metaKeywordsInput, setMetaKeywordsInput] = useState('');
  const [slugClashInfo, setSlugClashInfo] = useState<any | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);

  // Prefill configuration inputs on story select
  useEffect(() => {
    if (selectedStory) {
      const initialSlug = selectedStory.slug || selectedStory.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '';
      setSlugInput(initialSlug);
      setMetaTitleInput(selectedStory.metaData?.title || selectedStory.title || '');
      setMetaDescriptionInput(selectedStory.metaData?.description || selectedStory.shortDescription || selectedStory.content?.substring(0, 150) || '');
      setMetaKeywordsInput(selectedStory.metaData?.keywords || selectedStory.tags?.join(', ') || '');
      setSlugClashInfo(null);
    }
  }, [selectedStory]);

  // Debounced real-time slug availability check
  useEffect(() => {
    if (!selectedStory || !slugInput.trim()) {
      setSlugClashInfo(null);
      return;
    }

    const checkAvailability = async () => {
      setCheckingSlug(true);
      try {
        const result = await checkSlugAvailability(slugInput.trim(), selectedStory._id);
        setSlugClashInfo(result);
      } catch (error) {
        console.error("Failed to check slug availability", error);
      } finally {
        setCheckingSlug(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      checkAvailability();
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [slugInput, selectedStory?._id]);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const data = await getAllStories(filter === 'all' ? undefined : filter);
      setStories(data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch stories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [filter]);

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected', reason?: string) => {
    try {
      let slug = undefined;
      let metaData = undefined;

      if (selectedStory && selectedStory._id === id) {
        slug = slugInput.trim();
        metaData = {
          title: metaTitleInput.trim(),
          description: metaDescriptionInput.trim(),
          keywords: metaKeywordsInput.trim(),
        };
      }

      await updateStoryStatus(id, status, reason, slug, metaData);
      toast.success(`Story successfully ${status}`);
      
      // Close any active modals
      setRejectionModalStory(null);
      setRejectionReason('');
      if (selectedStory?._id === id) {
        setSelectedStory(null);
      }
      
      fetchStories();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleRejectClick = (story: any) => {
    setRejectionModalStory(story);
    setRejectionReason('');
  };

  const submitRejection = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    setSubmittingRejection(true);
    await handleStatusUpdate(rejectionModalStory._id, 'rejected', rejectionReason);
    setSubmittingRejection(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this story?")) return;
    try {
      await deleteStory(id);
      toast.success("Story deleted successfully");
      if (selectedStory?._id === id) {
        setSelectedStory(null);
      }
      fetchStories();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete story");
    }
  };

  const filteredStories = stories.filter(story => 
    story.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.author?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-3 sm:p-6 md:p-10 max-w-7xl mx-auto min-h-screen bg-[#F8FAFC] text-slate-800 rounded-2xl sm:rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden font-['Inter',sans-serif]">
      {/* Background Soft Orbs */}
      <div className="absolute top-[-25%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-indigo-500/5 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-orange-500/5 to-transparent blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1 w-8 bg-indigo-500 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Mountain Monkey Moderation</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Traveler <span className="bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">Stories</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Moderate, review, and verify stories shared by the Mountain Monkey community.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchStories}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-all duration-300 shadow-xs group cursor-pointer"
            title="Refresh list"
          >
            <RefreshCcw size={20} className={loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 relative z-10">
        <div className="lg:col-span-7 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search stories by title, location, or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all font-medium text-slate-700 placeholder:text-slate-400 text-sm"
          />
        </div>
        
        <div className="lg:col-span-5 flex items-center gap-1 bg-white p-1 sm:p-1.5 border border-slate-200 rounded-2xl">
          {['pending', 'approved', 'rejected', 'all'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`flex-1 py-2 sm:py-3 rounded-xl text-[9px] sm:text-xs font-bold uppercase tracking-normal sm:tracking-wider transition-all border-0 cursor-pointer ${
                filter === s 
                ? 'bg-slate-900 text-white shadow-sm font-black' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 bg-transparent'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-[400px] bg-white rounded-3xl animate-pulse border border-slate-100 shadow-sm" />
          ))}
        </div>
      ) : filteredStories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <AnimatePresence mode="popLayout">
            {filteredStories.map((story) => (
              <motion.div
                key={story._id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="group bg-white rounded-3xl border border-slate-200/60 shadow-xs hover:border-indigo-500/20 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Story Image / Banner */}
                <div className="aspect-video w-full bg-slate-100 relative overflow-hidden">
                  {story.images?.[0] ? (
                    <Image 
                      src={story.images[0]} 
                      alt={story.title} 
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                      <Sparkles size={48} className="text-slate-200" />
                      <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 mt-2">No Images Provided</span>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border backdrop-blur-md ${
                      story.status === 'approved' ? 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]' :
                      story.status === 'rejected' ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]' :
                      'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]'
                    }`}>
                      {story.status}
                    </span>
                  </div>

                  {/* Quick Detail Info (location / date) */}
                  <div className="absolute bottom-3 left-4 flex items-center gap-3">
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-white/95 border border-slate-100 backdrop-blur-md rounded-lg text-[10px] font-bold text-slate-700 shadow-xs">
                      <MapPin size={10} className="text-indigo-500" />
                      {story.location}
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-slate-400 text-[9px] font-black uppercase tracking-widest mb-3">
                      <Calendar size={11} className="text-slate-400" />
                      {new Date(story.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    
                    <h3 className="text-xl font-extrabold text-slate-900 mb-3 line-clamp-1 group-hover:text-indigo-600 transition-all duration-300">
                      {story.title}
                    </h3>
                    
                    <p className="text-slate-500 font-medium text-xs leading-relaxed line-clamp-3 mb-6">
                      {story.content}
                    </p>
                  </div>

                  {/* Author Box and Moderation Actions */}
                  <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0 sm:max-w-[55%]">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-sm shadow-inner flex-shrink-0">
                        {story.author?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{story.author?.name || 'Anonymous'}</p>
                        <p className="text-[9px] text-slate-400 font-medium truncate">{story.author?.email || 'Explorer'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedStory(story)}
                        className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl transition-all cursor-pointer"
                        title="Read Full Story"
                      >
                        <FileText size={16} />
                      </button>

                      {story.status !== 'approved' && (
                        <button 
                          onClick={() => handleStatusUpdate(story._id, 'approved')}
                          className="p-2.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl hover:bg-emerald-600 hover:text-white transition-all cursor-pointer shadow-xs"
                          title="Approve Story"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      
                      {story.status !== 'rejected' && (
                        <button 
                          onClick={() => handleRejectClick(story)}
                          className="p-2.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl hover:bg-rose-600 hover:text-white transition-all cursor-pointer shadow-xs"
                          title="Reject Story"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleDelete(story._id)}
                        className="p-2.5 bg-slate-50 text-slate-400 border border-slate-200/60 rounded-xl hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all cursor-pointer shadow-xs"
                        title="Delete Story Permanently"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Rejection Reason display if rejected */}
                  {story.status === 'rejected' && story.rejectionReason && (
                    <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2">
                      <AlertTriangle size={12} className="text-rose-500 mt-0.5 flex-shrink-0" />
                      <p className="text-[10px] text-rose-700 leading-normal font-medium">
                        <span className="font-bold uppercase tracking-wider text-[8px] block mb-0.5">Rejection Reason:</span>
                        {story.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-28 bg-white rounded-3xl border border-slate-100 relative z-10 shadow-xs">
          <BookOpen size={54} className="mx-auto text-slate-200 mb-6" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No stories found</h2>
          <p className="text-slate-500 font-medium text-sm max-w-sm mx-auto">There are no traveler stories matching the "{filter}" filter.</p>
        </div>
      )}

      {/* Drawer / Modal to view full story */}
      <AnimatePresence>
        {selectedStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStory(null)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-[4px]"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-200 w-full max-w-3xl rounded-2xl sm:rounded-[2.5rem] shadow-2xl relative overflow-hidden z-10 max-h-[85vh] flex flex-col text-slate-800"
            >
              {/* Header */}
              <div className="px-5 py-4 sm:px-8 sm:py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500 block mb-1">Full Article Moderator</span>
                  <h2 className="text-xl font-extrabold text-slate-900 truncate max-w-[500px]">{selectedStory.title}</h2>
                </div>
                <button 
                  onClick={() => setSelectedStory(null)}
                  className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 custom-scrollbar bg-white">
                {/* Images Grid */}
                {selectedStory.images && selectedStory.images.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedStory.images.map((img: string, idx: number) => (
                      <div key={idx} className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                        <img src={img} alt={`Story visual ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-4 text-slate-500 text-xs py-3 border-y border-slate-100">
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                    <User size={12} className="text-indigo-500" />
                    By {selectedStory.author?.name || 'Explorer'} ({selectedStory.author?.email || 'Verified User'})
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                    <MapPin size={12} className="text-indigo-500" />
                    {selectedStory.location}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                    <Calendar size={12} className="text-indigo-500" />
                    Submitted {new Date(selectedStory.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>

                {/* Main Article Content */}
                <article className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {selectedStory.content}
                </article>

                {/* Rating display if present */}
                {selectedStory.rating && (
                  <div className="p-4 bg-amber-50 border border-amber-200/50 rounded-2xl flex items-center gap-3">
                    <Star className="fill-amber-500 text-amber-500" size={20} />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">User Star Rating</h4>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">{selectedStory.rating} out of 5 stars submitted</p>
                    </div>
                  </div>
                )}

                {/* Tags if present */}
                {selectedStory.tags && selectedStory.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedStory.tags.map((tag: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-slate-50 border border-slate-100 text-[10px] font-black uppercase text-slate-500 rounded-lg">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* SEO & URL Configuration Accordion */}
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200/60 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <Sparkles className="text-indigo-500" size={18} />
                    <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">SEO & URL Slug Configuration</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    {/* Slug field */}
                    <div className="space-y-1.5 md:col-span-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">URL Slug</label>
                        {checkingSlug && <span className="text-[10px] text-slate-400 animate-pulse font-medium">Checking slug...</span>}
                      </div>
                      <input
                        type="text"
                        value={slugInput}
                        onChange={(e) => setSlugInput(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
                        placeholder="e.g. majestic-himalayan-trek"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all font-semibold"
                      />
                      {slugClashInfo && !slugClashInfo.available && (
                        <div className="mt-1.5 p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2">
                          <AlertTriangle size={14} className="text-rose-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-[10px] text-rose-700 font-bold uppercase tracking-wider">⚠️ Duplicate Slug Detected!</p>
                            <p className="text-[10px] text-rose-600 font-medium mt-0.5 leading-relaxed">
                              This slug is already in use by approved story: <span className="font-bold">"{slugClashInfo.clashingStory?.title}"</span>. You must choose a unique slug to approve this story.
                            </p>
                          </div>
                        </div>
                      )}
                      {slugClashInfo && slugClashInfo.available && slugInput.trim() !== '' && (
                        <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
                          <CheckCircle size={12} /> Slug is unique and available for publication.
                        </p>
                      )}
                    </div>

                    {/* Meta Title */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Meta Title</label>
                      <input
                        type="text"
                        value={metaTitleInput}
                        onChange={(e) => setMetaTitleInput(e.target.value)}
                        placeholder="Page Title for SEO"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all font-medium"
                      />
                    </div>

                    {/* Meta Keywords */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Meta Keywords</label>
                      <input
                        type="text"
                        value={metaKeywordsInput}
                        onChange={(e) => setMetaKeywordsInput(e.target.value)}
                        placeholder="trek, travel, adventure"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all font-medium"
                      />
                    </div>

                    {/* Meta Description */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Meta Description</label>
                      <textarea
                        value={metaDescriptionInput}
                        onChange={(e) => setMetaDescriptionInput(e.target.value)}
                        rows={2}
                        placeholder="Search engine description snippet..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all font-medium resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons footer */}
              <div className="px-5 py-4 sm:px-8 sm:py-5 border-t border-slate-100 bg-slate-50/50 flex flex-wrap sm:flex-nowrap items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedStory(null)}
                  className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                >
                  Close
                </button>
                {selectedStory.status !== 'approved' && (
                  <button 
                    onClick={() => handleStatusUpdate(selectedStory._id, 'approved')}
                    disabled={slugClashInfo && !slugClashInfo.available}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-sm border-0"
                  >
                    <CheckCircle size={14} /> Approve Story
                  </button>
                )}
                {selectedStory.status !== 'rejected' && (
                  <button 
                    onClick={() => {
                      setSelectedStory(null);
                      handleRejectClick(selectedStory);
                    }}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-sm border-0"
                  >
                    <XCircle size={14} /> Reject Story
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal to prompt for rejection reason */}
      <AnimatePresence>
        {rejectionModalStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRejectionModalStory(null)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-[4px]"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-200 w-full max-w-md rounded-[2rem] shadow-2xl relative overflow-hidden z-10 text-slate-800"
            >
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-500" />
                  <h3 className="font-extrabold text-slate-900 text-base">Reject traveler story</h3>
                </div>
                <button 
                  onClick={() => setRejectionModalStory(null)}
                  className="p-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition-all cursor-pointer bg-transparent border-0"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-4 bg-white">
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Provide a detailed explanation for rejecting <span className="text-slate-900 font-bold">"{rejectionModalStory.title}"</span>. The author will see this feedback in their profile dashboard.
                </p>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Rejection Reason</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={4}
                    placeholder="e.g. Content contains promotional links, inappropriate language, or violates community guidelines..."
                    className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500/30 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-2.5">
                <button
                  onClick={() => setRejectionModalStory(null)}
                  className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border-0"
                >
                  Cancel
                </button>
                <button
                  onClick={submitRejection}
                  disabled={submittingRejection}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50 border-0"
                >
                  Confirm Rejection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
