/**
 * GTM Launch System — Setup Script
 * 
 * Creates a complete Go-To-Market company in Paperclip with:
 * - 7 specialized agents (one per GTM phase)
 * - Goal hierarchy with dependencies
 * - Initial issues for Phase 1
 * - Recurring routines for prospecting and monitoring
 * 
 * Usage:
 *   pnpm paperclipai gtm-setup --product-name "MyProduct" --product-description "Description"
 * 
 * Or run directly:
 *   tsx scripts/gtm-setup.ts --product-name "MyProduct" --product-description "Description"
 */

import { parseArgs } from 'node:util';

const { values: args } = parseArgs({
  options: {
    'product-name': { type: 'string' },
    'product-description': { type: 'string' },
    'api-url': { type: 'string', default: 'http://localhost:3100' },
    'api-key': { type: 'string' },
    help: { type: 'boolean', short: 'h' },
  },
  strict: false,
});

if (args.help) {
  console.log(`
GTM Launch System — Setup Script

Creates a full Go-To-Market company in Paperclip.

Options:
  --product-name         Name of the product to launch (required)
  --product-description  Brief description of the product (required)
  --api-url              Paperclip API URL (default: http://localhost:3100)
  --api-key              Board API key (auto-detected if running locally)
  -h, --help             Show this help
`);
  process.exit(0);
}

const PRODUCT_NAME = args['product-name'] as string;
const PRODUCT_DESC = args['product-description'] as string;
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

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  log('🚀', `Setting up GTM Launch System for "${PRODUCT_NAME}"`);
  log('📍', `API: ${API_URL}`);

  // -----------------------------------------------------------------------
  // 1. Create company
  // -----------------------------------------------------------------------
  log('🏢', 'Creating GTM company...');
  const company = await api('POST', '/api/companies', {
    name: `GTM — ${PRODUCT_NAME}`,
    goal: `Launch ${PRODUCT_NAME} and reach first paying customers. ${PRODUCT_DESC}`,
  });
  const companyId = company.id;
  const prefix = company.prefix || company.identifierPrefix;
  log('✅', `Company created: ${company.name} (${prefix})`);

  // -----------------------------------------------------------------------
  // 2. Create project
  // -----------------------------------------------------------------------
  log('📁', 'Creating GTM project...');
  const project = await api('POST', `/api/companies/${companyId}/projects`, {
    name: `${PRODUCT_NAME} Launch`,
    description: `Go-to-market execution for ${PRODUCT_NAME}`,
  });
  const projectId = project.id;
  log('✅', `Project created: ${project.name}`);

  // -----------------------------------------------------------------------
  // 3. Install skills
  // -----------------------------------------------------------------------
  const skillNames = [
    'gtm-strategist', 'gtm-brand', 'gtm-web',
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
    ].join(' '),
    adapterType: 'claude_local',
    adapterConfig: {
      model: 'claude-sonnet-4-20250514',
    },
    runtimeConfig: {
      heartbeat: { enabled: true, intervalSec: 600, wakeOnDemand: true },
    },
    desiredSkills: ['paperclip'],
  });
  const ceoId = ceo.id;
  log('✅', `CEO hired: ${ceo.name} (${ceoId})`);

  // -----------------------------------------------------------------------
  // 5. Create specialist agents
  // -----------------------------------------------------------------------
  const agentDefs = [
    {
      name: 'Strategist',
      role: 'strategist',
      title: 'Market Validation Specialist',
      icon: 'search',
      capabilities: 'Market research, competitor analysis, pricing strategy, ICP definition, unit economics calculation.',
      skill: 'gtm-strategist',
    },
    {
      name: 'Brand Designer',
      role: 'designer',
      title: 'Brand Identity Designer',
      icon: 'palette',
      capabilities: 'Product naming, visual identity (colors, typography, logo brief), verbal identity (tone, tagline, elevator pitch), brand guidelines.',
      skill: 'gtm-brand',
    },
    {
      name: 'Web Builder',
      role: 'engineer',
      title: 'Web Presence Engineer',
      icon: 'globe',
      capabilities: 'Landing pages, pricing pages, SEO content, legal pages, hosting, analytics, deployment.',
      skill: 'gtm-web',
    },
    {
      name: 'Finance Manager',
      role: 'finance',
      title: 'Payment & Billing Manager',
      icon: 'wallet',
      capabilities: 'Payment gateway integration (Stripe/Paddle), checkout flows, invoicing, tax compliance, subscription management, financial metrics.',
      skill: 'gtm-finance',
    },
    {
      name: 'Sales Manager',
      role: 'sales',
      title: 'CRM & Sales Pipeline Manager',
      icon: 'handshake',
      capabilities: 'CRM configuration, email sequences, sales decks, proposals, demo scripts, lead nurturing workflows.',
      skill: 'gtm-sales',
    },
    {
      name: 'Prospector',
      role: 'marketing',
      title: 'Outbound Acquisition Specialist',
      icon: 'megaphone',
      capabilities: 'Target company research, cold email campaigns, LinkedIn outreach, directory submissions, partnership outreach, response tracking.',
      skill: 'gtm-prospector',
    },
    {
      name: 'QA Lead',
      role: 'qa',
      title: 'Quality Assurance & Launch Manager',
      icon: 'shield-check',
      capabilities: 'End-to-end testing of purchase flows, responsive design QA, copy review, performance testing, launch execution, post-launch monitoring.',
      skill: 'gtm-qa',
    },
  ];

  const agentIds: Record<string, string> = {};

  for (const def of agentDefs) {
    log('🤖', `Hiring ${def.name}...`);
    try {
      const agent = await api('POST', `/api/companies/${companyId}/agents`, {
        name: def.name,
        role: def.role,
        title: def.title,
        icon: def.icon,
        reportsTo: ceoId,
        capabilities: def.capabilities,
        adapterType: 'claude_local',
        adapterConfig: {
          model: 'claude-sonnet-4-20250514',
        },
        runtimeConfig: {
          heartbeat: { enabled: true, intervalSec: 300, wakeOnDemand: true },
        },
        desiredSkills: ['paperclip', def.skill],
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
        projectId,
      });
      goalIds.push(goal.id);
      log('  ✅', `Goal ${i + 1}: ${def.title}`);
    } catch (e: any) {
      log('  ⚠️', `Goal ${i + 1} — ${e.message}`);
      goalIds.push('');
    }
  }

  // -----------------------------------------------------------------------
  // 7. Create Phase 1 issues (kickstart)
  // -----------------------------------------------------------------------
  log('📋', 'Creating Phase 1 issues...');

  const phase1Tasks = [
    {
      title: 'Define business model type',
      description: `Determine the revenue model for ${PRODUCT_NAME}: SaaS recurring, one-time purchase, freemium, or enterprise license. Document reasoning based on product type and market.`,
    },
    {
      title: 'Define pricing with at least 2 plans',
      description: 'Analyze competitor pricing, cost of serving, and willingness to pay. Create minimum 2 pricing tiers with clear feature differentiation.',
    },
    {
      title: 'Calculate unit economics (CAC, LTV, margins)',
      description: 'Estimate Customer Acquisition Cost, Lifetime Value, LTV:CAC ratio (must be >3:1), and payback period. Flag if economics need adjustment.',
    },
    {
      title: 'Define Ideal Customer Profile (ICP)',
      description: 'Document: target sector, company size, decision-maker role, primary pain point, budget range, and where they hang out online.',
    },
    {
      title: 'Analyze 3-5 direct competitors',
      description: 'For each competitor: pricing, key features, positioning, target market, and weaknesses/gaps we can exploit.',
    },
    {
      title: 'Build initial list of 20 target companies',
      description: 'Find 20+ companies matching ICP with company name, website, key contact, and why they are a good fit.',
    },
    {
      title: 'Craft value proposition in one sentence',
      description: 'Formula: "We help [ICP] to [solve problem] so they can [achieve result], unlike [competitor weakness]."',
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
      description: 'Find 5 new target companies matching ICP, generate personalized cold emails, queue for board approval.',
      agent: 'Prospector',
      schedule: '0 9 * * 1-5',
    },
    {
      title: 'Lead follow-up check',
      description: 'Review CRM for stale leads (no response in 3+ days), generate follow-up emails, update pipeline status.',
      agent: 'Sales Manager',
      schedule: '0 10 * * 1-5',
    },
    {
      title: 'Post-launch monitoring',
      description: 'Check uptime, error rates, conversion metrics, payment success rate, and user feedback. Report anomalies.',
      agent: 'QA Lead',
      schedule: '*/30 * * * *',
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
        status: r.title.includes('Post-launch') ? 'paused' : 'active',
        concurrencyPolicy: 'skip_if_active',
        catchUpPolicy: 'skip_missed',
      });

      // Add schedule trigger
      await api('POST', `/api/routines/${routine.id}/triggers`, {
        type: 'schedule',
        config: { cron: r.schedule },
      });

      log('  ✅', `Routine: ${r.title} (${r.schedule})`);
    } catch (e: any) {
      log('  ⚠️', `Routine "${r.title}" — ${e.message}`);
    }
  }

  // -----------------------------------------------------------------------
  // Done!
  // -----------------------------------------------------------------------
  console.log('');
  log('🎉', '═══════════════════════════════════════════════════');
  log('🎉', ` GTM Launch System for "${PRODUCT_NAME}" is ready!`);
  log('🎉', '═══════════════════════════════════════════════════');
  console.log('');
  log('📊', `Dashboard: ${API_URL}/${prefix}/dashboard`);
  log('👥', `Org chart: ${API_URL}/${prefix}/org`);
  log('📋', `Issues:    ${API_URL}/${prefix}/issues`);
  log('🎯', `Goals:     ${API_URL}/${prefix}/goals`);
  console.log('');
  log('💡', 'Next steps:');
  log('  1', 'Open the dashboard and review the org chart');
  log('  2', 'Check Phase 1 issues assigned to the Strategist');
  log('  3', `Trigger the Strategist's first heartbeat to begin validation`);
  log('  4', 'Approve Phase 1 when complete to unlock Phase 2');
  console.log('');
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
