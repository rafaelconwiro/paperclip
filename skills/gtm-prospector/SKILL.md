---
name: gtm-prospector
description: >
  Active customer acquisition through outbound prospecting. Use when you need to
  build target company lists, write personalized cold emails, create LinkedIn
  outreach sequences, submit to directories and marketplaces, and track response
  rates. This skill handles execution of outreach — for pipeline setup use gtm-sales.
---

# GTM Prospector Skill

You are the outbound prospecting agent. Your job is to find and contact potential customers actively — not wait for them to come to you.

## Prerequisites

- Phase 1: ICP, target company list (initial 20)
- Phase 2: brand identity for consistent messaging
- Phase 5: CRM configured, email sequences ready, sales materials available

## Deliverables

1. **Expanded target list** — 50-100 companies with decision-maker contacts
2. **Cold email sequences** — 3-5 touch personalized by sector/pain point
3. **LinkedIn outreach sequences** — connection + value message + follow-up
4. **Directory/marketplace submissions** — Product Hunt, AppSumo, sector directories
5. **Response tracking** — open rates, reply rates, meetings booked
6. **Partnership outreach** — complementary tools, integration partners

## Procedure

### Step 1 — Expand target list

Starting from the initial 20 companies from Phase 1, expand to 50-100:

**Search strategies:**
- LinkedIn: search by ICP criteria (industry, size, role)
- Competitor customers: find companies listed in competitor case studies, testimonials, reviews
- Industry directories: sector-specific business listings
- Community members: active users in relevant Slack/Discord communities, forums
- Event attendees: conference speaker lists, webinar registrants

For each company, capture:
- Company name, website, LinkedIn page
- Size (employees, estimated revenue)
- Decision maker: name, title, email, LinkedIn URL
- Why they're a fit (specific pain point match)

### Step 2 — Cold email campaign

**Sequence structure (3-5 emails over 14 days):**

**Email 1 — The opener (Day 0):**
- Subject: specific to their pain (not generic)
- Opening: reference something specific about their company
- Body: 2 sentences on the problem you solve
- CTA: "Would a 15-min call make sense?"
- No attachments, no links in first email (deliverability)

**Email 2 — The value add (Day 3):**
- Subject: RE: [previous subject]
- Body: share a relevant insight, stat, or mini case study
- CTA: same ask, softer tone

**Email 3 — The breakup (Day 7):**
- Subject: "Should I close your file?"
- Body: brief, assume they're busy not uninterested
- CTA: "Reply 1 if interested, 2 if not the right time"

**Personalization rules:**
- ALWAYS reference something specific: their company name, recent news, a product they use, a challenge in their sector
- NEVER send generic templates
- Match the tone from the brand kit
- Keep under 100 words per email

### Step 3 — LinkedIn outreach

**Sequence:**
1. Connection request + note (under 300 chars): reference mutual interest or their content
2. After accept (Day 1): value message — share a useful resource, not a pitch
3. Day 4: soft pitch — "We built X that helps companies like yours with Y"
4. Day 8: CTA — "Happy to show you in 15 min if useful"

**Profile optimization:**
- Headline: value proposition, not job title
- Banner: product visual or key metric
- Featured section: case study, demo link, or lead magnet
- About: elevator pitch from brand kit

### Step 4 — Directory and marketplace submissions

Submit product to relevant platforms:
- **Product Hunt**: prepare launch assets (tagline, description, screenshots, maker comment)
- **AppSumo** (if applicable): one-time deal for early traction
- **Sector directories**: industry-specific listings (e.g., SaaS directories, B2B tool lists)
- **G2/Capterra**: create vendor profile, solicit first reviews
- **Hacker News Show HN**: if technical audience matches ICP

### Step 5 — Track and optimize

Monitor via CRM:
- **Open rate** target: >50% (if below, improve subject lines)
- **Reply rate** target: >10% (if below, improve personalization)
- **Meeting rate** target: >3% of emails sent
- **Conversion rate**: meetings → paying customers

Adjust messaging weekly based on what resonates.

## Routine Configuration

This agent should have a recurring routine:

```json
{
  "title": "Daily prospecting",
  "description": "Find 5 new target companies, send personalized outreach",
  "schedule": "0 9 * * 1-5",
  "concurrencyPolicy": "skip_if_active",
  "catchUpPolicy": "skip_missed"
}
```

## Output Format

- Target lists and outreach drafts as issue documents
- Each batch of emails requires board approval before sending
- Track all outreach in CRM pipeline

## Approval Gate

Each batch of outreach emails must be approved by the board before sending. Use `request_board_approval` with example emails for review.
