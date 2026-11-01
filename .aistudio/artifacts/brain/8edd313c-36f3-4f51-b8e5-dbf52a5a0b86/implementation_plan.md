# OHDrug.com — A product of MuneerDataAI

Foundational executive portfolio and B2B SaaS landing page for Registered Pharmacist & Automation Architect (Muneer), integrating Next.js 15 App Router architecture, Supabase database connectivity, clinical/legal disclaimers, and an executive dark-mode design system.

### User Review & Critical Decisions

> [!IMPORTANT]
> The platform adheres to strict B2B compliance and clinical software guidelines. All content is educational and research-oriented.

- **Brand Hierarchy & Disclaimers**: Explicit inclusion of "A product of MuneerDataAI" across navigation, hero badges, lead modal, and footer. Clear prominent disclaimers affirming research and informational scope (non-prescriptive).
- **Executive Dark Aesthetic**: Deep obsidian canvas (`#090d16`), structural slate cards (`#111827`), electric blue (`#3b82f6`) primary CTA accents, and clinical emerald (`#10b981`) telemetry/verification indicators.
- **Data Integrity & Zero-Mock Standard**: Real Supabase table bindings for `leads`, `analytics_logs`, `blogs`, and `automations`, featuring real-time connection telemetry and functional lead capture.
- **Dual Runtime Support**: Pristine Next.js 15 App Router structure (`/src/app/layout.tsx`, `/src/app/page.tsx`, server actions/clients) paired seamlessly with live dev server preview rendering.

---

### 1. Overview & Core Concept

- **What It Does**: Presents an executive B2B portfolio and client acquisition funnel bridging clinical pharmacy knowledge with enterprise data engineering—custom healthcare scrapers, drug price tracking pipelines, clinical analytics dashboards, and custom clinic automation architectures.
- **Target Audience / Persona**: Pharma enterprise executives, health-tech founders, clinical research organizations (CROs), hospital automation directors, and digital health startups.
- **Key Value**: Direct access to a dual-domain expert (Registered Pharmacist + Automation Architect) capable of designing HIPAA/regulatory-conscious data pipelines and custom healthcare software.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. *Landing & Disclaimer Orientation*: User arrives, absorbs the persistent educational/legal disclaimer banner, and views the executive glassmorphic navigation.
  2. *Value Proposition & Proof*: Hero introduces core competency with live database/API health telemetry, leading directly into quantified capability showcases.
  3. *Service Exploration*: Interactive 3-card bento grid highlighting Data Extraction, Clinical Dashboards, and Custom Healthcare Pipelines with tech stack tags and impact metrics.
  4. *Direct Consultation Capture*: Clicking "Book Consultation" or "Explore B2B Solutions" triggers the `LeadCaptureModal`, saving directly to Supabase with instant validation and feedback.
- **Visual Identity & Theme**:
  - *Palette*: Obsidian background (`#090d16`), structural surface cards (`#111827` with 1px `slate-800` borders), electric blue accents (`#3b82f6`), clinical emerald (`#10b981`), high-contrast slate-100 typography.
  - *Typography*: Clean sans-serif hierarchy with balanced display headlines, tabular numerals for performance metrics, and zero pill badge clutter.
  - *Top Bar Contract*: 1-line brand title ("OHDrug.com" with subtle "MuneerDataAI" provenance), 4 single-line links (Solutions, Data Hub, Articles, About), and 1 primary CTA button ("Book Consultation").

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Direct Supabase Client + Server Setup**
  - *Chosen Approach*: Complete client-side browser client (`createBrowserClient` / `@supabase/supabase-js`), server-side cookie client, and strict TypeScript types (`/src/types/database.ts`).
  - *Why*: Enables seamless transition between Next.js App Router server actions and interactive client components.
- **Decision 2: Client-Side Image Compression Utility**
  - *Chosen Approach*: Canvas-based browser compressor (`/src/lib/utils/imageCompressor.ts`) restricting uploads to <200KB before reaching Supabase Storage (`blog-images`).
  - *Why*: Reduces egress costs, prevents slow uploads in clinical environments, and guarantees compliance with the 2MB bucket limit.
- **Decision 3: Complete SQL Migration Script**
  - *Chosen Approach*: Fully idempotent SQL migration enabling `uuid-ossp`, establishing tables (`profiles`, `blogs`, `automations`, `leads`, `analytics_logs`), Row Level Security (RLS) policies, and storage bucket configuration.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                      OHDrug.com Platform                    │
├─────────────────────────────────────────────────────────────┤
│  DisclaimerBanner ("A product of MuneerDataAI" Notice)      │
├─────────────────────────────────────────────────────────────┤
│  Navbar (Sticky Glassmorphic Header + Mobile Drawer)        │
├─────────────────────────────────────────────────────────────┤
│  HeroSection (Value Prop + Live API/DB Ping Telemetry)      │
├─────────────────────────────────────────────────────────────┤
│  ServicesGrid (Extraction · Clinical Dashboards · Pipelines)│
├─────────────────────────────────────────────────────────────┤
│  LeadCaptureModal (Validated Inbound Form -> Supabase)      │
├─────────────────────────────────────────────────────────────┤
│  Footer (Legal Disclaimers · Professional Accreditations)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
       Supabase Database             Client-Side Engine
   - profiles (admin/client)    - imageCompressor (<200KB)
   - blogs (RLS public/admin)   - Real-time Connection Prober
   - automations (featured)     - Responsive Mobile Drawer
   - leads (public insert)
   - analytics_logs (queries)
   - storage: blog-images (2MB)
```

- **Interactive Component & State Mapping**:
  - `LeadCaptureModal`: Form state with validation (name, email, company, service_needed, message), direct submission to Supabase `leads`, transition to confirmation dialog, error recovery.
  - `HeroSection`: Automated ping prober verifying Supabase environment readiness and displaying response latency in tabular numerals.
  - `Navbar`: Mobile drawer toggle state, responsive viewport collapse, and consultation trigger link.
