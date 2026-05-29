"use client";

import React, { useEffect, useState } from 'react';
import { Mail, Phone, Calendar, Users, HelpCircle, Trash2, Eye, RefreshCw, FileText, CheckCircle2, AlertCircle, Clock, X } from 'lucide-react';
import { toast } from 'sonner';
import { Enquiry, fetchEnquiriesApi, updateEnquiryStatusApi, deleteEnquiryApi } from '@/services/enquiry.service';

export default function EnquiriesDashboard() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Selected enquiry for reading the detailed message in a modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const loadEnquiries = async () => {
    setIsLoading(true);
    try {
      const response = await fetchEnquiriesApi({
        enquiryType: filterType || undefined,
        status: filterStatus || undefined
      });
      if (response && response.success) {
        setEnquiries(response.data || []);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load enquiries");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [filterType, filterStatus]);

  const handleStatusChange = async (id: string, newStatus: 'Pending' | 'Reviewed' | 'Completed') => {
    try {
      const res = await updateEnquiryStatusApi(id, newStatus);
      if (res && res.success) {
        toast.success(`Enquiry marked as ${newStatus}`);
        setEnquiries(prev => prev.map(enq => enq._id === id ? { ...enq, status: newStatus } : enq));
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry lead?")) return;

    try {
      const res = await deleteEnquiryApi(id);
      if (res && res.success) {
        toast.success("Enquiry deleted successfully");
        setEnquiries(prev => prev.filter(enq => enq._id !== id));
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete enquiry");
    }
  };

  // Compute stat counters
  const totalCount = enquiries.length;
  const pendingCount = enquiries.filter(e => e.status === 'Pending').length;
  const reviewedCount = enquiries.filter(e => e.status === 'Reviewed').length;
  const completedCount = enquiries.filter(e => e.status === 'Completed').length;

  // Filter clientside search query (matches name, email, or itemTitle)
  const filteredEnquiries = enquiries.filter(enq => {
    const query = searchQuery.toLowerCase();
    return (
      enq.name.toLowerCase().includes(query) ||
      enq.email.toLowerCase().includes(query) ||
      enq.itemTitle.toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans text-slate-800 bg-[#f8fafc] min-h-screen">
      
      {/* Header Row */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Travel Enquiries</h1>
          <p className="text-slate-500 text-sm font-medium">Manage and review inbound traveler consultation leads.</p>
        </div>
        <button
          onClick={loadEnquiries}
          className="bg-white border border-slate-200 p-2.5 rounded-xl hover:bg-slate-50 shadow-sm transition active:scale-95 flex items-center gap-2 font-bold text-xs text-slate-600 cursor-pointer"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Metrics Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total leads card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Total Leads</span>
            <span className="text-3xl font-black text-slate-950 mt-1 block">{totalCount}</span>
          </div>
          <div className="bg-slate-50 text-slate-500 p-3.5 rounded-2xl">
            <FileText size={24} />
          </div>
        </div>

        {/* Pending Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block">Pending Reviews</span>
            <span className="text-3xl font-black text-amber-600 mt-1 block">{pendingCount}</span>
          </div>
          <div className="bg-amber-50 text-amber-500 p-3.5 rounded-2xl">
            <Clock size={24} />
          </div>
        </div>

        {/* Reviewed Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block">In Discussion</span>
            <span className="text-3xl font-black text-blue-600 mt-1 block">{reviewedCount}</span>
          </div>
          <div className="bg-blue-50 text-blue-500 p-3.5 rounded-2xl">
            <AlertCircle size={24} />
          </div>
        </div>

        {/* Completed Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block">Converted Bookings</span>
            <span className="text-3xl font-black text-emerald-600 mt-1 block">{completedCount}</span>
          </div>
          <div className="bg-emerald-50 text-emerald-500 p-3.5 rounded-2xl">
            <CheckCircle2 size={24} />
          </div>
        </div>
      </div>

      {/* Filters and Search Row */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Dropdowns */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Filter by Category */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-600 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Categories</option>
            <option value="stay">Stays</option>
            <option value="package">Tour Packages</option>
            <option value="activity">Activities</option>
          </select>

          {/* Filter by Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-600 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by name, email, or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-xs font-semibold focus:bg-white focus:outline-none focus:border-blue-500 transition-all text-slate-700"
          />
        </div>
      </div>

      {/* Main Grid/Table Data View */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Fetching Leads from API Matrix...</p>
          </div>
        ) : filteredEnquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="p-4 pl-6">Traveler</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Enquiry Details</th>
                  <th className="p-4">Travel Parameters</th>
                  <th className="p-4 text-center">Status Badge</th>
                  <th className="p-4 pr-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60 font-semibold text-slate-600">
                {filteredEnquiries.map((enq) => {
                  const statusColors = 
                    enq.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    enq.status === 'Reviewed' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    'bg-emerald-50 text-emerald-600 border-emerald-100';

                  const typePillColors = 
                    enq.enquiryType === 'stay' ? 'bg-cyan-50 text-cyan-700 border-cyan-100' :
                    enq.enquiryType === 'package' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                    'bg-orange-50 text-orange-700 border-orange-100';

                  return (
                    <tr key={enq._id} className="hover:bg-slate-50/30 transition-colors">
                      {/* Name/User info */}
                      <td className="p-4 pl-6">
                        <div className="font-bold text-slate-900 text-sm">{enq.name}</div>
                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-wide block mt-0.5">
                          {enq.userId ? "Registered User" : "Anonymous Lead"}
                        </span>
                      </td>

                      {/* Contact details */}
                      <td className="p-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                          <Mail size={13} /> {enq.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                          <Phone size={13} /> {enq.phone}
                        </div>
                      </td>

                      {/* Item info */}
                      <td className="p-4">
                        <span className={`inline-block text-[8px] font-black uppercase px-2 py-0.5 rounded-md border ${typePillColors} mb-1`}>
                          {enq.enquiryType}
                        </span>
                        <div className="font-bold text-slate-800 line-clamp-1">{enq.itemTitle}</div>
                      </td>

                      {/* Target params */}
                      <td className="p-4 space-y-1">
                        {enq.checkInDate && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                            <Calendar size={13} className="text-slate-400" />
                            <span>
                              {new Date(enq.checkInDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                              {enq.checkOutDate ? ` - ${new Date(enq.checkOutDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}` : ''}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                          <Users size={13} className="text-slate-400" />
                          <span>{enq.numberOfGuests || 1} Explorer{enq.numberOfGuests && enq.numberOfGuests > 1 ? 's' : ''}</span>
                        </div>
                        {enq.roomType && (
                          <div className="text-[10px] text-slate-400 font-black tracking-wide">
                            {enq.roomType}
                          </div>
                        )}
                      </td>

                      {/* Status select select */}
                      <td className="p-4 text-center">
                        <select
                          value={enq.status}
                          onChange={(e) => handleStatusChange(enq._id, e.target.value as any)}
                          className={`border text-[10px] font-black uppercase rounded-lg px-2 py-1 outline-none cursor-pointer transition ${statusColors}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6">
                        <div className="flex items-center justify-center gap-2.5">
                          <button
                            onClick={() => setSelectedEnquiry(enq)}
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition cursor-pointer"
                            title="Read traveler query details"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(enq._id)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition cursor-pointer"
                            title="Remove enquiry lead"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-24 text-center bg-white rounded-2xl">
            <HelpCircle size={40} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 font-bold italic text-sm">No enquiries matched your matrix search criteria.</p>
          </div>
        )}
      </div>

      {/* Modal Dialog overlay for reading a single detailed query message */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-in fade-in zoom-in duration-300 font-sans text-slate-800">
            <button
              onClick={() => setSelectedEnquiry(null)}
              className="absolute top-5 right-5 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition text-slate-500 cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Header info */}
            <div className="mb-5">
              <span className="inline-block text-[8px] font-black uppercase bg-rose-50 border border-rose-100 text-rose-500 px-2 py-0.5 rounded-md mb-2">
                Traveler Lead Detail
              </span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{selectedEnquiry.name}</h3>
              <p className="text-[11px] text-slate-400 font-bold mt-0.5">Submitted Enquiry for &quot;{selectedEnquiry.itemTitle}&quot;</p>
            </div>

            {/* Traveler notes box */}
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-1 leading-relaxed">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Message from Customer</span>
                <p className="text-xs font-bold text-slate-700 whitespace-pre-wrap">{selectedEnquiry.message}</p>
              </div>

              {/* Status Update Quick Bar */}
              <div className="flex justify-between items-center bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mark Status:</span>
                <div className="flex gap-2">
                  {(['Pending', 'Reviewed', 'Completed'] as const).map((st) => {
                    const isActive = selectedEnquiry.status === st;
                    const btnStyles = 
                      st === 'Pending' ? (isActive ? 'bg-amber-500 text-slate-950' : 'bg-white text-amber-500 hover:bg-amber-50') :
                      st === 'Reviewed' ? (isActive ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 hover:bg-blue-50') :
                      (isActive ? 'bg-emerald-500 text-white' : 'bg-white text-emerald-500 hover:bg-emerald-50');

                    return (
                      <button
                        key={st}
                        onClick={() => {
                          handleStatusChange(selectedEnquiry._id, st);
                          setSelectedEnquiry(prev => prev ? { ...prev, status: st } : null);
                        }}
                        className={`text-[9px] font-black uppercase px-2.5 py-1.5 rounded-lg border border-slate-200 transition-all cursor-pointer ${btnStyles}`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
