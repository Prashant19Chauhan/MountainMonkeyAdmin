"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  GitBranch, MapPin, Bus, Train, Plane, Navigation, 
  Plus, Search, Filter, Trash2, Edit3, DollarSign, 
  Clock, Shield, ArrowRight, ArrowLeft, CheckCircle2, 
  Map, Sparkles, Building2, UserCheck, Settings, Eye,
  ChevronRight, Compass, LayoutGrid, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RouteGraphCanvas from './RouteGraphCanvas';
import useTravelRoute from '@/hooks/useTravelRoute';

// ── Types ──
interface Location {
  _id: string;
  name: string;
  country: string;
  state: string;
  city: string;
}

interface Hub {
  _id: string;
  name: string;
  type: "BUS_STAND" | "RAILWAY_STATION" | "AIRPORT" | "METRO_STATION" | "TAXI_STAND" | "PICKUP_POINT" | "CUSTOM_HUB";
  address: string;
  cityId: string;
  coordinates: [number, number]; // [lng, lat]
}

interface Operator {
  _id: string;
  name: string;
  logo?: string;
  supportNumber: string;
  supportEmail: string;
}

interface Vehicle {
  _id: string;
  operatorId: string;
  vehicleNumber: string;
  vehicleName: string;
  mode: "BUS" | "TRAIN" | "FLIGHT" | "METRO" | "CAB" | "AUTO";
  capacity: number;
}

interface Route {
  _id: string;
  sourceHubId: string;
  destinationHubId: string;
  operatorId: string;
  vehicleId: string;
  mode: "BUS" | "TRAIN" | "FLIGHT" | "METRO";
  distanceKm: number;
  durationMin: number;
  basePrice: number;
  currentPrice: number;
  active: boolean;
}

interface Transfer {
  _id: string;
  cityId: string;
  sourceHubId: string;
  destinationHubId: string;
  transferMode: "WALK" | "AUTO" | "CAB" | "METRO" | "SHUTTLE";
  distanceKm: number;
  durationMin: number;
  estimatedCost: number;
}

interface Schedule {
  _id: string;
  routeId: string;
  departureTime: string;
  arrivalTime: string;
  totalSeats?: number;
  availableSeats?: number;
  price?: number;
  createdAt?: string;
}

// ── PRE-SEEDED SEED DATA FOR DEMO / INITIAL STATE ──
const INITIAL_LOCATIONS: Location[] = [
  { _id: "loc-1", name: "Shimla", country: "India", state: "Himachal Pradesh", city: "Shimla" },
  { _id: "loc-2", name: "Manali", country: "India", state: "Himachal Pradesh", city: "Manali" },
  { _id: "loc-3", name: "Delhi", country: "India", state: "Delhi", city: "Delhi" },
  { _id: "loc-4", name: "Chandigarh", country: "India", state: "Punjab", city: "Chandigarh" },
];

const INITIAL_HUBS: Hub[] = [
  { _id: "hub-1", name: "Shimla ISBT", type: "BUS_STAND", address: "Bypass Rd, Shimla", cityId: "loc-1", coordinates: [77.1734, 31.1048] },
  { _id: "hub-5", name: "Shimla Mall Road Stand", type: "TAXI_STAND", address: "Mall Road, Shimla", cityId: "loc-1", coordinates: [77.1895, 31.1120] },
  { _id: "hub-2", name: "Manali Mall Road Stand", type: "TAXI_STAND", address: "Mall Road, Manali", cityId: "loc-2", coordinates: [77.1887, 32.2396] },
  { _id: "hub-3", name: "Delhi IGI Airport T3", type: "AIRPORT", address: "IGI Airport, New Delhi", cityId: "loc-3", coordinates: [77.1000, 28.5562] },
  { _id: "hub-4", name: "Chandigarh Junction", type: "RAILWAY_STATION", address: "Railway Station Rd, Chandigarh", cityId: "loc-4", coordinates: [76.8173, 30.7061] },
];

const INITIAL_TRANSFERS: Transfer[] = [
  { _id: "trans-1", cityId: "loc-1", sourceHubId: "hub-1", destinationHubId: "hub-5", transferMode: "CAB", distanceKm: 4.5, durationMin: 20, estimatedCost: 150 },
];

const INITIAL_OPERATORS: Operator[] = [
  { _id: "op-1", name: "Himalayan Volvo Express", supportNumber: "+91 9876543210", supportEmail: "support@himalayanvolvo.com" },
  { _id: "op-2", name: "Air India Regional", supportNumber: "+91 18001801407", supportEmail: "contact@airindia.in" },
  { _id: "op-3", name: "Northern Railway division", supportNumber: "139", supportEmail: "support@irctc.co.in" },
];

const INITIAL_VEHICLES: Vehicle[] = [
  { _id: "veh-1", operatorId: "op-1", vehicleName: "Scania Multi-Axle", vehicleNumber: "HP-63-A-1234", mode: "BUS", capacity: 42 },
  { _id: "veh-2", operatorId: "op-2", vehicleName: "ATR 72-600", vehicleNumber: "VT-ALL", mode: "FLIGHT", capacity: 72 },
  { _id: "veh-3", operatorId: "op-3", vehicleName: "Shatabdi Express", vehicleNumber: "12011", mode: "TRAIN", capacity: 600 },
];

const INITIAL_ROUTES: Route[] = [
  { _id: "route-1", sourceHubId: "hub-3", destinationHubId: "hub-1", operatorId: "op-1", vehicleId: "veh-1", mode: "BUS", distanceKm: 345, durationMin: 480, basePrice: 950, currentPrice: 1200, active: true },
  { _id: "route-2", sourceHubId: "hub-3", destinationHubId: "hub-4", operatorId: "op-3", vehicleId: "veh-3", mode: "TRAIN", distanceKm: 244, durationMin: 200, basePrice: 650, currentPrice: 650, active: true },
];

export default function TravelRoutesDashboard() {
  const {
    locations,
    hubs,
    operators,
    vehicles,
    routes,
    transfers,
    schedules,
    isLoading,
    createCity,
    createHub,
    deleteHub,
    createOperator,
    deleteOperator,
    createVehicle,
    deleteVehicle,
    createRoute,
    deleteRoute,
    createTransfer,
    deleteTransfer,
    createSchedule,
    deleteSchedule
  } = useTravelRoute();

  // ── UI Filter & Navigation States ──
  const [viewMode, setViewMode] = useState<'mindmap' | 'table'>('mindmap');
  const [activeTab, setActiveTab] = useState<'routes' | 'hubs' | 'vehicles' | 'operators' | 'transfers' | 'schedules'>('routes');
  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState<'ALL' | 'BUS' | 'TRAIN' | 'FLIGHT' | 'METRO'>('ALL');
  
  // ── Modal States ──
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // ── Vehicle Schedule Form States ──
  const [scheduleForm, setScheduleForm] = useState({
    routeId: "",
    departureTime: "",
    arrivalTime: "",
    totalSeats: 40,
    availableSeats: 40,
    price: 500
  });

  // ── Sub-Form Trigger States (Runtime Additions) ──
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [showAddHub, setShowAddHub] = useState(false);
  const [showAddOperator, setShowAddOperator] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);

  // ── Dynamic Form Inputs States ──
  const [routeForm, setRouteForm] = useState({
    mode: "BUS" as "BUS" | "TRAIN" | "FLIGHT" | "METRO",
    operatorId: "",
    vehicleId: "",
    sourceHubId: "",
    destinationHubId: "",
    distanceKm: 0,
    durationMin: 0,
    basePrice: 0,
    currentPrice: 0,
    active: true
  });

  // ── Nested Object Creation Form States ──
  const [newLocationForm, setNewLocationForm] = useState({ name: "", city: "", state: "", country: "India" });
  const [newHubForm, setNewHubForm] = useState({ name: "", type: "BUS_STAND" as Hub['type'], address: "", cityId: "", lng: 77.0, lat: 31.0 });
  const [newOperatorForm, setNewOperatorForm] = useState({ name: "", supportNumber: "", supportEmail: "" });
  const [newVehicleForm, setNewVehicleForm] = useState({ operatorId: "", vehicleName: "", vehicleNumber: "", mode: "BUS" as Vehicle['mode'], capacity: 40 });

  // ── DELETE OPERATIONS ──
  const handleDeleteRoute = (id: string) => {
    deleteRoute(id);
  };

  const handleDeleteTransfer = (id: string) => {
    deleteTransfer(id);
  };

  const handleDeleteHub = (id: string) => {
    deleteHub(id);
  };

  const handleDeleteVehicle = (id: string) => {
    deleteVehicle(id);
  };

  const handleDeleteOperator = (id: string) => {
    deleteOperator(id);
  };

  const handleDeleteSchedule = (id: string) => {
    deleteSchedule(id);
  };

  // ── ON-THE-FLY RUNTIME CREATIONS ──
  const handleCreateLocationInline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocationForm.name || !newLocationForm.city) return;

    const payload = {
      name: newLocationForm.name,
      country: newLocationForm.country || "India",
      state: newLocationForm.state || "Himachal Pradesh",
      city: newLocationForm.city,
      address: `${newLocationForm.city}, ${newLocationForm.state || "Himachal Pradesh"}, India`,
      locationCoordinates: {
        type: "Point",
        coordinates: [77.1734, 31.1048]
      },
      altitude: 1500,
      timezone: "Asia/Kolkata",
      description: `Transit cluster region for ${newLocationForm.city}.`
    };

    createCity(payload, {
      onSuccess: (res: any) => {
        const newCityId = res.data?._id || res.data?.id;
        setNewHubForm(prev => ({ ...prev, cityId: newCityId }));
        setNewLocationForm({ name: "", city: "", state: "", country: "India" });
        setShowAddLocation(false);
      }
    });
  };

  const handleCreateHubInline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHubForm.name || !newHubForm.cityId) return;

    const payload = {
      cityId: newHubForm.cityId,
      name: newHubForm.name,
      type: newHubForm.type,
      address: newHubForm.address || `${newHubForm.name}, Cluster Region`,
      coordinates: [newHubForm.lng || 77.0, newHubForm.lat || 31.0]
    };

    createHub(payload, {
      onSuccess: (res: any) => {
        const newHubId = res.data?._id || res.data?.id;
        if (!routeForm.sourceHubId) {
          setRouteForm(prev => ({ ...prev, sourceHubId: newHubId }));
        } else if (!routeForm.destinationHubId) {
          setRouteForm(prev => ({ ...prev, destinationHubId: newHubId }));
        }
        setNewHubForm({ name: "", type: "BUS_STAND", address: "", cityId: "", lng: 77.0, lat: 31.0 });
        setShowAddHub(false);
      }
    });
  };

  const handleCreateOperatorInline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOperatorForm.name) return;

    const payload = {
      name: newOperatorForm.name,
      supportNumber: newOperatorForm.supportNumber || "+91 9999999999",
      supportEmail: newOperatorForm.supportEmail || "support@operator.com"
    };

    createOperator(payload, {
      onSuccess: (res: any) => {
        const opId = res.data?._id || res.data?.id;
        setRouteForm(prev => ({ ...prev, operatorId: opId }));
        setNewOperatorForm({ name: "", supportNumber: "", supportEmail: "" });
        setShowAddOperator(false);
      }
    });
  };

  const handleCreateVehicleInline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicleForm.vehicleName || !newVehicleForm.operatorId) return;

    const payload = {
      operatorId: newVehicleForm.operatorId,
      vehicleNumber: newVehicleForm.vehicleNumber || "HP-00-Temp",
      vehicleName: newVehicleForm.vehicleName,
      mode: newVehicleForm.mode,
      capacity: newVehicleForm.capacity || 40
    };

    createVehicle(payload, {
      onSuccess: (res: any) => {
        const vehId = res.data?._id || res.data?.id;
        setRouteForm(prev => ({ ...prev, vehicleId: vehId }));
        setNewVehicleForm({ operatorId: "", vehicleName: "", vehicleNumber: "", mode: "BUS", capacity: 40 });
        setShowAddVehicle(false);
      }
    });
  };

  // ── SUBMIT MAIN ROUTE FORM ──
  const handleSubmitRoute = () => {
    if (!routeForm.sourceHubId || !routeForm.destinationHubId) return;

    const payload = {
      sourceHubId: routeForm.sourceHubId,
      destinationHubId: routeForm.destinationHubId,
      operatorId: routeForm.operatorId || undefined,
      vehicleId: routeForm.vehicleId || undefined,
      mode: routeForm.mode,
      distanceKm: Number(routeForm.distanceKm) || 10,
      durationMin: Number(routeForm.durationMin) || 15,
      basePrice: Number(routeForm.basePrice) || 100,
      currentPrice: Number(routeForm.currentPrice) || 100,
      active: routeForm.active
    };

    createRoute(payload, {
      onSuccess: () => {
        setRouteForm({
          mode: "BUS",
          operatorId: "",
          vehicleId: "",
          sourceHubId: "",
          destinationHubId: "",
          distanceKm: 0,
          durationMin: 0,
          basePrice: 0,
          currentPrice: 0,
          active: true
        });
        setCurrentStep(1);
        setIsCreateModalOpen(false);
      }
    });
  };

  // ── SUBMIT VEHICLE SCHEDULE FORM ──
  const handleSubmitSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleForm.routeId || !scheduleForm.departureTime || !scheduleForm.arrivalTime) return;

    createSchedule(scheduleForm, {
      onSuccess: () => {
        setScheduleForm({
          routeId: "",
          departureTime: "",
          arrivalTime: "",
          totalSeats: 40,
          availableSeats: 40,
          price: 500
        });
        setIsScheduleModalOpen(false);
      }
    });
  };

  // ── Resolution Helpers ──
  const getHubName = (id: string) => hubs.find(h => h._id === id)?.name || "Unknown Station";
  const getCityNameForHub = (id: string) => {
    const hub = hubs.find(h => h._id === id);
    if (!hub) return "Unknown";
    return locations.find(l => l._id === hub.cityId)?.name || "Unknown City";
  };
  const getOperatorName = (id: string) => operators.find(o => o._id === id)?.name || "Private Division";
  const getVehicleName = (id: string) => vehicles.find(v => v._id === id)?.vehicleName || "Direct Link";

  // ── Filtered Listings pipelines ──
  const filteredRoutes = routes.filter(route => {
    const matchesSearch = 
      getHubName(route.sourceHubId).toLowerCase().includes(searchQuery.toLowerCase()) ||
      getHubName(route.destinationHubId).toLowerCase().includes(searchQuery.toLowerCase()) ||
      getOperatorName(route.operatorId).toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMode = modeFilter === 'ALL' || route.mode === modeFilter;
    return matchesSearch && matchesMode;
  });

  const filteredTransfers = transfers.filter(trans => {
    return getHubName(trans.sourceHubId).toLowerCase().includes(searchQuery.toLowerCase()) ||
      getHubName(trans.destinationHubId).toLowerCase().includes(searchQuery.toLowerCase()) ||
      trans.transferMode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getCityNameForHub(trans.sourceHubId).toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredHubs = hubs.filter(hub => {
    return hub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hub.address.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredVehicles = vehicles.filter(veh => {
    return veh.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      veh.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredOperators = operators.filter(op => {
    return op.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredSchedules = (schedules || []).filter(sched => {
    const route = routes.find(r => r._id === sched.routeId);
    if (!route) return false;
    const srcName = getHubName(route.sourceHubId).toLowerCase();
    const destName = getHubName(route.destinationHubId).toLowerCase();
    const opName = getOperatorName(route.operatorId).toLowerCase();
    const query = searchQuery.toLowerCase();
    return srcName.includes(query) || destName.includes(query) || opName.includes(query);
  });

  return (
    <div className="space-y-8 py-6 px-4 md:px-8 bg-slate-50/50 min-h-screen text-slate-900 font-sans">
      
      {/* ── HEADER & META STATS ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-indigo-600 mb-1">
            <GitBranch size={28} className="animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.25em]">Transit Infrastructure</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight">
            Travel & Route Studio
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Manage dynamic hubs, operators, dynamic pricing edges, and transfer connectivity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          <div className="flex bg-slate-200/60 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setViewMode('mindmap')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border-0 cursor-pointer
                ${viewMode === 'mindmap' 
                  ? 'bg-white text-slate-900 shadow-sm font-black scale-102' 
                  : 'text-slate-500 hover:text-slate-800 bg-transparent'}`}
            >
              <Compass size={14} /> Map Canvas
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border-0 cursor-pointer
                ${viewMode === 'table' 
                  ? 'bg-white text-slate-900 shadow-sm font-black scale-102' 
                  : 'text-slate-500 hover:text-slate-800 bg-transparent'}`}
            >
              <LayoutGrid size={14} /> Tables Grid
            </button>
          </div>

          <Link href="/metadata?travel-routes-page=travel-routes-page" className="no-underline">
            <button className="px-4 py-2.5 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 cursor-pointer border-0">
              <Edit3 size={14} /> Listing SEO
            </button>
          </Link>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2.5 px-6 py-4 bg-slate-900 text-white rounded-[1.5rem] font-bold text-xs uppercase tracking-wider hover:bg-rose-500 hover:shadow-xl hover:shadow-rose-100 transition-all border-0 cursor-pointer"
          >
            <Plus size={16} />
            Create Route Edge
          </button>

          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="flex items-center justify-center gap-2.5 px-6 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-bold text-xs uppercase tracking-wider hover:bg-rose-500 hover:shadow-xl hover:shadow-indigo-100 transition-all border-0 cursor-pointer"
          >
            <Plus size={16} />
            Define Schedule Timing
          </button>
        </div>
      </div>

      {/* ── STATS SECTION CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: "Active Routes", val: routes.length, icon: Navigation, col: "from-blue-500 to-cyan-400" },
          { label: "Transit Stations / Hubs", val: hubs.length, icon: MapPin, col: "from-rose-500 to-orange-400" },
          { label: "Operators Registries", val: operators.length, icon: Building2, col: "from-indigo-500 to-purple-400" },
          { label: "Fleet Vehicles Available", val: vehicles.length, icon: Bus, col: "from-emerald-500 to-teal-400" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className={`absolute top-0 left-0 w-2.5 h-full bg-gradient-to-b ${stat.col}`} />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-3xl font-black text-slate-900 mt-2">{stat.val}</h3>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl text-slate-500 group-hover:text-indigo-500 transition-colors">
                <stat.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── DYNAMIC VIEWPORTS: MIND-MAP CANVAS vs GRIDS ── */}
      {viewMode === 'mindmap' ? (
        <RouteGraphCanvas
          locations={locations}
          hubs={hubs}
          operators={operators}
          vehicles={vehicles}
          routes={routes}
          transfers={transfers}
        />
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        
        {/* SECTION NAVIGATION TABS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 p-6 md:p-8 gap-4 bg-slate-50/50">
          
          <div className="flex bg-slate-100 p-1.5 rounded-[1.25rem] self-start">
            {[
              { id: 'routes', label: 'Routes Network' },
              { id: 'transfers', label: 'Local Transfers' },
              { id: 'schedules', label: 'Vehicle Schedules' },
              { id: 'hubs', label: 'Transit Hubs' },
              { id: 'vehicles', label: 'Fleet Vehicles' },
              { id: 'operators', label: 'Operators' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setSearchQuery(''); }}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border-0 cursor-pointer
                  ${activeTab === tab.id 
                    ? 'bg-white text-slate-900 shadow-sm scale-102 font-black' 
                    : 'text-slate-500 hover:text-slate-900 bg-transparent'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ACTIVE FILTER & SEARCH BAR */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {activeTab === 'routes' && (
              <select
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value as any)}
                className="px-4 py-3 bg-white border border-slate-100 rounded-xl text-xs font-black text-slate-700 outline-none cursor-pointer"
              >
                <option value="ALL">All Modes</option>
                <option value="BUS">Bus</option>
                <option value="TRAIN">Train</option>
                <option value="FLIGHT">Flight</option>
                <option value="METRO">Metro</option>
              </select>
            )}

            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400"
              />
            </div>
          </div>

        </div>

        {/* ── TABLES DISPLAY DYNAMICS ── */}
        <div className="p-6 md:p-8 overflow-x-auto">
          
          {/* TAB 1: ROUTES NETWORK TABLE */}
          {activeTab === 'routes' && (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="pb-4">Origin Station</th>
                  <th className="pb-4">Destination Station</th>
                  <th className="pb-4">Transit Mode</th>
                  <th className="pb-4">Operator & Fleet</th>
                  <th className="pb-4">Performance Metrics</th>
                  <th className="pb-4">Fare Matrix</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {filteredRoutes.length > 0 ? filteredRoutes.map((route) => (
                  <tr key={route._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-4.5 pr-4">
                      <div className="font-extrabold text-slate-900 text-sm">{getHubName(route.sourceHubId)}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">
                        📍 {getCityNameForHub(route.sourceHubId)}
                      </div>
                    </td>
                    <td className="py-4.5 pr-4">
                      <div className="font-extrabold text-slate-900 text-sm">{getHubName(route.destinationHubId)}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">
                        📍 {getCityNameForHub(route.destinationHubId)}
                      </div>
                    </td>
                    <td className="py-4.5 pr-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border font-black text-[9px] uppercase tracking-wider
                        ${route.mode === 'BUS' ? 'bg-blue-50 text-blue-600 border-blue-100' : ''}
                        ${route.mode === 'TRAIN' ? 'bg-amber-50 text-amber-600 border-amber-100' : ''}
                        ${route.mode === 'FLIGHT' ? 'bg-rose-50 text-rose-600 border-rose-100' : ''}
                        ${route.mode === 'METRO' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : ''}
                      `}>
                        {route.mode === 'BUS' && <Bus size={10} />}
                        {route.mode === 'TRAIN' && <Train size={10} />}
                        {route.mode === 'FLIGHT' && <Plane size={10} />}
                        {route.mode === 'METRO' && <Navigation size={10} />}
                        {route.mode}
                      </span>
                    </td>
                    <td className="py-4.5 pr-4">
                      <div className="font-black text-slate-700">{getOperatorName(route.operatorId)}</div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">{getVehicleName(route.vehicleId)}</div>
                    </td>
                    <td className="py-4.5 pr-4 space-y-1">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Map className="text-slate-400" size={12} />
                        <span className="font-bold">{route.distanceKm} Km</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-[10px] font-medium">
                        <Clock size={11} />
                        <span>{Math.floor(route.durationMin / 60)} hrs {route.durationMin % 60} mins</span>
                      </div>
                    </td>
                    <td className="py-4.5 pr-4 space-y-1">
                      <div className="flex items-center gap-1 font-black text-slate-900 text-sm">
                        <span>₹{route.currentPrice}</span>
                      </div>
                      {route.currentPrice !== route.basePrice && (
                        <div className="text-[10px] text-slate-400 line-through">Base: ₹{route.basePrice}</div>
                      )}
                    </td>
                    <td className="py-4.5 pr-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border
                        ${route.active 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : 'bg-slate-50 text-slate-400 border-slate-100'
                        }`}>
                        {route.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4.5 text-right flex items-center justify-end gap-1">
                      <Link href={`/metadata?route=${route._id}`}>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all cursor-pointer border-0 bg-transparent" title="Edit Route SEO Metadata">
                          <Edit3 size={16} />
                        </button>
                      </Link>
                      <button 
                        onClick={() => handleDeleteRoute(route._id)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer border-0 bg-transparent"
                        title="Delete Route"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-slate-400 font-bold italic">
                      No travel route networks found matching filter requirements.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* TAB: VEHICLE SCHEDULES TABLE */}
          {activeTab === 'schedules' && (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="pb-4">Route Path</th>
                  <th className="pb-4">Operator & Vehicle</th>
                  <th className="pb-4">Departure Time</th>
                  <th className="pb-4">Arrival Time</th>
                  <th className="pb-4">Available Seats</th>
                  <th className="pb-4">Total Seats</th>
                  <th className="pb-4">Fare (₹)</th>
                  <th className="pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {filteredSchedules.length > 0 ? filteredSchedules.map((sched) => {
                  const route = routes.find(r => r._id === sched.routeId);
                  const srcHubName = route ? getHubName(route.sourceHubId) : "Unknown Station";
                  const destHubName = route ? getHubName(route.destinationHubId) : "Unknown Station";
                  const srcCity = route ? getCityNameForHub(route.sourceHubId) : "";
                  const destCity = route ? getCityNameForHub(route.destinationHubId) : "";
                  const opName = route ? getOperatorName(route.operatorId) : "Private Division";
                  const vehName = route ? getVehicleName(route.vehicleId) : "Direct Service";

                  return (
                    <tr key={sched._id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-4.5 pr-4">
                        <div className="font-extrabold text-slate-900 text-sm">
                          {srcHubName} ➔ {destHubName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">
                          🏙️ {srcCity} ➔ {destCity}
                        </div>
                      </td>
                      <td className="py-4.5 pr-4">
                        <div className="font-black text-slate-700">{opName}</div>
                        <div className="text-[10px] text-slate-400 font-medium mt-0.5">{vehName}</div>
                      </td>
                      <td className="py-4.5 pr-4 font-bold text-slate-700">
                        {new Date(sched.departureTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </td>
                      <td className="py-4.5 pr-4 font-bold text-slate-700">
                        {new Date(sched.arrivalTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </td>
                      <td className="py-4.5 pr-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border
                          ${(sched.availableSeats || 0) < 5 
                            ? 'bg-rose-50 text-rose-600 border-rose-100' 
                            : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          }`}>
                          {sched.availableSeats ?? 0} Seats Left
                        </span>
                      </td>
                      <td className="py-4.5 pr-4 font-bold text-slate-500">
                        {sched.totalSeats ?? 40} Seats
                      </td>
                      <td className="py-4.5 pr-4 font-black text-slate-950 text-sm">
                        ₹{sched.price ?? 0}
                      </td>
                      <td className="py-4.5 text-right">
                        <button 
                          onClick={() => handleDeleteSchedule(sched._id)}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer border-0 bg-transparent"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-slate-400 font-bold italic">
                      No vehicle schedules mapped for this route network.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* TAB: LOCAL TRANSFERS TABLE */}
          {activeTab === 'transfers' && (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="pb-4">City</th>
                  <th className="pb-4">Origin Station</th>
                  <th className="pb-4">Destination Station</th>
                  <th className="pb-4">Transfer Mode</th>
                  <th className="pb-4">Performance Metrics</th>
                  <th className="pb-4">Est. Cost</th>
                  <th className="pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {filteredTransfers.length > 0 ? filteredTransfers.map((trans) => (
                  <tr key={trans._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-4.5 pr-4">
                      <div className="font-extrabold text-slate-900 text-sm">
                        🏙️ {getCityNameForHub(trans.sourceHubId)}
                      </div>
                    </td>
                    <td className="py-4.5 pr-4">
                      <div className="font-extrabold text-slate-900 text-sm">{getHubName(trans.sourceHubId)}</div>
                    </td>
                    <td className="py-4.5 pr-4">
                      <div className="font-extrabold text-slate-900 text-sm">{getHubName(trans.destinationHubId)}</div>
                    </td>
                    <td className="py-4.5 pr-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border font-black text-[9px] uppercase tracking-wider
                        ${trans.transferMode === 'WALK' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : ''}
                        ${trans.transferMode === 'AUTO' ? 'bg-amber-50 text-amber-600 border-amber-100' : ''}
                        ${trans.transferMode === 'CAB' ? 'bg-rose-50 text-rose-600 border-rose-100' : ''}
                        ${trans.transferMode === 'METRO' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : ''}
                        ${trans.transferMode === 'SHUTTLE' ? 'bg-blue-50 text-blue-600 border-blue-100' : ''}
                      `}>
                        {trans.transferMode === 'WALK' && '🚶 WALK'}
                        {trans.transferMode === 'AUTO' && '🛺 AUTO'}
                        {trans.transferMode === 'CAB' && '🚕 CAB'}
                        {trans.transferMode === 'METRO' && '🚇 METRO'}
                        {trans.transferMode === 'SHUTTLE' && '🚍 SHUTTLE'}
                      </span>
                    </td>
                    <td className="py-4.5 pr-4 space-y-1">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Map className="text-slate-400" size={12} />
                        <span className="font-bold">{trans.distanceKm} Km</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-[10px] font-medium">
                        <Clock size={11} />
                        <span>{trans.durationMin} mins</span>
                      </div>
                    </td>
                    <td className="py-4.5 pr-4 font-black text-slate-900 text-sm">
                      ₹{trans.estimatedCost}
                    </td>
                    <td className="py-4.5 text-right">
                      <button 
                        onClick={() => handleDeleteTransfer(trans._id)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer border-0 bg-transparent"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-slate-400 font-bold italic">
                      No in-city transfers cataloged yet for this cluster.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* TAB 2: HUBS LIST */}
          {activeTab === 'hubs' && (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="pb-4">Hub Name</th>
                  <th className="pb-4">Type</th>
                  <th className="pb-4">Location Coordinates</th>
                  <th className="pb-4">Full Address</th>
                  <th className="pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {filteredHubs.length > 0 ? filteredHubs.map((hub) => (
                  <tr key={hub._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-4">
                      <div className="font-extrabold text-slate-900 text-sm">{hub.name}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                        📍 {locations.find(l => l._id === hub.cityId)?.name || "Unknown City"}
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-wider">
                        {hub.type.split('_').join(' ')}
                      </span>
                    </td>
                    <td className="py-4 text-slate-600 font-bold font-mono">
                      [{hub.coordinates[0].toFixed(4)}, {hub.coordinates[1].toFixed(4)}]
                    </td>
                    <td className="py-4 text-slate-400 font-medium max-w-[200px] truncate">
                      {hub.address || "No Address Saved"}
                    </td>
                    <td className="py-4 text-right">
                      <button 
                        onClick={() => handleDeleteHub(hub._id)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer border-0 bg-transparent"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-slate-400 font-bold italic">
                      No transit hubs cataloged yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* TAB 3: VEHICLES LIST */}
          {activeTab === 'vehicles' && (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="pb-4">Vehicle Name</th>
                  <th className="pb-4">Plate Registration</th>
                  <th className="pb-4">Transit Mode</th>
                  <th className="pb-4">Seating Capacity</th>
                  <th className="pb-4">Operator Division</th>
                  <th className="pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {filteredVehicles.length > 0 ? filteredVehicles.map((veh) => (
                  <tr key={veh._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-4">
                      <div className="font-extrabold text-slate-900 text-sm">{veh.vehicleName}</div>
                    </td>
                    <td className="py-4 text-slate-700 font-bold uppercase font-mono bg-slate-50 rounded px-2.5 py-1 inline-block mt-3">
                      {veh.vehicleNumber || "UNREGISTERED"}
                    </td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border font-black text-[9px] uppercase tracking-wider bg-slate-50 text-slate-700 border-slate-200">
                        {veh.mode}
                      </span>
                    </td>
                    <td className="py-4 font-black text-slate-950">
                      {veh.capacity} Seats Available
                    </td>
                    <td className="py-4 text-slate-500 font-bold">
                      {getOperatorName(veh.operatorId)}
                    </td>
                    <td className="py-4 text-right">
                      <button 
                        onClick={() => handleDeleteVehicle(veh._id)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer border-0 bg-transparent"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-slate-400 font-bold italic">
                      No active vehicles mapped in catalog.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* TAB 4: OPERATORS LIST */}
          {activeTab === 'operators' && (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="pb-4">Operator Brand</th>
                  <th className="pb-4">Support Hotline</th>
                  <th className="pb-4">Business Email</th>
                  <th className="pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {filteredOperators.length > 0 ? filteredOperators.map((op) => (
                  <tr key={op._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-4">
                      <div className="font-extrabold text-slate-900 text-sm flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-[10px] font-black uppercase">
                          {op.name.charAt(0)}
                        </div>
                        {op.name}
                      </div>
                    </td>
                    <td className="py-4 text-slate-600 font-extrabold">
                      {op.supportNumber || "No Helpline Support"}
                    </td>
                    <td className="py-4 text-slate-400 font-bold">
                      {op.supportEmail || "N/A"}
                    </td>
                    <td className="py-4 text-right">
                      <button 
                        onClick={() => handleDeleteOperator(op._id)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer border-0 bg-transparent"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="text-center py-16 text-slate-400 font-bold italic">
                      No travel operators registered.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

        </div>

        </div>
      )}

      {/* ── CREATE ROUTE WIZARD MODAL ── */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[999] flex items-center justify-center p-4 overflow-y-auto">
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[3rem] w-full max-w-4xl shadow-2xl border border-slate-100 overflow-hidden"
            >
              
              {/* MODAL HEADER */}
              <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Create Route Edge Network</h2>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-1">Multi-Step Network Orchestration Wizard</p>
                </div>
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 rounded-xl bg-white border border-slate-100 hover:bg-slate-100 transition-colors font-black text-slate-400 hover:text-slate-800 cursor-pointer"
                >
                  Close
                </button>
              </div>

              {/* WIZARD STEP INDICATOR BAR */}
              <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between text-xs font-black uppercase tracking-wider">
                {[
                  { step: 1, label: "Operator & Fleet" },
                  { step: 2, label: "Path & Stations" },
                  { step: 3, label: "Rates & Pricing" }
                ].map((s) => (
                  <div key={s.step} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border transition-all
                      ${currentStep >= s.step 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                        : 'bg-white text-slate-400 border-slate-200'
                      }`}>
                      {s.step}
                    </div>
                    <span className={currentStep >= s.step ? 'text-slate-950' : 'text-slate-400'}>{s.label}</span>
                    {s.step < 3 && <ChevronRight size={14} className="text-slate-300" />}
                  </div>
                ))}
              </div>

              {/* STEP INTERFACE CONTENT VIEW */}
              <div className="p-8 max-h-[60vh] overflow-y-auto space-y-6">
                
                {/* ── STEP 1: FLEET & MODE SELECTION ── */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-tight mb-3">1. Select Transportation Mode</h3>
                      <div className="grid grid-cols-4 gap-4">
                        {[
                          { id: "BUS", icon: Bus, label: "Deluxe Bus" },
                          { id: "TRAIN", icon: Train, label: "Railway Division" },
                          { id: "FLIGHT", icon: Plane, label: "Air Flight" },
                          { id: "METRO", icon: Navigation, label: "Metro Transit" },
                        ].map((mode) => {
                          const isSel = routeForm.mode === mode.id;
                          return (
                            <div
                              key={mode.id}
                              onClick={() => setRouteForm(prev => ({ ...prev, mode: mode.id as any, vehicleId: "" }))}
                              className={`p-5 rounded-[1.5rem] border text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center
                                ${isSel 
                                  ? 'bg-slate-900 border-slate-900 text-white scale-102 shadow-lg shadow-slate-900/10' 
                                  : 'bg-slate-50 border-slate-100 hover:border-slate-300 text-slate-700'
                                }`}
                            >
                              <mode.icon size={24} className={isSel ? 'text-rose-500' : 'text-slate-500'} />
                              <span className="text-[10px] font-black uppercase tracking-wider mt-3 block">{mode.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* SELECT OPERATOR & FLEET INPUT FIELDS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      
                      {/* OPERATOR FIELD */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">A. Choose Transit Operator</label>
                          <button
                            onClick={() => setShowAddOperator(true)}
                            className="text-xs font-black text-indigo-500 hover:underline border-0 bg-transparent cursor-pointer"
                          >
                            ➕ Add Operator
                          </button>
                        </div>
                        
                        <select
                          value={routeForm.operatorId}
                          onChange={(e) => setRouteForm(prev => ({ ...prev, operatorId: e.target.value }))}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700"
                        >
                          <option value="">-- Choose Operator --</option>
                          {operators.map(op => (
                            <option key={op._id} value={op._id}>{op.name}</option>
                          ))}
                        </select>

                        {/* RUNTIME NESTED POPUP FORM: CREATE NEW OPERATOR */}
                        {showAddOperator && (
                          <div className="p-5 border border-dashed border-indigo-200 bg-indigo-50/20 rounded-2xl space-y-4">
                            <h4 className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">➕ Create Operator Inline</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <input 
                                type="text" 
                                placeholder="Operator Name" 
                                value={newOperatorForm.name}
                                onChange={(e) => setNewOperatorForm(prev => ({ ...prev, name: e.target.value }))}
                                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs" 
                              />
                              <input 
                                type="text" 
                                placeholder="Support Hotline" 
                                value={newOperatorForm.supportNumber}
                                onChange={(e) => setNewOperatorForm(prev => ({ ...prev, supportNumber: e.target.value }))}
                                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs" 
                              />
                              <input 
                                type="email" 
                                placeholder="Business Email" 
                                value={newOperatorForm.supportEmail}
                                onChange={(e) => setNewOperatorForm(prev => ({ ...prev, supportEmail: e.target.value }))}
                                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs" 
                              />
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={handleCreateOperatorInline}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase border-0 cursor-pointer"
                              >
                                Save Operator
                              </button>
                              <button 
                                onClick={() => setShowAddOperator(false)}
                                className="px-4 py-2 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase border-0 cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* VEHICLE FIELD */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">B. Mapped Transit Vehicle</label>
                          <button
                            onClick={() => {
                              if (!routeForm.operatorId) {
                                alert("Please select an operator first!");
                                return;
                              }
                              setNewVehicleForm(prev => ({ ...prev, operatorId: routeForm.operatorId, mode: routeForm.mode }));
                              setShowAddVehicle(true);
                            }}
                            className="text-xs font-black text-indigo-500 hover:underline border-0 bg-transparent cursor-pointer"
                          >
                            ➕ Add Vehicle
                          </button>
                        </div>
                        
                        <select
                          value={routeForm.vehicleId}
                          disabled={!routeForm.operatorId}
                          onChange={(e) => setRouteForm(prev => ({ ...prev, vehicleId: e.target.value }))}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 disabled:opacity-50"
                        >
                          <option value="">-- Choose Vehicle --</option>
                          {vehicles
                            .filter(v => v.operatorId === routeForm.operatorId && v.mode === routeForm.mode)
                            .map(v => (
                              <option key={v._id} value={v._id}>{v.vehicleName} ({v.vehicleNumber})</option>
                          ))}
                        </select>

                        {/* RUNTIME NESTED POPUP FORM: CREATE NEW VEHICLE */}
                        {showAddVehicle && (
                          <div className="p-5 border border-dashed border-indigo-200 bg-indigo-50/20 rounded-2xl space-y-4">
                            <h4 className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">➕ Create Vehicle Inline</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <input 
                                type="text" 
                                placeholder="Vehicle Name" 
                                value={newVehicleForm.vehicleName}
                                onChange={(e) => setNewVehicleForm(prev => ({ ...prev, vehicleName: e.target.value }))}
                                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs" 
                              />
                              <input 
                                type="text" 
                                placeholder="Plate Number" 
                                value={newVehicleForm.vehicleNumber}
                                onChange={(e) => setNewVehicleForm(prev => ({ ...prev, vehicleNumber: e.target.value }))}
                                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs" 
                              />
                              <input 
                                type="number" 
                                placeholder="Capacity Seats" 
                                value={newVehicleForm.capacity || ""}
                                onChange={(e) => setNewVehicleForm(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs" 
                              />
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={handleCreateVehicleInline}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase border-0 cursor-pointer"
                              >
                                Save Vehicle
                              </button>
                              <button 
                                onClick={() => setShowAddVehicle(false)}
                                className="px-4 py-2 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase border-0 cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                )}

                {/* ── STEP 2: PATHWAY & STATIONS SETUP (WITH RUNTIME NODE CREATION) ── */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-tight">2. Select Origin & Destination Hubs</h3>
                      <button
                        onClick={() => setShowAddHub(true)}
                        className="text-xs font-black text-rose-500 hover:underline border-0 bg-transparent cursor-pointer"
                      >
                        ➕ Add New Hub / Station
                      </button>
                    </div>

                    {/* RUNTIME NESTED FORMS: CREATE NEW HUB / LOCATION (CITY) */}
                    {showAddHub && (
                      <div className="p-6 border-2 border-dashed border-rose-200 bg-rose-50/10 rounded-3xl space-y-6">
                        <div className="flex justify-between items-center">
                          <h4 className="text-[10px] font-black uppercase text-rose-500 tracking-wider">➕ Create Transit Hub & Add Location</h4>
                          <button
                            onClick={() => setShowAddLocation(true)}
                            className="text-[10px] font-black text-indigo-600 hover:underline border-0 bg-transparent cursor-pointer"
                          >
                            ➕ Add New City / Region
                          </button>
                        </div>

                        {/* RUNTIME NESTED CITY CREATOR */}
                        {showAddLocation && (
                          <div className="p-4 border border-dashed border-indigo-200 bg-indigo-50/20 rounded-2xl space-y-4">
                            <h5 className="text-[9px] font-black uppercase text-indigo-500 tracking-wider">➕ Create Location City Node</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                              <input 
                                type="text" 
                                placeholder="Location Name" 
                                value={newLocationForm.name}
                                onChange={(e) => setNewLocationForm(prev => ({ ...prev, name: e.target.value }))}
                                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs" 
                              />
                              <input 
                                type="text" 
                                placeholder="City" 
                                value={newLocationForm.city}
                                onChange={(e) => setNewLocationForm(prev => ({ ...prev, city: e.target.value }))}
                                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs" 
                              />
                              <input 
                                type="text" 
                                placeholder="State" 
                                value={newLocationForm.state}
                                onChange={(e) => setNewLocationForm(prev => ({ ...prev, state: e.target.value }))}
                                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs" 
                              />
                              <input 
                                type="text" 
                                placeholder="Country" 
                                value={newLocationForm.country}
                                onChange={(e) => setNewLocationForm(prev => ({ ...prev, country: e.target.value }))}
                                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs" 
                              />
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={handleCreateLocationInline}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase border-0 cursor-pointer"
                              >
                                Save City
                              </button>
                              <button 
                                onClick={() => setShowAddLocation(false)}
                                className="px-4 py-2 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase border-0 cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Station/Hub Name</label>
                            <input 
                              type="text" 
                              placeholder="e.g. Chandigarh ISBT" 
                              value={newHubForm.name}
                              onChange={(e) => setNewHubForm(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Station Type</label>
                            <select
                              value={newHubForm.type}
                              onChange={(e) => setNewHubForm(prev => ({ ...prev, type: e.target.value as any }))}
                              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                            >
                              <option value="BUS_STAND">Bus Stand</option>
                              <option value="RAILWAY_STATION">Railway Station</option>
                              <option value="AIRPORT">Airport</option>
                              <option value="METRO_STATION">Metro Station</option>
                              <option value="TAXI_STAND">Taxi Stand</option>
                              <option value="PICKUP_POINT">Pickup Point</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">City Reference Node</label>
                            <select
                              value={newHubForm.cityId}
                              onChange={(e) => setNewHubForm(prev => ({ ...prev, cityId: e.target.value }))}
                              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                            >
                              <option value="">-- Choose City --</option>
                              {locations.map(l => (
                                <option key={l._id} value={l._id}>{l.name} ({l.state})</option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Full Location Coordinates [Lng, Lat]</label>
                            <div className="grid grid-cols-2 gap-2">
                              <input 
                                type="number" 
                                step="any"
                                placeholder="Longitude (e.g. 77.0)" 
                                value={newHubForm.lng || ""}
                                onChange={(e) => setNewHubForm(prev => ({ ...prev, lng: Number(e.target.value) }))}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                              />
                              <input 
                                type="number" 
                                step="any"
                                placeholder="Latitude (e.g. 31.0)" 
                                value={newHubForm.lat || ""}
                                onChange={(e) => setNewHubForm(prev => ({ ...prev, lat: Number(e.target.value) }))}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                              />
                            </div>
                          </div>

                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Physical Address</label>
                            <input 
                              type="text" 
                              placeholder="Road name, landmark, state, pin" 
                              value={newHubForm.address}
                              onChange={(e) => setNewHubForm(prev => ({ ...prev, address: e.target.value }))}
                              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button 
                            onClick={handleCreateHubInline}
                            className="px-5 py-2.5 bg-rose-500 text-white rounded-xl text-xs font-black uppercase border-0 cursor-pointer"
                          >
                            Save Hub & Select
                          </button>
                          <button 
                            onClick={() => setShowAddHub(false)}
                            className="px-5 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-xs font-black uppercase border-0 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>

                      </div>
                    )}

                    {/* SELECT ROUTE HUB DROPDOWNS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      
                      {/* ORIGIN HUB */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">A. Source Origin Hub</label>
                        <select
                          value={routeForm.sourceHubId}
                          onChange={(e) => setRouteForm(prev => ({ ...prev, sourceHubId: e.target.value }))}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700"
                        >
                          <option value="">-- Choose Origin Hub --</option>
                          {hubs.map(hub => (
                            <option key={hub._id} value={hub._id}>{hub.name} ({getCityNameForHub(hub._id)})</option>
                          ))}
                        </select>
                      </div>

                      {/* DESTINATION HUB */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">B. Destination Hub</label>
                        <select
                          value={routeForm.destinationHubId}
                          onChange={(e) => setRouteForm(prev => ({ ...prev, destinationHubId: e.target.value }))}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700"
                        >
                          <option value="">-- Choose Destination Hub --</option>
                          {hubs
                            .filter(h => h._id !== routeForm.sourceHubId)
                            .map(hub => (
                              <option key={hub._id} value={hub._id}>{hub.name} ({getCityNameForHub(hub._id)})</option>
                          ))}
                        </select>
                      </div>

                    </div>
                  </div>
                )}

                {/* ── STEP 3: METRICS, PRICING & SAVING ── */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-tight">3. Network Metrics & Fares</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">A. Travel Distance (Kilometers)</label>
                        <div className="relative">
                          <Map className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            type="number" 
                            placeholder="Distance e.g. 340"
                            value={routeForm.distanceKm || ""}
                            onChange={(e) => setRouteForm(prev => ({ ...prev, distanceKm: Number(e.target.value) }))}
                            className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">B. Estimated Duration (Minutes)</label>
                        <div className="relative">
                          <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            type="number" 
                            placeholder="Duration e.g. 480"
                            value={routeForm.durationMin || ""}
                            onChange={(e) => setRouteForm(prev => ({ ...prev, durationMin: Number(e.target.value) }))}
                            className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">C. Base Base Price (INR)</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            type="number" 
                            placeholder="Fare e.g. 950"
                            value={routeForm.basePrice || ""}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setRouteForm(prev => ({ ...prev, basePrice: val, currentPrice: prev.currentPrice || val }));
                            }}
                            className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">D. Current Running Fare (INR)</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            type="number" 
                            placeholder="Fare e.g. 1200"
                            value={routeForm.currentPrice || ""}
                            onChange={(e) => setRouteForm(prev => ({ ...prev, currentPrice: Number(e.target.value) }))}
                            className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-3">
                        <input
                          type="checkbox"
                          id="routeActive"
                          checked={routeForm.active}
                          onChange={(e) => setRouteForm(prev => ({ ...prev, active: e.target.checked }))}
                          className="w-5 h-5 accent-indigo-600 rounded border-slate-300"
                        />
                        <label htmlFor="routeActive" className="text-xs font-bold text-slate-700 uppercase tracking-wide cursor-pointer">
                          Publish Route Active Instantly
                        </label>
                      </div>

                    </div>
                  </div>
                )}

              </div>

              {/* MODAL WIZARD CONTROLS FOOTER */}
              <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <button
                  onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed border-0 cursor-pointer transition-all"
                >
                  <ArrowLeft size={14} /> Back
                </button>

                {currentStep < 3 ? (
                  <button
                    onClick={() => {
                      if (currentStep === 1 && (!routeForm.operatorId || !routeForm.vehicleId)) {
                        alert("Please select both an Operator and Fleet Vehicle!");
                        return;
                      }
                      if (currentStep === 2 && (!routeForm.sourceHubId || !routeForm.destinationHubId)) {
                        alert("Please specify both Origin and Destination Hubs!");
                        return;
                      }
                      setCurrentStep(prev => prev + 1);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-rose-500 border-0 cursor-pointer transition-all"
                  >
                    Next <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitRoute}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 border-0 cursor-pointer transition-all"
                  >
                    Deploy Route Edge <CheckCircle2 size={14} />
                  </button>
                )}
              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* ── DEFINE VEHICLE SCHEDULE TIMING MODAL ── */}
      <AnimatePresence>
        {isScheduleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
            >
              {/* MODAL HEADER */}
              <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Clock className="text-indigo-600 animate-pulse" size={22} />
                  <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">Define Schedule Timing</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Configure dynamic fleet scheduling</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-200/50 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors border-0 cursor-pointer flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>

              {/* MODAL CONTENT FORM */}
              <form onSubmit={handleSubmitSchedule} className="p-8 space-y-5 overflow-y-auto max-h-[70vh] no-scrollbar">
                
                {/* 1. SELECT ACTIVE TRANSIT ROUTE */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">A. Select Transit Route Link</label>
                  <select
                    required
                    value={scheduleForm.routeId}
                    onChange={(e) => {
                      const val = e.target.value;
                      const matchedRoute = routes.find(r => r._id === val);
                      setScheduleForm(prev => ({
                        ...prev,
                        routeId: val,
                        price: matchedRoute ? matchedRoute.currentPrice : prev.price
                      }));
                    }}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none cursor-pointer"
                  >
                    <option value="">Select an active intercity route...</option>
                    {routes.map(r => (
                      <option key={r._id} value={r._id}>
                        {getHubName(r.sourceHubId)} ➔ {getHubName(r.destinationHubId)} ({r.mode} | {getOperatorName(r.operatorId)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. TIMINGS (DEPARTURE & ARRIVAL) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">B. Departure Timestamp</label>
                    <input
                      required
                      type="datetime-local"
                      value={scheduleForm.departureTime}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, departureTime: e.target.value }))}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">C. Arrival Timestamp</label>
                    <input
                      required
                      type="datetime-local"
                      value={scheduleForm.arrivalTime}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, arrivalTime: e.target.value }))}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none"
                    />
                  </div>
                </div>

                {/* 3. CAPACITIES (TOTAL & AVAILABLE) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">D. Seating Capacity (Total)</label>
                    <input
                      required
                      type="number"
                      min={1}
                      value={scheduleForm.totalSeats}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setScheduleForm(prev => ({ ...prev, totalSeats: val, availableSeats: val }));
                      }}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E. Special Ticket Fare (INR)</label>
                    <input
                      required
                      type="number"
                      min={0}
                      value={scheduleForm.price}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none"
                    />
                  </div>
                </div>

                {/* MODAL FOOTER */}
                <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsScheduleModalOpen(false)}
                    className="px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-500 border-0 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider border-0 cursor-pointer shadow-lg shadow-indigo-100 transition-colors"
                  >
                    Deploy Schedule
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
