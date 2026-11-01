/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * OHDrug.com — A product of MuneerDataAI
 * Lead Capture & Consultation Request Modal
 * Direct Integration with Supabase 'leads' Table
 */

import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, AlertCircle, Loader2, Lock, ShieldCheck, Mail, Copy, Check, ExternalLink } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase/client';
import { sendLeadNotificationEmail, generateDirectMailtoUrl } from '@/src/lib/utils/emailDispatcher';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

export function LeadCaptureModal({
  isOpen,
  onClose,
  defaultService,
}: LeadCaptureModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    serviceNeeded: defaultService || 'B2B Healthcare Data Extraction',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyOfficialEmail = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('ohdrug01@gmail.com');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  useEffect(() => {
    if (defaultService) {
      setFormData((prev) => ({ ...prev, serviceNeeded: defaultService }));
    }
  }, [defaultService]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Please complete all required fields.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid business email address.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      let createdId = `lead-${Date.now().toString(36)}`;

      if (isSupabaseConfigured) {
        const { data, error } = await (supabase.from('leads') as any)
          .insert({
            name: formData.name.trim(),
            email: formData.email.trim(),
            company: formData.company.trim() || null,
            service_needed: formData.serviceNeeded,
            message: formData.message.trim(),
            status: 'new',
          })
          .select('id')
          .single();

        if (error) {
          throw new Error(error.message);
        }

        if (data?.id) {
          createdId = data.id;
        }
      } else {
        // Fallback simulated database transaction when running in preview before keys are configured
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      setSubmittedLeadId(createdId);

      // Trigger automated email dispatch to ohdrug01@gmail.com (Resend / Email API)
      await sendLeadNotificationEmail({
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim(),
        serviceNeeded: formData.serviceNeeded,
        message: formData.message.trim(),
        leadId: createdId,
      });

      setStatus('success');
    } catch (err: any) {
      console.error('Error submitting consultation lead:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Failed to submit inquiry. Please try again.');
    }
  };

  const resetAndClose = () => {
    setStatus('idle');
    setFormData({
      name: '',
      email: '',
      company: '',
      serviceNeeded: 'B2B Healthcare Data Extraction',
      message: '',
    });
    setSubmittedLeadId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={resetAndClose}
        aria-hidden="true"
      />

      {/* Modal Surface */}
      <div className="relative w-full max-w-lg bg-[#111827] border border-slate-800 rounded-xl shadow-2xl p-6 sm:p-8 z-10 my-8">
        
        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {status === 'success' ? (
          <div className="text-center py-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Consultation Request Received</h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Thank you for reaching out to <span className="text-emerald-400 font-semibold">MuneerDataAI</span>. Muneer (Registered Pharmacist &amp; Automation Architect) will review your project parameters within 24 business hours.
            </p>

            <div className="mt-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center justify-center gap-2">
              <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Automated notification dispatched to <strong className="font-mono text-white">ohdrug01@gmail.com</strong></span>
            </div>

            {submittedLeadId && (
              <div className="mt-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono">
                Reference ID: <span className="text-blue-400 select-all">{submittedLeadId}</span>
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <a
                href={generateDirectMailtoUrl({
                  name: formData.name,
                  email: formData.email,
                  company: formData.company,
                  serviceNeeded: formData.serviceNeeded,
                  message: formData.message,
                  leadId: submittedLeadId || undefined,
                })}
                className="w-full sm:w-1/2 py-2.5 px-4 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                <Mail className="h-3.5 w-3.5 text-blue-400" />
                <span>Open in Email Client</span>
              </a>
              <button
                type="button"
                onClick={resetAndClose}
                className="w-full sm:w-1/2 py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer"
              >
                Close &amp; Return
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-5">
              <div className="text-xs font-semibold text-emerald-400 tracking-wider uppercase mb-1">
                Executive Consultation
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Connect with Muneer
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Registered Pharmacist &amp; Automation Architect · A product of MuneerDataAI
              </p>
            </div>

            {/* Direct Official Email Quick Connect Box */}
            <div className="mb-5 p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600/20 text-blue-400 border border-blue-500/30 shrink-0">
                  <Mail className="h-4 w-4" />
                </span>
                <div className="truncate text-left">
                  <div className="text-[11px] text-slate-400">Official Contact Email:</div>
                  <a
                    href="mailto:ohdrug01@gmail.com?subject=Consultation%20Inquiry%20-%20OHDrug.com"
                    className="font-mono font-medium text-blue-300 hover:text-blue-200 underline underline-offset-2"
                  >
                    ohdrug01@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyOfficialEmail}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors border border-slate-700 cursor-pointer"
                  title="Copy email to clipboard"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-slate-400" />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>
                <a
                  href="mailto:ohdrug01@gmail.com?subject=Consultation%20Inquiry%20-%20OHDrug.com"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 text-[11px] font-medium transition-colors border border-blue-500/30"
                >
                  <span>Mailto</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Error Banner */}
            {status === 'error' && (
              <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-red-950/40 border border-red-800 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-slate-300 mb-1.5">
                    Your Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Dr. Alex Vance"
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1.5">
                    Work Email <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@pharma-corp.com"
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="company" className="block text-xs font-medium text-slate-300 mb-1.5">
                    Company / Organization
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="BioTech Ventures LLC"
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block text-xs font-medium text-slate-300 mb-1.5">
                    Service Required <span className="text-rose-400">*</span>
                  </label>
                  <select
                    id="service"
                    value={formData.serviceNeeded}
                    onChange={(e) => setFormData({ ...formData, serviceNeeded: e.target.value })}
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                  >
                    <option value="B2B Healthcare Data Extraction">B2B Healthcare Data Extraction</option>
                    <option value="Clinical & Executive Dashboards">Clinical &amp; Executive Dashboards</option>
                    <option value="Custom Healthcare Software Pipelines">Custom Healthcare Software Pipelines</option>
                    <option value="Full Architecture & Strategy">Full Architecture &amp; Strategy Audit</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Project Details &amp; Technical Requirements <span className="text-rose-400">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your data sources, target volume, integration endpoints, or clinical workflow goals..."
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-none"
                />
              </div>

              {/* Security & Disclaimer Note */}
              <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                <Lock className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Submissions are encrypted and stored with Supabase Row Level Security.</span>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-60 rounded-lg shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving to Supabase Pipeline...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Consultation Request</span>
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
