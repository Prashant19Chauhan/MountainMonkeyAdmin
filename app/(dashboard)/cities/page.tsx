"use client";

import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Clock,
  Globe,
  MapPin,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Edit3
} from 'lucide-react';
import AddCityDrawer from '../../../components/city/AddCityDrawer';
import useCity from '@/hooks/useCity';
import { City } from '@/types/type';
import DeleteDialog from '../../../components/mainComponents/deleteDialog';
import Link from 'next/link';

export default function CitiesPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<string | null | undefined>(null);

  const cityHook = useCity();
  const {
    citiesData, isCitiesLoading,
    deleteCity, isDeleteCityLoading, isDeleteDialogOpen, setIsDeleteDialogOpen,
    setEditCityId,
    page, setPage,
    search, setSearch
  } = cityHook;

  const [localSearch, setLocalSearch] = useState(search);

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(localSearch);
      setPage(1); // Reset to first page on search
    }, 500);
    return () => clearTimeout(handler);
  }, [localSearch, setSearch, setPage]);

  if (isCitiesLoading) {
    return (
      <div className='flex flex-col items-center justify-center h-screen gap-4 bg-slate-50'>
        <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Mapping Cities...</p>
      </div>
    );
  }

  const cities = citiesData?.data || [];
  const totalItems = citiesData?.meta?.total || 0;
  const totalPages = citiesData?.meta?.totalPages || 1;

  const uniqueCountries = new Set(cities.map((c: City) => c.country)).size;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 md:mb-10 gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-[#0f172a] tracking-tighter">Cities & Regions</h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1 font-medium italic">Define the geographical anchors for your global travel network.</p>
        </div>
        <button
          onClick={() => {
            setEditCityId(null);
            setIsDrawerOpen(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 md:py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/10 active:scale-95">
          <Plus size={18} />
          <span className="hidden xs:inline">Add New City</span>
          <span className="xs:hidden">New City</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Cities"
          value={totalItems.toString()}
          trend="Registered"
          icon={<Globe className="text-blue-500" size={20} />}
        />
        <StatCard
          title="Current Scope"
          value={cities.length.toString()}
          trend="On This Page"
          icon={<CheckCircle className="text-emerald-500" size={20} />}
        />
        <StatCard
          title="Countries"
          value={uniqueCountries.toString()}
          trend="Territories"
          icon={<MapPin className="text-indigo-500" size={20} />}
        />
        <StatCard
          title="Avg. Altitude"
          value="1,240m"
          trend="Mountain Peaks"
          icon={<Clock className="text-amber-500" size={20} />}
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
              placeholder="Search locations..."
              className="w-full pl-11 pr-4 py-2.5 md:py-3 bg-slate-50/50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Filter size={16} />
              <span className="hidden xs:inline">Filters</span>
            </button>
            <div className="hidden sm:flex items-center px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-400 border border-slate-100 uppercase tracking-widest">
              {totalItems} ENTRIES
            </div>
          </div>
        </div>

        {/* List View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/20">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Geographic Anchor</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Timeline & Altitude</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Lifecycle Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {cities.length > 0 ? cities.map((city: City) => (
                <tr key={city._id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center border border-slate-200 shadow-sm overflow-hidden shrink-0">
                        <MapPin className="text-slate-400 group-hover:scale-110 transition-transform" size={24} />
                      </div>
                      <div>
                        <div className="font-black text-slate-900 text-base leading-tight group-hover:text-blue-600 transition-colors">{city.name}</div>
                        <div className="text-[11px] text-slate-400 font-black uppercase tracking-tighter mt-1 flex items-center gap-2">
                          <span className="text-slate-500">{city.country}</span> • <span>{city.state}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <Clock size={14} className="text-slate-400" />
                        {city.timezone || "GMT+5:30"}
                      </div>
                      <div className="text-[10px] text-slate-400 font-black flex items-center gap-2 uppercase tracking-tight">
                        <div className="w-1 h-1 bg-slate-300 rounded-full" />
                        {city.altitude || 0} meters elevation
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest border shadow-sm ${city.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      city.status === 'Draft' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-slate-50 text-slate-500 border border-slate-200'
                      }`}>
                      {city.status?.toUpperCase()}
                    </span>
                  </td>

                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/cities/${city._id}`}
                        className="p-2.5 text-slate-300 hover:text-slate-900 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/metadata?city=${city._id}`}
                        className="p-2.5 text-slate-300 hover:text-slate-900 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100">
                        <Edit3 size={18} />
                      </Link>
                      <button
                        onClick={() => {
                          setEditCityId(city._id!)
                          setIsDrawerOpen(true)
                        }}
                        className="p-2.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setIsDeleteDialogOpen(true)
                          setSelectedCityId(city._id)
                        }}
                        className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
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
                        <Search size={32} className="text-slate-200" />
                      </div>
                      <div>
                        <p className="text-slate-400 font-black text-sm uppercase tracking-widest">No Cities Found</p>
                        <p className="text-slate-300 text-xs font-medium mt-1 italic">Try adjusting your search terms or filters.</p>
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
            {cities.length} of {totalItems} locations
          </p>
          <div className="flex items-center gap-3 order-1 sm:order-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all disabled:opacity-20"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-1 overflow-x-auto max-w-[150px] sm:max-w-none no-scrollbar">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-xl text-[10px] font-black transition-all ${page === i + 1
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
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all disabled:opacity-20"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <AddCityDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false)
          setEditCityId(null)
        }}
        cityHook={cityHook}
      />
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => deleteCity(selectedCityId!)}
        isLoading={isDeleteCityLoading}
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