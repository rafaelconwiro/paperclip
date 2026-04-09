# GTM Launch System — Implementation Plan

**Date:** 2026-04-09
**Goal:** Create a reusable Paperclip company template that takes any digital product from "built" to "billing" using a team of 7 specialized AI agents.

## Architecture

The GTM system is implemented as a **Paperclip company template** with:

- **1 CEO agent** (GTM Director) — orchestrates the 7 phases, manages dependencies, enforces quality gates
- **7 specialist agents** — one per GTM phase, each with a dedicated skill
- **Goal hierarchy** — Company goal → 7 phase goals → individual task issues
- **Approval gates** — Board approval required between phases (governance)
- **Routines** — Recurring prospection, monitoring, and follow-up tasks

## Org Chart

```
Board (You)
  └── GTM Director (CEO agent)
        ├── Strategist      — Phase 1: Validation
        ├── Brand Designer   — Phase 2: Identity
        ├── Web Builder      — Phase 3: Web & presence
        ├── Finance Manager  — Phase 4: Payments
        ├── Sales Manager    — Phase 5: CRM & sales
        ├── Prospector       — Phase 6: Outreach
        └── QA Lead          — Phase 7: QA & launch
```

## Phase-to-Agent Mapping

| Phase | Agent | Skill | Adapter |
|-------|-------|-------|---------|
| 1. Validation | `gtm-strategist` | `gtm-strategist` | claude_local |
| 2. Identity | `gtm-brand` | `gtm-brand` | claude_local |
| 3. Web & presence | `gtm-web` | `gtm-web` | claude_local |
| 4. Payments | `gtm-finance` | `gtm-finance` | claude_local |
| 5. CRM & sales | `gtm-sales` | `gtm-sales` | claude_local |
| 6. Outreach | `gtm-prospector` | `gtm-prospector` | claude_local |
| 7. QA & launch | `gtm-qa` | `gtm-qa` | claude_local |

## Skills Created

All skills live in `/skills/gtm-*/SKILL.md` and follow the standard Paperclip skill format.

| Skill | Purpose |
|-------|---------|
| `gtm-strategist` | Market research, competitor analysis, pricing, ICP definition, unit economics |
| `gtm-brand` | Name, domain, logo brief, color palette, typography, tone, tagline, elevator pitch |
| `gtm-web` | Landing page, pricing page, SEO content, legal pages, analytics, deployment |
| `gtm-finance` | Stripe/Paddle setup, checkout flow, invoicing, tax compliance, subscription management |
| `gtm-sales` | CRM setup, pipeline config, email sequences, proposals, deck, one-pager, scripts |
| `gtm-prospector` | Company search, cold email, LinkedIn outreach, directories, partnerships |
| `gtm-qa` | Purchase flow testing, responsive, copy review, performance, launch checklist |

## Goal Hierarchy

```
Company Goal: "Launch [PRODUCT] and reach first paying customers"
  ├── G1: Validate market and define business model
  ├── G2: Create professional brand identity
  ├── G3: Build web presence that converts
  ├── G4: Set up payment infrastructure
  ├── G5: Configure CRM and sales pipeline
  ├── G6: Acquire first 10 paying customers
  └── G7: Pass QA and execute launch
```

Each goal has 4-8 child issues (tasks) matching the checklist from the methodology.

## Dependency Chain

```
G1 (Validation) ──blocks──► G2 (Brand) ──blocks──► G3 (Web)
                                                      │
G4 (Payments) ◄──blocks── G1                         │
                    │                                  │
G5 (Sales) ◄───────┤◄─────────────────────────────────┘
                    │
G6 (Outreach) ◄────┤◄── G3, G5
                    │
G7 (QA & Launch) ◄─┘◄── ALL previous
```

## Routines

| Routine | Agent | Schedule | Purpose |
|---------|-------|----------|---------|
| Daily prospecting | Prospector | `0 9 * * 1-5` | Find 5 new companies, generate personalized emails |
| Follow-up check | Sales Manager | `0 10 * * 1-5` | Check CRM for stale leads, send follow-ups |
| Post-launch monitor | QA Lead | `*/30 * * * *` | Check uptime, errors, conversion metrics (first 48h) |

## Setup Script

`scripts/gtm-setup.ts` — Run after Paperclip is running to create the full GTM company:

1. Creates a new company with the GTM goal
2. Installs all 7 skills into the company library
3. Hires the CEO (GTM Director) agent
4. CEO hires the 7 specialist agents via approval flow
5. Creates the goal hierarchy with dependency chains
6. Creates initial issues for Phase 1
7. Sets up routines for recurring tasks

## Usage

```bash
# Start Paperclip
pnpm dev

# In another terminal, run the GTM setup
pnpm paperclipai gtm-setup --product-name "MyProduct" --product-description "Brief description"
```

Or manually via the UI: create a company, import the GTM template.

## Files Created

```
doc/plans/2026-04-09-gtm-launch-system.md  ← this file
skills/gtm-strategist/SKILL.md
skills/gtm-brand/SKILL.md
skills/gtm-web/SKILL.md
skills/gtm-finance/SKILL.md
skills/gtm-sales/SKILL.md
skills/gtm-prospector/SKILL.md
skills/gtm-qa/SKILL.md
scripts/gtm-setup.ts
```
