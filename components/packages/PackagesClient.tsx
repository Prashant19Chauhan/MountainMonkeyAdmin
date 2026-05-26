"use client";

import React, { useState } from 'react';
import { Plus, Download, Package, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

import usePackage from '@/hooks/usePackage';
import { StatCard } from '@/components/packages/StatCard';
import { PackagesFilter } from '@/components/packages/PackagesFilter';
import { PackagesTable } from '@/components/packages/PackagesTable';
import { PackagesPagination } from '@/components/packages/PackagesPagination';
import DeleteDialog from '@/components/mainComponents/deleteDialog';

const PackagesClient = () => {
  const router = useRouter();
  
  const {
    packagesData,
    isPackagesLoading,
    deletePackage,
    page,
    setPage,
    status,
    setStatus,
    updatePackageCurrentPrice,
  } = usePackage();

  const packages = packagesData?.data || [];
  const totalPackages = packagesData?.total || 0;
  const totalPages = packagesData?.totalPages || 1;

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [packageId, setPackageId] = useState("");

  const handleDeleteClick = (id: string) => {
    setPackageId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    deletePackage(packageId);
    setDeleteModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Package Inventory</h1>
          <p className="text-slate-500 text-sm mt-1">Manage all multi-day travel bundles and seasonal inventory.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={() => router.push('/packages/create-package')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Package
          </button>
        </div>
      </div>

      {/* Metadata Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Packages"
          value={totalPackages.toString()}
          trend=""
          icon={<Package className="text-slate-400" size={18} />}
        />
        <StatCard
          title="Active Bundles"
          value="--"
          trend=""
          icon={<CheckCircle2 className="text-emerald-500" size={18} />}
        />
        <StatCard
          title="Total Revenue"
          value="--"
          trend=""
          icon={<DollarSign className="text-slate-400" size={18} />}
        />
        <StatCard
          title="Draft Items"
          value="--"
          trend=""
          icon={<AlertCircle className="text-amber-500" size={18} />}
        />
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        <PackagesFilter status={status} setStatus={setStatus} />
        
        <PackagesTable 
          packages={packages} 
          isPackagesLoading={isPackagesLoading} 
          onDeleteClick={handleDeleteClick}
          onUpdatePrice={(id: string, price: number) => updatePackageCurrentPrice({ id, price })}
        />
        
        <PackagesPagination 
          page={page} 
          setPage={setPage} 
          totalPages={totalPages} 
          totalPackages={totalPackages} 
          packagesLength={packages.length} 
        />

      </div>
      
      <DeleteDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={false}
      />
    </div>
  );
};

export default PackagesClient;
