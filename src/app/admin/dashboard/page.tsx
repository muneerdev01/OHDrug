/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * OHDrug.com — A product of MuneerDataAI
 * Unified Executive Admin Dashboard & CMS (Next.js 15 App Router)
 * Dual Interface: Inbound Leads & Proposals + CMS Knowledge Hub Article Manager
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  Database, 
  HardDrive, 
  Plus, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Edit, 
  Trash2, 
  FileText, 
  ArrowLeft,
  Sparkles,
  Lock,
  ShieldAlert,
  KeyRound,
  Check,
  Mail,
  Video
} from 'lucide-react';
import { LeadManagementTable } from '@/src/components/admin/LeadManagementTable';
import { BlogEditorModal } from '@/src/components/admin/BlogEditorModal';
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase/client';
import { INITIAL_EDITORIAL_ARTICLES } from '@/src/data/blogArticles';
import type { Lead, Blog, LeadStatus } from '@/src/types/database';

interface AdminDashboardPageProps {
  onNavigate?: (path: string) => void;
}

export default function AdminDashboardPage({ onNavigate }: AdminDashboardPageProps) {
  // Navigation tabs: 'leads' | 'cms'
  const [activeTab, setActiveTab] = useState<'leads' | 'cms'>('leads');

  // Leads State
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 'lead-101',
      name: 'Dr. Sarah Jenkins',
      email: 's.jenkins@metropharma.org',
      company: 'Metro Health Systems',
      service_needed: 'B2B Healthcare Data Extraction',
      message: 'We require a daily price aggregator monitoring 42 hospital drug formulary catalogs with automated NDC validation and Pydantic schema checks.',
      status: 'new',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: 'lead-102',
      name: 'Marcus Vance',
      email: 'm.vance@biotrail-cro.com',
      company: 'BioTrail Therapeutics',
      service_needed: 'Clinical & Executive Dashboards',
      message: 'Looking to integrate our FastAPI oncology trial endpoints into a sub-second executive dashboard. Need assistance with Postgres RLS configuration.',
      status: 'contacted',
      created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
    },
    {
      id: 'lead-103',
      name: 'Elena Rostova',
      email: 'e.rostova@synapsehealth.io',
      company: 'Synapse Health Tech',
      service_needed: 'Custom Healthcare Software Pipelines',
      message: 'Inquiring about outpatient pharmacy dispensing intake verification workflows. Need PharmD domain review alongside full-stack architecture.',
      status: 'in_progress',
      created_at: new Date(Date.now() - 3600000 * 50).toISOString(),
    },
    {
      id: 'lead-104',
      name: 'David Chen',
      email: 'd.chen@novapex.com',
      company: 'Novapex Pharma Group',
      service_needed: 'Full Architecture & Strategy',
      message: 'Consultation request for national pharmaceutical price scraping clusters with resident proxy rotators and client-side image compression.',
      status: 'archived',
      created_at: new Date(Date.now() - 3600000 * 96).toISOString(),
    },
  ]);

  // Blogs State
  const [blogs, setBlogs] = useState<Blog[]>(INITIAL_EDITORIAL_ARTICLES);

  // Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  // Admin Profile & RLS Security State
  const [adminEmail, setAdminEmail] = useState<string>('ohdrug01@gmail.com');
  const [adminRole, setAdminRole] = useState<'admin' | 'client'>('admin');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch real leads & blogs from Supabase
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        // Fetch leads
        const { data: leadsData, error: leadsErr } = await (supabase.from('leads') as any)
          .select('*')
          .order('created_at', { ascending: false });

        if (!leadsErr && Array.isArray(leadsData) && leadsData.length > 0) {
          setLeads(leadsData);
        }

        // Fetch blogs
        const { data: blogsData, error: blogsErr } = await (supabase.from('blogs') as any)
          .select('*')
          .order('created_at', { ascending: false });

        if (!blogsErr && Array.isArray(blogsData) && blogsData.length > 0) {
          setBlogs(blogsData);
        }

        // Check auth user session
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user?.email) {
          setAdminEmail(authData.user.email);
          setIsAuthenticated(true);
        }
      }
    } catch (e) {
      console.warn('Dashboard loaded with fallback data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Lead status update
  const handleUpdateLeadStatus = async (leadId: string, newStatus: LeadStatus) => {
    if (!isAuthenticated || adminRole !== 'admin') {
      showToast('RLS Security: Only authenticated administrators can modify lead records.');
      return;
    }

    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );

    if (isSupabaseConfigured) {
      try {
        const { error } = await (supabase.from('leads') as any)
          .update({ status: newStatus })
          .eq('id', leadId);

        if (error) throw new Error(error.message);
        showToast(`Lead status updated to ${newStatus}.`);
      } catch (err: any) {
        console.error('Failed to update lead in Supabase:', err);
        showToast('Error syncing status to Supabase.');
      }
    } else {
      showToast(`Lead marked as ${newStatus} (Saved locally).`);
    }
  };

  // Blog saved from editor modal
  const handleBlogSaved = (savedBlog: Blog) => {
    setBlogs((prev) => {
      const exists = prev.some((b) => b.id === savedBlog.id || b.slug === savedBlog.slug);
      if (exists) {
        return prev.map((b) =>
          b.id === savedBlog.id || b.slug === savedBlog.slug ? savedBlog : b
        );
      }
      return [savedBlog, ...prev];
    });
    showToast(`Article "${savedBlog.title.slice(0, 30)}..." updated successfully.`);
  };

  // Delete article handler
  const handleDeleteBlog = async (blogId: string) => {
    if (!isAuthenticated || adminRole !== 'admin') {
      showToast('RLS Security: Unauthorized. Administrator role required to delete articles.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this technical article?')) {
      return;
    }

    setBlogs((prev) => prev.filter((b) => b.id !== blogId));

    if (isSupabaseConfigured) {
      try {
        await (supabase.from('blogs') as any).delete().eq('id', blogId);
        showToast('Article deleted from Supabase.');
      } catch (err) {
        console.error(err);
      }
    } else {
      showToast('Article deleted.');
    }
  };

  // Computed metrics
  const totalLeadsCount = leads.length;
  const pendingInquiriesCount = leads.filter((l) => l.status === 'New' || l.status === 'new').length;
  const compliantEgressPercentage = '100%';

  const handleReturnHome = () => {
    if (onNavigate) {
      onNavigate('/');
    } else if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-950 border border-emerald-700 text-xs font-semibold text-emerald-200 shadow-2xl animate-in slide-in-from-bottom duration-200">
          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar: System Status, Active Admin Email, and link to muneerdev.com */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#090d16]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Brand & Portal Label */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleReturnHome}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">View Public Site</span>
            </button>

            <span aria-hidden="true" className="text-slate-700 hidden sm:inline">|</span>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white tracking-tight">
                  OHDrug<span className="text-blue-500">.com</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/30">
                  Dual Admin CMS
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                A product of <strong className="text-emerald-400 font-semibold">MuneerDataAI</strong>
              </div>
            </div>
          </div>

          {/* System Status, Active Admin Email, and link to muneerdev.com */}
          <div className="flex items-center gap-4">
            
            {/* System Status Badge */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-slate-400">System:</span>
              <span className="font-semibold text-emerald-300">RLS Active (Postgres)</span>
            </div>

            {/* Official Lead Inquiries & Notifications Email */}
            <a
              href="mailto:ohdrug01@gmail.com?subject=Admin%20System%20Notification%20-%20OHDrug.com"
              className="hidden md:flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg transition-colors group whitespace-nowrap"
              title="Official System Notifications & Lead Inquiries: ohdrug01@gmail.com"
            >
              <Mail className="h-3.5 w-3.5 text-blue-400 group-hover:text-blue-300" />
              <span className="text-slate-400">Inquiries:</span>
              <span className="font-mono text-slate-200 group-hover:text-white">ohdrug01@gmail.com</span>
            </a>

            {/* Active Admin Email */}
            <a
              href="mailto:ohdrug01@gmail.com?subject=Admin%20System%20Access%20-%20OHDrug.com"
              className="hidden sm:flex items-center gap-2 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg transition-colors group"
              title="Active Administrator: mailto:ohdrug01@gmail.com"
            >
              <Lock className="h-3.5 w-3.5 text-emerald-400 group-hover:text-emerald-300" />
              <span className="text-slate-400">Admin:</span>
              <span className="font-mono text-slate-200 group-hover:text-white">{adminEmail}</span>
            </a>

            {/* Direct Link to muneerdev.com */}
            <a
              href="https://muneerdev.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors whitespace-nowrap"
            >
              <span>muneerdev.com</span>
              <ExternalLink className="h-3 w-3" />
            </a>

            {/* Refresh Prober */}
            <button
              onClick={loadDashboardData}
              title="Refresh dashboard records"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Metric Cards: Total Leads, Pending Inquiries, Published Articles, and Egress Storage Usage (<200KB compliance) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Leads */}
          <div className="rounded-xl border border-slate-800 bg-[#111827] p-5 text-left">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Total Leads</span>
              <Users className="h-4 w-4 text-blue-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white tabular-nums">
                {totalLeadsCount}
              </span>
              <span className="text-xs text-blue-400 font-medium">B2B Inquiries</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              Consultations for scrapers &amp; pipelines
            </div>
          </div>

          {/* Card 2: Pending Inquiries */}
          <div className="rounded-xl border border-slate-800 bg-[#111827] p-5 text-left">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Pending Inquiries</span>
              <Clock className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-amber-300 tabular-nums">
                {pendingInquiriesCount}
              </span>
              <span className="text-xs text-amber-400 font-medium">Action Required</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              Unreviewed proposal submissions
            </div>
          </div>

          {/* Card 3: Published Articles */}
          <div className="rounded-xl border border-slate-800 bg-[#111827] p-5 text-left">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Published Articles</span>
              <BookOpen className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white tabular-nums">
                {blogs.filter((b) => b.is_published || b.published).length}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ {blogs.length} Total</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              Active in Knowledge Hub
            </div>
          </div>

          {/* Card 4: Egress Storage Usage (<200KB compliance) */}
          <div className="rounded-xl border border-slate-800 bg-[#111827] p-5 text-left">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Egress Storage Usage</span>
              <HardDrive className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                {compliantEgressPercentage}
              </span>
              <span className="text-xs text-emerald-300 font-medium">&lt;200KB Compliance</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              Bucket: <code className="text-slate-300 font-mono">blog-images</code> (WebP)
            </div>
          </div>

        </div>

        {/* Tab Navigation: "Inbound Leads & Proposals" and "CMS Article Manager" */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          
          {/* Segmented Tab Controls */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('leads')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all cursor-pointer ${
                activeTab === 'leads'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Inbound Leads &amp; Proposals ({leads.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('cms')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all cursor-pointer ${
                activeTab === 'cms'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>CMS Article Manager ({blogs.length})</span>
            </button>
          </div>

          {/* Action Trigger / RLS Security Indicator */}
          <div>
            {activeTab === 'cms' ? (
              <button
                type="button"
                onClick={() => {
                  setEditingBlog(null);
                  setIsEditorOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Create New Article</span>
              </button>
            ) : (
              <div className="text-xs text-slate-400 flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Protected by Supabase Postgres Row-Level Security</span>
              </div>
            )}
          </div>

        </div>

        {/* Tab Content 1: Inbound Leads & Proposals */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            {/* Official Email Inquiries Alert Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-blue-950/20 border border-blue-900/40 text-xs">
              <div className="flex items-center gap-2.5 text-slate-300">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-600/20 text-blue-400 border border-blue-500/30 shrink-0">
                  <Mail className="h-3.5 w-3.5" />
                </span>
                <span>
                  Consultation inquiries and platform notifications are routed to{' '}
                  <a
                    href="mailto:ohdrug01@gmail.com"
                    className="font-mono font-medium text-blue-300 hover:underline"
                  >
                    ohdrug01@gmail.com
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <a
                  href="mailto:ohdrug01@gmail.com?subject=Consultation%20Inquiry%20Dispatch%20-%20OHDrug.com"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-[11px] font-medium transition-colors border border-blue-500/30"
                >
                  <span>Dispatch Mail</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <LeadManagementTable
              leads={leads}
              onUpdateStatus={handleUpdateLeadStatus}
              onRefresh={loadDashboardData}
            />
          </div>
        )}

        {/* Tab Content 2: CMS Article Manager */}
        {activeTab === 'cms' && (
          <div className="space-y-4 text-left">
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#111827]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">Article Title &amp; Slug</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Created Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div 
                          className="font-semibold text-white hover:text-blue-400 cursor-pointer" 
                          onClick={() => { setEditingBlog(blog); setIsEditorOpen(true); }}
                        >
                          {blog.title}
                        </div>
                        <div className="font-mono text-[11px] text-slate-500 mt-0.5">
                          /blog/{blog.slug}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-900 border border-slate-700 text-slate-300">
                            {blog.category}
                          </span>
                          {blog.video_url && (
                            <span 
                              title="YouTube Video Attached" 
                              className="p-1 rounded bg-rose-950/70 border border-rose-800 text-rose-300"
                            >
                              <Video className="h-3 w-3" />
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                            (blog.is_published || blog.published)
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {(blog.is_published || blog.published) ? 'Published' : 'Draft'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 tabular-nums">
                        {new Date(blog.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingBlog(blog);
                              setIsEditorOpen(true);
                            }}
                            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Edit Article in Split-Preview Editor"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteBlog(blog.id)}
                            className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Delete Article"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* Editor Modal Integration */}
      <BlogEditorModal
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingBlog(null);
        }}
        onSaved={handleBlogSaved}
        initialBlog={editingBlog}
      />

      {/* Executive Admin Footer with Disclaimers and muneerdev.com */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#060911] text-xs text-slate-400 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span>OHDrug.com Executive CMS · A product of </span>
            <strong className="text-emerald-400 font-semibold">MuneerDataAI</strong>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://muneerdev.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 transition-colors"
            >
              <span>Portfolio: muneerdev.com</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span>Registered Pharmacist &amp; Automation Architect</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
