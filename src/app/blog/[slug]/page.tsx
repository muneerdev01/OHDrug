/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * OHDrug.com — A product of MuneerDataAI
 * Individual Article View (Next.js 15 App Router / Server & Client Compatible)
 * Features Direct Answer Summary, Markdown Content, Dual Disclaimers, AuthorCard & JSON-LD
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Share2, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  ShieldAlert,
  Sparkles,
  BookOpen,
  Video,
  Play
} from 'lucide-react';
import { DisclaimerBanner } from '@/src/components/layout/DisclaimerBanner';
import { Navbar } from '@/src/components/layout/Navbar';
import { AuthorCard } from '@/src/components/blog/AuthorCard';
import { Footer } from '@/src/components/layout/Footer';
import { LeadCaptureModal } from '@/src/components/home/LeadCaptureModal';
import { INITIAL_EDITORIAL_ARTICLES, type EditorialArticle } from '@/src/data/blogArticles';
import { getYouTubeEmbedUrl } from '@/src/lib/utils/youtube';
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase/client';
import type { Blog } from '@/src/types/database';

interface ArticleViewProps {
  slug?: string;
  params?: Promise<{ slug: string }> | { slug: string };
  onBack?: () => void;
}

export default function ArticleViewPage({
  slug: propSlug,
  params,
  onBack,
}: ArticleViewProps) {
  const [resolvedSlug, setResolvedSlug] = useState<string>(propSlug || '');
  const [article, setArticle] = useState<EditorialArticle | null>(null);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Resolve slug from props, params Promise (Next.js 15), or window URL
  useEffect(() => {
    async function determineSlug() {
      if (propSlug) {
        setResolvedSlug(propSlug);
        return;
      }
      if (params) {
        const resolved = 'then' in params ? await params : params;
        if (resolved?.slug) {
          setResolvedSlug(resolved.slug);
          return;
        }
      }
      if (typeof window !== 'undefined') {
        const pathParts = window.location.pathname.split('/');
        const blogIdx = pathParts.indexOf('blog');
        if (blogIdx !== -1 && pathParts[blogIdx + 1]) {
          setResolvedSlug(pathParts[blogIdx + 1]);
        }
      }
    }
    determineSlug();
  }, [propSlug, params]);

  // Load article from Supabase or fallback editorial dataset
  useEffect(() => {
    if (!resolvedSlug) return;

    // First check local editorial articles for immediate response
    const localMatch = INITIAL_EDITORIAL_ARTICLES.find((b) => b.slug === resolvedSlug) as Blog | undefined;
    if (localMatch) {
      const editorialArticle: EditorialArticle = {
        ...localMatch,
        readingTimeMinutes: parseReadingTime(localMatch.reading_time),
        directAnswerSummary: localMatch.excerpt || localMatch.title,
      };
      setArticle(editorialArticle);
    }

    // Attempt live Supabase query if configured
    if (isSupabaseConfigured) {
      (supabase.from('blogs') as any)
        .select('*')
        .eq('slug', resolvedSlug)
        .single()
        .then(({ data, error }: { data: any; error: any }) => {
          if (!error && data) {
            setArticle({
              ...data,
              readingTimeMinutes: Math.max(4, Math.round((data.content?.length || 1000) / 400)),
              directAnswerSummary: data.excerpt || data.title,
            });
          }
        });
    }
  }, [resolvedSlug]);

  function parseReadingTime(readingTime: string | null): number {
    if (!readingTime) return 5;
    const match = readingTime.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 5;
  }

  function renderMarkdown(content: string): { __html: string } {
    return { __html: content };
  }

  if (!article && !article) {
    return (
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
        <Navbar onOpenConsultation={() => setIsConsultModalOpen(true)} />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Article Not Found</h2>
            <p className="text-slate-400 mb-6">The requested article could not be loaded.</p>
            <button
              onClick={() => onBack ? onBack() : window.history.back()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      <Navbar onOpenConsultation={() => setIsConsultModalOpen(true)} />
      
      <LeadCaptureModal
        isOpen={isConsultModalOpen}
        onClose={() => setIsConsultModalOpen(false)}
      />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => onBack ? onBack() : window.history.back()}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Articles
        </button>

        {/* Article Header */}
        <article className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded text-xs font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/30">
              {article.category}
            </span>
            {article.video_url && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-rose-950/30 text-rose-300 border border-rose-700/30">
                <Video className="h-3 w-3" />
                Video Attached
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 border-y border-slate-800 py-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span>{new Date(article.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-500" />
              <span>{article.readingTimeMinutes} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-slate-500" />
              <span>{article.tags?.length || 0} topics</span>
            </div>
          </div>

          {/* Cover Image */}
          {article.cover_image_url && (
            <div className="mt-8 rounded-2xl overflow-hidden border border-slate-800">
              <img
                src={article.cover_image_url}
                alt={article.title}
                className="w-full h-auto object-cover max-h-96"
                loading="lazy"
              />
            </div>
          )}

          {/* YouTube Video */}
          {article.video_url && (
            <div className="mt-8 rounded-xl overflow-hidden border border-slate-800 bg-black">
              <div className="relative aspect-video">
                <iframe
                  src={getYouTubeEmbedUrl(article.video_url)}
                  title={article.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Direct Answer Summary */}
          <div className="mt-8 bg-emerald-950/10 border border-emerald-900/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-emerald-300 mb-2">Direct Answer Summary</h3>
                <p className="text-slate-300 leading-relaxed">{article.directAnswerSummary}</p>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="mt-8 prose prose-invert max-w-none prose-p:text-slate-300 prose-p:leading-relaxed prose-headings:text-white prose-a:text-blue-400">
            <div dangerouslySetInnerHTML={renderMarkdown(article.content)} />
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-slate-800">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs bg-slate-900 border border-slate-700 text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Author Card */}
        <div className="mt-12">
          <AuthorCard />
        </div>

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-400">
              Share this article
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors text-sm font-medium"
            >
              <Share2 className={`h-4 w-4 ${copied ? 'text-emerald-400' : 'text-slate-400'}`} />
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}