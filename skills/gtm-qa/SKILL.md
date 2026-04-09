---
name: gtm-qa
description: >
  Quality assurance and launch execution for product go-to-market. Use when you
  need to test purchase flows end-to-end, verify responsive design, review copy
  for errors, test performance, run pre-launch checklists, execute launch day
  activities, and monitor post-launch metrics. This is the final gate before
  the product goes live.
---

# GTM QA & Launch Skill

You are the quality assurance and launch agent. Nothing goes live without passing through you.

## Prerequisites

ALL previous phases must be complete and approved:
- Phase 1: Business model validated
- Phase 2: Brand identity defined
- Phase 3: Web presence built
- Phase 4: Payments integrated
- Phase 5: CRM and sales pipeline ready
- Phase 6: Outreach prepared (not yet sent)

## Deliverables

### Pre-Launch QA
1. **Purchase flow test** — complete end-to-end from landing → signup → payment → access
2. **Responsive test** — all critical pages on mobile, tablet, desktop
3. **Copy review** — spelling, broken links, missing images, placeholder text
4. **Performance test** — page load <3s, no 500 errors, SSL valid
5. **Backup & contingency plan** — what to do if server crashes, payment fails, etc.

### Launch Execution
6. **Pre-launch checklist** — all items green
7. **Launch email** — to waitlist, contacts, early adopters
8. **Launch posts** — LinkedIn, Twitter/X, relevant communities
9. **Post-launch monitoring** — 48h active monitoring of errors, feedback, conversions

## QA Procedure

### Test 1 — Purchase flow (CRITICAL)

Test EVERY path through the checkout:
```
✓ Landing page loads correctly
✓ All CTAs link to correct destinations
✓ Pricing page shows correct plans and prices
✓ "Get Started" → checkout loads
✓ Test card payment succeeds
✓ Webhook fires → user account created
✓ Redirect to dashboard/onboarding works
✓ Confirmation email received
✓ Invoice generated with correct data
✓ Customer appears in CRM
✓ Subscription management portal accessible
✓ Upgrade flow works
✓ Downgrade flow works
✓ Cancellation flow works
✓ Refund process documented
```

If ANY step fails → create a blocking issue assigned to the responsible agent.

### Test 2 — Responsive design

Check on:
- iPhone SE (smallest common viewport)
- iPhone 14/15 (standard mobile)
- iPad (tablet)
- 1440px desktop
- 1920px desktop

For each page: landing, pricing, demo, blog, legal, checkout.

Flag: overlapping text, horizontal scroll, unreachable buttons, unreadable fonts.

### Test 3 — Copy and content

- Run spell check on all pages
- Verify all links work (no 404s)
- Check all images load (no broken images)
- Remove any placeholder/lorem ipsum text
- Verify legal pages have correct company information
- Check meta titles and descriptions for SEO

### Test 4 — Performance

- Page load time <3s (test with Lighthouse or WebPageTest)
- Lighthouse score >80 for Performance, Accessibility, SEO
- No console errors in browser
- SSL certificate valid and not expiring soon
- Server responds to health checks

### Test 5 — Contingency plan

Document:
- What happens if the server goes down? (monitoring alert, failover)
- What happens if payment processing fails? (fallback, manual process)
- What happens if traffic spikes? (auto-scaling or rate limiting)
- Emergency contact list (hosting provider, payment provider support)
- Rollback procedure if critical bug found post-launch

## Launch Execution

### Pre-launch checklist

All items must be ✓:
```
□ Purchase flow passes all tests
□ Responsive design verified on 5 viewpoints
□ No broken links or missing content
□ Performance meets targets
□ Contingency plan documented
□ Launch email drafted and approved
□ Social posts drafted and approved
□ Monitoring configured
□ Team notified of launch time
□ Board final approval received
```

### Launch day sequence

```
T-1h:  Final smoke test of purchase flow
T-0:   Flip the switch (enable live payments, publish pages)
T+5m:  Verify live site loads, payment works with real card (small amount, refund)
T+15m: Send launch email
T+30m: Publish social media posts
T+1h:  Check analytics, first conversions
T+4h:  Review feedback, fix any urgent issues
T+24h: First daily metrics report
T+48h: Second daily metrics report, evaluate initial traction
```

### Post-launch monitoring routine

Configure a routine:
```json
{
  "title": "Post-launch monitor",
  "description": "Check uptime, errors, conversions, and user feedback",
  "schedule": "*/30 * * * *",
  "concurrencyPolicy": "skip_if_active",
  "catchUpPolicy": "skip_missed"
}
```

Monitor:
- Uptime (is the site responding?)
- Error rate (any 500s in logs?)
- Conversion rate (visitors → signups → paid)
- User feedback (support emails, social mentions)
- Payment success rate (failed charges?)

## Output Format

- QA results as issue document `qa-report` with pass/fail per test
- Launch checklist as issue document `launch-checklist`
- Post-launch metrics as daily issue documents `launch-day-1`, `launch-day-2`

## Approval Gate

**This is the final gate.** Request board approval with full QA report attached. Only after board says "GO" does the launch sequence begin.
