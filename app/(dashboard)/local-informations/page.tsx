"use client";

import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  RefreshCw,
  BookOpen,
  MessageSquare,
  Clock,
  CheckCircle,
  Filter,
  Globe,
  DollarSign,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
  Eye,
  Edit2
} from 'lucide-react';
import useLocalInfo from '@/hooks/useLocalInfo';
import DeleteDialog from '../../../components/mainComponents/deleteDialog';
import Link from 'next/link';
import { LocalInfo } from '@/types/type';

export default function LocalGuidesPage() {
  const localInfoHook = useLocalInfo();

  const {
    localInfosData,
    isLocalInfosLoading,
    page,
    setPage,
    search,
    setSearch,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    setDeleteId,
    confirmDelete,
    resetForm
  } = localInfoHook;


  const localInfos = localInfosData?.data || [];
  const totalPages = localInfosData?.totalPages || 0;
  const totalEntries = localInfosData?.total || 0;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">Local Information Guides</h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1 font-medium italic">Manage essential destination details: languages, currency, and local norms.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors shadow-sm">
            <RefreshCw size={16} /> <span className="hidden sm:inline">Sync Data</span><span className="sm:hidden">Sync</span>
          </button>
          <Link
            href="/local-informations/create-local-information"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-900/10"
          >
            <Plus size={18} /> <span className="hidden xs:inline">Add New Guide</span><span className="xs:hidden">Add Guide</span>
          </Link>
        </div>
      </header>


      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Guides" value={totalEntries.toString()} trend="+4 this week" trendUp={true} icon={<BookOpen className="text-slate-400" size={20} />} />
        <StatCard title="Active Regions" value={localInfos.length.toString()} trend="Live data" trendUp={true} icon={<Globe className="text-slate-400" size={20} />} />
        <StatCard title="Safety Average" value="8.4/10" trend="Stable" trendUp={true} icon={<CheckCircle className="text-slate-400" size={20} />} />
        <StatCard title="Recent Updates" value="Today" trend="Real-time" trendUp={true} icon={<Clock className="text-slate-400" size={20} />} />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filters bar */}
        <div className="p-4 md:p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-white">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guides by destination..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <FilterButton icon={<Filter size={16} />} label="Filters" />
          </div>
        </div>


        {/* Table */}
        <div className="overflow-x-auto min-h-[400px] relative">
          {isLocalInfosLoading && (
            <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          )}

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest font-black text-slate-400 border-b border-slate-50 bg-slate-50/30">
                <th className="px-6 py-4">Destination Profile</th>
                <th className="px-6 py-4">Language & Currency</th>
                <th className="px-6 py-4">Catalog Overview</th>
                <th className="px-6 py-4">Safety Index</th>
                <th className="px-6 py-4 text-right pr-10">Actions</th>
              </tr>

            </thead>
            <tbody className="divide-y divide-slate-50">
              {localInfos.length > 0 ? localInfos.map((info: LocalInfo) => (
                <tr key={info._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 text-slate-400 shrink-0">
                        <Globe size={20} />
                      </div>
                      <div>
                        <div className="font-black text-sm text-slate-900 group-hover:text-blue-600 transition-colors">{info.destinationId?.name || "Global Entry"}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5 font-bold uppercase tracking-widest italic">
                          Updated {info.updatedAt ? new Date(info.updatedAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {info.language?.map((lang: string) => (
                        <span key={lang} className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-md font-bold">
                          {lang}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs font-black text-slate-700 flex items-center gap-1">
                      <DollarSign size={12} className="text-slate-400" /> {info.currency || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                        <span className="font-bold">{info.famousFood?.length || 0}</span> Food Items
                      </div>
                      <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                        <span className="font-bold">{info.famousPlaces?.length || 0}</span> Famous Places
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`h-1.5 w-16 rounded-full bg-slate-100 overflow-hidden`}>
                        <div className="h-full bg-emerald-500" style={{ width: `${(info.safety?.overallSafety || 5) * 10}%` }}></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-600">{info.safety?.overallSafety || 0}/10</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-amber-600 font-bold">
                      <AlertTriangle size={10} /> {info.precautions?.length || 0} Precautions
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      <Link
                        href={`/local-informations/${info.slug || info._id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        href={`/metadata?local-info=${info._id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit3 size={16} />
                      </Link>
                      <Link
                        href={`/local-informations/update-local-information?id=${info.slug || info._id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => {
                          setDeleteId(info.slug || info._id || null);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center text-slate-400 text-sm italic bg-white">
                    {isLocalInfosLoading ? "Loading guides..." : "No local info guides found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 md:p-5 border-t border-slate-50 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic order-2 sm:order-1 text-center sm:text-left">
            Showing Page {page} of {totalPages || 1} Guides
          </p>
          <div className="flex items-center gap-2 sm:gap-3 order-1 sm:order-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all disabled:opacity-20"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-1 overflow-x-auto max-w-[150px] sm:max-w-none no-scrollbar">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-xl text-xs font-black transition-all ${page === p
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                    : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-200'
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(page + 1)}
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all disabled:opacity-20"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

      </div>

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        isLoading={false}
      />
    </div>
  );
}

// --- Helper Components ---

function StatCard({ title, value, trend, trendUp, icon }: { title: string, value: string, trend: string, trendUp: boolean, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">{title}</span>
        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-3">
        <h3 className="text-2xl font-black text-slate-800">{value}</h3>
        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {trend}
        </span>
      </div>
    </div>
  );
}

function FilterButton({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
      {icon} {label} <ChevronDown size={14} className="text-slate-300" />
    </button>
  );
}

function ChevronDown({ size, className }: { size: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6" /></svg>
  )
}