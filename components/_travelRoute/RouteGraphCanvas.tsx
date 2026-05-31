"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Plus, Search, Navigation, Bus, Train, Plane, 
  MapPin, HelpCircle, X, Check, ShieldAlert,
  ArrowRight, ShieldCheck, ZoomIn, ZoomOut, RotateCcw,
  Sparkles, Compass, AlertCircle, Eye, Footprints,
  Car, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useTravelRoute from '@/hooks/useTravelRoute';

// ── Types ──
export interface Location {
  _id: string;
  name: string;
  country: string;
  state: string;
  city: string;
}

export interface Hub {
  _id: string;
  name: string;
  type: "BUS_STAND" | "RAILWAY_STATION" | "AIRPORT" | "METRO_STATION" | "TAXI_STAND" | "PICKUP_POINT" | "CUSTOM_HUB";
  address: string;
  cityId: string;
  coordinates: [number, number]; // [lng, lat]
}

export interface Operator {
  _id: string;
  name: string;
  logo?: string;
  supportNumber: string;
  supportEmail: string;
}

export interface Vehicle {
  _id: string;
  operatorId: string;
  vehicleNumber: string;
  vehicleName: string;
  mode: "BUS" | "TRAIN" | "FLIGHT" | "METRO" | "CAB" | "AUTO";
  capacity: number;
}

export interface Route {
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

export interface Transfer {
  _id: string;
  cityId: string;
  sourceHubId: string;
  destinationHubId: string;
  transferMode: "WALK" | "AUTO" | "CAB" | "METRO" | "SHUTTLE";
  distanceKm: number;
  durationMin: number;
  estimatedCost: number;
}

export interface Schedule {
  _id: string;
  routeId: string;
  departureTime: string;
  arrivalTime: string;
  totalSeats?: number;
  availableSeats?: number;
  price?: number;
  createdAt?: string;
}

interface RouteGraphCanvasProps {
  locations: Location[];
  hubs: Hub[];
  operators: Operator[];
  vehicles: Vehicle[];
  routes: Route[];
  transfers: Transfer[];
}

export default function RouteGraphCanvas({
  locations,
  hubs,
  operators,
  vehicles,
  routes,
  transfers
}: RouteGraphCanvasProps) {

  const {
    createCity,
    createHub,
    createOperator,
    createVehicle,
    createRoute,
    createTransfer
  } = useTravelRoute();

  // ── Panning & Zooming Canvas States ──
  const [pan, setPan] = useState({ x: 100, y: 50 });
  const [zoom, setZoom] = useState(1);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // ── Selected Node or Edge Panel ──
  const [selectedHub, setSelectedHub] = useState<Hub | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<{ sourceId: string; destId: string; routes: Route[] } | null>(null);
  const [selectedTransferEdge, setSelectedTransferEdge] = useState<{ sourceId: string; destId: string; transfers: Transfer[] } | null>(null);

  // ── Drag to Connect State ──
  const [connectingSource, setConnectingSource] = useState<Hub | null>(null);
  const [currentMousePos, setCurrentMousePos] = useState({ x: 0, y: 0 });
  
  // ── Search & Filter State ──
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const [highlightedEdges, setHighlightedEdges] = useState<string[]>([]);

  // ── On-the-fly Creators Drawer States ──
  const [activeDrawer, setActiveDrawer] = useState<'NONE' | 'CITY' | 'HUB' | 'OPERATOR' | 'VEHICLE' | 'ROUTE' | 'TRANSFER'>('NONE');

  // ── Forms States ──
  const [cityForm, setCityForm] = useState({ name: "", city: "", state: "", country: "India" });
  const [hubForm, setHubForm] = useState({ name: "", type: "BUS_STAND" as Hub['type'], address: "", cityId: "", lng: 77.0, lat: 31.0 });
  const [operatorForm, setOperatorForm] = useState({ name: "", supportNumber: "", supportEmail: "" });
  const [vehicleForm, setVehicleForm] = useState({ operatorId: "", vehicleName: "", vehicleNumber: "", mode: "BUS" as Vehicle['mode'], capacity: 40 });
  const [routeForm, setRouteForm] = useState({
    mode: "BUS" as Route['mode'],
    operatorId: "",
    vehicleId: "",
    sourceHubId: "",
    destinationHubId: "",
    distanceKm: 150,
    durationMin: 180,
    basePrice: 500,
    currentPrice: 650,
    active: true
  });
  const [transferForm, setTransferForm] = useState({
    cityId: "",
    sourceHubId: "",
    destinationHubId: "",
    transferMode: "WALK" as Transfer['transferMode'],
    distanceKm: 2,
    durationMin: 15,
    estimatedCost: 50
  });

  const svgRef = useRef<SVGSVGElement>(null);
  const touchStartDistRef = useRef<number | null>(null);
  const touchStartZoomRef = useRef<number>(1);
  const getHubName = (id: string) => hubs.find(h => h._id === id)?.name || "Unknown Station";

  // ── GEOSPATIAL PROJECTION ENGINE ──
  const nodePositions = useMemo(() => {
    if (hubs.length === 0) return {};

    // Boundaries of our Himalayan network
    const minLng = 76.5;
    const maxLng = 77.5;
    const minLat = 28.3;
    const maxLat = 32.5;

    const canvasWidth = 1100;
    const canvasHeight = 700;
    const padding = 120;

    const positions: { [hubId: string]: { x: number; y: number } } = {};

    hubs.forEach(hub => {
      const lng = hub.coordinates[0];
      const lat = hub.coordinates[1];

      // Interpolate coordinates linearly
      const x = padding + ((lng - minLng) / (maxLng - minLng)) * (canvasWidth - padding * 2);
      const y = padding + ((maxLat - lat) / (maxLat - minLat)) * (canvasHeight - padding * 2);

      positions[hub._id] = { x, y };
    });

    return positions;
  }, [hubs]);

  // Compute boundaries for city cluster containers
  const cityClusters = useMemo(() => {
    const clusters: { [cityId: string]: { name: string; x: number; y: number; r: number; hubIds: string[] } } = {};

    locations.forEach(loc => {
      const cityHubs = hubs.filter(h => h.cityId === loc._id);
      if (cityHubs.length === 0) return;

      let sumX = 0;
      let sumY = 0;
      let count = 0;

      cityHubs.forEach(h => {
        const pos = nodePositions[h._id];
        if (pos) {
          sumX += pos.x;
          sumY += pos.y;
          count++;
        }
      });

      if (count > 0) {
        const centerX = sumX / count;
        const centerY = sumY / count;

        let maxDist = 45;
        cityHubs.forEach(h => {
          const pos = nodePositions[h._id];
          if (pos) {
            const dist = Math.hypot(pos.x - centerX, pos.y - centerY);
            if (dist > maxDist) maxDist = dist;
          }
        });

        clusters[loc._id] = {
          name: loc.name,
          x: centerX,
          y: centerY,
          r: maxDist + 45,
          hubIds: cityHubs.map(h => h._id)
        };
      }
    });

    return clusters;
  }, [locations, hubs, nodePositions]);

  // Compute aggregated Intercity Route paths connecting hubs
  const edgeConnections = useMemo(() => {
    const edges: { [key: string]: { sourceId: string; destId: string; routes: Route[] } } = {};

    routes.forEach(route => {
      const key = `${route.sourceHubId}->${route.destinationHubId}`;
      if (!edges[key]) {
        edges[key] = {
          sourceId: route.sourceHubId,
          destId: route.destinationHubId,
          routes: []
        };
      }
      edges[key].routes.push(route);
    });

    return Object.values(edges);
  }, [routes]);

  // Compute aggregated In-city Local Transfer paths connecting hubs
  const transferEdgeConnections = useMemo(() => {
    const edges: { [key: string]: { sourceId: string; destId: string; transfers: Transfer[] } } = {};

    transfers.forEach(trans => {
      const key = `${trans.sourceHubId}->${trans.destinationHubId}`;
      if (!edges[key]) {
        edges[key] = {
          sourceId: trans.sourceHubId,
          destId: trans.destinationHubId,
          transfers: []
        };
      }
      edges[key].transfers.push(trans);
    });

    return Object.values(edges);
  }, [transfers]);

  // ── MOUSE CANVAS ACTIONS (PAN & ZOOM) ──
  const handleMouseDown = (e: React.MouseEvent) => {
    if (connectingSource) return;
    setIsDraggingCanvas(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingCanvas) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }

    if (connectingSource && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const localX = (e.clientX - rect.left - pan.x) / zoom;
      const localY = (e.clientY - rect.top - pan.y) / zoom;
      setCurrentMousePos({ x: localX, y: localY });
    }
  };

  const handleMouseUp = () => {
    setIsDraggingCanvas(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const scale = e.deltaY < 0 ? 1.05 : 0.95;
    setZoom(z => Math.max(0.3, Math.min(3, z * scale)));
  };

  const handleZoomIn = () => setZoom(z => Math.min(3, z + 0.15));
  const handleZoomOut = () => setZoom(z => Math.max(0.3, z - 0.15));
  const handleResetPan = () => { setPan({ x: 100, y: 50 }); setZoom(1); setFocusedNodeId(null); setHighlightedEdges([]); };

  // ── TOUCH CANVAS ACTIONS (PINCH & PAN) ──
  const handleTouchStart = (e: React.TouchEvent) => {
    if (connectingSource) return;
    if (e.touches.length === 1) {
      setIsDraggingCanvas(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
      touchStartDistRef.current = null;
    } else if (e.touches.length === 2) {
      setIsDraggingCanvas(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartDistRef.current = dist;
      touchStartZoomRef.current = zoom;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDraggingCanvas && e.touches.length === 1) {
      const touch = e.touches[0];
      setPan({ x: touch.clientX - dragStart.x, y: touch.clientY - dragStart.y });
    } else if (e.touches.length === 2 && touchStartDistRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / touchStartDistRef.current;
      const newZoom = Math.max(0.3, Math.min(3, touchStartZoomRef.current * factor));
      setZoom(newZoom);
    }
  };

  const handleTouchEnd = () => {
    setIsDraggingCanvas(false);
    touchStartDistRef.current = null;
  };

  // ── DRAG-TO-CONNECT DUAL DISPATCHER (ROUTES vs TRANSFERS) ──
  const handleStartConnection = (e: React.MouseEvent, hub: Hub) => {
    e.stopPropagation();
    setConnectingSource(hub);
    const pos = nodePositions[hub._id] || { x: 0, y: 0 };
    setCurrentMousePos(pos);
  };

  const handleEndConnection = (hub: Hub) => {
    if (!connectingSource || connectingSource._id === hub._id) return;
    
    // Check if hubs are in the same city cluster
    const isInCity = connectingSource.cityId === hub.cityId;

    if (isInCity) {
      // ➔ Launch IN-CITY TRANSFER form
      setTransferForm(prev => ({
        ...prev,
        cityId: hub.cityId,
        sourceHubId: connectingSource._id,
        destinationHubId: hub._id,
        transferMode: "WALK",
        distanceKm: 2,
        durationMin: 15,
        estimatedCost: 50
      }));
      setActiveDrawer('TRANSFER');
    } else {
      // ➔ Launch INTERCITY ROUTE form
      setRouteForm(prev => ({
        ...prev,
        sourceHubId: connectingSource._id,
        destinationHubId: hub._id,
        mode: "BUS"
      }));
      setActiveDrawer('ROUTE');
    }
    
    setConnectingSource(null);
  };

  // ── SEARCH FOCUS ENGINE ──
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

    const q = searchQuery.toLowerCase();
    
    // Clear previous highlights
    setHighlightedEdges([]);

    // 1. Search City Clusters
    const matchedCity = locations.find(l => l.name.toLowerCase().includes(q));
    if (matchedCity) {
      const cluster = cityClusters[matchedCity._id];
      if (cluster) {
        setFocusedNodeId(matchedCity._id);
        setSelectedHub(null);
        setSelectedEdge(null);
        setSelectedTransferEdge(null);
        setPan({
          x: window.innerWidth / 2 - cluster.x * zoom,
          y: window.innerHeight / 2 - cluster.y * zoom
        });
        return;
      }
    }

    // 2. Search Hubs
    const matchedHub = hubs.find(h => h.name.toLowerCase().includes(q));
    if (matchedHub) {
      setFocusedNodeId(matchedHub._id);
      setSelectedHub(matchedHub);
      setSelectedEdge(null);
      setSelectedTransferEdge(null);
      const pos = nodePositions[matchedHub._id];
      if (pos) {
        setPan({
          x: window.innerWidth / 2 - pos.x * zoom,
          y: window.innerHeight / 2 - pos.y * zoom
        });
      }
      return;
    }

    // 3. Search Intercity Routes (by Operator, Vehicle, or Travel Mode)
    const matchedRoutes = routes.filter(r => {
      const opName = getOpName(r.operatorId).toLowerCase();
      const vehName = getVehName(r.vehicleId).toLowerCase();
      const modeName = r.mode.toLowerCase();
      return opName.includes(q) || vehName.includes(q) || modeName.includes(q);
    });

    // 4. Search In-City Transfers (by Mode of Travel)
    const matchedTransfers = transfers.filter(t => {
      const modeName = t.transferMode.toLowerCase();
      return modeName.includes(q);
    });

    if (matchedRoutes.length > 0 || matchedTransfers.length > 0) {
      // Highlight ALL matching edges in one color
      const keysToHighlight: string[] = [];
      matchedRoutes.forEach(r => {
        keysToHighlight.push(`${r.sourceHubId}->${r.destinationHubId}`);
      });
      matchedTransfers.forEach(t => {
        keysToHighlight.push(`${t.sourceHubId}->${t.destinationHubId}`);
      });
      setHighlightedEdges(keysToHighlight);

      // Open first matched model
      if (matchedRoutes.length > 0) {
        const firstRoute = matchedRoutes[0];
        const edge = edgeConnections.find(e => e.sourceId === firstRoute.sourceHubId && e.destId === firstRoute.destinationHubId);
        if (edge) {
          setSelectedEdge(edge);
          setSelectedTransferEdge(null);
          setSelectedHub(null);
          const posSrc = nodePositions[edge.sourceId];
          const posDest = nodePositions[edge.destId];
          if (posSrc && posDest) {
            const midX = (posSrc.x + posDest.x) / 2;
            const midY = (posSrc.y + posDest.y) / 2;
            setPan({
              x: window.innerWidth / 2 - midX * zoom,
              y: window.innerHeight / 2 - midY * zoom
            });
          }
        }
      } else if (matchedTransfers.length > 0) {
        const firstTransfer = matchedTransfers[0];
        const edge = transferEdgeConnections.find(e => e.sourceId === firstTransfer.sourceHubId && e.destId === firstTransfer.destinationHubId);
        if (edge) {
          setSelectedTransferEdge(edge);
          setSelectedEdge(null);
          setSelectedHub(null);
          const posSrc = nodePositions[edge.sourceId];
          const posDest = nodePositions[edge.destId];
          if (posSrc && posDest) {
            const midX = (posSrc.x + posDest.x) / 2;
            const midY = (posSrc.y + posDest.y) / 2;
            setPan({
              x: window.innerWidth / 2 - midX * zoom,
              y: window.innerHeight / 2 - midY * zoom
            });
          }
        }
      }
      return;
    }
  };

  // ── ON-THE-FLY CREATIONS ──
  const handleCreateCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityForm.name || !cityForm.city) return;

    const payload = {
      name: cityForm.name,
      country: cityForm.country || "India",
      state: cityForm.state || "Himachal Pradesh",
      city: cityForm.city,
      address: `${cityForm.city}, ${cityForm.state || "Himachal Pradesh"}, India`,
      locationCoordinates: {
        type: "Point",
        coordinates: [77.1734, 31.1048]
      },
      altitude: 1500,
      timezone: "Asia/Kolkata",
      description: `Transit cluster region for ${cityForm.city}.`
    };

    createCity(payload, {
      onSuccess: (res: any) => {
        const newCityId = res.data?._id || res.data?.id;
        setHubForm(prev => ({ ...prev, cityId: newCityId }));
        setCityForm({ name: "", city: "", state: "", country: "India" });
        setActiveDrawer('HUB');
      }
    });
  };

  const handleCreateHub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hubForm.name || !hubForm.cityId) return;

    const payload = {
      cityId: hubForm.cityId,
      name: hubForm.name,
      type: hubForm.type,
      address: hubForm.address || `${hubForm.name}, Cluster Region`,
      coordinates: [hubForm.lng || 77.0, hubForm.lat || 31.0]
    };

    createHub(payload, {
      onSuccess: () => {
        setHubForm({ name: "", type: "BUS_STAND", address: "", cityId: "", lng: 77.0, lat: 31.0 });
        setActiveDrawer('NONE');
      }
    });
  };

  const handleCreateOperator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!operatorForm.name) return;

    const payload = {
      name: operatorForm.name,
      supportNumber: operatorForm.supportNumber || "+91 9999999999",
      supportEmail: operatorForm.supportEmail || "support@operator.com"
    };

    createOperator(payload, {
      onSuccess: (res: any) => {
        const opId = res.data?._id || res.data?.id;
        setRouteForm(prev => ({ ...prev, operatorId: opId }));
        setOperatorForm({ name: "", supportNumber: "", supportEmail: "" });
        setActiveDrawer('ROUTE');
      }
    });
  };

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleForm.vehicleName || !vehicleForm.operatorId) return;

    const payload = {
      operatorId: vehicleForm.operatorId,
      vehicleNumber: vehicleForm.vehicleNumber || "HP-00-Temp",
      vehicleName: vehicleForm.vehicleName,
      mode: vehicleForm.mode,
      capacity: vehicleForm.capacity || 40
    };

    createVehicle(payload, {
      onSuccess: (res: any) => {
        const vehId = res.data?._id || res.data?.id;
        setRouteForm(prev => ({ ...prev, vehicleId: vehId }));
        setVehicleForm({ operatorId: "", vehicleName: "", vehicleNumber: "", mode: "BUS", capacity: 40 });
        setActiveDrawer('ROUTE');
      }
    });
  };

  const handleCreateRoute = (e: React.FormEvent) => {
    e.preventDefault();
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
          distanceKm: 150,
          durationMin: 180,
          basePrice: 500,
          currentPrice: 650,
          active: true
        });
        setActiveDrawer('NONE');
      }
    });
  };

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferForm.sourceHubId || !transferForm.destinationHubId || !transferForm.cityId) return;

    const payload = {
      cityId: transferForm.cityId,
      sourceHubId: transferForm.sourceHubId,
      destinationHubId: transferForm.destinationHubId,
      transferMode: transferForm.transferMode,
      distanceKm: Number(transferForm.distanceKm) || 2,
      durationMin: Number(transferForm.durationMin) || 15,
      estimatedCost: Number(transferForm.estimatedCost) || 50
    };

    createTransfer(payload, {
      onSuccess: () => {
        setTransferForm({
          cityId: "",
          sourceHubId: "",
          destinationHubId: "",
          transferMode: "WALK",
          distanceKm: 2,
          durationMin: 15,
          estimatedCost: 50
        });
        setActiveDrawer('NONE');
      }
    });
  };

  // Helper resolvers
  const getCityName = (id: string) => locations.find(l => l._id === id)?.name || "Unknown City";
  const getOpName = (id: string) => operators.find(o => o._id === id)?.name || "Private Transit";
  const getVehName = (id: string) => vehicles.find(v => v._id === id)?.vehicleName || "Fleet Bus";

  return (
    <div className="relative w-full h-[600px] md:h-[750px] bg-slate-950 rounded-[3rem] overflow-hidden shadow-2xl border border-slate-900 font-sans text-white">
      
      {/* ── CANVAS VIEWPORT INSTRUCTIONS OVERLAY ── */}
      <div className="absolute top-6 left-6 z-20 pointer-events-none space-y-2">
        <div className="flex items-center gap-2.5 bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/5 shadow-lg">
          <Compass className="text-indigo-400 animate-spin duration-[8000ms]" size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Geospatial Mind Map Studio</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[9px] font-bold text-cyan-400 uppercase">
            <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" /> Solid Edge: Intercity Route
          </span>
          <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase">
            <span className="w-2.5 h-0.5 border-t border-dashed border-slate-400 inline-block" /> Dashed Edge: In-City Transfer
          </span>
        </div>
      </div>

      {/* ── TOP CONTROL BAR OVERLAYS ── */}
      <div className="absolute top-6 right-6 z-20 flex flex-wrap items-center gap-3">
        
        {/* GRAPH VIEWPORT ZOOM & RE-CENTER PANEL */}
        <div className="flex bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-white/5 shadow-xl">
          <button 
            onClick={handleZoomIn} 
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all border-0 bg-transparent cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <button 
            onClick={handleZoomOut} 
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all border-0 bg-transparent cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <button 
            onClick={handleResetPan} 
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all border-0 bg-transparent cursor-pointer"
            title="Reset Pan"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* FLOATING ACTION CANVAS TOOLBAR */}
        <div className="flex bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-white/5 shadow-xl gap-1">
          <button 
            onClick={() => setActiveDrawer('CITY')}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border-0 cursor-pointer text-white"
          >
            <Plus size={12} /> City
          </button>
          <button 
            onClick={() => setActiveDrawer('HUB')}
            className="flex items-center gap-1.5 px-3 py-2 bg-rose-500 hover:bg-rose-600 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border-0 cursor-pointer text-white"
          >
            <Plus size={12} /> Hub
          </button>
          <button 
            onClick={() => setActiveDrawer('TRANSFER')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border-0 cursor-pointer text-white"
          >
            <Plus size={12} /> Transfer
          </button>
          <button 
            onClick={() => setActiveDrawer('ROUTE')}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border-0 cursor-pointer text-white"
          >
            <Plus size={12} /> Route
          </button>
        </div>

        {/* SEARCH FOCUS ENGINE OVERLAY */}
        <form onSubmit={handleSearchSubmit} className="relative w-48 sm:w-60 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/5 shadow-xl overflow-hidden px-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          <input
            type="text"
            placeholder="Search City or Hub..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (!e.target.value) {
                setHighlightedEdges([]);
              }
            }}
            className="w-full pl-10 pr-4 py-3 bg-transparent text-xs font-bold focus:outline-none placeholder:text-slate-500 border-0"
          />
        </form>

      </div>

      {/* ── INTERACTIVE GRAPH SVG WINDOW ── */}
      <svg
        ref={svgRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => {
          setSelectedHub(null);
          setSelectedEdge(null);
          setSelectedTransferEdge(null);
          setHighlightedEdges([]);
        }}
        className="w-full h-full bg-slate-950 select-none cursor-grab active:cursor-grabbing overflow-hidden"
      >
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
          </marker>
          <marker id="arrow-active" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
          </marker>
          <marker id="arrow-transfer" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
          </marker>
          <marker id="arrow-transfer-active" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#fb7185" />
          </marker>
        </defs>

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} className="transition-transform duration-75">
          
          {/* 1. DRAW CITY CLUSTER BOUNDARIES */}
          {Object.entries(cityClusters).map(([cityId, cluster]) => {
            const isFocused = focusedNodeId === cityId;
            return (
              <g key={cityId} className="group">
                <circle
                  cx={cluster.x}
                  cy={cluster.y}
                  r={cluster.r}
                  fill="rgba(30, 41, 59, 0.05)"
                  stroke={isFocused ? "#eab308" : "rgba(255, 255, 255, 0.04)"}
                  strokeWidth={isFocused ? 3 : 1}
                  strokeDasharray="6,6"
                  className="transition-all duration-500"
                />
                
                {/* City Center Cluster Label */}
                <g transform={`translate(${cluster.x}, ${cluster.y - cluster.r + 20})`}>
                  <rect
                    x={-60}
                    y={-12}
                    width={120}
                    height={24}
                    rx={12}
                    fill="rgba(15, 23, 42, 0.85)"
                    stroke="rgba(255,255,255,0.05)"
                    className="backdrop-blur-sm"
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#94a3b8"
                    className="text-[10px] font-black uppercase tracking-widest select-none"
                  >
                    {cluster.name} Cluster
                  </text>
                </g>
              </g>
            );
          })}

          {/* 2. DRAW IN-CITY LOCAL TRANSFERS (DASHED CURVES) */}
          {transferEdgeConnections.map((edge, idx) => {
            const posSrc = nodePositions[edge.sourceId];
            const posDest = nodePositions[edge.destId];

            if (!posSrc || !posDest) return null;

            const isSelected = selectedTransferEdge?.sourceId === edge.sourceId && selectedTransferEdge?.destId === edge.destId;
            const isHighlighted = highlightedEdges.includes(`${edge.sourceId}->${edge.destId}`);
            
            const dx = posDest.x - posSrc.x;
            const dy = posDest.y - posSrc.y;
            const dist = Math.hypot(dx, dy);
            
            const nx = -dy / dist;
            const ny = dx / dist;

            const curvature = 20; // Soft local curve
            const midX = (posSrc.x + posDest.x) / 2 + nx * curvature;
            const midY = (posSrc.y + posDest.y) / 2 + ny * curvature;

            const pathD = `M ${posSrc.x} ${posSrc.y} Q ${midX} ${midY} ${posDest.x} ${posDest.y}`;

            return (
              <g 
                key={`trans-${idx}`} 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTransferEdge(edge);
                  setSelectedEdge(null);
                  setSelectedHub(null);
                }}
                className="cursor-pointer group"
              >
                <path d={pathD} fill="none" stroke="transparent" strokeWidth={15} />

                {/* Dashed edge representing internal transfers */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isSelected ? "#fb7185" : (isHighlighted ? "#eab308" : "#475569")}
                  strokeWidth={isSelected || isHighlighted ? 2.5 : 1.5}
                  strokeDasharray="4,4"
                  markerEnd={isSelected ? "url(#arrow-transfer-active)" : "url(#arrow-transfer)"}
                  className="transition-all duration-300 group-hover:stroke-rose-400"
                />

                {/* Transfer badge details */}
                <g transform={`translate(${midX}, ${midY})`}>
                  <circle
                    r={9}
                    fill={isSelected ? "#fb7185" : (isHighlighted ? "#eab308" : "#334155")}
                    stroke="rgba(255,255,255,0.05)"
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#fff"
                    className="text-[8px] font-black"
                  >
                    ⇆
                  </text>
                </g>
              </g>
            );
          })}

          {/* 3. DRAW INTERCITY ROUTE EDGES (SOLID GLOW CURVES) */}
          {edgeConnections.map((edge, idx) => {
            const posSrc = nodePositions[edge.sourceId];
            const posDest = nodePositions[edge.destId];

            if (!posSrc || !posDest) return null;

            const isSelected = selectedEdge?.sourceId === edge.sourceId && selectedEdge?.destId === edge.destId;
            const isHighlighted = highlightedEdges.includes(`${edge.sourceId}->${edge.destId}`);
            
            const dx = posDest.x - posSrc.x;
            const dy = posDest.y - posSrc.y;
            const dist = Math.hypot(dx, dy);
            
            const nx = -dy / dist;
            const ny = dx / dist;

            const curvature = 35; 
            const midX = (posSrc.x + posDest.x) / 2 + nx * curvature;
            const midY = (posSrc.y + posDest.y) / 2 + ny * curvature;

            const pathD = `M ${posSrc.x} ${posSrc.y} Q ${midX} ${midY} ${posDest.x} ${posDest.y}`;

            return (
              <g 
                key={`edge-${idx}`} 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEdge(edge);
                  setSelectedTransferEdge(null);
                  setSelectedHub(null);
                }}
                className="cursor-pointer group"
              >
                <path d={pathD} fill="none" stroke="transparent" strokeWidth={20} />

                {/* Main solid route edge */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isSelected ? "#06b6d4" : (isHighlighted ? "#eab308" : "#1e293b")}
                  strokeWidth={isSelected || isHighlighted ? 3.5 : 2}
                  markerEnd={isSelected ? "url(#arrow-active)" : "url(#arrow)"}
                  className="transition-all duration-300 group-hover:stroke-indigo-400 group-hover:stroke-[2.5px]"
                />

                <path
                  d={pathD}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth={isSelected ? 1.5 : 1}
                  strokeDasharray="4,8"
                  className="animate-transit-flow"
                  style={{ animation: 'transitFlow 1.5s linear infinite' }}
                />

                {/* Price indicator badge */}
                <g transform={`translate(${midX}, ${midY})`}>
                  <rect
                    x={-28}
                    y={-10}
                    width={56}
                    height={20}
                    rx={6}
                    fill={isSelected ? "#06b6d4" : (isHighlighted ? "#eab308" : "#1e293b")}
                    stroke="rgba(255,255,255,0.05)"
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#fff"
                    className="text-[9px] font-black tracking-wider"
                  >
                    ₹{Math.min(...edge.routes.map(r => r.currentPrice))}
                  </text>
                </g>
              </g>
            );
          })}

          {/* 4. DRAW DYNAMIC CONNECTION WIRE DRAG */}
          {connectingSource && (
            <g>
              <line
                x1={nodePositions[connectingSource._id]?.x}
                y1={nodePositions[connectingSource._id]?.y}
                x2={currentMousePos.x}
                y2={currentMousePos.y}
                stroke="#6366f1"
                strokeWidth={2}
                strokeDasharray="5,5"
              />
              <circle cx={currentMousePos.x} cy={currentMousePos.y} r={6} fill="#6366f1" />
            </g>
          )}

          {/* 5. DRAW HUB STATION NODES */}
          {hubs.map((hub) => {
            const pos = nodePositions[hub._id];
            if (!pos) return null;

            const isSelected = selectedHub?._id === hub._id;
            const isFocused = focusedNodeId === hub._id;

            const getNodeColor = () => {
              if (hub.type === 'AIRPORT') return '#f43f5e'; 
              if (hub.type === 'RAILWAY_STATION') return '#f97316'; 
              if (hub.type === 'BUS_STAND') return '#3b82f6'; 
              return '#10b981'; 
            };

            return (
              <g
                key={hub._id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (connectingSource) {
                    handleEndConnection(hub);
                  } else {
                    setSelectedHub(hub);
                    setSelectedEdge(null);
                    setSelectedTransferEdge(null);
                  }
                }}
                className="cursor-pointer"
              >
                {(isSelected || isFocused) && (
                  <circle
                    r={24}
                    fill="none"
                    stroke="#eab308"
                    strokeWidth={2}
                    className="animate-ping"
                    style={{ animationDuration: '3s' }}
                  />
                )}

                {/* Circular station boundary */}
                <circle
                  r={15}
                  fill="#020617"
                  stroke={isSelected ? "#eab308" : getNodeColor()}
                  strokeWidth={2.5}
                  className="transition-all duration-300 hover:scale-115"
                />

                {/* Icons */}
                <g transform="translate(-7, -7)">
                  {hub.type === 'AIRPORT' && <Plane size={14} className="text-white" />}
                  {hub.type === 'RAILWAY_STATION' && <Train size={14} className="text-white" />}
                  {hub.type === 'BUS_STAND' && <Bus size={14} className="text-white" />}
                  {hub.type !== 'AIRPORT' && hub.type !== 'RAILWAY_STATION' && hub.type !== 'BUS_STAND' && (
                    <MapPin size={14} className="text-white" />
                  )}
                </g>

                {/* Drag Anchor Trigger */}
                <circle
                  cx={0}
                  cy={-14}
                  r={5}
                  fill="#334155"
                  stroke="#fff"
                  strokeWidth={1}
                  className="opacity-0 hover:opacity-100 hover:fill-indigo-500 hover:scale-120 transition-all"
                  onMouseDown={(e) => handleStartConnection(e, hub)}
                />

                <text
                  x={0}
                  y={25}
                  textAnchor="middle"
                  fill={isSelected ? "#eab308" : "#e2e8f0"}
                  className="text-[9px] font-black tracking-wide bg-slate-950 px-1 py-0.5 rounded shadow select-none"
                >
                  {hub.name}
                </text>
              </g>
            );
          })}

        </g>
      </svg>

      {/* ── STYLE KEYFRAMES ── */}
      <style jsx global>{`
        @keyframes transitFlow {
          to {
            stroke-dashoffset: -12;
          }
        }
        .animate-transit-flow {
          animation: transitFlow 1.2s linear infinite;
        }
      `}</style>

      {/* ── DETAIL PANELS OVERLAYS ── */}
      <AnimatePresence>
        {/* HUB DETAIL PANEL */}
        {selectedHub && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="absolute bottom-6 left-6 right-6 md:right-auto md:w-96 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl z-30"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 font-black text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-lg">
                  {selectedHub.type.split('_').join(' ')}
                </span>
                <h3 className="text-lg font-black text-white mt-1.5">{selectedHub.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                  🏙️ Cluster City: {getCityName(selectedHub.cityId)}
                </p>
              </div>
              <button onClick={() => setSelectedHub(null)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 border-0 bg-transparent cursor-pointer">
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950/60 rounded-2xl border border-white/5 space-y-1">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Station Address</span>
                <p className="text-slate-300 font-medium">{selectedHub.address || "No saved street address."}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950/60 rounded-2xl border border-white/5 text-center">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Longitude</span>
                  <span className="font-mono text-slate-300 font-bold">{selectedHub.coordinates[0].toFixed(5)}</span>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-2xl border border-white/5 text-center">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Latitude</span>
                  <span className="font-mono text-slate-300 font-bold">{selectedHub.coordinates[1].toFixed(5)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* INTERCITY ROUTE DETAIL PANEL */}
        {selectedEdge && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="absolute bottom-6 left-6 right-6 md:right-auto md:w-[480px] bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl z-30 max-h-[360px] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-3">
              <div>
                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-black text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-lg">
                  Intercity Route Networks
                </span>
                <h3 className="text-sm font-black text-white mt-1.5">
                  {getHubName(selectedEdge.sourceId)} ➔ {getHubName(selectedEdge.destId)}
                </h3>
              </div>
              <button onClick={() => setSelectedEdge(null)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 border-0 bg-transparent cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              {selectedEdge.routes.map((rt) => (
                <div key={rt._id} className="p-4 bg-slate-950/80 rounded-2xl border border-white/5 flex justify-between items-center text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white">{getOpName(rt.operatorId)}</span>
                      <span className="bg-slate-800 text-[8px] font-black px-1.5 py-0.5 rounded text-indigo-400 uppercase tracking-widest">{rt.mode}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      Fleet vehicle: {getVehName(rt.vehicleId)} • Dist: {rt.distanceKm} Km • Time: {rt.durationMin} Mins
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-rose-400 font-black text-sm block">₹{rt.currentPrice}</span>
                    <span className="text-[9px] text-slate-500 font-bold uppercase">Dynamic Rate</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* IN-CITY LOCAL TRANSFER DETAIL PANEL */}
        {selectedTransferEdge && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="absolute bottom-6 left-6 right-6 md:right-auto md:w-[480px] bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl z-30 max-h-[360px] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-3">
              <div>
                <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 font-black text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-lg">
                  In-City Local Transfers
                </span>
                <h3 className="text-sm font-black text-white mt-1.5">
                  {getHubName(selectedTransferEdge.sourceId)} ➔ {getHubName(selectedTransferEdge.destId)}
                </h3>
              </div>
              <button onClick={() => setSelectedTransferEdge(null)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 border-0 bg-transparent cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              {selectedTransferEdge.transfers.map((tr) => (
                <div key={tr._id} className="p-4 bg-slate-950/80 rounded-2xl border border-white/5 flex justify-between items-center text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white">Local Hub Transfer</span>
                      <span className="bg-slate-800 text-[8px] font-black px-1.5 py-0.5 rounded text-rose-400 uppercase tracking-widest">{tr.transferMode}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium flex items-center gap-2">
                      <Compass size={11} /> Dist: {tr.distanceKm} Km • <Clock size={11} /> Time: {tr.durationMin} Mins
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-cyan-400 font-black text-sm block">₹{tr.estimatedCost}</span>
                    <span className="text-[9px] text-slate-500 font-bold uppercase">Est. Cost</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ON-THE-FLY CANVAS CREATOR DRAWER OVERLAYS ── */}
      <AnimatePresence>
        {activeDrawer !== 'NONE' && (
          <div className="absolute inset-y-0 right-0 w-80 md:w-96 bg-slate-900/98 backdrop-blur-2xl border-l border-white/10 z-40 p-6 flex flex-col justify-between shadow-2xl">
            
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <div>
                <h3 className="text-md font-black">
                  {activeDrawer === 'CITY' && "➕ Create Location City"}
                  {activeDrawer === 'HUB' && "➕ Create Transit Hub"}
                  {activeDrawer === 'OPERATOR' && "➕ Register Operator"}
                  {activeDrawer === 'VEHICLE' && "➕ Map Fleet Vehicle"}
                  {activeDrawer === 'ROUTE' && "➕ Create Intercity Route"}
                  {activeDrawer === 'TRANSFER' && "➕ Create Local Transfer"}
                </h3>
                <p className="text-[8px] text-slate-500 uppercase tracking-widest font-black mt-0.5">Runtime Canvas Seeder</p>
              </div>
              <button onClick={() => setActiveDrawer('NONE')} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 border-0 bg-transparent cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 space-y-4 text-xs">
              
              {/* FORM A: CREATE CITY LOCATION */}
              {activeDrawer === 'CITY' && (
                <form onSubmit={handleCreateCity} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">A. City/Region Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Shimla" 
                      value={cityForm.name}
                      onChange={(e) => setCityForm(prev => ({ ...prev, name: e.target.value, city: e.target.value }))}
                      className="w-full px-4.5 py-3.5 bg-slate-950 border border-white/5 rounded-xl text-xs font-bold text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">B. State Province</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Himachal Pradesh" 
                      value={cityForm.state}
                      onChange={(e) => setCityForm(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full px-4.5 py-3.5 bg-slate-950 border border-white/5 rounded-xl text-xs font-bold text-white focus:outline-none"
                    />
                  </div>

                  <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase border-0 cursor-pointer">
                    Deploy City Cluster
                  </button>
                </form>
              )}

              {/* FORM B: CREATE TRANSIT HUB */}
              {activeDrawer === 'HUB' && (
                <form onSubmit={handleCreateHub} className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">A. Select City Cluster</label>
                      <button type="button" onClick={() => setActiveDrawer('CITY')} className="text-[9px] font-black text-indigo-400 hover:underline border-0 bg-transparent cursor-pointer">
                        ➕ Add City
                      </button>
                    </div>
                    <select
                      value={hubForm.cityId}
                      onChange={(e) => setHubForm(prev => ({ ...prev, cityId: e.target.value }))}
                      className="w-full px-4 py-3.5 bg-slate-950 border border-white/5 rounded-xl text-xs font-bold text-slate-300"
                    >
                      <option value="">-- Choose City --</option>
                      {locations.map(l => (
                        <option key={l._id} value={l._id}>{l.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">B. Hub/Station Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Shimla ISBT" 
                      value={hubForm.name}
                      onChange={(e) => setHubForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4.5 py-3.5 bg-slate-950 border border-white/5 rounded-xl text-xs font-bold text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">C. Station Terminal Type</label>
                    <select
                      value={hubForm.type}
                      onChange={(e) => setHubForm(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-4 py-3.5 bg-slate-950 border border-white/5 rounded-xl text-xs font-bold text-slate-300"
                    >
                      <option value="BUS_STAND">Bus Stand</option>
                      <option value="RAILWAY_STATION">Railway Station</option>
                      <option value="AIRPORT">Airport</option>
                      <option value="METRO_STATION">Metro Station</option>
                      <option value="TAXI_STAND">Taxi Stand</option>
                      <option value="PICKUP_POINT">Pickup Point</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">D. Geocoordinates [Lng, Lat]</label>
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        type="number" step="any" placeholder="Lng" value={hubForm.lng || ""}
                        onChange={(e) => setHubForm(prev => ({ ...prev, lng: Number(e.target.value) }))}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-xs"
                      />
                      <input 
                        type="number" step="any" placeholder="Lat" value={hubForm.lat || ""}
                        onChange={(e) => setHubForm(prev => ({ ...prev, lat: Number(e.target.value) }))}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">E. Address Location</label>
                    <input 
                      type="text" placeholder="e.g. Bypass road, Shimla" value={hubForm.address}
                      onChange={(e) => setHubForm(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-4.5 py-3.5 bg-slate-950 border border-white/5 rounded-xl text-xs font-bold text-white focus:outline-none"
                    />
                  </div>

                  <button type="submit" className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase border-0 cursor-pointer">
                    Deploy Station Node
                  </button>
                </form>
              )}

              {/* FORM C: REGISTER OPERATOR */}
              {activeDrawer === 'OPERATOR' && (
                <form onSubmit={handleCreateOperator} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">A. Operator Name</label>
                    <input 
                      type="text" placeholder="e.g. HRTC Volvo" value={operatorForm.name}
                      onChange={(e) => setOperatorForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4.5 py-3.5 bg-slate-950 border border-white/5 rounded-xl text-xs font-bold text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">B. Support Phone</label>
                    <input 
                      type="text" placeholder="+91" value={operatorForm.supportNumber}
                      onChange={(e) => setOperatorForm(prev => ({ ...prev, supportNumber: e.target.value }))}
                      className="w-full px-4.5 py-3.5 bg-slate-950 border border-white/5 rounded-xl text-xs font-bold text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">C. Business Email</label>
                    <input 
                      type="email" placeholder="support@company.com" value={operatorForm.supportEmail}
                      onChange={(e) => setOperatorForm(prev => ({ ...prev, supportEmail: e.target.value }))}
                      className="w-full px-4.5 py-3.5 bg-slate-950 border border-white/5 rounded-xl text-xs font-bold text-white"
                    />
                  </div>

                  <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase border-0 cursor-pointer">
                    Save Operator
                  </button>
                </form>
              )}

              {/* FORM D: CREATE VEHICLE */}
              {activeDrawer === 'VEHICLE' && (
                <form onSubmit={handleCreateVehicle} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">A. Select Operator</label>
                    <select
                      value={vehicleForm.operatorId}
                      onChange={(e) => setVehicleForm(prev => ({ ...prev, operatorId: e.target.value }))}
                      className="w-full px-4 py-3.5 bg-slate-950 border border-white/5 rounded-xl text-xs font-bold text-slate-300"
                    >
                      <option value="">-- Choose Operator --</option>
                      {operators.map(op => (
                        <option key={op._id} value={op._id}>{op.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">B. Vehicle Name</label>
                    <input 
                      type="text" placeholder="e.g. Scania" value={vehicleForm.vehicleName}
                      onChange={(e) => setVehicleForm(prev => ({ ...prev, vehicleName: e.target.value }))}
                      className="w-full px-4.5 py-3.5 bg-slate-950 border border-white/5 rounded-xl text-xs font-bold text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">C. Plate Number</label>
                    <input 
                      type="text" placeholder="Plate number" value={vehicleForm.vehicleNumber}
                      onChange={(e) => setVehicleForm(prev => ({ ...prev, vehicleNumber: e.target.value }))}
                      className="w-full px-4.5 py-3.5 bg-slate-950 border border-white/5 rounded-xl text-xs font-bold text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">D. Mode</label>
                      <select
                        value={vehicleForm.mode}
                        onChange={(e) => setVehicleForm(prev => ({ ...prev, mode: e.target.value as any }))}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-xs text-slate-300 font-bold"
                      >
                        <option value="BUS">Bus</option>
                        <option value="TRAIN">Train</option>
                        <option value="FLIGHT">Flight</option>
                        <option value="METRO">Metro</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">E. Seats</label>
                      <input 
                        type="number" placeholder="Seats" value={vehicleForm.capacity || ""}
                        onChange={(e) => setVehicleForm(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full py-4 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase border-0 cursor-pointer">
                    Deploy Fleet Vehicle
                  </button>
                </form>
              )}

              {/* FORM E: CREATE INTERCITY ROUTE EDGE */}
              {activeDrawer === 'ROUTE' && (
                <form onSubmit={handleCreateRoute} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Origin Station</label>
                      <select
                        value={routeForm.sourceHubId}
                        onChange={(e) => setRouteForm(prev => ({ ...prev, sourceHubId: e.target.value }))}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-xs text-slate-300 font-bold"
                      >
                        <option value="">-- Origin --</option>
                        {hubs.map(h => (
                          <option key={h._id} value={h._id}>{h.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Destination</label>
                      <select
                        value={routeForm.destinationHubId}
                        onChange={(e) => setRouteForm(prev => ({ ...prev, destinationHubId: e.target.value }))}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-xs text-slate-300 font-bold"
                      >
                        <option value="">-- Target --</option>
                        {hubs.map(h => (
                          <option key={h._id} value={h._id}>{h.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">A. Select Operator</label>
                      <button type="button" onClick={() => setActiveDrawer('OPERATOR')} className="text-[9px] font-black text-indigo-400 hover:underline border-0 bg-transparent cursor-pointer">
                        ➕ Add Operator
                      </button>
                    </div>
                    <select
                      value={routeForm.operatorId}
                      onChange={(e) => setRouteForm(prev => ({ ...prev, operatorId: e.target.value, vehicleId: "" }))}
                      className="w-full px-4 py-3.5 bg-slate-950 border border-white/5 rounded-xl text-xs font-bold text-slate-300"
                    >
                      <option value="">-- Choose Operator --</option>
                      {operators.map(op => (
                        <option key={op._id} value={op._id}>{op.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">B. Mapped Vehicle</label>
                      <button type="button" onClick={() => setActiveDrawer('VEHICLE')} className="text-[9px] font-black text-indigo-400 hover:underline border-0 bg-transparent cursor-pointer">
                        ➕ Add Vehicle
                      </button>
                    </div>
                    <select
                      value={routeForm.vehicleId}
                      disabled={!routeForm.operatorId}
                      onChange={(e) => setRouteForm(prev => ({ ...prev, vehicleId: e.target.value }))}
                      className="w-full px-4 py-3.5 bg-slate-950 border border-white/5 rounded-xl text-xs font-bold text-slate-300 disabled:opacity-40"
                    >
                      <option value="">-- Choose Fleet Vehicle --</option>
                      {vehicles
                        .filter(v => v.operatorId === routeForm.operatorId)
                        .map(v => (
                          <option key={v._id} value={v._id}>{v.vehicleName}</option>
                        ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mode</label>
                      <select
                        value={routeForm.mode}
                        onChange={(e) => setRouteForm(prev => ({ ...prev, mode: e.target.value as any }))}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-xs text-slate-300 font-bold"
                      >
                        <option value="BUS">Bus</option>
                        <option value="TRAIN">Train</option>
                        <option value="FLIGHT">Flight</option>
                        <option value="METRO">Metro</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Distance (Km)</label>
                      <input 
                        type="number" value={routeForm.distanceKm || ""}
                        onChange={(e) => setRouteForm(prev => ({ ...prev, distanceKm: Number(e.target.value) }))}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Base Cost (₹)</label>
                      <input 
                        type="number" value={routeForm.basePrice || ""}
                        onChange={(e) => setRouteForm(prev => ({ ...prev, basePrice: Number(e.target.value), currentPrice: prev.currentPrice || Number(e.target.value) }))}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Duration (Min)</label>
                      <input 
                        type="number" value={routeForm.durationMin || ""}
                        onChange={(e) => setRouteForm(prev => ({ ...prev, durationMin: Number(e.target.value) }))}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full py-4 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase border-0 cursor-pointer">
                    Deploy Weighted Edge
                  </button>
                </form>
              )}

              {/* FORM F: CREATE IN-CITY LOCAL TRANSFER */}
              {activeDrawer === 'TRANSFER' && (
                <form onSubmit={handleCreateTransfer} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Selected City Location</label>
                    <select
                      value={transferForm.cityId}
                      onChange={(e) => setTransferForm(prev => ({ ...prev, cityId: e.target.value }))}
                      className="w-full px-4 py-3.5 bg-slate-950 border border-white/5 rounded-xl text-xs font-bold text-slate-300"
                    >
                      <option value="">-- Choose City --</option>
                      {locations.map(l => (
                        <option key={l._id} value={l._id}>{l.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Origin Station</label>
                      <select
                        value={transferForm.sourceHubId}
                        onChange={(e) => setTransferForm(prev => ({ ...prev, sourceHubId: e.target.value }))}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-xs text-slate-300 font-bold"
                      >
                        <option value="">-- Choose --</option>
                        {hubs
                          .filter(h => !transferForm.cityId || h.cityId === transferForm.cityId)
                          .map(h => (
                            <option key={h._id} value={h._id}>{h.name}</option>
                          ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Destination</label>
                      <select
                        value={transferForm.destinationHubId}
                        onChange={(e) => setTransferForm(prev => ({ ...prev, destinationHubId: e.target.value }))}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-xs text-slate-300 font-bold"
                      >
                        <option value="">-- Choose --</option>
                        {hubs
                          .filter(h => !transferForm.cityId || h.cityId === transferForm.cityId)
                          .filter(h => h._id !== transferForm.sourceHubId)
                          .map(h => (
                            <option key={h._id} value={h._id}>{h.name}</option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Transfer Mode Type</label>
                    <select
                      value={transferForm.transferMode}
                      onChange={(e) => setTransferForm(prev => ({ ...prev, transferMode: e.target.value as any }))}
                      className="w-full px-4 py-3.5 bg-slate-950 border border-white/5 rounded-xl text-xs font-bold text-slate-300"
                    >
                      <option value="WALK">🚶 Walk</option>
                      <option value="AUTO">🛺 Auto Rikshaw</option>
                      <option value="CAB">🚕 Taxi Cab</option>
                      <option value="METRO">🚇 Local Metro</option>
                      <option value="SHUTTLE">🚍 Shuttle Bus</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Dist (Km)</label>
                      <input 
                        type="number" step="any" value={transferForm.distanceKm || ""}
                        onChange={(e) => setTransferForm(prev => ({ ...prev, distanceKm: Number(e.target.value) }))}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Time (Min)</label>
                      <input 
                        type="number" value={transferForm.durationMin || ""}
                        onChange={(e) => setTransferForm(prev => ({ ...prev, durationMin: Number(e.target.value) }))}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Est Cost (₹)</label>
                      <input 
                        type="number" value={transferForm.estimatedCost || ""}
                        onChange={(e) => setTransferForm(prev => ({ ...prev, estimatedCost: Number(e.target.value) }))}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-xs text-white"
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase border-0 cursor-pointer">
                    Deploy Local Transfer Edge
                  </button>
                </form>
              )}

            </div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
