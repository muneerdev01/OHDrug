/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * OHDrug.com — A product of MuneerDataAI
 * Clinical & Educational Disclaimer Banner
 */

import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, X } from 'lucide-react';

export function DisclaimerBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <aside 
      aria-label="Educational and Medical Disclaimer"
      className="relative z-50 bg-[#090d16]/95 border-b border-amber-500/25 px-4 py-2 text-xs text-slate-300 backdrop-blur-md transition-all duration-200"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-amber-500/10 text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <p className="leading-snug text-slate-300">
            <strong className="font-semibold text-amber-300">Educational Disclaimer: </strong>
            <span className="font-medium text-slate-200">OHDrug.com</span> is a product of{' '}
            <span className="font-medium text-emerald-400">MuneerDataAI</span>. All content, dataset analytics, and software architectural demonstrations are strictly for research, learning, and general informational purposes only. Not for clinical diagnosis or medical prescribing.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <ShieldCheck className="h-3 w-3" />
            General Info Only
          </span>
          <button
            onClick={() => setIsVisible(false)}
            aria-label="Dismiss disclaimer"
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
