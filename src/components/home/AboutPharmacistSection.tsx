/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * OHDrug.com — A product of MuneerDataAI
 * Executive Profile: Registered Pharmacist & Automation Architect (Muneer)
 */

import React from 'react';
import { Award, CheckCircle, Shield, Code, Stethoscope, Terminal } from 'lucide-react';

export function AboutPharmacistSection({ onOpenConsultation }: { onOpenConsultation: () => void }) {
  const credentials = [
    {
      title: 'Clinical Pharmacology Foundation',
      description:
        'Licensed Registered Pharmacist (RPh) with extensive hands-on experience in medication therapy management (MTM), outpatient formulary navigation, and healthcare compliance.',
      icon: Stethoscope,
    },
    {
      title: 'Full-Stack Data & Automation Architecture',
      description:
        'Architect of high-throughput web scraping clusters, FastAPI endpoints, Supabase Row-Level Security environments, and real-time clinical business intelligence dashboards.',
      icon: Code,
    },
    {
      title: 'Zero-Egress Data Discipline',
      description:
        'Engineers HIPAA-conscious pipelines that compress and validate high-density clinical and image data on the client side before writing to persistent Postgres and object storage.',
      icon: Shield,
    },
  ];

  return (
    <section id="about" className="py-20 bg-[#060911] border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 text-left">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 tracking-wider uppercase mb-2">
              <span>The Architect Behind MuneerDataAI</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              Where Clinical Rigor Meets Enterprise Engineering.
            </h2>

            <p className="mt-4 text-base text-slate-300 leading-relaxed">
              Standard software developers lack the clinical nuances of drug classifications, therapeutic duplications, and pharmaceutical supply chain realities. Conversely, clinical staff rarely write distributed web scrapers or architect Postgres RLS security policies.
            </p>

            <p className="mt-4 text-base text-slate-300 leading-relaxed">
              <span className="text-white font-semibold">Muneer</span> unifies both disciplines under <strong className="text-emerald-400 font-semibold">MuneerDataAI</strong> — delivering customized software and data scraping pipelines that are medically accurate, mathematically sound, and enterprise-grade.
            </p>

            <div className="mt-8">
              <button
                onClick={onOpenConsultation}
                className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer"
              >
                <span>Schedule Strategy Call with Muneer</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            {credentials.map((cred) => {
              const Icon = cred.icon;
              return (
                <div
                  key={cred.title}
                  className="flex items-start gap-4 p-5 rounded-xl bg-[#111827] border border-slate-800 hover:border-slate-700 transition-colors text-left"
                >
                  <div className="p-2 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20 shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{cred.title}</h3>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                      {cred.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
