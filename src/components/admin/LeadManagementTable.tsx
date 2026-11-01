/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * OHDrug.com — A product of MuneerDataAI
 * Lead Management Table & Detail Inspection Drawer
 * Direct Supabase 'leads' Table Integration, Status Toggle & CSV Export
 */

import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Eye, 
  Mail, 
  Building, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  X, 
  ChevronDown, 
  Copy, 
  Check, 
  ExternalLink,
  Filter,
  Activity
} from 'lucide-react';
import type { Lead, LeadStatus } from '@/src/types/database';

interface LeadManagementTableProps {
  leads: Lead[];
  onUpdateStatus: (leadId: string, newStatus: LeadStatus) => Promise<void>;
  onRefresh: () => void;
}

export const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  'New': {
    label: 'New',
    bg: 'bg-blue-950/40',
    text: 'text-blue-300',
    border: 'border-blue-500/40',
  },
  'new': {
    label: 'New',
    bg: 'bg-blue-950/40',
    text: 'text-blue-300',
    border: 'border-blue-500/40',
  },
  'Contacted': {
    label: 'Contacted',
    bg: 'bg-amber-950/40',
    text: 'text-amber-300',
    border: 'border-amber-500/40',
  },
  'contacted': {
    label: 'Contacted',
    bg: 'bg-amber-950/40',
    text: 'text-amber-300',
    border: 'border-amber-500/40',
  },
  'In Progress': {
    label: 'In Progress',
    bg: 'bg-purple-950/40',
    text: 'text-purple-300',
    border: 'border-purple-500/40',
  },
  'in_progress': {
    label: 'In Progress',
    bg: 'bg-purple-950/40',
    text: 'text-purple-300',
    border: 'border-purple-500/40',
  },
  'closed': {
    label: 'Closed',
    bg: 'bg-emerald-950/40',
    text: 'text-emerald-300',
    border: 'border-emerald-500/40',
  },
  'Archived': {
    label: 'Archived',
    bg: 'bg-slate-900',
    text: 'text-slate-400',
    border: 'border-slate-700',
  },
  'archived': {
    label: 'Archived',
    bg: 'bg-slate-900',
    text: 'text-slate-400',
    border: 'border-slate-700',
  },
};

export function LeadManagementTable({
  leads,
  onUpdateStatus,
  onRefresh,
}: LeadManagementTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filter leads by search term and status
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      lead.service_needed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === 'all'
        ? true
        : selectedStatus === 'archived'
        ? lead.status === 'archived' || lead.status === 'Archived' || lead.status === 'closed'
        : lead.status === selectedStatus || lead.status === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleCopyEmail = (email: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(email);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleStatusChange = async (leadId: string, status: LeadStatus) => {
    setUpdatingId(leadId);
    try {
      await onUpdateStatus(leadId, status);
      if (activeLead && activeLead.id === leadId) {
        setActiveLead({ ...activeLead, status });
      }
    } finally {
      setUpdatingId(null);
    }
  };

  // Export filtered leads to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Company', 'Service Needed', 'Status', 'Date', 'Message'];
    const rows = filteredLeads.map((l) => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.email.replace(/"/g, '""')}"`,
      `"${(l.company || '').replace(/"/g, '""')}"`,
      `"${l.service_needed.replace(/"/g, '""')}"`,
      l.status,
      l.created_at,
      `"${l.message.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `muneerdataai-leads-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 text-left">
      {/* Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-[#111827]">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, email, company, or service..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
          />
        </div>

        {/* Status Filter Tabs (New, Contacted, In Progress, Archived) & CSV Export */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            {[
              { id: 'all', label: 'All' },
              { id: 'new', label: 'New' },
              { id: 'contacted', label: 'Contacted' },
              { id: 'in_progress', label: 'In Progress' },
              { id: 'archived', label: 'Archived' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedStatus(st.id)}
                className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                  selectedStatus === st.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Leads Data Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#111827]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Client / Company</th>
              <th className="py-3.5 px-4">Service Required</th>
              <th className="py-3.5 px-4 hidden md:table-cell">Message Preview</th>
              <th className="py-3.5 px-4">Created Date</th>
              <th className="py-3.5 px-4">Status Update</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-500">
                  No consultation leads found matching current filter.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => {
                const config = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;
                return (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-900/40 transition-colors group cursor-pointer"
                    onClick={() => setActiveLead(lead)}
                  >
                    {/* Client & Company */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {lead.name}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail className="h-3 w-3 text-slate-500" />
                        <span>{lead.email}</span>
                        {lead.company && (
                          <>
                            <span aria-hidden="true" className="text-slate-600">·</span>
                            <span className="text-slate-300">{lead.company}</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Service Required */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        {lead.service_needed || lead.service || 'Custom Service'}
                      </span>
                    </td>

                    {/* Message Snippet */}
                    <td className="py-3.5 px-4 hidden md:table-cell max-w-xs">
                      <p className="text-slate-400 truncate text-[11px]">
                        {lead.message || ''}
                      </p>
                    </td>

                    {/* Created Date */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 tabular-nums">
                      {new Date(lead.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Status Update Toggle Dropdown */}
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={lead.status}
                        disabled={updatingId === lead.id}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                        className={`text-[11px] font-semibold py-1 px-2.5 rounded border outline-none cursor-pointer transition-colors ${config.bg} ${config.text} ${config.border}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="in_progress">In Progress</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyEmail(lead.email, lead.id)}
                          title="Copy email to clipboard"
                          className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          {copiedId === lead.id ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveLead(lead)}
                          title="View complete proposal details"
                          className="p-1.5 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Quick Detail Inspection Drawer */}
      {activeLead && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setActiveLead(null)}
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div className="relative w-full max-w-lg bg-[#111827] border-l border-slate-800 h-full p-6 sm:p-8 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto animate-in slide-in-from-right duration-200">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-800">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Lead Consultation Inquiry
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {activeLead.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveLead(null)}
                  className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Lead Info Rows */}
              <div className="mt-6 space-y-4 text-xs">
                <div>
                  <label className="text-[11px] font-medium text-slate-400">Work Email</label>
                  <div className="mt-1 flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-slate-200">
                    <span>{activeLead.email}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyEmail(activeLead.email, activeLead.id)}
                      className="text-blue-400 hover:text-blue-300 font-sans text-xs inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === activeLead.id ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                {activeLead.company && (
                  <div>
                    <label className="text-[11px] font-medium text-slate-400">Company / Organization</label>
                    <div className="mt-1 p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-200 font-medium">
                      {activeLead.company}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-medium text-slate-400">Service Category Needed</label>
                  <div className="mt-1 p-2.5 rounded bg-slate-900 border border-slate-800 text-blue-300 font-semibold">
                    {activeLead.service_needed || activeLead.service || 'Custom Service'}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-400">Update Proposal Status</label>
                  <div className="mt-1">
                    <select
                      value={activeLead.status}
                      onChange={(e) => handleStatusChange(activeLead.id, e.target.value as LeadStatus)}
                      className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white font-medium outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="new">New (Uncontacted)</option>
                      <option value="contacted">Contacted (In Review)</option>
                      <option value="in_progress">In Progress (Scoping)</option>
                      <option value="archived">Archived / Closed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-400">Inbound Scope &amp; Project Requirements</label>
                  <div className="mt-1 p-3.5 rounded bg-slate-900/90 border border-slate-800 text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                    {activeLead.message || ''}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>ID: {activeLead.id}</span>
                  <span>
                    Received: {new Date(activeLead.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions: One-click email reply to client or ohdrug01@gmail.com logging */}
            <div className="pt-6 border-t border-slate-800 space-y-2.5">
              <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                <a
                  href={`mailto:${activeLead.email}?cc=ohdrug01@gmail.com&subject=OHDrug.com%20Consultation%20Follow-Up%20-%20${encodeURIComponent(activeLead.company || activeLead.name)}&body=Hi%20${encodeURIComponent(activeLead.name)},%0A%0AThank%20you%20for%20reaching%20out%20to%20MuneerDataAI%20regarding%20${encodeURIComponent(activeLead.service_needed)}.%0A%0AWe%20have%20reviewed%20your%20technical%20requirements%20and%20would%20like%20to%20schedule%20a%20strategy%20session.%0A%0ABest%20regards,%0AMuneer%0ARegistered%20Pharmacist%20%26%20Automation%20Architect%0AOHDrug.com%20%7C%20muneerdev.com%0AContact:%20ohdrug01@gmail.com`}
                  className="flex-1 py-2.5 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-center text-xs font-semibold text-white shadow transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Reply to Client (CC ohdrug01)</span>
                </a>

                <a
                  href={`mailto:ohdrug01@gmail.com?subject=Internal%20Lead%20Log:%20${encodeURIComponent(activeLead.name)}%20(${encodeURIComponent(activeLead.company || 'Direct')})&body=INBOUND%20LEAD%20SPECIFICATIONS:%0AID:%20${activeLead.id}%0AName:%20${encodeURIComponent(activeLead.name)}%0AClient%20Email:%20${activeLead.email}%0ACompany:%20${encodeURIComponent(activeLead.company || 'N/A')}%0AService:%20${encodeURIComponent(activeLead.service_needed)}%0AStatus:%20${activeLead.status}%0AReceived:%20${activeLead.created_at}%0A%0AMESSAGE:%0A${encodeURIComponent(activeLead.message)}`}
                  className="py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-center text-xs font-semibold text-slate-200 transition-colors inline-flex items-center justify-center gap-1.5 border border-slate-700"
                  title="Forward/Log record to official email: ohdrug01@gmail.com"
                >
                  <span>Log to ohdrug01</span>
                  <ExternalLink className="h-3 w-3 text-slate-400" />
                </a>
              </div>

              <button
                type="button"
                onClick={() => setActiveLead(null)}
                className="w-full py-2 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
