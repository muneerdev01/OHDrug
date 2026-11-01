/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * OHDrug.com — A product of MuneerDataAI
 * Root Layout for Next.js 15 App Router
 */

import React from 'react';
import '@/src/index.css';

export interface Metadata {
  title: string;
  description: string;
  openGraph?: {
    title: string;
    description: string;
    type: string;
  };
}

export const metadata: Metadata = {
  title: 'OHDrug.com — A product of MuneerDataAI',
  description:
    'Executive portfolio and B2B SaaS platform for Registered Pharmacist & Automation Architect (Muneer), delivering clinical data pipelines, healthcare automation, and research analytics.',
  openGraph: {
    title: 'OHDrug.com — A product of MuneerDataAI',
    description:
      'Executive portfolio and B2B SaaS platform for Registered Pharmacist & Automation Architect (Muneer), delivering clinical data pipelines, healthcare automation, and research analytics.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#090d16] text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
