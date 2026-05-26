"use client";

import React from 'react';
import { Plus, Download, Building2, Percent, Clock, DollarSign } from 'lucide-react';
import Link from 'next/link';

import useStay from '@/hooks/useStay';
import { StatCard } from '@/components/stays/StatCard';
import { StaysFilter } from '@/components/stays/StaysFilter';
import { StaysTable } from '@/components/stays/StaysTable';
import { StaysPagination } from '@/components/stays/StaysPagination';
import DeleteDialog from '@/components/mainComponents/deleteDialog';

const StaysClient = () => {
  const stayHook = useStay();
  
  const {
    staysData,
    isStaysLoading,
    page,
    setPage,
    search,
    setSearch,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    setDeleteId,
    confirmDelete,
    updateStayCurrentPrice,
  } = stayHook;

  const stays = staysData?.data || [];
  const totalPages = staysData?.totalPages || 0;

  const stats = [
    { label: 'Total Properties', value: staysData?.total?.toString() || '0', trend: '+8% this month', icon: <Building2 className="w-4 h-4 text-slate-500" /> },
    { label: 'Avg. Occupancy', value: '78%', trend: '+12% vs last year', icon: <Percent className="w-4 h-4 text-slate-500" /> },
    { label: 'Pending Approvals', value: '18', trend: '-3% this week', icon: <Clock className="w-4 h-4 text-slate-500" />, negative: true },
    { label: 'Avg. Nightly Rate', value: '$245', trend: '+4% this quarter', icon: <DollarSign className="w-4 h-4 text-slate-500" /> },
  ];

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Stays & Accommodations</h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1 font-medium italic">Manage partner hotels, resorts, and unique stays worldwide.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm uppercase tracking-wider">
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export Data</span><span className="sm:hidden">Export</span>
          </button>
          <Link
            href="/stays/create-stay"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-black transition-all shadow-lg shadow-slate-900/10 uppercase tracking-widest"
          >
            <Plus className="w-4 h-4" /> <span className="hidden xs:inline">Add Property</span><span className="xs:hidden">Add Stay</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
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

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        
        <StaysFilter search={search} setSearch={setSearch} />
        
        <StaysTable 
          stays={stays} 
          isStaysLoading={isStaysLoading} 
          onDeleteClick={handleDeleteClick} 
          onUpdatePrice={(id: string, price: number) => updateStayCurrentPrice({ id, price })}
        />
        
        <StaysPagination 
          page={page} 
          setPage={setPage} 
          totalPages={totalPages} 
        />

      </div>

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        isLoading={false}
      />
    </div>
  );
};

export default StaysClient;
