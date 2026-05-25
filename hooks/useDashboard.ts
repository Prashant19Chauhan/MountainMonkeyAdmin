import { useState, useEffect } from 'react';

export const useDashboard = () => {
    // In a real app, you would fetch this data from an API
    const [kpis, setKpis] = useState([
        { label: "Aggregate Revenue", value: "$142.8k", trend: "+12.4%", positive: true, color: "indigo", iconName: "TrendingUp" },
        { label: "Active Inventory", value: "542", trend: "+8.1%", positive: true, color: "emerald", iconName: "Zap" },
        { label: "User Expansion", value: "12.4k", trend: "-2.4%", positive: false, color: "orange", iconName: "Users" },
        { label: "System Health", value: "99.9%", trend: "Stable", positive: true, color: "blue", iconName: "Sparkles" },
    ]);

    const [modules, setModules] = useState([
        { label: "Destinations", count: "84", color: "blue", iconName: "Globe" },
        { label: "Stays", count: "215", color: "indigo", iconName: "Hotel" },
        { label: "Activities", count: "124", color: "emerald", iconName: "Activity" },
        { label: "Blog Content", count: "42", color: "purple", iconName: "PenTool" },
    ]);

    const [streams, setStreams] = useState([
        { user: "Alice M.", action: "acquired package", target: "Nordic Expedition", time: "2m ago", initials: "AM", accent: "rose" },
        { user: "System", action: "auto-optimized", target: "Kyoto Stays", time: "14m ago", initials: "AI", accent: "indigo" },
        { user: "Agent Bob", action: "drafted", target: "Bali Beach Guide", time: "1h ago", initials: "BS", accent: "emerald" },
        { user: "Mark R.", action: "joined as", target: "Elite Member", time: "3h ago", initials: "MR", accent: "orange" },
    ]);

    const [dispatchActions, setDispatchActions] = useState([
        { label: "New Travel Package", iconName: "Plus" },
        { label: "Register Destination", iconName: "MapPin" },
        { label: "Onboard Agent", iconName: "Users" },
    ]);

    const [timelineEvents, setTimelineEvents] = useState([
        { title: "Santorini Flight Group", time: "Tomorrow, 08:00 AM", status: "Ready" },
        { title: "Alpine Trek Briefing", time: "Oct 24, 10:30 AM", status: "Pending" },
        { title: "Tokyo Hub Sync", time: "Oct 26, 06:00 PM", status: "Scheduled" },
    ]);

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    return {
        kpis,
        modules,
        streams,
        dispatchActions,
        timelineEvents,
        searchQuery,
        handleSearch
    };
};
