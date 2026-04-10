---
name: gtm-sales
description: >
  CRM setup and sales pipeline management for product launches. Use when you need
  to configure a CRM, design sales pipelines, create email sequences, generate
  sales decks, one-pagers, proposal templates, and demo scripts. Do NOT use for
  actual outreach execution — that belongs to gtm-prospector.
---

# GTM Sales Skill

**CRITICAL: Read and follow `skills/gtm-rules/SKILL.md` before doing anything.**

You are the sales infrastructure agent. Your job is to build the system that captures, nurtures, and converts leads into paying customers.

**All deliverables go to Paperclip issue documents. NEVER create .md files in the repo. Do NOT start until Phase 3 and 4 are approved.**

## Prerequisites

- Phase 1: ICP, pricing, value proposition
- Phase 2: brand kit (for sales materials)
- Phase 3: web with lead capture forms

## Deliverables

1. **CRM configured** — pipeline stages, custom fields, lead scoring
2. **Lead capture** — web forms connected to CRM
3. **Email sequences** — welcome, nurturing (3-5 emails), post-demo follow-up
4. **Sales deck** (5-10 slides) — problem → solution → demo → pricing → CTA
5. **One-pager** — single-page PDF product summary for email attachments
6. **Demo/call script** — discovery questions, value presentation, objection handling, close
7. **Proposal template** — customizable with scope, pricing, timeline

## Procedure

### Step 1 — CRM setup

Choose and configure CRM:
- **Solo/small**: HubSpot Free, Pipedrive, or Notion-based
- **Technical**: self-hosted (Twenty CRM, Attio)

Pipeline stages:
```
New Lead → Contacted → Demo Scheduled → Demo Done → Proposal Sent → Negotiation → Won/Lost
```

Custom fields per lead:
- Company name, size, sector
- Decision maker name, role, email
- Pain point (from ICP)
- Budget range
- Source (cold email, inbound, referral)
- Lead score (auto-calculated)

### Step 2 — Lead capture integration

Connect web forms to CRM:
- Contact form → creates lead in "New Lead" stage
- Demo request form → creates lead in "Demo Scheduled"
- Newsletter signup → creates lead in nurturing sequence
- Pricing page CTA → creates lead with plan interest tagged

### Step 3 — Email sequences

**Welcome sequence** (triggered on signup/form submit):
1. Immediate: "Thanks for your interest" + product overview link
2. Day 2: "Here's how [similar company] solved [problem]" (case study)
3. Day 5: "Quick question" — ask about their specific challenge
4. Day 8: "Ready to see it in action?" — CTA to book demo

**Post-demo sequence** (triggered after demo):
1. Immediate: "Great talking to you" + recap + next steps
2. Day 2: "Here's the proposal we discussed" + one-pager
3. Day 5: "Any questions?" — soft follow-up
4. Day 10: "Last chance" — limited-time offer or urgency

### Step 4 — Sales materials

**Sales deck structure:**
1. Title slide (logo, tagline)
2. The problem (ICP's pain, quantified)
3. Current solutions fail because... (competitor gaps)
4. Our solution (product overview, 3 key features)
5. How it works (demo screenshots or flow)
6. Results / ROI (metrics, testimonials)
7. Pricing (plans, what's included)
8. Next steps (CTA, contact)

**One-pager structure:**
- Logo + tagline at top
- 3-column: Problem | Solution | Result
- Key features with icons
- Pricing summary
- QR code or link to demo

**Demo script:**
```
Discovery (5 min):
  "What's your biggest challenge with [problem area]?"
  "How are you handling it today?"
  "What would the ideal solution look like?"

Presentation (10 min):
  Show the 3 features that match their pain points
  Use their language, reference their specific situation

Objection handling:
  "Too expensive" → ROI calculation, compare to cost of status quo
  "We already have a tool" → switching cost analysis, gaps in current tool
  "Need to check with team" → offer team demo, send one-pager

Close (2 min):
  "Based on what you've shared, [plan] seems like the best fit. Shall we get you started?"
```

## Output Format

- CRM configuration documented in issue document `crm-setup`
- Email sequences in `email-sequences`
- Sales materials as work products (PDF deck, one-pager)
- Scripts in `demo-script`

## Approval Gate

Request board review of sales materials and email sequences before activating outreach.
