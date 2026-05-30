"use client";

import React, { useState, useEffect } from 'react';
import { 
  getAllTestimonials, 
  updateTestimonialStatus, 
  deleteTestimonial 
} from '@/services/testimonial.service';
import { 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Star,
  Quote,
  User,
  ShieldCheck,
  RefreshCcw,
  Search,
  Sparkles,
  Edit3,
  Award,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function TestimonialsModerationPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const data = await getAllTestimonials(filter === 'all' ? undefined : filter);
      setTestimonials(data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [filter]);

  const handleAction = async (id: string, status: 'approved' | 'rejected', isFeatured?: boolean) => {
    try {
      await updateTestimonialStatus(id, { status, isFeatured });
      toast.success(`Testimonial ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
      fetchTestimonials();
    } catch (error: any) {
      toast.error(error.message || "Failed to update testimonial");
    }
  };

  const handleToggleFeatured = async (testimonial: any) => {
    try {
      await updateTestimonialStatus(testimonial._id, { 
        status: testimonial.status, 
        isFeatured: !testimonial.isFeatured 
      });
      toast.success(testimonial.isFeatured ? "Removed from featured" : "Added to featured");
      fetchTestimonials();
    } catch (error: any) {
      toast.error(error.message || "Failed to toggle featured status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await deleteTestimonial(id);
      toast.success("Testimonial deleted successfully");
      fetchTestimonials();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete testimonial");
    }
  };

  const filteredTestimonials = testimonials.filter(t => 
    t.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen bg-[#F8FAFC] text-slate-800 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden font-['Inter',sans-serif]">
      {/* Background Soft Orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-indigo-500/5 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-orange-500/5 to-transparent blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1 w-8 bg-indigo-500 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Mountain Monkey Moderation</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            User <span className="bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">Testimonials</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Verify, feature, and showcase traveler feedback on the home page.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/metadata?testimonials-page=testimonials-page" className="no-underline">
            <button className="px-5 py-3 bg-white hover:bg-slate-50 text-indigo-600 border border-slate-200 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-xs hover:scale-[1.02]">
              <Edit3 size={14} /> SEO Meta
            </button>
          </Link>
          <button 
            onClick={fetchTestimonials}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-all duration-300 shadow-xs group cursor-pointer"
            title="Refresh list"
          >
            <RefreshCcw size={20} className={loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
          </button>
        </div>
      </div>

      {/* Controls / Filter Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 relative z-10">
        <div className="lg:col-span-7 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search testimonials or users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all font-medium text-slate-700 placeholder:text-slate-400 text-sm"
          />
        </div>
        
        <div className="lg:col-span-5 flex items-center gap-1.5 bg-white p-1.5 border border-slate-200 rounded-2xl">
          {['pending', 'approved', 'rejected', 'all'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border-0 cursor-pointer ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-72 bg-white rounded-3xl animate-pulse border border-slate-100 shadow-sm" />
          ))}
        </div>
      ) : filteredTestimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          <AnimatePresence mode="popLayout">
            {filteredTestimonials.map((t) => (
              <motion.div
                key={t._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="group relative bg-white p-8 rounded-3xl border border-slate-200/60 shadow-xs hover:border-indigo-500/20 hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[300px]"
              >
                {/* Featured Glowing Ring / Icon */}
                {t.isFeatured && (
                  <div className="absolute -top-3.5 -right-3.5 z-10 bg-gradient-to-br from-amber-400 to-orange-500 text-white p-2.5 rounded-2xl shadow-md animate-pulse border border-amber-300/35">
                    <Sparkles size={16} className="stroke-[2.5px]" />
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={15} 
                          className={star <= t.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} 
                        />
                      ))}
                    </div>
                    <Quote size={28} className="text-slate-100 group-hover:text-slate-200 transition-all duration-300" />
                  </div>

                  <blockquote className="text-slate-600 font-medium italic mb-6 leading-relaxed text-sm">
                    &ldquo;{t.message}&rdquo;
                  </blockquote>
                </div>

                <div className="mt-auto">
                  {/* User details */}
                  <div className="flex items-center gap-3.5 mb-6 pt-4 border-t border-slate-100">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-base">
                      {t.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-800 text-sm truncate flex items-center gap-1.5">
                        {t.user?.name || 'Happy Traveler'}
                        {t.isFeatured && <Award size={13} className="text-amber-500" />}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium truncate">{t.user?.email || 'verified explorer'}</p>
                    </div>
                  </div>

                  {/* Actions Panel */}
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      {t.status !== 'approved' && (
                        <button 
                          onClick={() => handleAction(t._id, 'approved', t.isFeatured)}
                          className="p-2.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl hover:bg-emerald-600 hover:text-white transition-all cursor-pointer shadow-xs"
                          title="Approve Testimony"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {t.status !== 'rejected' && (
                        <button 
                          onClick={() => handleAction(t._id, 'rejected', t.isFeatured)}
                          className="p-2.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl hover:bg-rose-600 hover:text-white transition-all cursor-pointer shadow-xs"
                          title="Reject Testimony"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(t._id)}
                        className="p-2.5 bg-slate-50 text-slate-400 border border-slate-200/60 rounded-xl hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all cursor-pointer shadow-xs"
                        title="Delete Permanently"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleToggleFeatured(t)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border cursor-pointer ${
                        t.isFeatured 
                        ? 'bg-amber-400 text-white border-amber-300/35 shadow-sm' 
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <Sparkles size={11} className={t.isFeatured ? "stroke-[2.5px]" : ""} />
                      {t.isFeatured ? 'Featured' : 'Feature'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-28 bg-white rounded-3xl border border-slate-100 relative z-10 shadow-xs">
          <Quote size={54} className="mx-auto text-slate-200 mb-6" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No testimonials found</h2>
          <p className="text-slate-500 font-medium text-sm max-w-sm mx-auto">There are no testimonials listed in the "{filter}" category at the moment.</p>
        </div>
      )}
    </div>
  );
}
