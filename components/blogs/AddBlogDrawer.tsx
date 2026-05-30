"use client";

import React from 'react';
import { X, Save, Edit3 } from 'lucide-react';

interface AddBlogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  blogHook: any;
}

export default function AddBlogDrawer({ isOpen, onClose, blogHook }: AddBlogDrawerProps) {
  const { formData, handleInputChange, editBlogId, loading, updateFields } = blogHook;

  if (!isOpen) return null;

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const tagsArr = value.split(',').map(tag => tag.trim()).filter(Boolean);
    updateFields({ tags: tagsArr });
  };

  return (
    <>
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity duration-300"
      />
      <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] bg-white z-50 shadow-2xl flex flex-col h-full border-l border-slate-100 transition-all duration-300 transform font-sans text-left text-slate-800">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="bg-slate-900 p-2 rounded-xl text-white">
              <Edit3 size={18} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                {editBlogId ? "Edit Blog Article" : "Create Blog Article"}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">CMS Publishing desk</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-colors border-0 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (editBlogId) {
              blogHook.handleBlogUpdate();
            } else {
              blogHook.handleBlogCreate();
            }
            onClose();
          }}
          className="flex-1 overflow-y-auto p-6 space-y-5"
        >
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Blog Title *</label>
            <input 
              type="text" 
              required
              name="title"
              value={formData.title} 
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 text-xs focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all"
              placeholder="e.g., Ultimate Manali Trekking Guide..."
            />
          </div>

          {/* Author */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Author Name *</label>
            <input 
              type="text" 
              required
              name="author"
              value={formData.author} 
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 text-xs focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all"
              placeholder="e.g., MountainMonkey Guide..."
            />
          </div>

          {/* Cover Image URL */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Cover Image URL *</label>
            <input 
              type="text" 
              required
              name="coverImage"
              value={formData.coverImage} 
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 text-xs focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Category *</label>
              <select 
                name="category"
                value={formData.category} 
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 text-xs focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all"
              >
                <option value="Travel Guide">Travel Guide</option>
                <option value="Himalayan Tips">Himalayan Tips</option>
                <option value="Gear & Equipment">Gear & Equipment</option>
                <option value="Logistics & Permits">Logistics & Permits</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Publish Status *</label>
              <select 
                name="status"
                value={formData.status} 
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 text-xs focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all"
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Tags (Comma-separated)</label>
            <input 
              type="text" 
              name="tags"
              value={formData.tags?.join(', ') || ''} 
              onChange={handleTagsChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 text-xs focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all"
              placeholder="trekking, gear, safety, manali"
            />
          </div>

          {/* Short Catchphrase Description */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Short Catchphrase Description *</label>
            <textarea 
              required
              name="shortDescription"
              value={formData.shortDescription} 
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 text-xs focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all resize-none"
              placeholder="Short catchy summary shown in listing cards..."
            />
          </div>

          {/* Detailed Content */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Article Core Narrative *</label>
            <textarea 
              required
              name="content"
              value={formData.content} 
              onChange={handleInputChange}
              rows={8}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 text-xs focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all resize-none"
              placeholder="Deep narrative body paragraphs or markdown blocks..."
            />
          </div>

          {/* Drawer Footer Actions */}
          <div className="pt-4 border-t border-slate-50 flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border-0 cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center gap-1.5 shadow-md shadow-slate-900/10 cursor-pointer border-0"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={14} />
              )}
              {editBlogId ? "Save Changes" : "Publish Blog"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
