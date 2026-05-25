"use client";

import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  TrendingUp, 
  Zap, 
  Users, 
  Sparkles,
  Globe,
  Hotel,
  Activity,
  PenTool,
  Plus,
  MapPin,
  Calendar,
  Layout
} from 'lucide-react';
import { KPIStore } from '@/components/dashboard/KPIStore';
import { ModuleCard } from '@/components/dashboard/ModuleCard';
import { StreamItem } from '@/components/dashboard/StreamItem';
import { DispatchAction } from '@/components/dashboard/DispatchAction';
import { TimelineItem } from '@/components/dashboard/TimelineItem';

const kpiIcons: any = {
    TrendingUp: <TrendingUp size={16} />,
    Zap: <Zap size={16} />,
    Users: <Users size={16} />,
    Sparkles: <Sparkles size={16} />
};

const moduleIcons: any = {
    Globe: <Globe size={20} />,
    Hotel: <Hotel size={20} />,
    Activity: <Activity size={20} />,
    PenTool: <PenTool size={20} />
};

const actionIcons: any = {
    Plus: <Plus size={16} />,
    MapPin: <MapPin size={16} />,
    Users: <Users size={16} />
};

const DashboardClient = () => {
    const [kpis] = useState([
        { label: "Aggregate Revenue", value: "$142.8k", trend: "+12.4%", positive: true, color: "indigo", iconName: "TrendingUp" },
        { label: "Active Inventory", value: "542", trend: "+8.1%", positive: true, color: "emerald", iconName: "Zap" },
        { label: "User Expansion", value: "12.4k", trend: "-2.4%", positive: false, color: "orange", iconName: "Users" },
        { label: "System Health", value: "99.9%", trend: "Stable", positive: true, color: "blue", iconName: "Sparkles" },
    ]);

    const [modules] = useState([
        { label: "Destinations", count: "84", color: "blue", iconName: "Globe" },
        { label: "Stays", count: "215", color: "indigo", iconName: "Hotel" },
        { label: "Activities", count: "124", color: "emerald", iconName: "Activity" },
        { label: "Blog Content", count: "42", color: "purple", iconName: "PenTool" },
    ]);

    const [streams] = useState([
        { user: "Alice M.", action: "acquired package", target: "Nordic Expedition", time: "2m ago", initials: "AM", accent: "rose" },
        { user: "System", action: "auto-optimized", target: "Kyoto Stays", time: "14m ago", initials: "AI", accent: "indigo" },
        { user: "Agent Bob", action: "drafted", target: "Bali Beach Guide", time: "1h ago", initials: "BS", accent: "emerald" },
        { user: "Mark R.", action: "joined as", target: "Elite Member", time: "3h ago", initials: "MR", accent: "orange" },
    ]);

    const [dispatchActions] = useState([
        { label: "New Travel Package", iconName: "Plus" },
        { label: "Register Destination", iconName: "MapPin" },
        { label: "Onboard Agent", iconName: "Users" },
    ]);

    const [timelineEvents] = useState([
        { title: "Santorini Flight Group", time: "Tomorrow, 08:00 AM", status: "Ready" },
        { title: "Alpine Trek Briefing", time: "Oct 24, 10:30 AM", status: "Pending" },
        { title: "Tokyo Hub Sync", time: "Oct 26, 06:00 PM", status: "Scheduled" },
    ]);

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900">
      
      {/* Premium Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
            <div className="flex items-center gap-2 mb-1">
                <Sparkles size={14} className="text-indigo-500" />
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Live Intelligence</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Ecosystem Overview</h1>
            <p className="text-sm font-medium text-slate-400 mt-1 italic">Welcome back, Admin. Here is what's happening today.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Query registry..." 
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/20 transition-all shadow-sm placeholder:text-slate-400"
            />
          </div>
          <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-500 hover:bg-slate-50 transition-all shadow-sm relative">
            <Bell size={20} />
            <div className="absolute top-3 right-3 w-2 h-2 bg-rose-500 border-2 border-white rounded-full" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        
        {/* Main Insights Area */}
        <div className="col-span-12 xl:col-span-8 space-y-10">
          
          {/* High-Level KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, idx) => (
                <KPIStore 
                    key={idx}
                    label={kpi.label}
                    value={kpi.value}
                    trend={kpi.trend}
                    positive={kpi.positive}
                    icon={kpiIcons[kpi.iconName]}
                    color={kpi.color}
                />
            ))}
          </div>

          {/* Core Modules Status */}
          <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Layout size={18} className="text-slate-400" /> Module Integrity
                </h2>
                <div className="h-[1px] flex-1 bg-slate-100 ml-6" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {modules.map((mod, idx) => (
                    <ModuleCard 
                        key={idx}
                        icon={moduleIcons[mod.iconName]}
                        label={mod.label}
                        count={mod.count}
                        color={mod.color}
                    />
                ))}
            </div>
          </section>

          {/* Interactive Intelligence Feed */}
          <section className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm shadow-slate-100/50">
            <div className="flex justify-between items-center p-8 border-b border-slate-50">
                <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Event Stream</h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time system telemetry</p>
                </div>
                <button className="px-5 py-2.5 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100">
                    Full Archive
                </button>
            </div>
            <div className="divide-y divide-slate-50">
              {streams.map((stream, idx) => (
                <StreamItem 
                    key={idx}
                    user={stream.user}
                    action={stream.action}
                    target={stream.target}
                    time={stream.time}
                    initials={stream.initials}
                    accent={stream.accent}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Tactical Sidebar Area */}
        <div className="col-span-12 xl:col-span-4 space-y-8">
          
          {/* Quick Registry Actions */}
          <aside className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-100">
            <Zap className="absolute -right-6 -bottom-6 opacity-10" size={160} />
            <div className="relative z-10">
                <h3 className="text-xl font-black tracking-tight mb-6">Dispatch Center</h3>
                <div className="space-y-3">
                    {dispatchActions.map((action, idx) => (
                        <DispatchAction 
                            key={idx}
                            icon={actionIcons[action.iconName]}
                            label={action.label}
                        />
                    ))}
                </div>
            </div>
          </aside>

          {/* Operational Timeline */}
          <aside className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Operations</h3>
                <Calendar size={18} className="text-slate-400" />
            </div>
            <div className="space-y-6">
                {timelineEvents.map((event, idx) => (
                    <TimelineItem 
                        key={idx}
                        title={event.title}
                        time={event.time}
                        status={event.status}
                    />
                ))}
            </div>
            <button className="w-full mt-8 py-4 bg-slate-50 text-slate-500 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100">
                View Logistic Calendar
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DashboardClient;
