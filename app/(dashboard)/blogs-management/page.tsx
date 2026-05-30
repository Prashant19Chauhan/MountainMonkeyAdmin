"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Eye, 
  Settings, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Layout,
  Edit3,
  Loader2
} from 'lucide-react';
import { getBlogsApi } from '@/services/blog.service';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function BlogsPageManagement() {
  const [blogStats, setBlogStats] = useState({
    total: 0,
    active: 0,
    drafts: 0,
    categories: [] as string[]
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await getBlogsApi(1, 100);
      if (response && response.data) {
        const blogs = response.data;
        const active = blogs.filter((b: any) => b.status === 'Active').length;
        const drafts = blogs.filter((b: any) => b.status === 'Draft').length;
        const categories = Array.from(new Set(blogs.map((b: any) => b.category))) as string[];
        setBlogStats({
          total: response.meta?.total || blogs.length,
          active,
          drafts,
          categories
        });
      }
    } catch (error) {
      console.error("Failed to load blog stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center h-screen gap-4 bg-slate-50'>
        <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Mapping Blogs Workspace...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-50/30 text-left font-sans text-slate-800">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-slate-900 p-2.5 rounded-xl shadow-md text-white">
              <FileText size={22} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Blogs Page CMS</h1>
          </div>
          <p className="text-slate-500 font-medium">Manage the main public blogs directory layouts, editorial policies, SEO meta tags, and index coverage.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/metadata?blog-page=blog-page">
            <button className="px-5 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 cursor-pointer border-0">
              <Edit3 size={14} /> Configure SEO Meta
            </button>
          </Link>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-10"
      >
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total Articles" value={blogStats.total} description="Combined inventory" />
          <StatCard title="Published Guideposts" value={blogStats.active} description="Active on directory" />
          <StatCard title="Drafts & Revisions" value={blogStats.drafts} description="Pending publication" />
          <StatCard title="Featured Topics" value={blogStats.categories.length} description="Dynamic categories" />
        </div>

        {/* Configurations Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
          {/* Main Blogs Hub Link */}
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
            <div>
              <div className="bg-slate-50 p-4 rounded-3xl w-fit mb-6 text-indigo-500 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-500">
                <Layout size={28} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">Editorial Article Desk</h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mt-3">
                Access the primary lists of blog narrative posts. Write Manali trekking experiences, mountaineering warnings, gear packing checklist guides, and dynamic layout sub-sections.
              </p>
            </div>
            <Link href="/blogs" className="mt-8">
              <button className="px-6 py-4 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer border-0 w-full justify-between">
                <span>Manage Articles Inventory</span>
                <ArrowRight size={16} />
              </button>
            </Link>
          </div>

          {/* SEO Metadata Setup */}
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
            <div>
              <div className="bg-slate-50 p-4 rounded-3xl w-fit mb-6 text-indigo-500 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-500">
                <Sparkles size={28} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">SEO Metadata Manager</h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mt-3">
                Configure SEO title headers, search indexing meta tags, key catchphrases, and social share image cards for the primary public "/blogs" directory hub page.
              </p>
            </div>
            <Link href="/metadata?blog-page=blog-page" className="mt-8">
              <button className="px-6 py-4 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer border-0 w-full justify-between">
                <span>Configure Hub Page SEO</span>
                <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>

        {/* Directory Categorization Overview */}
        <div className="bg-white p-8 sm:p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-wide">Category Index Map</h3>
              <p className="text-slate-400 font-medium text-xs mt-1">Breakdown of content streams active across the portal directory.</p>
            </div>
            <div className="bg-slate-50 text-[10px] font-black text-indigo-600 px-3 py-1.5 rounded-xl border border-slate-100 uppercase tracking-widest">
              Live Categorization
            </div>
          </div>

          {blogStats.categories.length === 0 ? (
            <p className="text-slate-400 text-sm italic font-medium">No categories tracked. Create articles to define categories.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {blogStats.categories.map((category) => (
                <span 
                  key={category} 
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-extrabold text-[11px] px-4 py-2.5 rounded-2xl shadow-2xs hover:scale-[1.02] transition-all cursor-pointer"
                >
                  {category}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ title, value, description }: { title: string, value: number, description: string }) {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{title}</p>
      <h3 className="text-4xl font-black text-slate-900 tracking-tighter mt-4 mb-2">{value}</h3>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{description}</span>
    </div>
  );
}
