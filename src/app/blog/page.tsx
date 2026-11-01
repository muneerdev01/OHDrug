/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * OHDrug.com — A product of MuneerDataAI
 * Blog Knowledge Hub Listing Page (Next.js 15 App Router)
 */

'use client';

import React, { useState, useEffect } from 'react';
import { DisclaimerBanner } from '@/src/components/layout/DisclaimerBanner';
import { Navbar } from '@/src/components/layout/Navbar';
import { EditorialNewsroom } from '@/src/components/blog/EditorialNewsroom';
import { Footer } from '@/src/components/layout/Footer';
import { LeadCaptureModal } from '@/src/components/home/LeadCaptureModal';
import { INITIAL_EDITORIAL_ARTICLES, type EditorialArticle } from '@/src/data/blogArticles';
import type { Blog } from '@/src/types/database';
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase/client';

interface BlogPageProps {
  onNavigate?: (path: string) => void;
}

export default function BlogListingPage({ onNavigate }: BlogPageProps) {
  const [articles, setArticles] = useState<EditorialArticle[]>(() => {
    // Convert Blog[] to EditorialArticle[]
    return INITIAL_EDITORIAL_ARTICLES.map((blog) => ({
      ...blog,
      readingTimeMinutes: parseReadingTime(blog.reading_time),
      directAnswerSummary: blog.excerpt || blog.title,
    }));
  });
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);

  // Fetch published articles from Supabase 'blogs' table if connected
  useEffect(() => {
    async function loadPublishedBlogs() {
      if (!isSupabaseConfigured) return;
      try {
        const { data, error } = await (supabase.from('blogs') as any)
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          // Merge with editorial reading times and fallbacks
          const merged: EditorialArticle[] = data.map((blog: Blog, idx: number) => ({
            ...blog,
            readingTimeMinutes: parseReadingTime(blog.reading_time),
            trendingRank: idx < 3 ? idx + 1 : undefined,
            directAnswerSummary: blog.excerpt || blog.title,
          }));
          setArticles(merged);
        }
      } catch (err) {
        console.warn('Using editorial initial articles dataset:', err);
      }
    }

    loadPublishedBlogs();
  }, []);

  function parseReadingTime(readingTime: string | null): number {
    if (!readingTime) return 5;
    const match = readingTime.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 5;
  }

  const handleSelectArticle = (slug: string) => {
    if (onNavigate) {
      onNavigate(`/blog/${slug}`);
    } else if (typeof window !== 'undefined') {
      window.location.href = `/blog/${slug}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Educational and Medical Disclaimer Alert */}
      <DisclaimerBanner />

      {/* 2. Sticky Glassmorphism Header with Direct Consultation Trigger */}
      <Navbar onOpenConsultation={() => setIsConsultModalOpen(true)} onNavigate={onNavigate} />

      {/* Main Content: Step 4 Editorial Newsroom */}
      <main className="flex-1">
        <EditorialNewsroom
          articles={articles}
          onSelectArticle={handleSelectArticle}
        />
      </main>

      {/* 6. Executive Footer with Disclaimers & muneerdev.com Links */}
      <Footer />

      {/* Consultation Modal */}
      <LeadCaptureModal
        isOpen={isConsultModalOpen}
        onClose={() => setIsConsultModalOpen(false)}
      />
    </div>
  );
}
