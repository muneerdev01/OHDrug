/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * OHDrug.com — A product of MuneerDataAI
 * Executive Clean Footer with Single-Instance Portfolio, Email & Legal Disclaimers
 */

import React from 'react';
import { Activity, ShieldAlert, Award, ExternalLink, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#060911] border-t border-slate-800/80 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        {/* Brand & Mission Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Left Column: Brand Logo & Tagline */}
          <div className="md:col-span-6 space-y-4 text-left">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <Activity className="h-3.5 w-3.5" />
              </span>
              <span className="text-lg font-bold text-white tracking-tight">
                OHDrug<span className="text-blue-500">.com</span>
              </span>
            </div>

            <p className="text-xs text-slate-300 font-medium">
              A product of <span className="text-emerald-400 font-semibold">MuneerDataAI</span>
            </p>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Specialized B2B data engineering, healthcare web scraping pipelines, and clinical analytics dashboards founded and engineered by Muneer — Registered Pharmacist &amp; Automation Architect.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Award className="h-3.5 w-3.5 text-blue-400" />
              <span>PharmD Clinical Foundation · Full-Stack Automation Architecture</span>
            </div>
          </div>

          {/* Middle Column: Platform Links with Single Portfolio Link */}
          <div className="md:col-span-3 space-y-3 text-left">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-200">Platform &amp; Hub</div>
            <ul className="space-y-2">
              <li>
                <a href="/blog" className="hover:text-slate-200 transition-colors">
                  Knowledge Hub &amp; Articles
                </a>
              </li>
              <li>
                <a href="/admin/dashboard" className="hover:text-slate-200 transition-colors">
                  Admin CMS Console
                </a>
              </li>
              <li>
                <a href="/#solutions" className="hover:text-slate-200 transition-colors">
                  B2B Healthcare Extraction
                </a>
              </li>
              <li>
                <a href="/#data-hub" className="hover:text-slate-200 transition-colors">
                  Clinical Analytics Engine
                </a>
              </li>
              <li>
                <a href="/#solutions" className="hover:text-slate-200 transition-colors">
                  Custom Software Pipelines
                </a>
              </li>
              <li>
                {/* Single Portfolio Link in Platform Links */}
                <a
                  href="https://muneerdev.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 text-emerald-400 font-medium inline-flex items-center gap-1 transition-colors"
                >
                  <span>muneerdev.com Portfolio</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Right Column: Governance & Privacy */}
          <div className="md:col-span-3 space-y-3 text-left">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-200">Governance &amp; Privacy</div>
            <ul className="space-y-2">
              <li>
                <span className="text-slate-400">Postgres Row Level Security (RLS)</span>
              </li>
              <li>
                <span className="text-slate-400">Encrypted Inbound Pipeline</span>
              </li>
              <li>
                <span className="text-slate-400">Educational Research Scope</span>
              </li>
              <li>
                <span className="text-slate-400">Zero-Mock Schema Validation</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Mandatory Medical & Legal Disclaimers */}
        <div className="pt-8 pb-8 text-left space-y-3 border-b border-slate-800/60">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed text-slate-400">
              <strong className="text-slate-300 font-semibold">Comprehensive Medical &amp; Legal Disclaimer: </strong>
              OHDrug.com is an educational technology demonstration and portfolio platform developed by MuneerDataAI. All analytical metrics, sample clinical datasets, automated scraping demonstrations, and software architectures displayed on this site are strictly intended for general research, learning, and enterprise technical evaluation. Nothing herein constitutes clinical medical advice, pharmacotherapy diagnosis, treatment recommendation, or prescriptive guidance. Healthcare practitioners and organizations must verify all drug data against official regulatory bodies and approved prescribing literature before making patient-care decisions.
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Single Email Link */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            &copy; {currentYear} <span className="text-slate-300 font-medium">OHDrug.com</span>. All rights reserved. A product of <span className="text-emerald-400 font-medium">MuneerDataAI</span>.
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {/* Single Email Link in Bottom Bar */}
            <a
              href="mailto:ohdrug01@gmail.com"
              className="text-slate-300 hover:text-white font-mono inline-flex items-center gap-1.5 transition-colors"
            >
              <Mail className="h-3 w-3 text-blue-400" />
              <span>ohdrug01@gmail.com</span>
            </a>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span>Registered Pharmacist &amp; Automation Architect</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
