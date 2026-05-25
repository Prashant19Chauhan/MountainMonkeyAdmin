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
  Sparkles
} from 'lucide-react';
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
      setTestimonials(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [filter]);

  const handleAction = async (id: string, status: 'approved' | 'rejected', featured?: boolean) => {
    try {
      await updateTestimonialStatus(id, { status, featured });
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
        featured: !testimonial.featured 
      });
      toast.success(testimonial.featured ? "Removed from featured" : "Added to featured");
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
    t.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-50/30">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">User Testimonials</h1>
          <p className="text-slate-500 font-medium">Verify and showcase what our users say about us.</p>
        </div>
        
        <button 
          onClick={fetchTestimonials}
          className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm group"
        >
          <RefreshCcw size={20} className={loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search testimonials or users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-[2rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/20 transition-all font-medium text-slate-700"
          />
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1.5 border border-slate-200 rounded-[2rem] shadow-sm overflow-x-auto no-scrollbar">
          {['pending', 'approved', 'rejected', 'all'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                filter === s 
                ? 'bg-slate-900 text-white shadow-lg' 
                : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-white rounded-[2.5rem] animate-pulse border border-slate-100 shadow-sm" />
          ))}
        </div>
      ) : filteredTestimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredTestimonials.map((t) => (
              <motion.div
                key={t._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col"
              >
                {/* Featured Badge */}
                {t.featured && (
                  <div className="absolute -top-3 -right-3 z-10 bg-linear-to-r from-amber-400 to-orange-500 text-white p-2.5 rounded-2xl shadow-xl shadow-amber-200 animate-bounce-slow">
                    <Sparkles size={18} />
                  </div>
                )}

                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={16} 
                        className={star <= t.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} 
                      />
                    ))}
                  </div>
                  <Quote size={32} className="text-slate-100 group-hover:text-indigo-50 transition-colors" />
                </div>

                <p className="text-slate-600 font-medium italic mb-8 flex-1 leading-relaxed">
                  "{t.content}"
                </p>

                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-[1.25rem] bg-indigo-500 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100">
                    {t.user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900">{t.user?.name || 'Happy Traveler'}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified User</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex items-center justify-between gap-2">
                   <div className="flex items-center gap-1.5">
                    {t.status !== 'approved' && (
                      <button 
                        onClick={() => handleAction(t._id, 'approved')}
                        className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                        title="Approve"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                    {t.status !== 'rejected' && (
                      <button 
                        onClick={() => handleAction(t._id, 'rejected')}
                        className="p-2.5 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all"
                        title="Reject"
                      >
                        <XCircle size={18} />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(t._id)}
                      className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <button
                    onClick={() => handleToggleFeatured(t)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      t.featured 
                      ? 'bg-amber-500 text-white shadow-lg shadow-amber-100' 
                      : 'bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <Sparkles size={14} />
                    {t.featured ? 'Featured' : 'Feature'}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100">
          <Quote size={64} className="mx-auto text-slate-100 mb-6" />
          <h2 className="text-2xl font-black text-slate-900 mb-2">Quiet here...</h2>
          <p className="text-slate-500 font-medium">No testimonials match your current filter.</p>
        </div>
      )}
    </div>
  );
}
