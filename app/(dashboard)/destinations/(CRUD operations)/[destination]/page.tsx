"use client";

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Star, 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Globe, 
  Compass, 
  Clock, 
  Info,
  Layers,
  Zap,
  Tag,
  Smile,
  ShieldCheck,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';
import useDestination from '@/hooks/useDestination';
import { motion } from 'framer-motion';

export default function DestinationPage() {
  const { destination: destinationId } = useParams();
  const router = useRouter();
  const { 
    setDestinationId, 
    destinationData, 
    deleteDestination, 
    isDeleteDestinationLoading 
  } = useDestination();

  useEffect(() => {
    if (destinationId && typeof destinationId === 'string') {
      setDestinationId(destinationId);
    }
  }, [destinationId, setDestinationId]);

  const destination = destinationData?.data;

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
          <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Destination...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">

        {destination.images?.[0] ? (
          <img 
            src={destination.images[0]} 
            alt={destination.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-900 flex items-center justify-center">
            <ImageIcon size={64} className="text-slate-700" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        
        {/* Navigation / Actions */}
        <div className="absolute top-4 md:top-8 left-4 md:left-8 right-4 md:right-8 flex justify-between items-center z-10">
          <button 
            onClick={() => router.back()}
            className="p-2.5 md:p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 transition-all border border-white/10"
          >
            <ArrowLeft className="w-4.5 h-4.5 md:w-5 md:h-5" />

          </button>

          <div className="flex gap-2 md:gap-3">
            <button 
              className="px-3 md:px-4 py-2 md:py-2.5 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition-all border border-white/10 flex items-center gap-2 font-bold text-[10px] md:text-xs whitespace-nowrap"
            >
              <Edit3 className="w-3.5 h-3.5 md:w-4 md:h-4" /> <span className="hidden xs:inline">EDIT</span>

            </button>
            <button 
              onClick={() => {
                if(confirm("Are you sure you want to delete this destination?")) {
                  deleteDestination(destination._id);
                  router.push("/destinations");
                }
              }}
              className="px-3 md:px-4 py-2 md:py-2.5 bg-rose-500/20 backdrop-blur-md rounded-xl text-rose-200 hover:bg-rose-500/40 transition-all border border-rose-500/20 flex items-center gap-2 font-bold text-[10px] md:text-xs"
            >
              <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" /> <span className="hidden xs:inline">DELETE</span>

            </button>
          </div>
        </div>


        {/* Hero Content */}
        <div className="absolute bottom-6 md:bottom-12 left-4 md:left-8 right-4 md:right-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 md:space-y-4"
          >
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 md:px-3 md:py-1 bg-blue-500 text-white text-[9px] md:text-[10px] font-black rounded-full uppercase tracking-widest">
                {destination.placeType || 'Global'}
              </span>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 md:w-4 md:h-4" fill="currentColor" />

                <span className="text-xs md:text-sm font-black">{destination.ratings?.average || '0.0'}</span>
                <span className="text-[10px] md:text-xs text-slate-400 font-medium">({destination.ratings?.count || 0})</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight">{destination.name}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4 text-slate-300">
              <div className="flex items-center gap-1.5 text-xs md:text-sm font-bold">
                <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400" /> {destination.location?.address}


              </div>
              <div className="flex items-center gap-1.5 text-xs md:text-sm font-bold">
                <Compass className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" /> {destination.location?.altitude}m Elevation


              </div>
            </div>
          </motion.div>
        </div>
      </div>


      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-6 md:-mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SummaryCard 
                label="Daily Budget" 
                value={`₹${destination.budgetEstimate?.dailyAvg || 0}`} 
                icon={<DollarSign size={20}/>}
                color="blue"
              />
              <SummaryCard 
                label="Status" 
                value={destination.status || 'Active'} 
                icon={<Zap size={20}/>}
                color="emerald"
              />
              <SummaryCard 
                label="Region" 
                value={destination.mainCity?.name || 'Local'} 
                icon={<Globe size={20}/>}
                color="indigo"
              />
            </div>


            {/* Overview */}
            <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Overview</h2>
                <p className="text-lg md:text-xl font-bold text-slate-800 leading-snug">{destination.shortDescription}</p>
              </div>
              <div className="h-px bg-slate-100" />
              <div className="prose prose-slate max-w-none">
                <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">{destination.description}</p>
              </div>
            </section>


            {/* Highlights */}
            {destination.aiMetadata?.highlights?.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-[10px] md:text-sm font-black uppercase tracking-widest text-slate-400 ml-2">Experience Highlights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {destination.aiMetadata.highlights.map((h: any, i: number) => (
                    <div key={i} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-all group">
                      <div className="w-9 h-9 md:w-10 md:h-10 bg-slate-100 rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                        <Star className="w-4 h-4 md:w-4.5 md:h-4.5" />

                      </div>
                      <h4 className="font-black text-slate-900 mb-1 text-sm md:text-base">{h.title}</h4>
                      <p className="text-[11px] md:text-xs text-slate-500 font-medium leading-relaxed">{h.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}


            {/* Images Gallery */}
            {destination.images?.length > 1 && (
                <section className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 ml-2">Visual Gallery</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {destination.images.slice(1).map((img: string, i: number) => (
                            <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-slate-200 group">
                                <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                        ))}
                    </div>
                </section>
            )}
          </div>

          {/* Right Column: Meta & AI */}
          <div className="space-y-8">
            
            {/* AI Insights Card */}
            <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 md:p-8 opacity-10">
                    <Zap className="w-24 h-24 md:w-32 md:h-32" />

                </div>

                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-500 rounded-lg">
                            <Zap size={16} className="text-white" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">AI Intelligence</span>
                    </div>
                    
                    <div className="space-y-4">
                        <TagGroup title="Mood Tags" tags={destination.aiMetadata?.mood} color="emerald" />
                        <TagGroup title="Suitable For" tags={destination.aiMetadata?.suitableFor} color="blue" />
                        <TagGroup title="Travel Style" tags={destination.aiMetadata?.travelStyle} color="amber" />
                    </div>

                    <div className="pt-6 border-t border-white/10 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Popularity Score</span>
                            <span className="text-xl font-black text-emerald-400">{(destination.ratings?.average * 20).toFixed(0)}%</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${destination.ratings?.average * 20}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Nearby Destinations */}
            {destination.nearbyDestinations?.length > 0 && (
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 space-y-6 shadow-sm">
                    <h3 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">Nearby Exploration</h3>

                    <div className="space-y-4">
                        {destination.nearbyDestinations.map((nearby: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                                        <MapPin size={18} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">{nearby.destinationId?.name || 'Unknown'}</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{nearby.routeType || 'Road'} Travel</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-black text-slate-900">{nearby.distance}km</div>
                                    <div className="text-[10px] text-slate-400 font-bold">{nearby.travelTime} min</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Analytics */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">Performance Analytics</h3>

                <div className="space-y-4">
                    <AnalyticItem label="Total Searches" value={destination.analytics?.searches || 0} icon={<TrendingUp size={14}/>} />
                    <AnalyticItem label="Total Clicks" value={destination.analytics?.clicks || 0} icon={<Smile size={14}/>} />
                    <AnalyticItem label="Bookings" value={destination.analytics?.bookings || 0} icon={<ShieldCheck size={14}/>} />
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

function SummaryCard({ label, value, icon, color }: { label: string, value: string, icon: React.ReactNode, color: string }) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
  };

  return (
    <div className={`p-6 rounded-3xl border ${colors[color]} shadow-sm flex flex-col gap-3 transition-transform hover:scale-[1.02]`}>
      <div className="p-2 w-fit bg-white rounded-xl shadow-sm border border-black/5">
        {icon}
      </div>
      <div>
        <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">{label}</div>
        <div className="text-lg font-black tracking-tight">{value}</div>
      </div>
    </div>
  );
}

function TagGroup({ title, tags, color }: { title: string, tags: string[], color: string }) {
  if (!tags?.length) return null;
  
  const colors: any = {
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  return (
    <div className="space-y-2">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</span>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag} className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${colors[color]}`}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function AnalyticItem({ label, value, icon }: { label: string, value: number, icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-[11px] font-bold uppercase tracking-tight">{label}</span>
      </div>
      <span className="text-sm font-black text-slate-800">{value.toLocaleString()}</span>
    </div>
  );
}