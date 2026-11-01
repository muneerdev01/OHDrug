/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * OHDrug.com — A product of MuneerDataAI
 * News-Style Editorial Hero: Featured Spotlight + Trending Sidebar
 */

import React from 'react';
import { ArrowRight, Clock, ExternalLink, TrendingUp, Sparkles } from 'lucide-react';
import type { EditorialArticle } from '@/src/data/blogArticles';

interface NewsHeroProps {
  featuredArticle: EditorialArticle;
  trendingArticles: EditorialArticle[];
  onSelectArticle: (slug: string) => void;
}

export function NewsHero({
  featuredArticle,
  trendingArticles,
  onSelectArticle,
}: NewsHeroProps) {
  return (
    <section className="pt-6 pb-14 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Masthead Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-800/80 gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Knowledge Hub &amp; Tech Dispatch
            </span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="text-xs text-slate-400">
              A product of <span className="text-slate-200 font-semibold">MuneerDataAI</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Author &amp; Architect:</span>
            <a
              href="https://muneerdev.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 transition-colors"
            >
              <span>Muneer (muneerdev.com)</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Magazine 2-Column Split: Featured Left (7 cols) + Trending Right (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Main Featured Editorial Story */}
          <div className="lg:col-span-7 flex flex-col justify-between group">
            <div 
              onClick={() => onSelectArticle(featuredArticle.slug)}
              className="cursor-pointer"
            >
              {/* Cover Image Container */}
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900 border border-slate-800 mb-6 group-hover:border-slate-700 transition-all">
                <img
                  src={featuredArticle.cover_image_url || ''}
                  alt={featuredArticle.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-[#090d16]/90 border border-slate-800 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-semibold text-blue-400">
                  {featuredArticle.category}
                </div>
              </div>

              {/* Story Metadata (Unboxed text with dots per frontend-design) */}
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                <span className="font-semibold text-white">Featured Story</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-slate-500" />
                  {featuredArticle.readingTimeMinutes} min read
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  {new Date(featuredArticle.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug group-hover:text-blue-400 transition-colors">
                {featuredArticle.title}
              </h1>

              {/* Excerpt */}
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                {featuredArticle.excerpt}
              </p>
            </div>

            {/* Author Footer Lockup */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>By</span>
                <a
                  href="https://muneerdev.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-white hover:text-emerald-400 inline-flex items-center gap-1 transition-colors"
                >
                  <span>Muneer</span>
                  <ExternalLink className="h-2.5 w-2.5 text-emerald-400" />
                </a>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400">MuneerDataAI Lead</span>
              </div>

              <button
                onClick={() => onSelectArticle(featuredArticle.slug)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
              >
                <span>Read Full Article</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Trending Sidebar */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-slate-800 bg-[#111827]/70 p-6 sm:p-7">
            <div>
              <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-800">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Trending Automation &amp; Tech
                </h3>
              </div>

              <div className="divide-y divide-slate-800/80">
                {trendingArticles.map((article, index) => (
                  <article
                    key={article.id}
                    onClick={() => onSelectArticle(article.slug)}
                    className="py-4 first:pt-0 last:pb-0 group cursor-pointer text-left"
                  >
                    <div className="flex items-start gap-4">
                      {/* Rank Number */}
                      <span className="font-mono text-lg font-bold text-slate-500 group-hover:text-blue-400 transition-colors">
                        0{index + 1}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1">
                          <span className="text-blue-400 font-medium">{article.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{article.readingTimeMinutes} min read</span>
                        </div>

                        <h4 className="text-sm font-semibold text-slate-200 group-hover:text-white leading-snug line-clamp-2 transition-colors">
                          {article.title}
                        </h4>

                        <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
                          <span>By Muneer</span>
                          <span aria-hidden="true">·</span>
                          <span>
                            {new Date(article.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Direct Portfolio Link in Sidebar */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Architect Portfolio:</span>
              <a
                href="https://muneerdev.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 transition-colors"
              >
                <span>muneerdev.com</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
