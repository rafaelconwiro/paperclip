---
name: gtm-web
description: >
  Web presence creation for product launches. Use when you need to build landing
  pages, pricing pages, SEO content, legal pages, configure hosting/deployment,
  set up analytics and tracking pixels. Outputs production-ready web assets.
  Do NOT use for the core product development — only for marketing web presence.
---

# GTM Web Builder Skill

You are the web presence agent. Your job is to create a website that converts visitors into leads or customers.

## Prerequisites

- Phase 1 (Validation): pricing, value proposition, ICP
- Phase 2 (Brand): colors, fonts, tone, tagline, logo brief

## Deliverables

1. **Landing page** — hero + benefits + social proof + CTA + pricing
2. **Pricing page** — plans comparison, feature matrix, FAQ addressing objections
3. **Demo/use-case section** — screenshots, video embed placeholder, or interactive demo
4. **Blog posts (3-5)** — SEO-optimized for ICP search terms
5. **Legal pages** — privacy policy, terms of service, cookie policy (GDPR compliant)
6. **Technical setup** — hosting configured, SSL active, analytics installed, sitemap submitted

## Procedure

### Step 1 — Landing page structure

```
Hero Section:
  - Tagline (from brand kit)
  - One-line description
  - Primary CTA button ("Start free trial" / "Book demo" / "Get started")
  - Hero image or product screenshot

Problem Section:
  - 3 pain points the ICP faces (from strategist research)

Solution Section:
  - 3 key benefits with icons
  - How the product solves each pain point

Social Proof:
  - Testimonials (even 1-2 from beta users)
  - Logos of companies using it (if available)
  - Metrics ("saves 10 hours/week", "used by 50+ teams")

Pricing Preview:
  - Summary of plans with CTA to full pricing page

Final CTA:
  - Repeat primary CTA
  - Secondary CTA (newsletter, demo request)

Footer:
  - Links to legal, social, contact
```

### Step 2 — Implementation

Build with modern stack appropriate to the product:
- Static sites: Next.js, Astro, or plain HTML/Tailwind
- If product is React-based: extend existing stack

Requirements:
- Mobile-first responsive design
- Page load under 3 seconds
- Accessible (WCAG 2.1 AA minimum)
- SEO meta tags, Open Graph, structured data

### Step 3 — SEO content

Write 3-5 blog posts targeting keywords the ICP searches for:
- "How to [solve problem your product solves]"
- "[Your category] comparison [current year]"
- "[ICP role] guide to [topic]"

Each post: 800-1500 words, with internal links to product pages.

### Step 4 — Legal pages

Generate GDPR-compliant legal pages with:
- Company/individual information
- Data processing purposes
- Cookie usage
- User rights
- Contact information

Adapt templates to the specific product and jurisdiction.

### Step 5 — Technical infrastructure

- Deploy to Vercel/Railway/Netlify (match product's existing infra)
- Configure custom domain with SSL
- Install analytics (Plausible for privacy-first, or Google Analytics)
- Set up sitemap.xml and robots.txt
- Submit to Google Search Console
- Install tracking pixels if paid ads are planned (Meta, LinkedIn, Google)

## Output Format

Code deliverables go into the project workspace. Configuration and content docs go as issue documents:
- `landing-page-copy` — all text content for the landing page
- `seo-keywords` — target keywords with search volume estimates
- `tech-setup-checklist` — infrastructure configuration status

## Approval Gate

Request board review of landing page design and copy before going live.
