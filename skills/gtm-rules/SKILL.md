---
name: gtm-rules
description: >
  Critical rules shared by all GTM agents. These rules prevent common failure
  patterns like bureaucratic loops, repo pollution, and phase violations.
  Every GTM agent MUST have this skill assigned.
---

# GTM Critical Rules (ALL AGENTS MUST FOLLOW)

## Rule 1 — NEVER write files to the product repo unless you are building code

You are NOT allowed to create .md, .txt, or any documentation files in the product repository.

**Where to put deliverables:**
- Strategy docs, analysis, plans → Paperclip issue documents (`PUT /api/issues/{id}/documents/{key}`)
- Status updates → Paperclip issue comments (`POST /api/issues/{id}/comments`)
- Code (landing pages, payment integration, etc.) → product repo files (.tsx, .ts, .css, .html, .json)

**Explicitly FORBIDDEN:**
- Creating .md files in the product repo (except editing README.md)
- Creating analysis, strategy, crisis, escalation, or report files in the product repo
- Writing ANY file to the repo that is not functional code

## Rule 2 — NO escalation loops

If you have already commented on a blocker, and no new information has arrived since your last comment, **EXIT THE HEARTBEAT IMMEDIATELY**. Do not:
- Write another "URGENT" comment
- Create another escalation document
- Tag other agents asking for the same thing again
- Re-describe the same problem in different words

**Maximum:** You may escalate ONCE per issue. After that, exit and wait.

## Rule 3 — Stay in your phase

You may ONLY work on issues assigned to you whose phase is unblocked. If your phase depends on one that hasn't been approved:
1. Post ONE comment: "Waiting for Phase N approval"
2. Exit heartbeat
3. Do NOT start working prematurely

## Rule 4 — Do real work, not meta-work

Produce DELIVERABLES, not discussions. Each heartbeat must produce either:
- An issue document with real content (analysis, pricing table, ICP profile)
- A code commit with real changes (landing page, payment integration)
- A verified test result

NOT acceptable: crisis reports, escalation chains, strategy debates, re-analysis of the same data.

## Rule 5 — One heartbeat, one task

1. Pick highest-priority assigned issue
2. Do the work
3. Post deliverable
4. Mark done or update status
5. Exit

Do NOT work on multiple issues. Do NOT create issues for yourself.

## Rule 6 — Code agents: produce code

Web Builder, Finance Manager, QA Lead — your PRIMARY output is code:
- `git add -A && git commit -m "..." && git push`
- Post commit hash or deploy URL in issue comment
- Every commit must be testable

## Rule 7 — Communication budget per heartbeat

- Maximum 1 issue comment (under 200 words)
- Maximum 1 approval request (only when ALL phase tasks are done)
- Zero escalation documents
- Zero crisis reports
- Zero files written to the product repo
