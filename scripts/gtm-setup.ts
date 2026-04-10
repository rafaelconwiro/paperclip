/**
 * GTM Launch System — Setup Script
 * 
 * Creates a complete Go-To-Market company in Paperclip with:
 * - 7 specialized agents (one per GTM phase)
 * - Goal hierarchy with dependencies
 * - Initial issues for Phase 1
 * - Recurring routines for prospecting and monitoring
 * - Project workspace connected to your product repo
 * 
 * Usage:
 *   pnpm gtm-setup --product-name "MyProduct" --product-description "Description" --product-repo /path/to/repo
 * 
 * Or run directly:
 *   tsx scripts/gtm-setup.ts --product-name "MyProduct" --product-description "Description"
 */

import { parseArgs } from 'node:util';
import path from 'node:path';
import fs from 'node:fs/promises';

const { values: args } = parseArgs({
  options: {
    'product-name': { type: 'string' },
    'product-description': { type: 'string' },
    'product-repo': { type: 'string' },
    'product-url': { type: 'string' },
    'github-repo': { type: 'string' },
    'api-url': { type: 'string', default: 'http://localhost:3100' },
    'api-key': { type: 'string' },
    help: { type: 'boolean', short: 'h' },
  },
  strict: false,
});

if (args.help) {
  console.log(`
GTM Launch System — Setup Script

Creates a full Go-To-Market company in Paperclip with 7 AI agents
that take your product from "built" to "billing".

Options:
  --product-name         Name of the product to launch (required)
  --product-description  Brief description of the product (required)
  --product-repo         Local path to the product's code repository
  --product-url          Live URL of the product (if already deployed)
  --github-repo          GitHub repo URL (e.g. https://github.com/user/repo)
  --api-url              Paperclip API URL (default: http://localhost:3100)
  --api-key              Board API key (auto-detected if running locally)
  -h, --help             Show this help

Examples:
  pnpm gtm-setup --product-name "Finam" \\
    --product-description "Financial management tool for SMEs" \\
    --product-repo /Users/me/projects/finam \\
    --github-repo https://github.com/me/finam

  pnpm gtm-setup --product-name "SCHDL" \\
    --product-description "Enterprise scheduling SaaS" \\
    --product-repo /Users/me/Desktop/App-Desarrollo/SCHDL
`);
  process.exit(0);
}

const PRODUCT_NAME = args['product-name'] as string;
const PRODUCT_DESC = args['product-description'] as string;
const PRODUCT_REPO = args['product-repo'] as string | undefined;
const PRODUCT_URL = args['product-url'] as string | undefined;
const GITHUB_REPO = args['github-repo'] as string | undefined;
const API_URL = (args['api-url'] as string) || 'http://localhost:3100';
const API_KEY = args['api-key'] as string | undefined;

if (!PRODUCT_NAME || !PRODUCT_DESC) {
  console.error('Error: --product-name and --product-description are required.');
  console.error('Run with --help for usage.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const headers: Record<string, string> = { 'Content-Type': 'application/json' };
if (API_KEY) headers['Authorization'] = `Bearer ${API_KEY}`;

async function api<T = any>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${path} → ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

function log(emoji: string, msg: string) {
  console.log(`${emoji}  ${msg}`);
}

/** Try to read product context from the repo (README, package.json, etc.) */
async function readProductContext(repoPath: string): Promise<string> {
  const contextParts: string[] = [];

  // Try README
  for (const readme of ['README.md', 'readme.md', 'README.txt', 'README']) {
    try {
      const content = await fs.readFile(path.join(repoPath, readme), 'utf-8');
      contextParts.push(`## Product README\n${content.slice(0, 3000)}`);
      break;
    } catch { /* not found */ }
  }

  // Try package.json for tech stack info
  try {
    const pkg = JSON.parse(await fs.readFile(path.join(repoPath, 'package.json'), 'utf-8'));
    const deps = Object.keys(pkg.dependencies || {}).slice(0, 20);
    const devDeps = Object.keys(pkg.devDependencies || {}).slice(0, 10);
    contextParts.push(`## Tech Stack\n- Name: ${pkg.name}\n- Dependencies: ${deps.join(', ')}\n- Dev: ${devDeps.join(', ')}`);
  } catch { /* not found */ }

  // Try pyproject.toml / requirements.txt for Python
  try {
    const reqs = await fs.readFile(path.join(repoPath, 'requirements.txt'), 'utf-8');
    contextParts.push(`## Python Dependencies\n${reqs.slice(0, 1000)}`);
  } catch { /* not found */ }

  // Try to detect existing web presence
  const webIndicators: string[] = [];
  for (const f of ['vercel.json', 'netlify.toml', 'railway.json', 'fly.toml', 'Dockerfile', 'docker-compose.yml']) {
    try {
      await fs.access(path.join(repoPath, f));
      webIndicators.push(f);
    } catch { /* not found */ }
  }
  if (webIndicators.length > 0) {
    contextParts.push(`## Deployment Config Found\n${webIndicators.join(', ')}`);
  }

  return contextParts.join('\n\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  log('🚀', `Setting up GTM Launch System for "${PRODUCT_NAME}"`);
  log('📍', `API: ${API_URL}`);
  if (PRODUCT_REPO) log('📂', `Repo: ${PRODUCT_REPO}`);
  if (GITHUB_REPO) log('🐙', `GitHub: ${GITHUB_REPO}`);
  if (PRODUCT_URL) log('🌐', `URL: ${PRODUCT_URL}`);

  // -----------------------------------------------------------------------
  // 0. Read product context from repo (if provided)
  // -----------------------------------------------------------------------
  let productContext = '';
  if (PRODUCT_REPO) {
    try {
      productContext = await readProductContext(PRODUCT_REPO);
      if (productContext) {
        log('📖', `Read product context from repo (${productContext.length} chars)`);
      }
    } catch (e: any) {
      log('⚠️', `Could not read repo context: ${e.message}`);
    }
  }

  const fullDescription = [
    PRODUCT_DESC,
    PRODUCT_URL ? `\nLive URL: ${PRODUCT_URL}` : '',
    GITHUB_REPO ? `\nGitHub: ${GITHUB_REPO}` : '',
    PRODUCT_REPO ? `\nLocal repo: ${PRODUCT_REPO}` : '',
    productContext ? `\n\n---\n\n# Product Context (auto-extracted from repo)\n\n${productContext}` : '',
  ].join('');

  // -----------------------------------------------------------------------
  // 1. Create company
  // -----------------------------------------------------------------------
  log('🏢', 'Creating GTM company...');
  const company = await api('POST', '/api/companies', {
    name: `GTM — ${PRODUCT_NAME}`,
    description: `Launch ${PRODUCT_NAME} and reach first paying customers.\n\n${PRODUCT_DESC}`,
  });
  const companyId = company.id;
  const prefix = company.prefix || company.identifierPrefix;
  log('✅', `Company created: ${company.name} (${prefix})`);

  // -----------------------------------------------------------------------
  // 2. Create project + workspace (connected to product repo)
  // -----------------------------------------------------------------------
  log('📁', 'Creating GTM project...');

  const projectPayload: Record<string, any> = {
    name: `${PRODUCT_NAME} Launch`,
    description: fullDescription.slice(0, 5000),
  };

  const project = await api('POST', `/api/companies/${companyId}/projects`, projectPayload);
  const projectId = project.id;
  log('✅', `Project created: ${project.name}`);

  // Attach workspace if repo path or GitHub URL provided
  if (PRODUCT_REPO || GITHUB_REPO) {
    log('🔗', 'Connecting product repository as workspace...');
    try {
      const wsPayload: Record<string, any> = {
        name: `${PRODUCT_NAME} codebase`,
        isPrimary: true,
      };
      if (PRODUCT_REPO) wsPayload.cwd = path.resolve(PRODUCT_REPO);
      if (GITHUB_REPO) wsPayload.repoUrl = GITHUB_REPO;

      await api('POST', `/api/projects/${projectId}/workspaces`, wsPayload);
      log('✅', 'Workspace connected — agents can now read product code and docs');
    } catch (e: any) {
      log('⚠️', `Workspace: ${e.message}`);
    }
  }

  // -----------------------------------------------------------------------
  // 3. Install skills
  // -----------------------------------------------------------------------
  const skillNames = [
    'gtm-rules', 'gtm-director', 'gtm-strategist', 'gtm-brand', 'gtm-web',
    'gtm-finance', 'gtm-sales', 'gtm-prospector', 'gtm-qa',
  ];

  log('📚', 'Installing GTM skills...');
  const skillMap: Record<string, string> = {};
  for (const name of skillNames) {
    try {
      const skill = await api('POST', `/api/companies/${companyId}/skills/import`, {
        source: `skills/${name}`,
      });
      skillMap[name] = skill.id || skill.skillId;
      log('  ✅', `Skill installed: ${name}`);
    } catch (e: any) {
      log('  ⚠️', `Skill ${name} — ${e.message}`);
    }
  }

  // Also install the core paperclip skill
  try {
    await api('POST', `/api/companies/${companyId}/skills/import`, {
      source: 'skills/paperclip',
    });
    log('  ✅', 'Skill installed: paperclip (core)');
  } catch { /* may already exist */ }

  // -----------------------------------------------------------------------
  // 4. Create CEO agent (GTM Director)
  // -----------------------------------------------------------------------
  log('👔', 'Hiring GTM Director (CEO)...');

  const ceoAdapterConfig: Record<string, any> = {
    model: 'claude-sonnet-4-20250514',
  };
  if (PRODUCT_REPO) ceoAdapterConfig.cwd = path.resolve(PRODUCT_REPO);

  const ceo = await api('POST', `/api/companies/${companyId}/agents`, {
    name: 'GTM Director',
    role: 'ceo',
    title: 'Go-To-Market Director',
    icon: 'rocket',
    capabilities: [
      'Orchestrates all 7 GTM phases from validation to launch.',
      'Manages dependencies between phases.',
      'Reviews work from specialist agents.',
      'Escalates decisions to the board.',
      'Monitors overall progress and adjusts priorities.',
      `Product: ${PRODUCT_NAME} — ${PRODUCT_DESC}`,
    ].join(' '),
    adapterType: 'claude_local',
    adapterConfig: ceoAdapterConfig,
    runtimeConfig: {
      heartbeat: { enabled: true, intervalSec: 600, wakeOnDemand: true },
    },
    desiredSkills: ['paperclip', 'gtm-rules', 'gtm-director'],
  });
  const ceoId = ceo.id;
  log('✅', `CEO hired: ${ceo.name} (${ceoId})`);

  // -----------------------------------------------------------------------
  // 5. Create specialist agents
  // -----------------------------------------------------------------------
  const agentDefs = [
    {
      name: 'Strategist',
      role: 'researcher',
      title: 'Market Validation Specialist',
      icon: 'search',
      capabilities: `Market research, competitor analysis, pricing strategy, ICP definition, unit economics calculation. Product: ${PRODUCT_NAME} — ${PRODUCT_DESC}`,
      skill: 'gtm-strategist',
      needsRepo: false,
    },
    {
      name: 'Brand Designer',
      role: 'designer',
      title: 'Brand Identity Designer',
      icon: 'sparkles',
      capabilities: `Product naming, visual identity (colors, typography, logo brief), verbal identity (tone, tagline, elevator pitch), brand guidelines for ${PRODUCT_NAME}.`,
      skill: 'gtm-brand',
      needsRepo: false,
    },
    {
      name: 'Web Builder',
      role: 'engineer',
      title: 'Web Presence Engineer',
      icon: 'globe',
      capabilities: `Landing pages, pricing pages, SEO content, legal pages, hosting, analytics, deployment for ${PRODUCT_NAME}.`,
      skill: 'gtm-web',
      needsRepo: true, // needs access to product code
    },
    {
      name: 'Finance Manager',
      role: 'cfo',
      title: 'Payment & Billing Manager',
      icon: 'lock',
      capabilities: `Payment gateway integration (Stripe/Paddle), checkout flows, invoicing, tax compliance, subscription management for ${PRODUCT_NAME}.`,
      skill: 'gtm-finance',
      needsRepo: true, // needs to integrate payment code
    },
    {
      name: 'Sales Manager',
      role: 'pm',
      title: 'CRM & Sales Pipeline Manager',
      icon: 'target',
      capabilities: `CRM configuration, email sequences, sales decks, proposals, demo scripts, lead nurturing workflows for ${PRODUCT_NAME}.`,
      skill: 'gtm-sales',
      needsRepo: false,
    },
    {
      name: 'Prospector',
      role: 'cmo',
      title: 'Outbound Acquisition Specialist',
      icon: 'radar',
      capabilities: `Target company research, cold email campaigns, LinkedIn outreach, directory submissions, partnership outreach for ${PRODUCT_NAME}.`,
      skill: 'gtm-prospector',
      needsRepo: false,
    },
    {
      name: 'QA Lead',
      role: 'qa',
      title: 'Quality Assurance & Launch Manager',
      icon: 'shield',
      capabilities: `End-to-end testing of purchase flows, responsive design QA, copy review, performance testing, launch execution for ${PRODUCT_NAME}.`,
      skill: 'gtm-qa',
      needsRepo: true, // needs to test the actual product
    },
  ];

  const agentIds: Record<string, string> = {};

  for (const def of agentDefs) {
    log('🤖', `Hiring ${def.name}...`);
    try {
      const adapterConfig: Record<string, any> = {
        model: 'claude-sonnet-4-20250514',
      };
      // Agents that need code access get the repo path as cwd
      if (def.needsRepo && PRODUCT_REPO) {
        adapterConfig.cwd = path.resolve(PRODUCT_REPO);
      }

      const agent = await api('POST', `/api/companies/${companyId}/agents`, {
        name: def.name,
        role: def.role,
        title: def.title,
        icon: def.icon,
        reportsTo: ceoId,
        capabilities: def.capabilities,
        adapterType: 'claude_local',
        adapterConfig,
        runtimeConfig: {
          heartbeat: { enabled: true, intervalSec: 300, wakeOnDemand: true },
        },
        desiredSkills: ['paperclip', 'gtm-rules', def.skill],
      });
      agentIds[def.name] = agent.id;
      log('  ✅', `${def.name} hired (${agent.id})`);
    } catch (e: any) {
      log('  ❌', `Failed to hire ${def.name}: ${e.message}`);
    }
  }

  // -----------------------------------------------------------------------
  // 6. Create goal hierarchy
  // -----------------------------------------------------------------------
  log('🎯', 'Creating goal hierarchy...');

  const goalDefs = [
    { title: 'Validate market and define business model', agent: 'Strategist' },
    { title: 'Create professional brand identity', agent: 'Brand Designer' },
    { title: 'Build web presence that converts', agent: 'Web Builder' },
    { title: 'Set up payment infrastructure', agent: 'Finance Manager' },
    { title: 'Configure CRM and sales pipeline', agent: 'Sales Manager' },
    { title: 'Acquire first 10 paying customers', agent: 'Prospector' },
    { title: 'Pass QA and execute launch', agent: 'QA Lead' },
  ];

  const goalIds: string[] = [];

  for (let i = 0; i < goalDefs.length; i++) {
    const def = goalDefs[i];
    try {
      const goal = await api('POST', `/api/companies/${companyId}/goals`, {
        title: `Phase ${i + 1}: ${def.title}`,
        description: `GTM Phase ${i + 1} for ${PRODUCT_NAME}. Owned by ${def.agent}.`,
        level: 'team',
        status: 'active',
      });
      goalIds.push(goal.id);
      log('  ✅', `Goal ${i + 1}: ${def.title}`);
    } catch (e: any) {
      log('  ⚠️', `Goal ${i + 1} — ${e.message}`);
      goalIds.push('');
    }
  }

  // -----------------------------------------------------------------------
  // 7. Create Phase 1 issues with product context
  // -----------------------------------------------------------------------
  log('📋', 'Creating Phase 1 issues...');

  const phase1Tasks = [
    {
      title: 'Define business model type',
      description: `Determine the revenue model for ${PRODUCT_NAME}: SaaS recurring, one-time purchase, freemium, or enterprise license.\n\nProduct: ${PRODUCT_DESC}\n${PRODUCT_URL ? `Live URL: ${PRODUCT_URL}` : ''}\n\nRead the product repo README and code to understand what it does, then recommend the best model.`,
    },
    {
      title: 'Define pricing with at least 2 plans',
      description: `Analyze competitor pricing, cost of serving, and willingness to pay for ${PRODUCT_NAME}.\n\nCreate minimum 2 pricing tiers with clear feature differentiation. Search the web for competitors and their pricing pages.`,
    },
    {
      title: 'Calculate unit economics (CAC, LTV, margins)',
      description: `Estimate Customer Acquisition Cost, Lifetime Value, LTV:CAC ratio (must be >3:1), and payback period for ${PRODUCT_NAME}.\n\nFlag if economics need adjustment.`,
    },
    {
      title: 'Define Ideal Customer Profile (ICP)',
      description: `Document for ${PRODUCT_NAME}: target sector, company size, decision-maker role, primary pain point, budget range, and where they hang out online.\n\nUse web search to find real companies that match.`,
    },
    {
      title: 'Analyze 3-5 direct competitors',
      description: `Search the web for products competing with ${PRODUCT_NAME}.\n\nFor each: pricing, key features, positioning, target market, and weaknesses/gaps we can exploit. Check Product Hunt, G2, Capterra, and direct competitor websites.`,
    },
    {
      title: 'Build initial list of 20 target companies',
      description: `Find 20+ companies matching the ICP for ${PRODUCT_NAME}.\n\nFor each: company name, website, size estimate, key contact (name, title), and why they're a good fit. Use LinkedIn, industry directories, and competitor customer lists.`,
    },
    {
      title: 'Craft value proposition in one sentence',
      description: `Formula: "We help [ICP] to [solve problem] so they can [achieve result], unlike [competitor weakness]."\n\nMust be specific to ${PRODUCT_NAME}. Test: if you remove any part, it should stop making sense.`,
    },
  ];

  for (const task of phase1Tasks) {
    try {
      await api('POST', `/api/companies/${companyId}/issues`, {
        title: task.title,
        description: task.description,
        status: 'todo',
        priority: 'high',
        projectId,
        goalId: goalIds[0] || undefined,
        assigneeAgentId: agentIds['Strategist'] || undefined,
      });
      log('  ✅', task.title);
    } catch (e: any) {
      log('  ⚠️', `Issue — ${e.message}`);
    }
  }

  // -----------------------------------------------------------------------
  // 8. Create routines
  // -----------------------------------------------------------------------
  log('🔄', 'Creating routines...');

  const routineDefs = [
    {
      title: 'Daily prospecting',
      description: `Find 5 new target companies for ${PRODUCT_NAME} matching ICP, generate personalized cold emails, queue for board approval.`,
      agent: 'Prospector',
      schedule: '0 9 * * 1-5',
      startActive: false, // activates after Phase 6 setup
    },
    {
      title: 'Lead follow-up check',
      description: `Review CRM for stale ${PRODUCT_NAME} leads (no response in 3+ days), generate follow-up emails, update pipeline status.`,
      agent: 'Sales Manager',
      schedule: '0 10 * * 1-5',
      startActive: false,
    },
    {
      title: 'Post-launch monitoring',
      description: `Check ${PRODUCT_NAME} uptime, error rates, conversion metrics, payment success rate, and user feedback. Report anomalies.`,
      agent: 'QA Lead',
      schedule: '*/30 * * * *',
      startActive: false, // activates on launch day
    },
  ];

  for (const r of routineDefs) {
    if (!agentIds[r.agent]) {
      log('  ⚠️', `Skipping routine "${r.title}" — agent ${r.agent} not available`);
      continue;
    }
    try {
      const routine = await api('POST', `/api/companies/${companyId}/routines`, {
        title: r.title,
        description: r.description,
        assigneeAgentId: agentIds[r.agent],
        projectId,
        status: r.startActive ? 'active' : 'paused',
        concurrencyPolicy: 'skip_if_active',
        catchUpPolicy: 'skip_missed',
      });

      // Add schedule trigger
      await api('POST', `/api/routines/${routine.id}/triggers`, {
        kind: 'schedule',
        cronExpression: r.schedule,
        timezone: 'UTC',
      });

      log('  ✅', `Routine: ${r.title} (${r.schedule}) [${r.startActive ? 'active' : 'paused'}]`);
    } catch (e: any) {
      log('  ⚠️', `Routine "${r.title}" — ${e.message}`);
    }
  }

  // -----------------------------------------------------------------------
  // Done!
  // -----------------------------------------------------------------------
  console.log('');
  log('🎉', '═══════════════════════════════════════════════════════');
  log('🎉', ` GTM Launch System for "${PRODUCT_NAME}" is ready!`);
  log('🎉', '═══════════════════════════════════════════════════════');
  console.log('');
  log('📊', `Dashboard:  ${API_URL}/${prefix}/dashboard`);
  log('👥', `Org chart:  ${API_URL}/${prefix}/org`);
  log('📋', `Issues:     ${API_URL}/${prefix}/issues`);
  log('🎯', `Goals:      ${API_URL}/${prefix}/goals`);
  if (PRODUCT_REPO) {
    log('📂', `Workspace:  ${PRODUCT_REPO} (connected)`);
  }
  console.log('');
  log('📌', 'How data flows:');
  log('  ', '• Agents use web search (via Claude Code) to find competitors, companies, pricing');
  log('  ', '• Agents read your product code/docs from the connected workspace');
  log('  ', '• Agents share findings via Paperclip issues, comments, and documents');
  log('  ', '• You (the board) approve before each phase advances');
  console.log('');
  log('💡', 'Next steps:');
  log('  1', 'Open the dashboard and review the org chart');
  log('  2', 'Trigger the Strategist heartbeat to start Phase 1');
  log('  3', 'The Strategist will research your market using web search');
  log('  4', 'Approve Phase 1 deliverables to unlock Phase 2');
  console.log('');
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
