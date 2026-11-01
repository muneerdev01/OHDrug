/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * OHDrug.com — A product of MuneerDataAI
 * Author Profile Card with Direct Portfolio Link to muneerdev.com
 */

import React from 'react';
import { ExternalLink, Award, Code, Stethoscope } from 'lucide-react';

interface AuthorCardProps {
  className?: string;
  compact?: boolean;
}

export function AuthorCard({ className = '', compact = false }: AuthorCardProps) {
  if (compact) {
    return (
      <div className={`flex items-center gap-3 text-xs text-slate-300 ${className}`}>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold text-xs">
          M
        </div>
        <div className="leading-tight">
          <div className="font-semibold text-white">
            Muneer{' '}
            <span className="font-normal text-slate-400">· Automation Architect &amp; RPh</span>
          </div>
          <a
            href="https://muneerdev.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>muneerdev.com</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-slate-800 bg-[#111827] p-6 sm:p-7 text-left ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600/20 to-emerald-600/20 border border-blue-500/30 text-white font-bold text-lg">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-white">Muneer</h4>
              <span className="text-xs text-slate-400">(@muneerdev)</span>
            </div>
            <p className="text-xs text-emerald-400 font-medium mt-0.5">
              Automation Architect &amp; Founder at <strong className="font-semibold">MuneerDataAI</strong>
            </p>
          </div>
        </div>

        <a
          href="https://muneerdev.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-xs font-semibold text-blue-300 hover:text-white transition-all whitespace-nowrap"
        >
          <span>Explore muneerdev.com</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="mt-4 text-xs text-slate-300 leading-relaxed">
        Registered Pharmacist (PharmD) and Lead Automation Architect specializing in distributed web scrapers, high-throughput pharmaceutical data pipelines, Next.js 15 enterprise software, and clinical intelligence dashboards.
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="flex items-center gap-1">
            <Stethoscope className="h-3 w-3 text-emerald-400" />
            Registered Pharmacist
          </span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span className="flex items-center gap-1">
            <Code className="h-3 w-3 text-blue-400" />
            Automation Architect
          </span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span className="text-slate-300 font-medium">A product of MuneerDataAI</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500">Contact:</span>
          <a
            href="mailto:ohdrug01@gmail.com"
            className="font-mono text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
          >
            ohdrug01@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
