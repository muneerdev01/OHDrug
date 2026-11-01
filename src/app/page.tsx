/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * OHDrug.com — A product of MuneerDataAI
 * Main Landing Page (Next.js 15 App Router)
 * News & Editorial Technical Hub for Registered Pharmacist & Automation Architect (Muneer)
 */

'use client';

import React, { useState, useEffect } from 'react';
import { DisclaimerBanner } from '@/src/components/layout/DisclaimerBanner';
import { Navbar } from '@/src/components/layout/Navbar';
import { EditorialNewsroom } from '@/src/components/blog/EditorialNewsroom';
import { ClinicalAnalyticsSection } from '@/src/components/home/ClinicalAnalyticsSection';
import { AboutPharmacistSection } from '@/src/components/home/AboutPharmacistSection';
import { LeadCaptureModal } from '@/src/components/home/LeadCaptureModal';
import { Footer } from '@/src/components/layout/Footer';
import { INITIAL_EDITORIAL_ARTICLES, type EditorialArticle } from '@/src/data/blogArticles';
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase/client';

interface HomePageProps {
  onNavigate?: (path: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [articles, setArticles] = useState<EditorialArticle[]>(INITIAL_EDITORIAL_ARTICLES);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('B2B Healthcare Data Extraction');

  // Load published articles from Supabase 'blogs' table if available
  useEffect(() => {
    async function loadPublishedBlogs() {
      if (!isSupabaseConfigured) return;
      try {
        const { data, error } = await (supabase.from('blogs') as any)
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          const merged: EditorialArticle[] = data.map((blog: any, idx: number) => ({
            ...blog,
            readingTimeMinutes: Math.max(4, Math.round((blog.content?.length || 1000) / 400)),
            trendingRank: idx < 3 ? idx + 1 : undefined,
            directAnswerSummary: blog.excerpt || blog.title,
          }));
          setArticles(merged);
        }
      } catch (err) {
        console.warn('Using initial editorial articles:', err);
      }
    }

    loadPublishedBlogs();
  }, []);

  const handleOpenConsultation = (service?: string) => {
    if (service) {
      setSelectedService(service);
    }
    setIsLeadModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLeadModalOpen(false);
  };

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  const handleSelectArticle = (slug: string) => {
    handleNavigate(`/blog/${slug}`);
  };

  const featured = articles[0] || INITIAL_EDITORIAL_ARTICLES[0];
  const trending =
    articles.slice(1, 4).length > 0 ? articles.slice(1, 4) : INITIAL_EDITORIAL_ARTICLES.slice(1, 4);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Top Educational & Medical Legal Disclaimer Banner */}
      <DisclaimerBanner />

      {/* 2. Glassmorphism Sticky Navbar with muneerdev.com link & Admin Portal */}
      <Navbar
        onOpenConsultation={() => handleOpenConsultation()}
        onNavigate={handleNavigate}
      />

      {/* Main Content: Step 4 Editorial Newsroom Hub */}
      <main className="flex-1">
        {/* Top Hero Most Recent Article + 3-Column Structured Dispatch Grid + Author Profile Card */}
        <EditorialNewsroom
          articles={articles}
          onSelectArticle={handleSelectArticle}
        />

        {/* Clinical Analytics Hub & Storage Egress Optimizer (<200KB) */}
        <ClinicalAnalyticsSection />

        {/* Dual Pharmacy & Automation Mastery Section */}
        <AboutPharmacistSection onOpenConsultation={() => handleOpenConsultation()} />
      </main>

      {/* 8. Executive Footer with Disclaimers, Accreditations & muneerdev.com */}
      <Footer />

      {/* 9. Validated Lead Capture Modal saving directly to Supabase */}
      <LeadCaptureModal
        isOpen={isLeadModalOpen}
        onClose={handleCloseModal}
        defaultService={selectedService}
      />
    </div>
  );
}
