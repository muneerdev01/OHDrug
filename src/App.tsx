/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * OHDrug.com — A product of MuneerDataAI
 * Application Entry (renders Next.js 15 App Router pages with client preview routing)
 */

import React, { useState, useEffect } from 'react';
import HomePage from '@/src/app/page';
import BlogListingPage from '@/src/app/blog/page';
import ArticleViewPage from '@/src/app/blog/[slug]/page';
import AdminDashboardPage from '@/src/app/admin/dashboard/page';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path.startsWith('/#')) {
      const anchor = path.replace('/#', '');
      const el = document.getElementById(anchor);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setCurrentPath(path);
  };

  // Route: /admin or /admin/dashboard
  if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
    return <AdminDashboardPage onNavigate={navigate} />;
  }

  // Route: /blog/:slug
  if (currentPath.startsWith('/blog/')) {
    const slug = currentPath.replace('/blog/', '').split('/')[0];
    return <ArticleViewPage slug={slug} onBack={() => navigate('/blog')} />;
  }

  // Route: /blog
  if (currentPath === '/blog' || currentPath.startsWith('/blog?')) {
    return <BlogListingPage onNavigate={navigate} />;
  }

  // Default: Homepage (/)
  return <HomePage onNavigate={navigate} />;
}
