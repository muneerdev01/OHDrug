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
    const localMatch = INITIAL_EDITORIAL_ARTICLES.find((a) => a.slug === resolvedSlug);
    if (localMatch) {
      setArticle(localMatch);
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

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const currentArticle = article || INITIAL_EDITORIAL_ARTICLES[0];

  // Dynamic JSON-LD Structured Data Schema (TechArticle & MedicalWebPage)
  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `https://ohdrug.com/blog/${currentArticle.slug}#techarticle`,
        headline: currentArticle.title,
        description: currentArticle.excerpt,
        image: currentArticle.cover_image_url,
        datePublished: currentArticle.created_at,
        dateModified: currentArticle.updated_at,
        author: {
          '@type': 'Person',
          name: 'Muneer',
          jobTitle: 'Automation Architect & Registered Pharmacist',
          url: 'https://muneerdev.com',
          worksFor: {
            '@type': 'Organization',
            name: 'MuneerDataAI',
            url: 'https://ohdrug.com',
          },
        },
        publisher: {
          '@type': 'Organization',
          name: 'OHDrug.com — A product of MuneerDataAI',
          url: 'https://ohdrug.com',
        },
      },
      {
        '@type': 'MedicalWebPage',
        '@id': `https://ohdrug.com/blog/${currentArticle.slug}#medicalpage`,
        name: currentArticle.title,
        description: currentArticle.excerpt,
        audience: {
          '@type': 'MedicalAudience',
          audienceType: 'Pharma Researchers, Health-Tech Engineers & Pharmacists',
        },
        aspect: 'Educational and healthcare software data pipeline reference',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      {/* 1. Global Educational & Legal Disclaimer Banner */}
      <DisclaimerBanner />

      {/* 2. Sticky Glassmorphism Header */}
      <Navbar onOpenConsultation={() => setIsConsultModalOpen(true)} />

      {/* Main Reading View */}
      <main className="flex-1 py-10 md:py-16">
        <article className="max-w-4xl mx-auto px-4 sm:px-6">
          
          {/* Back Navigation Bar */}
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-800 text-xs">
            <button
              onClick={() => {
                if (onBack) onBack();
                else if (typeof window !== 'undefined') window.history.back();
              }}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Knowledge Hub</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5 text-blue-400" />
                <span>{copied ? 'Link Copied!' : 'Share Article'}</span>
              </button>
            </div>
          </div>

          {/* Article Header & Typography */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-3">
              <span className="font-semibold text-blue-400 uppercase tracking-wider text-[11px]">
                {currentArticle.category}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                {currentArticle.readingTimeMinutes} min read
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                {new Date(currentArticle.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.2] text-balance">
              {currentArticle.title}
            </h1>

            {/* Author Attribution with Direct muneerdev.com Link */}
            <div className="mt-6 flex items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-3 text-xs">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold">
                  M
                </div>
                <div>
                  <div className="font-semibold text-white">
                    Written by{' '}
                    <a
                      href="https://muneerdev.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 font-bold underline-offset-2 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Muneer</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Automation Architect &amp; Registered Pharmacist · <span className="text-slate-300 font-medium">A product of MuneerDataAI</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Top Medical / Educational Disclaimer Alert */}
          <div className="mb-8 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 sm:p-5 text-left text-xs text-amber-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-amber-300">Article Disclaimer: </strong>
                This technical publication is strictly for educational, research, and software engineering demonstration purposes. It does not provide medical guidance, dosage instructions, or clinical diagnosis. Verify all pharmaceutical data through certified regulatory frameworks before operational deployment.
              </div>
            </div>
          </div>

          {/* 2-Sentence Direct Answer Summary Box (SEO Search Snippet Optimization) */}
          <div className="mb-10 rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-950/30 via-slate-900 to-slate-900 p-5 sm:p-6 text-left">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
              <Sparkles className="h-4 w-4" />
              <span>Executive Direct Answer Summary</span>
            </div>
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-medium">
              {currentArticle.directAnswerSummary}
            </p>
          </div>

          {/* YouTube Technical Video Tutorial Embed (if present) */}
          {currentArticle.video_url && getYouTubeEmbedUrl(currentArticle.video_url) && (
            <div className="mb-10 rounded-xl border border-slate-800 bg-[#0c101a] overflow-hidden shadow-xl">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 text-xs">
                <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
                  <Video className="h-4 w-4" />
                  <span>Technical Case Study &amp; Walkthrough Video</span>
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  Embed: youtube-nocookie.com
                </span>
              </div>
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={getYouTubeEmbedUrl(currentArticle.video_url)!}
                  title={`${currentArticle.title} - Video Tutorial`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Cover Image */}
          {currentArticle.cover_image_url && (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-800 mb-10 bg-slate-900">
              <img
                src={currentArticle.cover_image_url}
                alt={currentArticle.title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono text-slate-300">
                Storage: blog-images (&lt;200KB WebP)
              </div>
            </div>
          )}

          {/* Main Markdown Content formatted with prose prose-invert */}
          <div className="prose prose-invert prose-blue max-w-none text-slate-200 text-left leading-relaxed">
            {renderMarkdown(currentArticle.content)}
          </div>

          {/* Bottom Educational Disclaimer Alert */}
          <div className="mt-14 mb-10 rounded-xl border border-slate-800 bg-[#111827] p-5 text-left text-xs text-slate-400">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-slate-200">Legal &amp; Clinical Notice: </strong>
                OHDrug.com and MuneerDataAI publish software blueprints and data pipelines under educational fair-use principles. All trademarks, drug nomenclature, and clinical terminologies belong to their respective regulatory authorities and pharmacopeias.
              </div>
            </div>
          </div>

          {/* Integrated Author Profile Card with muneerdev.com */}
          <div className="mt-8 mb-12">
            <AuthorCard />
          </div>

        </article>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Consultation Modal */}
      <LeadCaptureModal
        isOpen={isConsultModalOpen}
        onClose={() => setIsConsultModalOpen(false)}
      />
    </div>
  );
}

/**
 * Lightweight native Markdown parser for formatting headers, paragraphs, lists, and code blocks
 */
function renderMarkdown(content: string) {
  const sections = content.trim().split('\n\n');

  return (
    <div className="space-y-6">
      {sections.map((section, idx) => {
        const trimmed = section.trim();

        // Code block
        if (trimmed.startsWith('```')) {
          const lines = trimmed.split('\n');
          const language = lines[0].replace('```', '') || 'code';
          const code = lines.slice(1, -1).join('\n');
          return (
            <div key={idx} className="my-6 overflow-hidden rounded-lg border border-slate-800 bg-[#060911]">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/60 text-[11px] font-mono text-slate-400">
                <span>{language}</span>
                <span className="text-slate-500">MuneerDataAI Pipeline</span>
              </div>
              <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        // H3
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-xl font-bold text-white tracking-tight mt-8 mb-3">
              {trimmed.replace('### ', '')}
            </h3>
          );
        }

        // H2
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-2xl font-bold text-white tracking-tight mt-10 mb-4 border-b border-slate-800/80 pb-2">
              {trimmed.replace('## ', '')}
            </h2>
          );
        }

        // Unordered list
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split('\n').map((l) => l.replace(/^[-*]\s+/, ''));
          return (
            <ul key={idx} className="my-4 list-disc list-inside space-y-2 text-sm text-slate-300">
              {items.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          );
        }

        // Numbered list
        if (/^\d+\.\s/.test(trimmed)) {
          const items = trimmed.split('\n').map((l) => l.replace(/^\d+\.\s+/, ''));
          return (
            <ol key={idx} className="my-4 list-decimal list-inside space-y-2 text-sm text-slate-300">
              {items.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ol>
          );
        }

        // Standard paragraph
        return (
          <p key={idx} className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}
