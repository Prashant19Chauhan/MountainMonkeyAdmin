"use client";

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useCity from '@/hooks/useCity';
import { Loader2, XCircle } from 'lucide-react';
import CityHeader from './CityHeader';
import CitySidebar from './CitySidebar';
import CityCoords from './CityCoords';

export default function CityDetail() {
  const params = useParams();
  const router = useRouter();
  const cityId = params.city as string;

  const { setEditCityId, cityData, loading: isLoading } = useCity();

  useEffect(() => {
    if (cityId) {
      setEditCityId(cityId);
    }
  }, [cityId, setEditCityId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-slate-900" />
        <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Mapping Anchor Location...</p>
      </div>
    );
  }

  if (!cityData?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4 p-4 text-center">
        <XCircle className="w-16 h-16 text-rose-500" />
        <h2 className="text-2xl font-black text-slate-800">Failed to load location</h2>
        <p className="text-slate-500 italic text-sm max-w-md">
          The requested geographical anchor could not be retrieved.
        </p>
        <button
          onClick={() => router.push('/cities')}
          className="mt-4 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all"
        >
          Back to Cities
        </button>
      </div>
    );
  }

  const city = cityData.data;
  const hasCoordinates = city.locationCoordinates?.coordinates?.length === 2;
  const longitude = hasCoordinates ? city.locationCoordinates.coordinates[0] : 0;
  const latitude = hasCoordinates ? city.locationCoordinates.coordinates[1] : 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto">
        <CityHeader city={city} onBack={() => router.push('/cities')} />

        {/* Coords and Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2">
            <CityCoords latitude={latitude} longitude={longitude} />
          </div>
          <div>
            <CitySidebar city={city} />
          </div>
        </div>
      </div>
    </div>
  );
}
