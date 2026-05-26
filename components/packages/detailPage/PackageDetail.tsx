"use client";

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import usePackage from '@/hooks/usePackage';
import { XCircle } from 'lucide-react';
import PackageHeader from './PackageHeader';
import PackageTabs from './PackageTabs';
import PackageSidebar from './PackageSidebar';

export default function PackageDetail() {
  const params = useParams();
  const router = useRouter();
  const packageId = params.package as string;

  const { setPackageId, packageData } = usePackage();

  useEffect(() => {
    if (packageId) {
      setPackageId(packageId);
    }
  }, [packageId, setPackageId]);

  const isLoading = !packageData;
  const pkg = packageData?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Unpacking Experience...</p>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4 p-4 text-center">
        <XCircle className="w-16 h-16 text-rose-500" />
        <h2 className="text-2xl font-black text-slate-800">Failed to load package</h2>
        <button
          onClick={() => router.push('/packages')}
          className="mt-4 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all"
        >
          Back to Packages
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <PackageHeader pkg={pkg} onBack={() => router.push('/packages')} />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
          {/* Main Column */}
          <div className="lg:col-span-2">
            <PackageTabs pkg={pkg} />
          </div>

          {/* Sidebar */}
          <div>
            <PackageSidebar pkg={pkg} />
          </div>
        </div>
      </div>
    </div>
  );
}
