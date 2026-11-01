/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * OHDrug.com — A product of MuneerDataAI
 * Step 4 — The Dual News-Style Editorial Newsroom Hub
 * 
 * Architecture:
 * 1. Top Hero Section: Single most recent published article with YouTube player preview toggle
 * 2. 3-Column Structured Dispatch Grid:
 *    - Column 1: Medicine Info (WHO EML lists, ATC classification, clinical dosage safety)
 *    - Column 2: Data Analytics & Case Studies (Kaggle dataset analyses, WHO regional price trends)
 *    - Column 3: MedTech & Pharma Articles (Research syntheses, robotic dispensing, AI)
 * 3. Author Profile Card: "Written by Muneer — Registered Pharmacist & Automation Architect"
 */

import React, { useState } from 'react';
import { 
  Clock, 
  ArrowRight, 
  ExternalLink, 
  Video, 
  Play, 
  Sparkles, 
  Calendar, 
  FileText, 
  Database, 
  Cpu, 
  Stethoscope, 
  Activity, 
  Layers, 
  CheckCircle2, 
  ArrowUpRight,
  ShieldCheck,
  Mail
} from 'lucide-react';
import type { EditorialArticle } from '@/src/data/blogArticles';
import { getYouTubeEmbedUrl } from '@/src/lib/utils/youtube';
import { AuthorCard } from '@/src/components/blog/AuthorCard';

interface EditorialNewsroomProps {
  articles: EditorialArticle[];
  onSelectArticle: (slug: string) => void;
}

export function EditorialNewsroom({ articles, onSelectArticle }: EditorialNewsroomProps) {
  // Sort articles by created_at descending to guarantee top hero is the single most recent article
  const sortedArticles = [...articles].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Top single most recent article
  const mostRecentArticle = sortedArticles[0];

  // Remaining articles for the 3-column curated dispatch grid
  const remainingArticles = sortedArticles.slice(1);

  // Filter into the 3 specified columns
  const medicineInfoArticles = remainingArticles.filter(
    (a) => a.category.toLowerCase().includes('medicine') || a.category.toLowerCase().includes('healthcare')
  );

  const dataAnalyticsArticles = remainingArticles.filter(
    (a) => a.category.toLowerCase().includes('data') || a.category.toLowerCase().includes('scraping')
  );

  const medTechArticles = remainingArticles.filter(
    (a) => a.category.toLowerCase().includes('medtech') || a.category.toLowerCase().includes('tech stack') || a.category.toLowerCase().includes('next.js')
  );

  // Active Hero Media View: 'video' | 'cover'
  const heroEmbedUrl = getYouTubeEmbedUrl(mostRecentArticle?.video_url);
  const [heroMediaMode, setHeroMediaMode] = useState<'video' | 'cover'>(heroEmbedUrl ? 'video' : 'cover');

  return (
    <div className="bg-[#090d16] text-slate-100">
      
      {/* =========================================================================
          SECTION 1: EDITORIAL MASTHEAD & TOP HERO SPOTLIGHT (SINGLE MOST RECENT)
          ========================================================================= */}
      <section className="pt-6 pb-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Hero Layout: Single Most Recent Published Article */}
          {mostRecentArticle && (
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-[#111827] to-[#0c101a] p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                
                {/* Left/Main Column: Media Player (YouTube or Compressed Cover) */}
                <div className="lg:col-span-7 flex flex-col">
                  {/* Media Mode Toggle (if video_url is present) */}
                  {heroEmbedUrl && (
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <span className="text-slate-400 font-medium flex items-center gap-1.5">
                        <Video className="h-3.5 w-3.5 text-rose-400" />
                        <span>Technical Video Tutorial Attached</span>
                      </span>
                      <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800">
                        <button
                          type="button"
                          onClick={() => setHeroMediaMode('video')}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                            heroMediaMode === 'video'
                              ? 'bg-rose-600 text-white'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Watch Video
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeroMediaMode('cover')}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                            heroMediaMode === 'cover'
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Cover Image
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Media Frame */}
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-800 bg-black shadow-lg">
                    {heroEmbedUrl && heroMediaMode === 'video' ? (
                      <iframe
                        src={heroEmbedUrl}
                        title={mostRecentArticle.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div 
                        className="w-full h-full relative cursor-pointer group"
                        onClick={() => onSelectArticle(mostRecentArticle.slug)}
                      >
                        <img
                          src={mostRecentArticle.cover_image_url || '/src/assets/images/blog_hero_scraping_1793296918064.jpg'}
                          alt={mostRecentArticle.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded bg-[#090d16]/90 border border-slate-700 backdrop-blur-md text-[11px] font-bold text-blue-400">
                            {mostRecentArticle.category}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-emerald-400 border border-emerald-900/60">
                            Storage: &lt;200KB WebP
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Editorial Article Intelligence */}
                <div className="lg:col-span-5 flex flex-col justify-between text-left">
                  <div>
                    {/* Metadata Badges */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 uppercase tracking-wider text-[10px]">
                        Single Most Recent Dispatch
                      </span>
                      <span aria-hidden="true" className="text-slate-700">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-500" />
                        <span>{mostRecentArticle.readingTimeMinutes} min read</span>
                      </span>
                      <span aria-hidden="true" className="text-slate-700">·</span>
                      <span>
                        {new Date(mostRecentArticle.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Headline */}
                    <h1 
                      onClick={() => onSelectArticle(mostRecentArticle.slug)}
                      className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-snug hover:text-blue-400 transition-colors cursor-pointer"
                    >
                      {mostRecentArticle.title}
                    </h1>

                    {/* Executive Excerpt */}
                    <p className="mt-3 text-sm text-slate-300 leading-relaxed line-clamp-3">
                      {mostRecentArticle.excerpt}
                    </p>

                    {/* Direct Answer Summary Box */}
                    {mostRecentArticle.directAnswerSummary && (
                      <div className="mt-4 p-3 rounded-lg bg-blue-950/20 border border-blue-900/40 text-left">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-1 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-blue-400" />
                          <span>Direct Answer Summary</span>
                        </div>
                        <p className="text-xs text-blue-200/90 leading-relaxed">
                          {mostRecentArticle.directAnswerSummary}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Bar & Author Attribution */}
                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="text-xs text-slate-400">
                      <span>Written by </span>
                      <a
                        href="https://muneerdev.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-white hover:text-emerald-400 inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Muneer</span>
                        <ExternalLink className="h-3 w-3 text-emerald-400" />
                      </a>
                      <span className="block text-[11px] text-slate-500 mt-0.5">
                        Registered Pharmacist &amp; Automation Architect
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectArticle(mostRecentArticle.slug)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-lg shadow-blue-950/40 transition-all cursor-pointer"
                    >
                      <span>Read Technical Briefing</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </section>

      {/* =========================================================================
          SECTION 2: 3-COLUMN STRUCTURED DISPATCH GRID
          Column 1: Medicine Info (WHO EML, ATC, Dosage)
          Column 2: Data Analytics & Case Studies (Kaggle, Price Trends)
          Column 3: MedTech & Pharma Articles (Syntheses, Automation, AI)
          ========================================================================= */}
      <section className="py-16 bg-[#070b13] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Masthead */}
          <div className="pb-8 mb-10 border-b border-slate-800 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                <Layers className="h-3.5 w-3.5" />
                <span>Curated Research &amp; Engineering Grid</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                3-Column Structured Dispatches
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Continuous technical publications cataloged by pharmacology rigor, data engineering, and health-tech systems.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1 font-mono text-[11px] text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>All assets &lt;200KB WebP compliant</span>
              </span>
            </div>
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* -------------------------------------------------------------
                COLUMN 1: Medicine Info
                ------------------------------------------------------------- */}
            <div className="flex flex-col space-y-6">
              {/* Column Header */}
              <div className="p-4 rounded-xl bg-[#111827] border border-blue-900/40 border-l-4 border-l-blue-500 text-left">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-blue-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Medicine Info
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    Col 01
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  WHO Model Lists of Essential Medicines (EML), ATC classification hierarchies &amp; clinical dosage safety formulas.
                </p>
              </div>

              {/* Column Articles */}
              <div className="space-y-6">
                {medicineInfoArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} onSelectArticle={onSelectArticle} />
                ))}
                {medicineInfoArticles.length === 0 && (
                  <EmptyColumnPlaceholder title="Medicine Info articles loading..." />
                )}
              </div>
            </div>

            {/* -------------------------------------------------------------
                COLUMN 2: Data Analytics & Case Studies
                ------------------------------------------------------------- */}
            <div className="flex flex-col space-y-6">
              {/* Column Header */}
              <div className="p-4 rounded-xl bg-[#111827] border border-emerald-900/40 border-l-4 border-l-emerald-500 text-left">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Data Analytics
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Col 02
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Kaggle dataset analyses, WHO regional procurement price trends &amp; sub-85ms PostgreSQL RLS aggregations.
                </p>
              </div>

              {/* Column Articles */}
              <div className="space-y-6">
                {dataAnalyticsArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} onSelectArticle={onSelectArticle} />
                ))}
                {dataAnalyticsArticles.length === 0 && (
                  <EmptyColumnPlaceholder title="Data Analytics articles loading..." />
                )}
              </div>
            </div>

            {/* -------------------------------------------------------------
                COLUMN 3: MedTech & Pharma Articles
                ------------------------------------------------------------- */}
            <div className="flex flex-col space-y-6">
              {/* Column Header */}
              <div className="p-4 rounded-xl bg-[#111827] border border-purple-900/40 border-l-4 border-l-purple-500 text-left">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-purple-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      MedTech &amp; Pharma
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                    Col 03
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Synthesis of peer-reviewed papers, robotic pharmacy integration, ANSI X12 850 EDI &amp; healthcare AI pipelines.
                </p>
              </div>

              {/* Column Articles */}
              <div className="space-y-6">
                {medTechArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} onSelectArticle={onSelectArticle} />
                ))}
                {medTechArticles.length === 0 && (
                  <EmptyColumnPlaceholder title="MedTech articles loading..." />
                )}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: INTEGRATED AUTHOR PROFILE CARD & PORTFOLIO SPOTLIGHT
          ========================================================================= */}
      <section className="py-14 bg-[#090d16]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <AuthorCard />
        </div>
      </section>

    </div>
  );
}

/**
 * Reusable Card for 3-Column Grid with YouTube indicators, <200KB thumbnail & direct attribution
 */
function ArticleCard({ 
  article, 
  onSelectArticle 
}: { 
  article: EditorialArticle; 
  onSelectArticle: (slug: string) => void;
}) {
  const hasVideo = Boolean(article.video_url && getYouTubeEmbedUrl(article.video_url));

  return (
    <article
      onClick={() => onSelectArticle(article.slug)}
      className="group rounded-xl border border-slate-800 bg-[#111827] overflow-hidden hover:border-slate-700 hover:shadow-xl hover:shadow-blue-950/20 transition-all cursor-pointer text-left flex flex-col justify-between"
    >
      <div>
        {/* Cover Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-900 border-b border-slate-800">
          <img
            src={article.cover_image_url || '/src/assets/images/blog_hero_scraping_1793296918064.jpg'}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-[#090d16]/90 border border-slate-700 backdrop-blur-md text-[10px] font-semibold text-blue-400">
              {article.category}
            </span>
          </div>

          {/* YouTube Video Badge if present */}
          {hasVideo && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded bg-rose-950/90 border border-rose-800 text-[10px] font-semibold text-rose-300 backdrop-blur-md">
              <Play className="h-2.5 w-2.5 fill-rose-300" />
              <span>Video</span>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-5">
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-slate-500" />
              <span>{article.readingTimeMinutes} min read</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {new Date(article.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>

          <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-400 leading-snug tracking-tight transition-colors line-clamp-2">
            {article.title}
          </h4>

          <p className="mt-2 text-xs text-slate-300 leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
        </div>
      </div>

      {/* Card Footer with Link */}
      <div className="px-5 pb-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-400 font-medium">
          Muneer (<a href="https://muneerdev.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline" onClick={(e) => e.stopPropagation()}>muneerdev.com</a>)
        </span>
        <div className="flex items-center gap-1 font-semibold text-blue-400 group-hover:translate-x-0.5 transition-transform">
          <span>Read</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </article>
  );
}

function EmptyColumnPlaceholder({ title }: { title: string }) {
  return (
    <div className="p-6 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
      <Layers className="h-6 w-6 mx-auto mb-2 text-slate-600" />
      <span>{title}</span>
    </div>
  );
}
