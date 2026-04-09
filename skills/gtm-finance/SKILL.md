---
name: gtm-finance
description: >
  Payment infrastructure and billing setup for digital products. Use when you need
  to integrate payment gateways (Stripe, Paddle, LemonSqueezy), configure checkout
  flows, set up subscription management, automate invoicing, handle tax compliance
  (VAT, IRPF), and create financial dashboards. Do NOT use for general accounting
  or investment decisions.
---

# GTM Finance Skill

You are the payment and billing agent. Your job is to make sure the product can accept money from day 1.

## Prerequisites

- Phase 1: pricing model and plans defined
- Phase 3: web presence ready (checkout needs a frontend)

## Deliverables

1. **Payment gateway integration** — Stripe/Paddle/LemonSqueezy configured and tested
2. **Checkout flow** — complete flow from plan selection to payment confirmation
3. **Subscription management** (if SaaS) — upgrades, downgrades, cancellations, trials
4. **Automated invoicing** — invoice generated on payment with correct tax data
5. **Tax compliance setup** — VAT handling, reverse charge for EU B2B, IRPF if applicable
6. **Financial dashboard** — MRR, churn, revenue by plan, failed payments

## Procedure

### Step 1 — Choose payment provider

| Criteria | Stripe | Paddle | LemonSqueezy |
|---|---|---|---|
| Best for | Full control, B2B | Merchant of Record (handles VAT) | Simple digital products |
| VAT handling | You manage (or use Stripe Tax) | They handle it | They handle it |
| Pricing | 2.9% + 30¢ | 5% + 50¢ | 5% + 50¢ |
| Subscription mgmt | Built-in (Billing) | Built-in | Built-in |
| Setup complexity | Medium | Low | Low |

**Recommendation rules:**
- Solo founder selling globally → Paddle or LemonSqueezy (they handle VAT as Merchant of Record)
- B2B with custom invoicing needs → Stripe
- Spanish autónomo selling in EU → Paddle (avoids VAT registration in every country)

### Step 2 — Configure payment gateway

For Stripe:
1. Create Stripe account (test mode first)
2. Create Products and Prices matching the pricing plans
3. Set up Stripe Checkout or Payment Links
4. Configure webhook for `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated`
5. Set up Stripe Customer Portal for self-service subscription management

For Paddle:
1. Create Paddle account
2. Configure products and prices
3. Embed Paddle.js checkout
4. Configure webhooks for payment events

### Step 3 — Build checkout flow

```
User clicks "Get Started" on pricing page
  → Redirected to checkout (Stripe Checkout / Paddle overlay)
  → Enters payment details
  → Payment processed
  → Webhook fires → create user account / grant access
  → Redirect to onboarding / dashboard
  → Confirmation email sent
```

Test the ENTIRE flow end-to-end with test cards before going live.

### Step 4 — Invoicing

Configure automatic invoice generation:
- Company/individual tax details (NIF, VAT number)
- Sequential invoice numbering
- PDF generation and email delivery
- Credit notes for refunds

### Step 5 — Tax compliance

For EU-based businesses:
- **B2C sales in EU**: VAT at customer's country rate (or use MoR like Paddle)
- **B2B sales in EU**: reverse charge mechanism (validate VAT number via VIES)
- **Sales outside EU**: generally no VAT
- **Spanish autónomo**: quarterly VAT (modelo 303) and annual summary (modelo 390)

Document the tax setup and flag any areas that need accountant review.

### Step 6 — Financial metrics dashboard

Set up tracking for:
- **MRR** (Monthly Recurring Revenue)
- **Churn rate** (monthly cancellations / total subscribers)
- **Revenue by plan** (which tier sells most)
- **Failed payment rate** and recovery
- **Trial to paid conversion rate**

## Output Format

- Integration code goes in the project workspace
- Issue documents: `payment-setup`, `tax-compliance`, `financial-metrics`

## Execution on Approval

When the board approves your deliverables, you MUST execute these steps automatically:

### Auto-commit payment integration
```bash
cd $PROJECT_CWD
git add -A
git commit -m "feat(gtm): integrate payment gateway, checkout flow, invoicing

Co-Authored-By: Paperclip <noreply@paperclip.ing>"
git push origin main
```

### Activate live payments
1. Switch Stripe/Paddle from test mode to live mode
2. Verify webhook endpoints are reachable
3. Run one test transaction with a real card (small amount, then refund)
4. Confirm invoice was generated correctly

### Post-execution verification
1. Complete a full checkout flow on the live site
2. Verify payment appears in Stripe/Paddle dashboard
3. Verify invoice PDF was generated and emailed
4. Post confirmation as issue comment with screenshots/links

### Update issue status
```json
PATCH /api/issues/{issueId}
{ "status": "done", "comment": "Payment integration live. Test transaction verified. Invoice confirmed." }
```

## Approval Gate

Request board approval after test checkout works end-to-end before enabling live payments.
