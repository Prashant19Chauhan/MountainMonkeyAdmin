"use client";

import { useState, useEffect } from 'react';
import { Download, Plus, Globe, CheckCircle, Star, Map as MapIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';

import useDestination from '@/hooks/useDestination';
import { StatCard } from '@/components/destinations/StatCard';
import { DestinationsFilter } from '@/components/destinations/DestinationsFilter';
import { DestinationsTable } from '@/components/destinations/DestinationsTable';
import { DestinationsPagination } from '@/components/destinations/DestinationsPagination';
import DeleteDialog from '@/components/mainComponents/deleteDialog';

const DestinationsClient = () => {
  const {
    destinationsData,
    isDestinationsLoading,
    destinationsError,
    deleteDestination,
    page, setPage,
    search, setSearch,
  } = useDestination();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [localSearch, setLocalSearch] = useState(search);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(localSearch);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [localSearch, setSearch, setPage]);

  const destinations = destinationsData?.data || [];
  const totalItems = destinationsData?.total || 0;
  const totalPages = destinationsData?.totalPages || 1;

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteDestination(deleteId);
    setDeleteModalOpen(false);
  };

  if (isDestinationsLoading) {
    return (
      <div className='flex flex-col items-center justify-center h-screen gap-4 bg-slate-50'>
        <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Synchronizing Destinations...</p>
      </div>
    );
  }

  if (destinationsError) {
    return <div className='flex items-center justify-center h-screen text-red-500 font-bold'>Error: {destinationsError.message}</div>
  }

  return (
    <div className="space-y-6 md:space-y-8 p-4 md:p-8 bg-slate-50/50 min-h-screen">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Destinations</h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1 font-medium italic">Curate and manage the world's most breathtaking locations.</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm uppercase tracking-wider">
            <Download size={16} />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </button>
          <Link href="/destinations/create-destination" className="flex-1 sm:flex-none">
            <button className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-black transition-all shadow-lg shadow-slate-900/10 uppercase tracking-widest">
              <Plus size={18} />
              Add <span className="hidden sm:inline">Destination</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Catalog"
          value={totalItems.toString()}
          trend="Registered"
          icon={<Globe className="text-blue-500" size={20} />}
        />
        <StatCard
          title="Active Places"
          value={destinations.filter((d: any) => d.status === 'Active').length.toString()}
          trend="Live Now"
          icon={<CheckCircle className="text-emerald-500" size={20} />}
        />
        <StatCard
          title="Average Rating"
          value="4.9"
          trend="Top Notch"
          icon={<Star className="text-amber-500" size={20} />}
        />
        <StatCard
          title="Search Results"
          value={destinations.length.toString()}
          trend="This Page"
          icon={<MapIcon className="text-indigo-500" size={20} />}
        />
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <DestinationsFilter 
          localSearch={localSearch} 
          setLocalSearch={setLocalSearch} 
          totalItems={totalItems} 
        />
        
        <DestinationsTable 
          destinations={destinations} 
          onDeleteClick={handleDeleteClick} 
        />
        
        <DestinationsPagination 
          page={page} 
          setPage={setPage} 
          totalPages={totalPages} 
          totalItems={totalItems} 
          itemsLength={destinations.length} 
        />
      </div>

      <DeleteDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default DestinationsClient;
