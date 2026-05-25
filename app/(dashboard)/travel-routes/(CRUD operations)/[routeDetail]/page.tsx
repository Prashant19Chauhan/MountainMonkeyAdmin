"use client";

import React, { useState } from 'react';
import { 
  Search, 
  Map as MapIcon, 
  Plus, 
  Train, 
  Footprints, 
  Bus, 
  MapPin, 
  ChevronDown, 
  Activity,
  Maximize2,
  Minus,
  Navigation,
  Edit2,
  Trash2,
  RefreshCw,
  Clock,
  DollarSign,
  Users,
  AlertCircle,
  TrendingUp,
  Car,
  X,
  Check,
  Info
} from 'lucide-react';

// --- Types ---
interface RouteStep {
  mode: 'train' | 'walk' | 'bus' | 'car';
  label: string;
  detail: string;
  duration?: string;
  distance?: string;
  cost?: string;
}

interface TransitRoute {
  id: string;
  origin: string;
  destination: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  optionsCount: number;
  featuredRouteName: string;
  totalDuration: string;
  totalDistance: string;
  estimatedCost: string;
  frequency: string;
  capacity: string;
  reliability: number;
  steps: RouteStep[];
  supportedModes: ('train' | 'walk' | 'bus' | 'car')[];
  coordinates: {
    origin: { lat: number; lng: number };
    destination: { lat: number; lng: number };
    waypoints?: { lat: number; lng: number; label: string }[];
  };
}

// --- Mock Data ---
const INITIAL_ROUTES: TransitRoute[] = [
  {
    id: '1',
    origin: 'Kansai Int. Airport (KIX)',
    destination: 'Kyoto City Center',
    status: 'ACTIVE',
    optionsCount: 3,
    featuredRouteName: 'Haruka Express Route',
    totalDuration: '1h 15m',
    totalDistance: '78 km',
    estimatedCost: '¥3,570',
    frequency: 'Every 30 min',
    capacity: '320 passengers',
    reliability: 98,
    steps: [
      { mode: 'train', label: 'JR Haruka Express', detail: 'KIX to Kyoto Station', duration: '1h 15m', distance: '75 km', cost: '¥3,570' },
      { mode: 'walk', label: 'Walk', detail: 'Station to City Center', duration: '10m', distance: '800 m', cost: '¥0' }
    ],
    supportedModes: ['train', 'bus', 'car'],
    coordinates: {
      origin: { lat: 34.4273, lng: 135.2441 },
      destination: { lat: 35.0116, lng: 135.7681 },
      waypoints: [
        { lat: 34.7, lng: 135.5, label: 'Osaka Hub' }
      ]
    }
  },
  {
    id: '2',
    origin: 'Zurich Airport (ZRH)',
    destination: 'Zermatt Village',
    status: 'ACTIVE',
    optionsCount: 2,
    featuredRouteName: 'SBB Scenic Rail',
    totalDuration: '3h 32m',
    totalDistance: '245 km',
    estimatedCost: 'CHF 156',
    frequency: 'Every hour',
    capacity: '240 passengers',
    reliability: 95,
    steps: [
      { mode: 'train', label: 'InterCity Train', detail: 'ZRH to Visp', duration: '2h 15m', distance: '185 km', cost: 'CHF 98' },
      { mode: 'train', label: 'Matterhorn Railway', detail: 'Visp to Zermatt', duration: '1h 05m', distance: '60 km', cost: 'CHF 58' },
      { mode: 'walk', label: 'Walk', detail: 'Station to Village Center', duration: '12m', distance: '950 m', cost: 'CHF 0' }
    ],
    supportedModes: ['train', 'car'],
    coordinates: {
      origin: { lat: 47.4502, lng: 8.5617 },
      destination: { lat: 46.0207, lng: 7.7491 },
      waypoints: [
        { lat: 46.2944, lng: 7.8803, label: 'Visp Station' }
      ]
    }
  },
  {
    id: '3',
    origin: 'London Heathrow (LHR)',
    destination: 'Edinburgh City',
    status: 'MAINTENANCE',
    optionsCount: 4,
    featuredRouteName: 'East Coast Main Line',
    totalDuration: '5h 45m',
    totalDistance: '650 km',
    estimatedCost: '£95',
    frequency: 'Every 2 hours',
    capacity: '450 passengers',
    reliability: 87,
    steps: [
      { mode: 'train', label: 'Heathrow Express', detail: 'LHR to London Paddington', duration: '25m', distance: '24 km', cost: '£25' },
      { mode: 'walk', label: 'Transfer', detail: 'Paddington to Kings Cross', duration: '15m', distance: '1.2 km', cost: '£0' },
      { mode: 'train', label: 'LNER Service', detail: 'Kings Cross to Edinburgh', duration: '4h 45m', distance: '625 km', cost: '£70' },
      { mode: 'walk', label: 'Walk', detail: 'Waverley to City Center', duration: '20m', distance: '1.5 km', cost: '£0' }
    ],
    supportedModes: ['train', 'bus', 'car'],
    coordinates: {
      origin: { lat: 51.4700, lng: -0.4543 },
      destination: { lat: 55.9533, lng: -3.1883 },
      waypoints: [
        { lat: 51.5074, lng: -0.1278, label: 'London Hub' },
        { lat: 53.9591, lng: -1.0815, label: 'York' }
      ]
    }
  }
];

export default function TransitLogisticsPage() {
  const [routes, setRoutes] = useState<TransitRoute[]>(INITIAL_ROUTES);
  const [selectedRoute, setSelectedRoute] = useState<TransitRoute | null>(routes[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingRoute, setEditingRoute] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filteredRoutes = routes.filter(route => 
    route.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.featuredRouteName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (routeId: string) => {
    setEditingRoute(routeId);
  };

  const handleDelete = (routeId: string) => {
    setRoutes(routes.filter(r => r.id !== routeId));
    if (selectedRoute?.id === routeId) {
      setSelectedRoute(routes[0] || null);
    }
    setShowDeleteConfirm(null);
  };

  const handleUpdate = (routeId: string) => {
    // In a real app, this would save changes
    setEditingRoute(null);
    alert(`Route ${routeId} updated successfully!`);
  };

  const handleStatusToggle = (routeId: string) => {
    setRoutes(routes.map(route => {
      if (route.id === routeId) {
        const statuses: ('ACTIVE' | 'INACTIVE' | 'MAINTENANCE')[] = ['ACTIVE', 'INACTIVE', 'MAINTENANCE'];
        const currentIndex = statuses.indexOf(route.status);
        const newStatus = statuses[(currentIndex + 1) % statuses.length];
        return { ...route, status: newStatus };
      }
      return route;
    }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">Transit & Logistical Routes</h1>
          <p className="text-sm text-slate-400">Manage A-to-B connections, transport modes, and checkpoints.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-all">
            <MapIcon size={16} /> Network Map
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm">
            <Plus size={18} /> Add New Route
          </button>
        </div>
      </header>

      {/* Filters Bar */}
      <div className="px-8 py-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by origin, destination, or hub..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
          />
        </div>
        
        <FilterButton icon={<MapPin size={16}/>} label="Origin" />
        <FilterButton icon={<Train size={16}/>} label="Transport Mode" />
        <FilterButton icon={<Activity size={16}/>} label="Status" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-180px)]">
        {/* Left Sidebar: Route Cards */}
        <aside className="lg:col-span-5 px-8 pb-10 space-y-6 overflow-y-auto">
          {filteredRoutes.map(route => (
            <RouteCard 
              key={route.id} 
              route={route} 
              isSelected={selectedRoute?.id === route.id}
              onSelect={() => setSelectedRoute(route)}
              onEdit={() => handleEdit(route.id)}
              onDelete={() => setShowDeleteConfirm(route.id)}
              onUpdate={() => handleUpdate(route.id)}
              onStatusToggle={() => handleStatusToggle(route.id)}
              isEditing={editingRoute === route.id}
              showDeleteConfirm={showDeleteConfirm === route.id}
              onCancelDelete={() => setShowDeleteConfirm(null)}
              onConfirmDelete={() => handleDelete(route.id)}
            />
          ))}
          
          {filteredRoutes.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
              <p className="font-semibold">No routes found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          )}
        </aside>

        {/* Right Section: Interactive Map */}
        <main className="lg:col-span-7 relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-tl-[40px] overflow-hidden border-l border-slate-200">
          {/* Map Controls */}
          <div className="absolute top-6 right-6 flex flex-col gap-2 z-10">
            <MapControl icon={<Plus size={18} />} label="Zoom In" />
            <MapControl icon={<Minus size={18} />} label="Zoom Out" />
            <MapControl icon={<Maximize2 size={18} />} label="Fullscreen" />
            <MapControl icon={<Navigation size={18} />} label="Recenter" />
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-slate-200 z-10">
            <h4 className="text-xs font-black text-slate-700 mb-3 uppercase tracking-wider">Map Legend</h4>
            <div className="space-y-2">
              <LegendItem color="bg-emerald-500" label="Active Route" />
              <LegendItem color="bg-amber-500" label="Maintenance" />
              <LegendItem color="bg-slate-400" label="Inactive" />
              <LegendItem color="bg-blue-500" icon={<Train size={12} />} label="Station/Hub" />
            </div>
          </div>

          {/* Interactive Map */}
          {selectedRoute && (
            <InteractiveMap route={selectedRoute} />
          )}

          {/* Route Details Overlay */}
          {selectedRoute && (
            <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-slate-200 max-w-sm z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{selectedRoute.featuredRouteName}</h3>
                  <p className="text-xs text-slate-500 mt-1">{selectedRoute.origin} → {selectedRoute.destination}</p>
                </div>
                <StatusBadge status={selectedRoute.status} />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <MetricCard icon={<Clock size={14} />} label="Duration" value={selectedRoute.totalDuration} />
                <MetricCard icon={<MapPin size={14} />} label="Distance" value={selectedRoute.totalDistance} />
                <MetricCard icon={<DollarSign size={14} />} label="Cost" value={selectedRoute.estimatedCost} />
                <MetricCard icon={<TrendingUp size={14} />} label="Reliability" value={`${selectedRoute.reliability}%`} />
              </div>

              <div className="bg-slate-50 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Frequency:</span>
                  <span className="text-slate-800 font-bold">{selectedRoute.frequency}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Capacity:</span>
                  <span className="text-slate-800 font-bold">{selectedRoute.capacity}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Options:</span>
                  <span className="text-slate-800 font-bold">{selectedRoute.optionsCount} alternatives</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// --- Sub-Components ---

function FilterButton({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-200 transition-all">
      {icon}
      {label}
      <ChevronDown size={14} className="ml-1 opacity-50" />
    </button>
  );
}

function MapControl({ icon, label }: { icon: React.ReactNode, label?: string }) {
  return (
    <button 
      className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm hover:bg-slate-50 transition-all text-slate-500 group relative"
      title={label}
    >
      {icon}
      {label && (
        <span className="absolute right-12 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {label}
        </span>
      )}
    </button>
  );
}

function LegendItem({ color, icon, label }: { color?: string, icon?: React.ReactNode, label: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon ? (
        <div className={`w-5 h-5 ${color} rounded flex items-center justify-center text-white`}>
          {icon}
        </div>
      ) : (
        <div className={`w-3 h-3 ${color} rounded-full`} />
      )}
      <span className="text-xs text-slate-600 font-medium">{label}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' }) {
  const styles = {
    ACTIVE: 'bg-emerald-100 text-emerald-700',
    INACTIVE: 'bg-slate-100 text-slate-600',
    MAINTENANCE: 'bg-amber-100 text-amber-700'
  };

  return (
    <span className={`${styles[status]} text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider`}>
      {status}
    </span>
  );
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="text-slate-400">{icon}</div>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}

interface RouteCardProps {
  route: TransitRoute;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onUpdate: () => void;
  onStatusToggle: () => void;
  isEditing: boolean;
  showDeleteConfirm: boolean;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}

function RouteCard({ 
  route, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete, 
  onUpdate,
  onStatusToggle,
  isEditing,
  showDeleteConfirm,
  onCancelDelete,
  onConfirmDelete
}: RouteCardProps) {
  return (
    <div 
      className={`bg-white border-2 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all cursor-pointer ${
        isSelected ? 'border-blue-500 shadow-md' : 'border-slate-200'
      }`}
      onClick={onSelect}
    >
      {/* Delete Confirmation Overlay */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-[24px] flex items-center justify-center z-20">
          <div className="text-center px-6">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h4 className="font-bold text-slate-800 mb-2">Delete Route?</h4>
            <p className="text-sm text-slate-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={(e) => { e.stopPropagation(); onCancelDelete(); }}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onConfirmDelete(); }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Info */}
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full border-2 border-slate-400 bg-white" />
            <h3 className="font-bold text-slate-800">{route.origin}</h3>
            <button 
              onClick={(e) => { e.stopPropagation(); onStatusToggle(); }}
              className="hover:scale-110 transition-transform"
            >
              <StatusBadge status={route.status} />
            </button>
          </div>
          <div className="flex items-center gap-3 pl-[3px]">
            <MapPin size={16} className="text-blue-400" />
            <h3 className="font-bold text-slate-800">{route.destination}</h3>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          {isEditing ? (
            <>
              <ActionButton 
                icon={<Check size={16} />} 
                label="Save" 
                variant="success"
                onClick={onUpdate}
              />
              <ActionButton 
                icon={<X size={16} />} 
                label="Cancel" 
                variant="secondary"
                onClick={onEdit}
              />
            </>
          ) : (
            <>
              <ActionButton 
                icon={<Edit2 size={16} />} 
                label="Edit" 
                variant="primary"
                onClick={onEdit}
              />
              <ActionButton 
                icon={<RefreshCw size={16} />} 
                label="Sync" 
                variant="secondary"
                onClick={onUpdate}
              />
              <ActionButton 
                icon={<Trash2 size={16} />} 
                label="Delete" 
                variant="danger"
                onClick={onDelete}
              />
            </>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <QuickStat icon={<Clock size={14} />} value={route.totalDuration} />
        <QuickStat icon={<MapPin size={14} />} value={route.totalDistance} />
        <QuickStat icon={<DollarSign size={14} />} value={route.estimatedCost} />
      </div>

      {/* Featured Route Detail */}
      <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-5 space-y-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <StarIcon />
            <span className="text-sm font-bold text-slate-700">{route.featuredRouteName}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 text-white text-[11px] font-bold px-3 py-1 rounded-lg">
              {route.reliability}% Reliable
            </div>
          </div>
        </div>

        {/* Timeline Visual */}
        <div className="relative py-2 px-4">
          <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-[2px] bg-slate-300" />
          <div className="flex justify-between relative z-1">
            {route.steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white border-2 border-slate-300 shadow-sm flex items-center justify-center hover:scale-110 transition-transform">
                  {step.mode === 'train' && <Train size={18} className="text-slate-600" />}
                  {step.mode === 'walk' && <Footprints size={18} className="text-slate-600" />}
                  {step.mode === 'bus' && <Bus size={18} className="text-slate-600" />}
                  {step.mode === 'car' && <Car size={18} className="text-slate-600" />}
                </div>
                <span className="text-[10px] font-black text-slate-400">{step.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Text Steps */}
        <ul className="space-y-3">
          {route.steps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-3 text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-800">{step.label}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold">{step.cost}</span>
                </div>
                <p className="text-slate-500">{step.detail}</p>
                <div className="flex gap-3 mt-1 text-[10px] text-slate-400 font-semibold">
                  <span>⏱ {step.duration}</span>
                  <span>📍 {step.distance}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Modes & Info */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Modes:</span>
          <div className="flex gap-3">
            {route.supportedModes.map(mode => (
              <div key={mode} className="text-slate-400 hover:text-slate-600 transition-colors" title={mode}>
                {mode === 'train' && <Train size={16} />}
                {mode === 'walk' && <Footprints size={16} />}
                {mode === 'bus' && <Bus size={16} />}
                {mode === 'car' && <Car size={16} />}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Navigation size={12} />
          <span className="font-bold">{route.optionsCount} Options</span>
        </div>
      </div>
    </div>
  );
}

function QuickStat({ icon, value }: { icon: React.ReactNode, value: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-2.5 flex items-center gap-2">
      <div className="text-slate-400">{icon}</div>
      <span className="text-xs font-bold text-slate-700">{value}</span>
    </div>
  );
}

function ActionButton({ 
  icon, 
  label, 
  variant = 'primary',
  onClick 
}: { 
  icon: React.ReactNode, 
  label: string, 
  variant?: 'primary' | 'secondary' | 'danger' | 'success',
  onClick: () => void 
}) {
  const variants = {
    primary: 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200',
    secondary: 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200',
    success: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-200'
  };

  return (
    <button 
      onClick={onClick}
      className={`p-2 rounded-lg border transition-all hover:scale-105 group relative ${variants[variant]}`}
      title={label}
    >
      {icon}
      <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {label}
      </span>
    </button>
  );
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function InteractiveMap({ route }: { route: TransitRoute }) {
  const { origin, destination, waypoints = [] } = route.coordinates;
  
  // Calculate SVG viewBox based on coordinates
  const allPoints = [origin, destination, ...waypoints];
  const lats = allPoints.map(p => p.lat);
  const lngs = allPoints.map(p => p.lng);
  
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  
  const latRange = maxLat - minLat;
  const lngRange = maxLng - minLng;
  
  // Convert lat/lng to SVG coordinates
  const toSVG = (lat: number, lng: number) => {
    const x = ((lng - minLng) / lngRange) * 700 + 50;
    const y = ((maxLat - lat) / latRange) * 500 + 50;
    return { x, y };
  };
  
  const originSVG = toSVG(origin.lat, origin.lng);
  const destSVG = toSVG(destination.lat, destination.lng);
  const waypointsSVG = waypoints.map(wp => ({ ...toSVG(wp.lat, wp.lng), label: wp.label }));
  
  // Create smooth path through all points
  const createPath = () => {
    const points = [originSVG, ...waypointsSVG, destSVG];
    if (points.length === 2) {
      return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
    }
    
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2;
      path += ` Q ${midX} ${midY}, ${curr.x} ${curr.y}`;
    }
    return path;
  };

  const statusColors = {
    ACTIVE: '#10b981',
    INACTIVE: '#94a3b8',
    MAINTENANCE: '#f59e0b'
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-10">
      <svg className="w-full h-full" viewBox="0 0 800 600" style={{ maxHeight: '100%' }}>
        {/* Grid Background */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="800" height="600" fill="url(#grid)" />
        
        {/* Route Path */}
        <path
          d={createPath()}
          fill="none"
          stroke={statusColors[route.status]}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={route.status === 'MAINTENANCE' ? '10 5' : '0'}
          opacity="0.6"
        />
        
        {/* Animated Route Path */}
        <path
          d={createPath()}
          fill="none"
          stroke={statusColors[route.status]}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="20 10"
          opacity="0.8"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-30"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </path>
        
        {/* Waypoints */}
        {waypointsSVG.map((wp, idx) => (
          <g key={idx}>
            <circle
              cx={wp.x}
              cy={wp.y}
              r="20"
              fill="white"
              stroke="#3b82f6"
              strokeWidth="3"
              className="hover:r-25 transition-all cursor-pointer"
            />
            <g transform={`translate(${wp.x - 8}, ${wp.y - 8})`}>
              <Train size={16} className="text-blue-500" />
            </g>
            <text
              x={wp.x}
              y={wp.y + 35}
              textAnchor="middle"
              className="text-xs font-bold fill-slate-700"
            >
              {wp.label}
            </text>
          </g>
        ))}
        
        {/* Origin Point */}
        <g>
          <circle
            cx={originSVG.x}
            cy={originSVG.y}
            r="25"
            fill={statusColors[route.status]}
            opacity="0.2"
            className="animate-ping"
            style={{ animationDuration: '2s' }}
          />
          <circle
            cx={originSVG.x}
            cy={originSVG.y}
            r="25"
            fill="white"
            stroke={statusColors[route.status]}
            strokeWidth="4"
            className="hover:r-30 transition-all cursor-pointer"
          />
          <circle
            cx={originSVG.x}
            cy={originSVG.y}
            r="8"
            fill={statusColors[route.status]}
          />
          <text
            x={originSVG.x}
            y={originSVG.y + 45}
            textAnchor="middle"
            className="text-sm font-bold fill-slate-800"
          >
            {route.origin.split(' ')[0]}
          </text>
        </g>
        
        {/* Destination Point */}
        <g>
          <circle
            cx={destSVG.x}
            cy={destSVG.y}
            r="25"
            fill={statusColors[route.status]}
            opacity="0.2"
            className="animate-ping"
            style={{ animationDuration: '2s', animationDelay: '1s' }}
          />
          <circle
            cx={destSVG.x}
            cy={destSVG.y}
            r="25"
            fill="white"
            stroke={statusColors[route.status]}
            strokeWidth="4"
            className="hover:r-30 transition-all cursor-pointer"
          />
          <g transform={`translate(${destSVG.x - 8}, ${destSVG.y - 8})`}>
            <MapPin size={16} className={`text-${route.status === 'ACTIVE' ? 'emerald' : route.status === 'MAINTENANCE' ? 'amber' : 'slate'}-500`} />
          </g>
          <text
            x={destSVG.x}
            y={destSVG.y + 45}
            textAnchor="middle"
            className="text-sm font-bold fill-slate-800"
          >
            {route.destination.split(' ')[0]}
          </text>
        </g>
      </svg>
    </div>
  );
}