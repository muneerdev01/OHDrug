/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * OHDrug.com — A product of MuneerDataAI
 * Sticky Glassmorphism Navigation Bar & Mobile Drawer
 * Features direct links to muneerdev.com portfolio and Knowledge Hub
 */

import React, { useState } from 'react';
import { Menu, X, ArrowRight, Activity, ExternalLink, Mail } from 'lucide-react';

interface NavbarProps {
  onOpenConsultation: () => void;
  onNavigate?: (path: string) => void;
}

export function Navbar({ onOpenConsultation, onNavigate }: NavbarProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (href.startsWith('/')) {
      e.preventDefault();
      if (onNavigate) {
        onNavigate(href);
      } else if (typeof window !== 'undefined') {
        window.location.href = href;
      }
    }
  };

  const navLinks = [
    { label: 'Solutions', href: '/#solutions' },
    { label: 'Data Hub', href: '/#data-hub' },
    { label: 'Articles', href: '/blog' },
    { label: 'About', href: '/#about' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090d16]/85 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
          
          {/* Brand Wordmark & MuneerDataAI Provenance */}
          <div className="flex items-center gap-3 shrink-0">
            <a 
              href="/" 
              onClick={(e) => handleLinkClick(e, '/')}
              className="group flex flex-col justify-center text-left"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <Activity className="h-4 w-4" />
                </span>
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  OHDrug<span className="text-blue-500">.com</span>
                </span>
              </div>
              <span className="text-[10px] font-medium tracking-wide text-slate-400 pl-9 -mt-0.5">
                A product of <span className="text-emerald-400 font-semibold">MuneerDataAI</span>
              </span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="hover:text-white transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-blue-500 after:transition-all whitespace-nowrap shrink-0"
              >
                {link.label}
              </a>
            ))}

            {/* Direct Link to Muneer's Primary Portfolio: muneerdev.com */}
            <a
              href="https://muneerdev.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-all whitespace-nowrap shrink-0"
            >
              <span>muneerdev.com</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </nav>

          {/* Primary CTA & Mobile Hamburger */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenConsultation}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-lg shadow-sm hover:shadow-blue-500/20 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Book Consultation</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            {/* Mobile Drawer Hamburger */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop & Menu */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-xs bg-[#111827] border-l border-slate-800 h-full p-6 flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-slate-800">
                <div>
                  <span className="text-lg font-bold text-white">OHDrug.com</span>
                  <p className="text-[10px] text-emerald-400 font-medium">A product of MuneerDataAI</p>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      setMobileDrawerOpen(false);
                      handleLinkClick(e, link.href);
                    }}
                    className="text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 px-3 py-2.5 rounded-lg transition-colors"
                  >
                    {link.label}
                  </a>
                ))}

                {/* Official Contact Email */}
                <a
                  href="mailto:ohdrug01@gmail.com"
                  className="mt-2 flex items-center justify-between text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 px-3 py-2.5 rounded-lg"
                >
                  <span className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-blue-400" />
                    <span className="font-mono">ohdrug01@gmail.com</span>
                  </span>
                  <span className="text-[10px] text-blue-400 font-semibold">Email</span>
                </a>

                {/* Direct Link to muneerdev.com */}
                <a
                  href="https://muneerdev.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center justify-between text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2.5 rounded-lg"
                >
                  <span>Muneer Portfolio (muneerdev.com)</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 space-y-3">
              <div className="text-xs text-slate-400 px-1">
                Registered Pharmacist &amp; Automation Architect
              </div>
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  onOpenConsultation();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow transition-colors cursor-pointer"
              >
                <span>Book Consultation</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
