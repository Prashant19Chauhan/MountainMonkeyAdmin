"use client";

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useLocalInfo from '@/hooks/useLocalInfo';
import { Loader2, XCircle } from 'lucide-react';
import LocalInfoHeader from './LocalInfoHeader';
import LocalInfoSidebar from './LocalInfoSidebar';
import LocalInfoTabs from './LocalInfoTabs';

export default function LocalInfoDetail() {
  const params = useParams();
  const router = useRouter();
  const localInfoId = params.localInfo as string;

  const { setEditId, formData: info, isSingleLoading: isLoading, destinationsData } = useLocalInfo();

  useEffect(() => {
    if (localInfoId) {
      setEditId(localInfoId);
    }
  }, [localInfoId, setEditId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-slate-900" />
        <p className="text-slate-400 font-black text-xs uppercase tracking-widest font-sans">Consulting Local Guide...</p>
      </div>
    );
  }

  if (!info || !info.currency) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4 p-4 text-center">
        <XCircle className="w-16 h-16 text-rose-500" />
        <h2 className="text-2xl font-black text-slate-800 font-sans">Failed to load local guide</h2>
        <p className="text-slate-500 italic text-sm max-w-md font-sans">
          The requested local information guide details could not be retrieved.
        </p>
        <button
          onClick={() => router.push('/local-informations')}
          className="mt-4 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all font-sans"
        >
          Back to Guides
        </button>
      </div>
    );
  }

  const destinationIdAny = info.destinationId as any;
  const destinationName = typeof destinationIdAny === 'object' 
    ? destinationIdAny?.name 
    : (destinationsData?.data?.find((d: any) => d._id === info.destinationId)?.name || 'Global Travel Guide');

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        <LocalInfoHeader 
          info={info} 
          destinationName={destinationName} 
          onBack={() => router.push('/local-informations')} 
        />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Left Column: Core Tabs & Dynamic Information */}
          <div className="lg:col-span-2 space-y-6">
            <LocalInfoTabs info={info} />
          </div>

          {/* Right Column: AI summary and metadata indices */}
          <div>
            <LocalInfoSidebar info={info} />
          </div>
        </div>
      </div>
    </div>
  );
}
