/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * OHDrug.com — A product of MuneerDataAI
 * 3-Column Responsive Article Grid with Segmented Category Filter Tabs
 */

import React, { useState } from 'react';
import { Clock, ArrowUpRight, BookOpen, Layers } from 'lucide-react';
import type { EditorialArticle } from '@/src/data/blogArticles';

interface ArticleGridProps {
  articles: EditorialArticle[];
  onSelectArticle: (slug: string) => void;
}

export function ArticleGrid({ articles, onSelectArticle }: ArticleGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = [
    'All',
    'Web Scraping',
    'Data Engineering',
    'Next.js / Tech Stack',
    'Healthcare Insights',
  ];

  const filteredArticles = activeCategory === 'All'
    ? articles
    : articles.filter((a) => a.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section className="py-16 bg-[#090d16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Category Filter Tabs Bar (Interactive Buttons per frontend-design rule) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-10 border-b border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              All Technical Dispatches
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Engineering case studies, pipeline audits, and full-stack software breakdowns.
            </p>
          </div>

          {/* Segmented Filter Control */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Article Card Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 rounded-xl border border-dashed border-slate-800 p-8">
            <BookOpen className="h-8 w-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm text-slate-300 font-medium">No articles found in this category.</p>
            <button
              onClick={() => setActiveCategory('All')}
              className="mt-3 text-xs text-blue-400 hover:underline cursor-pointer"
            >
              Reset to All Articles
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                onClick={() => onSelectArticle(article.slug)}
                className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-[#111827] overflow-hidden hover:border-slate-700 hover:shadow-xl hover:shadow-blue-950/20 transition-all cursor-pointer text-left"
              >
                <div>
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900 border-b border-slate-800">
                    {article.cover_image_url ? (
                      <img
                        src={article.cover_image_url}
                        alt={article.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-900 text-slate-600">
                        <Layers className="h-8 w-8" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-[#090d16]/90 border border-slate-800 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold text-blue-400">
                      {article.category}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    {/* Quiet Metadata */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2.5">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-500" />
                        {article.readingTimeMinutes} min read
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {new Date(article.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 leading-snug tracking-tight transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="mt-3 text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                {/* Card Footer with Link */}
                <div className="px-6 pb-6 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">
                    By Muneer (muneerdev.com)
                  </span>
                  <div className="flex items-center gap-1 font-semibold text-blue-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Read Article</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
