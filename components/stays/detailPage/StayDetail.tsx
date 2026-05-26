"use client";

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useStay from '@/hooks/useStay';
import { XCircle, Loader2 } from 'lucide-react';
import StayHeader from './StayHeader';
import StayTabs from './StayTabs';
import StaySidebar from './StaySidebar';

export default function StayDetail() {
  const params = useParams();
  const router = useRouter();
  const stayId = params.stay as string;

  const { setEditId, formData: stay, isSingleLoading: isLoading, citiesData, destinationsData } = useStay();

  useEffect(() => {
    if (stayId) {
      setEditId(stayId);
    }
  }, [stayId, setEditId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-slate-900" />
        <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Checking In...</p>
      </div>
    );
  }

  if (!stay || !stay.name) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4 p-4 text-center">
        <XCircle className="w-16 h-16 text-rose-500" />
        <h2 className="text-2xl font-black text-slate-800">Failed to load property</h2>
        <p className="text-slate-500 italic text-sm max-w-md">
          The requested accommodation could not be retrieved from the database.
        </p>
        <button
          onClick={() => router.push('/stays')}
          className="mt-4 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all"
        >
          Back to Stays
        </button>
      </div>
    );
  }

  const mainCityAny = stay.mainCity as any;
  const mainCityName = typeof mainCityAny === 'object' ? mainCityAny?.name : (citiesData?.data?.find((c: any) => c._id === stay.mainCity)?.name || 'Global Partner');
  
  const destinationIdAny = stay.destinationId as any;
  const destinationName = typeof destinationIdAny === 'object' ? destinationIdAny?.name : (destinationsData?.data?.find((d: any) => d._id === stay.destinationId)?.name || 'Global Scope');

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Summary Profile */}
        <StayHeader stay={stay} onBack={() => router.push('/stays')} />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
          {/* Main Column */}
          <div className="lg:col-span-2">
            <StayTabs stay={stay} />
          </div>

          {/* Sidebar */}
          <div>
            <StaySidebar stay={stay} mainCityName={mainCityName} destinationName={destinationName} />
          </div>
        </div>
      </div>
    </div>
  );
}
