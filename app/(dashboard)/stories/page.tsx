"use client";

import Image from "@/components/ui/Image";
import React, { useState, useEffect } from 'react';
import { 
  getAllStories, 
  updateStoryStatus, 
  deleteStory 
} from '@/services/story.service';
import { 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Clock, 
  User, 
  Calendar,
  ExternalLink,
  Filter,
  RefreshCcw,
  Search,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function StoriesModerationPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStories = async () => {
    setLoading(true);
    try {
      const data = await getAllStories(filter === 'all' ? undefined : filter);
      setStories(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch stories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [filter]);

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateStoryStatus(id, status);
      toast.success(`Story ${status} successfully`);
      fetchStories();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    try {
      await deleteStory(id);
      toast.success("Story deleted successfully");
      fetchStories();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete story");
    }
  };

  const filteredStories = stories.filter(story => 
    story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.author?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-50/30">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Traveler Stories</h1>
          <p className="text-slate-500 font-medium">Moderate and manage stories shared by our community.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchStories}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all shadow-sm group"
          >
            <RefreshCcw size={20} className={loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-8 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by title, location, or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-[2rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/20 transition-all font-medium text-slate-700"
          />
        </div>
        
        <div className="lg:col-span-4 flex items-center gap-2 bg-white p-1.5 border border-slate-200 rounded-[2rem] shadow-sm">
          {['pending', 'approved', 'rejected', 'all'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`flex-1 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                filter === s 
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 bg-white rounded-[2.5rem] animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : filteredStories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredStories.map((story) => (
              <motion.div
                key={story._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden flex flex-col"
              >
                {/* Image Placeholder or Actual Image */}
                <div className="aspect-video bg-slate-100 relative overflow-hidden">
                  {story.images?.[0] ? (
                    <Image src={story.images[0]} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Sparkles size={48} />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${
                      story.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                      story.status === 'rejected' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' :
                      'bg-amber-500/10 text-amber-600 border-amber-500/20'
                    }`}>
                      {story.status}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                    <Calendar size={12} />
                    {new Date(story.createdAt).toLocaleDateString()}
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{story.title}</h3>
                  <p className="text-slate-500 font-medium line-clamp-3 mb-6 text-sm leading-relaxed">{story.content}</p>

                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-black text-sm">
                        {story.author?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900">{story.author?.name || 'Anonymous'}</p>
                        <p className="text-[10px] font-bold text-slate-400">{story.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {story.status !== 'approved' && (
                        <button 
                          onClick={() => handleStatusUpdate(story._id, 'approved')}
                          className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                          title="Approve"
                        >
                          <CheckCircle size={20} />
                        </button>
                      )}
                      {story.status !== 'rejected' && (
                        <button 
                          onClick={() => handleStatusUpdate(story._id, 'rejected')}
                          className="p-3 bg-amber-50 text-amber-600 rounded-2xl hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                          title="Reject"
                        >
                          <XCircle size={20} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(story._id)}
                        className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
          <div className="bg-slate-50 p-6 rounded-full mb-6">
            <Clock size={48} className="text-slate-300" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">No stories found</h2>
          <p className="text-slate-500 font-medium">Wait for users to share their amazing experiences.</p>
        </div>
      )}
    </div>
  );
}
