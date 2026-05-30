"use client";

import React, { useEffect, useState } from 'react';
import { Mail, Phone, HelpCircle, Trash2, Eye, RefreshCw, FileText, CheckCircle2, AlertCircle, Clock, X, Edit3 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ContactMessage, fetchContactMessagesApi, updateContactMessageStatusApi, deleteContactMessageApi } from '@/services/contact.service';

export default function ContactMessagesDashboard() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Selected message for reading the detailed message in a modal
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const response = await fetchContactMessagesApi({
        status: filterStatus || undefined
      });
      if (response && response.success) {
        setMessages(response.data || []);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load contact messages");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [filterStatus]);

  const handleStatusChange = async (id: string, newStatus: 'Pending' | 'Reviewed' | 'Completed') => {
    try {
      const res = await updateContactMessageStatusApi(id, newStatus);
      if (res && res.success) {
        toast.success(`Message marked as ${newStatus}`);
        setMessages(prev => prev.map(msg => msg._id === id ? { ...msg, status: newStatus } : msg));
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact message?")) return;

    try {
      const res = await deleteContactMessageApi(id);
      if (res && res.success) {
        toast.success("Message deleted successfully");
        setMessages(prev => prev.filter(msg => msg._id !== id));
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete message");
    }
  };

  // Compute stat counters
  const totalCount = messages.length;
  const pendingCount = messages.filter(m => m.status === 'Pending').length;
  const reviewedCount = messages.filter(m => m.status === 'Reviewed').length;
  const completedCount = messages.filter(m => m.status === 'Completed').length;

  // Filter clientside search query (matches name, email, or subject)
  const filteredMessages = messages.filter(msg => {
    const query = searchQuery.toLowerCase();
    return (
      msg.name.toLowerCase().includes(query) ||
      msg.email.toLowerCase().includes(query) ||
      (msg.subject || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans text-slate-800 bg-[#f8fafc] min-h-screen">
      
      {/* Header Row */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Contact Messages</h1>
          <p className="text-slate-500 text-sm font-medium">Manage and review general traveler Contact Us forms.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/metadata?contact-page=contact-page">
            <button className="px-4 py-2.5 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 cursor-pointer border-0">
              <Edit3 size={14} /> SEO Meta
            </button>
          </Link>
          <button
            onClick={loadMessages}
            className="bg-white border border-slate-200 p-2.5 rounded-xl hover:bg-slate-50 shadow-sm transition active:scale-95 flex items-center gap-2 font-bold text-xs text-slate-600 cursor-pointer"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Total Messages</span>
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
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block">Reviewed</span>
            <span className="text-3xl font-black text-blue-600 mt-1 block">{reviewedCount}</span>
          </div>
          <div className="bg-blue-50 text-blue-500 p-3.5 rounded-2xl">
            <AlertCircle size={24} />
          </div>
        </div>

        {/* Completed Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block">Resolved</span>
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
            placeholder="Search by name, email, or subject..."
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
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Fetching Messages from Database...</p>
          </div>
        ) : filteredMessages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="p-4 pl-6">Sender</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Message Preview</th>
                  <th className="p-4 text-center">Status Badge</th>
                  <th className="p-4 pr-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60 font-semibold text-slate-600">
                {filteredMessages.map((msg) => {
                  const statusColors = 
                    msg.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    msg.status === 'Reviewed' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    'bg-emerald-50 text-emerald-600 border-emerald-100';

                  return (
                    <tr key={msg._id} className="hover:bg-slate-50/30 transition-colors">
                      {/* Name */}
                      <td className="p-4 pl-6">
                        <div className="font-bold text-slate-900 text-sm">{msg.name}</div>
                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-wide block mt-0.5">
                          General Lead
                        </span>
                      </td>

                      {/* Contact details */}
                      <td className="p-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                          <Mail size={13} /> {msg.email}
                        </div>
                        {msg.phone && (
                          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                            <Phone size={13} /> {msg.phone}
                          </div>
                        )}
                      </td>

                      {/* Subject */}
                      <td className="p-4 font-bold text-slate-800">
                        {msg.subject || "General Enquiry"}
                      </td>

                      {/* Message Preview */}
                      <td className="p-4 max-w-xs">
                        <div className="text-slate-500 line-clamp-1 font-medium">{msg.message}</div>
                      </td>

                      {/* Status */}
                      <td className="p-4 text-center">
                        <select
                          value={msg.status}
                          onChange={(e) => handleStatusChange(msg._id, e.target.value as any)}
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
                            onClick={() => setSelectedMessage(msg)}
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition cursor-pointer"
                            title="Read detailed message"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(msg._id)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition cursor-pointer"
                            title="Delete message"
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
            <p className="text-slate-400 font-bold italic text-sm">No contact messages found.</p>
          </div>
        )}
      </div>

      {/* Modal Dialog overlay for reading a single detailed query message */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-in fade-in zoom-in duration-300 font-sans text-slate-800">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-5 right-5 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition text-slate-500 cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Header info */}
            <div className="mb-5">
              <span className="inline-block text-[8px] font-black uppercase bg-indigo-50 border border-indigo-100 text-indigo-500 px-2 py-0.5 rounded-md mb-2">
                Contact Form Detail
              </span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{selectedMessage.name}</h3>
              <p className="text-[11px] text-slate-400 font-bold mt-0.5">Subject: &quot;{selectedMessage.subject || "General Enquiry"}&quot;</p>
            </div>

            {/* Notes box */}
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-1 leading-relaxed">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Message from Customer</span>
                <p className="text-xs font-bold text-slate-700 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              {/* Status Update Quick Bar */}
              <div className="flex justify-between items-center bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mark Status:</span>
                <div className="flex gap-2">
                  {(['Pending', 'Reviewed', 'Completed'] as const).map((st) => {
                    const isActive = selectedMessage.status === st;
                    const btnStyles = 
                      st === 'Pending' ? (isActive ? 'bg-amber-500 text-slate-950' : 'bg-white text-amber-500 hover:bg-amber-50') :
                      st === 'Reviewed' ? (isActive ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 hover:bg-blue-50') :
                      (isActive ? 'bg-emerald-500 text-white' : 'bg-white text-emerald-500 hover:bg-emerald-50');

                    return (
                      <button
                        key={st}
                        onClick={() => {
                          handleStatusChange(selectedMessage._id, st);
                          setSelectedMessage(prev => prev ? { ...prev, status: st } : null);
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
