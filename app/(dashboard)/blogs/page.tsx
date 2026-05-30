"use client";

import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  FileText,
  User,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Edit3
} from 'lucide-react';
import AddBlogDrawer from '../../../components/blogs/AddBlogDrawer';
import useBlog from '@/hooks/useBlog';
import DeleteDialog from '../../../components/mainComponents/deleteDialog';
import Link from 'next/link';

export default function BlogsPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  const blogHook = useBlog();
  const {
    blogsData, isBlogsLoading,
    deleteBlog, isDeleteBlogLoading, isDeleteDialogOpen, setIsDeleteDialogOpen,
    setEditBlogId,
    page, setPage,
    search, setSearch
  } = blogHook;

  const [localSearch, setLocalSearch] = useState(search);

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(localSearch);
      setPage(1); // Reset to first page on search
    }, 500);
    return () => clearTimeout(handler);
  }, [localSearch, setSearch, setPage]);

  if (isBlogsLoading) {
    return (
      <div className='flex flex-col items-center justify-center h-screen gap-4 bg-slate-50'>
        <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Loading Articles...</p>
      </div>
    );
  }

  const blogs = blogsData?.data || [];
  const totalItems = blogsData?.meta?.total || 0;
  const totalPages = blogsData?.meta?.totalPages || 1;

  const uniqueCategories = new Set(blogs.map((b: any) => b.category)).size;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-800 text-left">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 md:mb-10 gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-[#0f172a] tracking-tighter">Blog Articles</h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1 font-medium italic">Compose, publish, and structure editorial guides and experiences.</p>
        </div>
        <button
          onClick={() => {
            setEditBlogId(null);
            blogHook.resetForm();
            setIsDrawerOpen(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 md:py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/10 active:scale-95 border-0 cursor-pointer">
          <Plus size={18} />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Total Articles"
          value={totalItems.toString()}
          trend="Registered"
          icon={<FileText className="text-blue-500" size={20} />}
        />
        <StatCard
          title="Page Coverage"
          value={blogs.length.toString()}
          trend="On This Page"
          icon={<CheckCircle className="text-emerald-500" size={20} />}
        />
        <StatCard
          title="Categories"
          value={uniqueCategories.toString()}
          trend="Active Topics"
          icon={<User className="text-indigo-500" size={20} />}
        />
      </div>

      {/* Table Interface */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">

        {/* Toolbar */}
        <div className="p-4 md:p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-white">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search by title, category, author..."
              className="w-full pl-11 pr-4 py-2.5 md:py-3 bg-slate-50/50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm border-0 cursor-pointer">
              <Filter size={16} />
              <span>Filters</span>
            </button>
            <div className="hidden sm:flex items-center px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-400 border border-slate-100 uppercase tracking-widest">
              {totalItems} ARTICLES
            </div>
          </div>
        </div>

        {/* List View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/20">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Article Info</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Author & Date</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Publish Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {blogs.length > 0 ? blogs.map((blog: any) => (
                <tr key={blog._id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-12 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm overflow-hidden shrink-0">
                        {blog.coverImage ? (
                          <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        ) : (
                          <FileText className="text-slate-400" size={20} />
                        )}
                      </div>
                      <div className="min-w-0 max-w-[280px] sm:max-w-md">
                        <div className="font-black text-slate-900 text-sm leading-snug group-hover:text-blue-600 transition-colors truncate">{blog.title}</div>
                        <div className="text-[10px] text-indigo-500 font-extrabold uppercase tracking-tighter mt-1">
                          {blog.category} • <span className="text-slate-400 font-bold lowercase">/{blog.slug}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <User size={13} className="text-slate-400" />
                        {blog.author || "MountainMonkey"}
                      </div>
                      <div className="text-[10px] text-slate-400 font-black flex items-center gap-1.5 uppercase tracking-tight">
                        <Calendar size={12} />
                        {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest border shadow-sm ${blog.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      blog.status === 'Draft' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-slate-50 text-slate-500 border border-slate-200'
                      }`}>
                      {blog.status?.toUpperCase()}
                    </span>
                  </td>

                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/blogs/${blog._id}`}
                        className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100"
                        title="Manage Rich Layout Details"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/metadata?blog=${blog._id}`}
                        className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100"
                        title="Configure SEO Metadata"
                      >
                        <Edit3 size={18} />
                      </Link>
                      <button
                        onClick={() => {
                          setEditBlogId(blog._id)
                          setIsDrawerOpen(true)
                        }}
                        className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100 cursor-pointer"
                        title="Edit Article Info"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setIsDeleteDialogOpen(true)
                          setSelectedBlogId(blog._id)
                        }}
                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-100">
                        <FileText size={32} className="text-slate-200" />
                      </div>
                      <div>
                        <p className="text-slate-400 font-black text-sm uppercase tracking-widest">No Blogs Found</p>
                        <p className="text-slate-300 text-xs font-medium mt-1 italic">Write your first blog post to guide your explorers.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with Functional Pagination */}
        <div className="p-4 md:p-6 border-t border-slate-50 bg-slate-50/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] order-2 sm:order-1 italic">
            {blogs.length} of {totalItems} articles
          </p>
          <div className="flex items-center gap-3 order-1 sm:order-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all disabled:opacity-20 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-1 overflow-x-auto max-w-[150px] sm:max-w-none no-scrollbar">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-xl text-[10px] font-black transition-all cursor-pointer ${page === i + 1
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                    : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-200'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all disabled:opacity-20 cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <AddBlogDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false)
          blogHook.resetForm()
        }}
        blogHook={blogHook}
      />
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          if (selectedBlogId) {
            deleteBlog(selectedBlogId);
          }
        }}
        isLoading={isDeleteBlogLoading}
      />
    </div>
  );
}

function StatCard({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm transition-all hover:shadow-xl group">
      <div className="flex justify-between items-start mb-5">
        <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{title}</span>
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shadow-sm">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-3">
        <h3 className="text-4xl font-black text-slate-800 tracking-tighter">{value}</h3>
        <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-100 uppercase tracking-widest group-hover:text-emerald-500 transition-colors">
          {trend}
        </span>
      </div>
    </div>
  );
}
