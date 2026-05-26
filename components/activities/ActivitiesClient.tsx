"use client";

import React from 'react';
import { Plus, Download, TrendingUp, Calendar, Clock, Star } from 'lucide-react';
import Link from 'next/link';

import useActivity from '@/hooks/useActivity';
import { StatCard } from '@/components/activities/StatCard';
import { ActivitiesFilter } from '@/components/activities/ActivitiesFilter';
import { ActivitiesTable } from '@/components/activities/ActivitiesTable';
import { ActivitiesPagination } from '@/components/activities/ActivitiesPagination';
import DeleteDialog from '@/components/mainComponents/deleteDialog';

const ActivitiesClient = () => {
  const {
    activitiesData,
    isActivitiesLoading,
    setSearch,
    search,
    page,
    setPage,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    confirmDelete,
    isDeleteLoading,
    openDeleteDialog,
    updateActivityCurrentPrice,
  } = useActivity();

  const activities = activitiesData?.data?.activities || [];
  const totalPages = activitiesData?.data?.totalPages || 0;

  const stats = [
    { label: 'Total Activities', value: activitiesData?.data?.totalActivities?.toString() || '0', trend: '+12% this month', icon: <TrendingUp className="w-5 h-5 text-gray-500" /> },
    { label: 'Active Bookings', value: '856', trend: '+5% this month', icon: <Calendar className="w-5 h-5 text-gray-500" /> },
    { label: 'Pending Review', value: '34', trend: '-2% this month', icon: <Clock className="w-5 h-5 text-gray-500" />, negative: true },
    { label: 'Average Rating', value: '4.8', trend: '+0.1 since last week', icon: <Star className="w-5 h-5 text-gray-500" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Activities & Experiences</h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1 italic font-medium">Manage bookable activities, tours, and experiences across all destinations.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm uppercase tracking-wider">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </button>
          <Link
            href="/activities/create-activity"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-black transition-all shadow-lg shadow-slate-900/10 uppercase tracking-widest"
          >
            <Plus className="w-4 h-4" /> Add <span className="hidden sm:inline">Activity</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <StatCard
            key={i}
            label={stat.label}
            value={stat.value}
            trend={stat.trend}
            icon={stat.icon}
            negative={stat.negative}
          />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <ActivitiesFilter search={search} setSearch={setSearch} />
        
        <ActivitiesTable 
          activities={activities} 
          isActivitiesLoading={isActivitiesLoading} 
          onDeleteClick={openDeleteDialog} 
          onUpdatePrice={(id: string, price: number) => updateActivityCurrentPrice({ id, price })}
        />
        
        <ActivitiesPagination 
          page={page} 
          setPage={setPage} 
          totalPages={totalPages} 
        />
      </div>

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        isLoading={isDeleteLoading}
      />
    </div>
  );
};

export default ActivitiesClient;
