/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * OHDrug.com — A product of MuneerDataAI
 * Services Grid: B2B Extraction, Clinical Dashboards & Healthcare Pipelines
 */

import React from 'react';
import { 
  Database, 
  LineChart, 
  Workflow, 
  ArrowUpRight, 
  Layers, 
  Binary, 
  SlidersHorizontal, 
  ExternalLink 
} from 'lucide-react';

interface ServicesGridProps {
  onSelectService: (serviceName: string) => void;
}

export function ServicesGrid({ onSelectService }: ServicesGridProps) {
  const services = [
    {
      id: 'extraction',
      number: '01',
      title: 'B2B Healthcare Data Extraction',
      subtitle: 'Automated Drug Pricing, Formulary Crawlers & Regulatory Feeds',
      description:
        'Custom high-concurrency web scrapers and ETL workflows engineered to aggregate hospital tender prices, online pharmacy catalogs, and national drug registries with automated deduplication and schema validation.',
      metrics: [
        { label: 'Daily Data Points', value: '250k+' },
        { label: 'Data Accuracy', value: '99.94%' },
        { label: 'Egress Compliance', value: '<200KB assets' },
      ],
      techStack: ['Python', 'Playwright', 'PostgreSQL', 'FastAPI', 'Redis'],
      icon: Database,
      highlightColor: 'from-blue-500/20 to-transparent',
    },
    {
      id: 'dashboards',
      number: '02',
      title: 'Clinical & Executive Analytics Dashboards',
      subtitle: 'FastAPI + Next.js Dynamic Visualizations for Pharma & CROs',
      description:
        'Interactive business intelligence platforms combining clinical pharmacokinetics, prescription trends, and market pricing intelligence into sub-second, executive-ready analytical interfaces.',
      metrics: [
        { label: 'Query Latency', value: '<85ms' },
        { label: 'Pipeline Auth', value: 'Row Level Security' },
        { label: 'Architecture', value: 'Server Components' },
      ],
      techStack: ['Next.js 15', 'FastAPI', 'Supabase RLS', 'Tailwind CSS', 'Tremor'],
      icon: LineChart,
      highlightColor: 'from-emerald-500/20 to-transparent',
    },
    {
      id: 'pipelines',
      number: '03',
      title: 'Custom Healthcare Software Pipelines',
      subtitle: 'Outpatient (OPD), Pharmacy Inventory & Intake Workflows',
      description:
        'Resilient software architectures engineered specifically for clinical workflows: drug dispensing validation, inventory reordering rules, electronic patient intake pipelines, and custom HL7/FHIR converters.',
      metrics: [
        { label: 'Workflow Efficiency', value: '+68%' },
        { label: 'Clinical Accuracy', value: 'PharmD Verified' },
        { label: 'Data Security', value: 'Zero-Leak Audited' },
      ],
      techStack: ['TypeScript', 'Supabase Storage', 'Express Proxy', 'Postgres', 'Docker'],
      icon: Workflow,
      highlightColor: 'from-purple-500/20 to-transparent',
    },
  ];

  return (
    <section id="solutions" className="py-20 bg-[#090d16] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 text-left">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 tracking-wider uppercase mb-2">
            <span>Specialized Capabilities</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>MuneerDataAI Core Architectures</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight text-balance">
            Engineered specifically for Pharma Enterprises, Biotech Researchers &amp; Health-Tech Startups.
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            Eliminating operational bottlenecks by merging deep clinical pharmacy mastery with robust cloud software pipelines and high-throughput data extraction.
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-800 bg-[#111827] p-7 transition-all duration-200 hover:border-slate-700 hover:shadow-xl hover:shadow-blue-950/20"
              >
                <div>
                  {/* Card Header & Numbering */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                    <span className="font-mono text-sm font-semibold text-blue-400">
                      {service.number}
                    </span>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 group-hover:text-blue-400 transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="mt-5">
                    <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-slate-400">
                      {service.subtitle}
                    </p>
                    <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Quantitative Impact Metrics */}
                  <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-left">
                    {service.metrics.map((metric) => (
                      <div key={metric.label}>
                        <div className="font-mono text-base font-bold text-white tabular-nums">
                          {metric.value}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack Unboxed Text Metadata */}
                  <div className="mt-6 pt-4 border-t border-slate-800/60">
                    <div className="text-[11px] font-medium text-slate-400 mb-2">Primary Technology:</div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-300">
                      {service.techStack.map((tech, idx) => (
                        <React.Fragment key={tech}>
                          <span className="font-mono text-slate-300">{tech}</span>
                          {idx < service.techStack.length - 1 && (
                            <span aria-hidden="true" className="text-slate-600">·</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="mt-8 pt-4">
                  <button
                    onClick={() => onSelectService(service.title)}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-slate-900/80 hover:bg-blue-600/10 border border-slate-800 hover:border-blue-500/40 text-xs font-semibold text-slate-200 hover:text-blue-400 transition-all cursor-pointer"
                  >
                    <span>Request Custom Scope</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
