"use client";

import React, { useState } from 'react';
import { Plus, Download, Map, Send, Clock, Star } from 'lucide-react';
import Link from 'next/link';

import useTravelRoute from '@/hooks/useTravelRoute';
import { StatCard } from '@/components/travel-routes/StatCard';
import { TravelRoutesFilter } from '@/components/travel-routes/TravelRoutesFilter';
import { TravelRoutesTable } from '@/components/travel-routes/TravelRoutesTable';
import { TravelRoutesPagination } from '@/components/travel-routes/TravelRoutesPagination';
import DeleteDialog from '@/components/mainComponents/deleteDialog';

const TravelRoutesClient = () => {
  const {
    travelRoutesData,
    isTravelRoutesLoading,
    deleteRoute,
    setEditRouteId,
    setIsDeleteDialogOpen,
    isDeleteDialogOpen,
    editRouteId
  } = useTravelRoute();

  const [search, setSearch] = useState("");
  const routes = travelRoutesData?.data || [];

  // Filter routes based on search
  const filteredRoutes = routes.filter((r: any) =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.from?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.to?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteClick = (id: string) => {
    setEditRouteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteRoute(editRouteId as string);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-900">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-800 uppercase">Route Management</h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1 font-medium italic">Overview of all travel itineraries, transit pathways, and guided routes.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Download size={16} /> <span className="hidden xs:inline">Export</span>
          </button>
          <Link href="/travel-routes/create-travel-route" className="flex-1 sm:flex-none">
            <button
              className="w-full flex items-center justify-center gap-2 bg-[#0F172A] text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-900/10"
            >
              <Plus size={16} /> <span className="hidden xs:inline">New Route</span><span className="xs:hidden">Add Route</span>
            </button>
          </Link>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatCard title="Total Routes" value={routes.length.toString()} trend="+12 this month" icon={<Map className="text-slate-400" size={20} />} />
        <StatCard title="Active Itineraries" value={routes.length.toString()} trend="+5% vs last month" icon={<Send className="text-slate-400" size={20} />} />
        <StatCard title="Needs Review" value="0" trend="-2 since yesterday" icon={<Clock className="text-slate-400" size={20} />} />
        <StatCard title="Avg. Route Rating" value="4.8" trend="+0.1 overall" icon={<Star className="text-slate-400" size={20} />} />
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        <TravelRoutesFilter search={search} setSearch={setSearch} />
        
        <TravelRoutesTable 
          filteredRoutes={filteredRoutes} 
          isTravelRoutesLoading={isTravelRoutesLoading} 
          onDeleteClick={handleDeleteClick} 
        />
        
        <TravelRoutesPagination 
          filteredRoutesLength={filteredRoutes.length} 
        />

      </div>

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={false}
      />
    </div>
  );
};

export default TravelRoutesClient;
