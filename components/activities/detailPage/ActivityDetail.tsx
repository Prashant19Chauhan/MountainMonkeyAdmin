"use client";

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useActivity from '@/hooks/useActivity';
import { Loader2, XCircle } from 'lucide-react';
import ActivityHeader from './ActivityHeader';
import ActivitySidebar from './ActivitySidebar';
import ActivityTabs from './ActivityTabs';

export default function ActivityDetail() {
  const params = useParams();
  const router = useRouter();
  const activityId = params.activity as string;

  const { setEditActivityId, formData: activity, isSingleActivityLoading: isLoading, citiesData, destinationsData } = useActivity();

  useEffect(() => {
    if (activityId) {
      setEditActivityId(activityId);
    }
  }, [activityId, setEditActivityId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-slate-900" />
        <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Loading Adventure...</p>
      </div>
    );
  }

  if (!activity || !activity.name) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4 p-4 text-center">
        <XCircle className="w-16 h-16 text-rose-500" />
        <h2 className="text-2xl font-black text-slate-800">Failed to load activity</h2>
        <p className="text-slate-500 italic text-sm max-w-md">
          The requested tour activity details could not be loaded.
        </p>
        <button
          onClick={() => router.push('/activities')}
          className="mt-4 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all"
        >
          Back to Activities
        </button>
      </div>
    );
  }

  const destinationIdAny = activity.destinationId as any;
  const destinationName = typeof destinationIdAny === 'object' 
    ? destinationIdAny?.name 
    : (destinationsData?.data?.find((d: any) => d._id === activity.destinationId)?.name || 'Global Scope');
    
  const mainCityAny = activity.location?.mainCity as any;
  const mainCityName = typeof mainCityAny === 'object' 
    ? mainCityAny?.name 
    : (citiesData?.data?.find((c: any) => c._id === activity.location?.mainCity)?.name || 'Not Specified');

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-800">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        <ActivityHeader activity={activity} onBack={() => router.push('/activities')} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Left Column: Visuals & Mapped Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard 
                title="Duration" 
                value={activity.timing?.duration ? `${activity.timing.duration} Mins` : 'Flexible'} 
              />
              <MetricCard 
                title="Age Limit" 
                value={activity.ageLimit ? `${activity.ageLimit.min} - ${activity.ageLimit.max} Yrs` : 'All Ages'} 
              />
              <MetricCard 
                title="Stamina Level" 
                value={activity.difficultyLevel || 'Moderate'} 
                highlight={true} 
              />
              <MetricCard 
                title="Risk Profile" 
                value={activity.safetyInfo?.riskLevel || 'Low'} 
                alert={activity.safetyInfo?.riskLevel === 'high'} 
              />
            </div>

            <ActivityTabs activity={activity} />
          </div>

          {/* Right Column: Pricing, AI Scores, and Location info */}
          <div className="space-y-6">
            <ActivitySidebar 
              activity={activity} 
              destinationName={destinationName} 
              mainCityName={mainCityName} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Component for Metrics
function MetricCard({ title, value, highlight, alert }: { title: string; value: string; highlight?: boolean; alert?: boolean }) {
  return (
    <div className={`p-4 rounded-2xl border text-center shadow-sm hover:shadow-md transition-all ${
      alert 
        ? 'bg-rose-50 border-rose-100 text-rose-700' 
        : highlight 
        ? 'bg-indigo-50 border-indigo-100 text-indigo-700' 
        : 'bg-white border-slate-200 text-slate-800'
    }`}>
      <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">{title}</div>
      <div className="text-xs font-black uppercase mt-1 truncate">{value}</div>
    </div>
  );
}
