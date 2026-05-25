"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  LayoutDashboard,
  LineChart,
  Package,
  MapPin,
  Activity,
  GitBranch,
  Hotel,
  FileText,
  Globe,
  Users,
  Briefcase,
  Settings,
  LogOut,
  Plane,
  LocateIcon,
  Search,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Bell,
  Sparkles
} from "lucide-react";

const menuSections = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "Analytics", href: "/analytics", icon: LineChart },
    ],
  },
  {
    title: "Inventory",
    items: [
      { label: "Packages", href: "/packages", icon: Package },
      { label: "Destinations", href: "/destinations", icon: MapPin },
      { label: "Activities", href: "/activities", icon: Activity },
      { label: "Travel Routes", href: "/travel-routes", icon: GitBranch },
      { label: "Stays", href: "/stays", icon: Hotel },
      { label: "Local Info", href: "/local-informations", icon: LocateIcon },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Blog Pages", href: "/blogs", icon: FileText },
      { label: "Cities", href: "/cities", icon: Globe },
    ],
  },
  {
    title: "Moderation",
    items: [
      { label: "Traveler Stories", href: "/stories", icon: FileText },
      { label: "Testimonials", icon: Sparkles, href: "/testimonials" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Home Page", href: "/home-management", icon: LayoutDashboard },
      { label: "Theme Studio", href: "/theme-studio", icon: Sparkles },
    ],
  },
  {
    title: "People",
    items: [
      { label: "Users", href: "/users", icon: Users },
      { label: "Agents", href: "/agents", icon: Briefcase },
    ],
  },
];

const footerItems = [
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Close mobile drawer on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredSections = menuSections.map(section => ({
    ...section,
    items: section.items.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-slate-100 shadow-[20px_0_40px_-20px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-2.5 rounded-[1.25rem] shadow-lg shadow-slate-200 ring-4 ring-slate-50">
            <Plane className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">Mountain Monkey</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* Search Input (Only when not collapsed) */}
      {!isCollapsed && (
        <div className="px-6 mb-6">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input 
              type="text"
              placeholder="Quick find..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/20 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-4 space-y-8 custom-scrollbar">
        {filteredSections.map((section) => (
          <section key={section.title}>
            {!isCollapsed && (
              <h3 className="px-4 mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center justify-between">
                {section.title}
                <div className="h-[1px] flex-1 bg-slate-50 ml-4" />
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={<item.icon size={18} />}
                  active={pathname === item.href}
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Footer / User Profile */}
      <div className="p-4 mt-auto border-t border-slate-50 bg-slate-50/30">
        <div className="space-y-1 mb-4">
          {footerItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={<item.icon size={18} />}
              active={pathname === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>

        <div className={`flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-100">
              AD
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-900 truncate">Admin User</p>
              <div className="flex items-center gap-1">
                <ShieldCheck size={10} className="text-indigo-500" />
                <p className="text-[9px] font-bold text-slate-400 uppercase">Super Admin</p>
              </div>
            </div>
          )}
          
          {!isCollapsed && (
            <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-100 z-40 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-2 rounded-xl">
            <Plane className="w-4 h-4 text-white" />
          </div>
          <h1 className="font-black text-slate-900 tracking-tight">Wanderly</h1>
        </div>
        <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 relative">
                <Bell size={20} />
                <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-white rounded-full" />
            </button>
            <button 
                onClick={() => setIsMobileOpen(true)}
                className="p-2 bg-slate-50 rounded-xl text-slate-900 border border-slate-100"
            >
                <Menu size={20} />
            </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex h-screen sticky top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isCollapsed ? "w-24" : "w-72"
        }`}
      >
        <SidebarContent />
        
        {/* Collapse Trigger (Desktop Only) */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-500 shadow-sm z-50 transition-colors group"
        >
          <ChevronRight size={14} className={`transition-transform duration-500 ${isCollapsed ? 'rotate-0' : 'rotate-180'}`} />
        </button>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[300px] z-[70] lg:hidden"
            >
              <div className="absolute top-4 right-4 z-[80]">
                <button 
                    onClick={() => setIsMobileOpen(false)}
                    className="p-2 bg-white rounded-xl shadow-lg border border-slate-100"
                >
                    <X size={20} className="text-slate-900" />
                </button>
              </div>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  isCollapsed?: boolean;
}

function NavItem({
  href,
  icon,
  label,
  active,
  isCollapsed
}: NavItemProps) {
  return (
    <Link
      href={href}
      className={`
        group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 relative
        ${active ? "bg-indigo-50 text-indigo-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}
        ${isCollapsed ? "justify-center px-0" : ""}
      `}
    >
      <span className={`transition-all duration-300 ${active ? "text-indigo-600 scale-110" : "text-slate-400 group-hover:text-indigo-500 group-hover:scale-110"}`}>
        {icon}
      </span>

      {!isCollapsed && (
        <span className={`text-[13px] font-bold tracking-tight transition-colors ${active ? "text-indigo-700" : "text-slate-600 group-hover:text-slate-900"}`}>
          {label}
        </span>
      )}

      {active && !isCollapsed && (
        <motion.div 
            layoutId="active-nav"
            className="absolute right-3 w-1.5 h-6 bg-indigo-500 rounded-full"
            transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
        />
      )}
      
      {isCollapsed && (
        <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </Link>
  );
}