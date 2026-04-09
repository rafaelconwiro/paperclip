/**
 * GTM Launch System — Interactive CLI Command
 * 
 * Can be invoked:
 *   1. Standalone: `paperclipai gtm`
 *   2. From onboard flow: after initial setup completes
 *   3. Skipped and run later at any time
 */
import * as p from "@clack/prompts";
import pc from "picocolors";
import path from "node:path";
import fs from "node:fs/promises";
import { resolveCommandContext, addCommonClientOptions, type BaseClientOptions } from "./client/common.js";

type GtmOptions = BaseClientOptions & {
  yes?: boolean;
};

// ---------------------------------------------------------------------------
// Product context reader
// ---------------------------------------------------------------------------

async function readProductContext(repoPath: string): Promise<{ description: string; techStack: string }> {
  let description = '';
  let techStack = '';

  // README
  for (const readme of ['README.md', 'readme.md', 'README.txt']) {
    try {
      const content = await fs.readFile(path.join(repoPath, readme), 'utf-8');
      description = content.slice(0, 2000);
      break;
    } catch { /* skip */ }
  }

  // package.json
  try {
    const pkg = JSON.parse(await fs.readFile(path.join(repoPath, 'package.json'), 'utf-8'));
    const deps = Object.keys(pkg.dependencies || {}).slice(0, 15);
    techStack = `${pkg.name || 'unknown'} — ${deps.join(', ')}`;
  } catch { /* skip */ }

  // requirements.txt
  if (!techStack) {
    try {
      const reqs = await fs.readFile(path.join(repoPath, 'requirements.txt'), 'utf-8');
      techStack = `Python — ${reqs.split('\n').slice(0, 10).join(', ')}`;
    } catch { /* skip */ }
  }

  return { description, techStack };
}

// ---------------------------------------------------------------------------
// Skill definitions (names match skills/ directory)
// ---------------------------------------------------------------------------

const GTM_SKILLS = [
  'gtm-director', 'gtm-strategist', 'gtm-brand', 'gtm-web',
  'gtm-finance', 'gtm-sales', 'gtm-prospector', 'gtm-qa',
];

const AGENT_DEFS = [
  { name: 'Strategist', role: 'researcher' as const, title: 'Market Validation Specialist', icon: 'search' as const, skill: 'gtm-strategist', needsRepo: false },
  { name: 'Brand Designer', role: 'designer' as const, title: 'Brand Identity Designer', icon: 'sparkles' as const, skill: 'gtm-brand', needsRepo: false },
  { name: 'Web Builder', role: 'engineer' as const, title: 'Web Presence Engineer', icon: 'globe' as const, skill: 'gtm-web', needsRepo: true },
  { name: 'Finance Manager', role: 'cfo' as const, title: 'Payment & Billing Manager', icon: 'lock' as const, skill: 'gtm-finance', needsRepo: true },
  { name: 'Sales Manager', role: 'pm' as const, title: 'CRM & Sales Pipeline Manager', icon: 'target' as const, skill: 'gtm-sales', needsRepo: false },
  { name: 'Prospector', role: 'cmo' as const, title: 'Outbound Acquisition Specialist', icon: 'radar' as const, skill: 'gtm-prospector', needsRepo: false },
  { name: 'QA Lead', role: 'qa' as const, title: 'Quality Assurance & Launch Manager', icon: 'shield' as const, skill: 'gtm-qa', needsRepo: true },
];

const GOAL_DEFS = [
  'Validate market and define business model',
  'Create professional brand identity',
  'Build web presence that converts',
  'Set up payment infrastructure',
  'Configure CRM and sales pipeline',
  'Acquire first 10 paying customers',
  'Pass QA and execute launch',
];

const PHASE1_TASKS = [
  { title: 'Define business model type', desc: 'Determine revenue model: SaaS recurring, one-time, freemium, or enterprise license.' },
  { title: 'Define pricing with at least 2 plans', desc: 'Analyze competitor pricing. Create minimum 2 tiers with feature differentiation.' },
  { title: 'Calculate unit economics', desc: 'Estimate CAC, LTV, LTV:CAC ratio (>3:1), and payback period.' },
  { title: 'Define Ideal Customer Profile', desc: 'Document: sector, company size, decision-maker, pain point, budget, channels.' },
  { title: 'Analyze 3-5 direct competitors', desc: 'Pricing, features, positioning, weaknesses. Check Product Hunt, G2, Capterra.' },
  { title: 'Build list of 20 target companies', desc: 'Matching ICP: company, website, key contact, fit reason.' },
  { title: 'Craft value proposition', desc: '"We help [ICP] to [solve problem] so they can [achieve result]."' },
];

const ROUTINE_DEFS = [
  { title: 'Daily prospecting', agent: 'Prospector', cron: '0 9 * * 1-5', desc: 'Find 5 new target companies, generate personalized cold emails.' },
  { title: 'Lead follow-up check', agent: 'Sales Manager', cron: '0 10 * * 1-5', desc: 'Check CRM for stale leads, generate follow-ups.' },
  { title: 'Post-launch monitoring', agent: 'QA Lead', cron: '*/30 * * * *', desc: 'Check uptime, errors, conversions, feedback.' },
];

// ---------------------------------------------------------------------------
// Main GTM command
// ---------------------------------------------------------------------------

export async function gtmCommand(opts: GtmOptions): Promise<void> {
  p.intro(pc.bgMagenta(pc.white(' GTM Launch System ')));
  p.log.message(pc.dim('Creates a Go-To-Market company with 7 AI agents to take your product from "built" to "billing".'));

  // -----------------------------------------------------------------------
  // Step 1: Gather product info
  // -----------------------------------------------------------------------
  const productName = await p.text({
    message: 'Product name',
    placeholder: 'e.g., FinAI, SCHDL, MyTool',
    validate: (v) => (!v?.trim() ? 'Required' : undefined),
  });
  if (p.isCancel(productName)) { p.cancel('Cancelled.'); return; }

  const productDescription = await p.text({
    message: 'Brief product description',
    placeholder: 'What does it do, for whom, what problem does it solve?',
    validate: (v) => (!v?.trim() ? 'Required' : undefined),
  });
  if (p.isCancel(productDescription)) { p.cancel('Cancelled.'); return; }

  const repoPath = await p.text({
    message: 'Path to product repository (optional — press Enter to skip)',
    placeholder: '/Users/you/projects/my-product',
  });
  if (p.isCancel(repoPath)) { p.cancel('Cancelled.'); return; }

  const resolvedRepo = repoPath?.trim() ? path.resolve(repoPath.trim()) : null;

  let productUrl: string | null = null;
  const urlAnswer = await p.text({
    message: 'Live product URL (optional — press Enter to skip)',
    placeholder: 'https://myproduct.com',
  });
  if (!p.isCancel(urlAnswer) && urlAnswer?.trim()) {
    productUrl = urlAnswer.trim();
  }

  // -----------------------------------------------------------------------
  // Step 2: Read repo context
  // -----------------------------------------------------------------------
  let repoContext = { description: '', techStack: '' };
  if (resolvedRepo) {
    const s = p.spinner();
    s.start('Reading product repository...');
    try {
      repoContext = await readProductContext(resolvedRepo);
      s.stop(`Found: ${repoContext.techStack || 'project files detected'}`);
    } catch {
      s.stop(pc.yellow('Could not read repo — continuing without context'));
    }
  }

  // -----------------------------------------------------------------------
  // Step 3: Confirm
  // -----------------------------------------------------------------------
  p.note(
    [
      `Product: ${pc.cyan(productName as string)}`,
      `Description: ${(productDescription as string).slice(0, 80)}`,
      resolvedRepo ? `Repository: ${resolvedRepo}` : 'Repository: not connected',
      productUrl ? `URL: ${productUrl}` : '',
      repoContext.techStack ? `Stack: ${repoContext.techStack}` : '',
      '',
      'This will create:',
      '  • 1 GTM Director (CEO agent)',
      '  • 7 specialist agents (strategy, brand, web, payments, CRM, outreach, QA)',
      '  • 7 phase goals with dependency chain',
      '  • 7 Phase 1 issues assigned to the Strategist',
      '  • 3 recurring routines (paused until ready)',
    ].filter(Boolean).join('\n'),
    'GTM Company Summary',
  );

  const confirm = await p.confirm({
    message: 'Create this GTM company?',
    initialValue: true,
  });
  if (p.isCancel(confirm) || !confirm) { p.cancel('Cancelled.'); return; }

  // -----------------------------------------------------------------------
  // Step 4: Connect to API
  // -----------------------------------------------------------------------
  let ctx: ReturnType<typeof resolveCommandContext>;
  try {
    ctx = resolveCommandContext(opts);
  } catch (e: any) {
    p.log.error(`Cannot connect to Paperclip: ${e.message}`);
    p.log.message(pc.dim('Start it with: paperclipai run'));
    return;
  }
  const { api: apiClient } = ctx;

  // Wrap the PaperclipApiClient into our simple helper
  const api = async <T = any>(method: string, apiPath: string, body?: unknown): Promise<T> => {
    if (method === 'POST') return apiClient.post(apiPath, body) as Promise<T>;
    if (method === 'GET') return apiClient.get(apiPath) as Promise<T>;
    if (method === 'PATCH') return apiClient.patch(apiPath, body) as Promise<T>;
    throw new Error(`Unsupported method: ${method}`);
  };

  const s = p.spinner();
  s.start('Connecting to Paperclip...');
  try {
    await apiClient.get('/health');
    s.stop('Connected to Paperclip');
  } catch {
    s.stop(pc.red('Cannot reach Paperclip'));
    p.log.error('Make sure Paperclip is running');
    p.log.message(pc.dim('Start it with: paperclipai run'));
    return;
  }

  // -----------------------------------------------------------------------
  // Step 5: Create everything
  // -----------------------------------------------------------------------
  const name = productName as string;
  const desc = productDescription as string;

  // Company
  s.start('Creating company...');
  let companyId: string;
  let prefix: string;
  try {
    const company = await api('POST', '/api/companies', {
      name: `GTM — ${name}`,
      description: `Launch ${name} and reach first paying customers.\n\n${desc}`,
    });
    companyId = company.id;
    prefix = company.prefix || company.identifierPrefix;
    s.stop(`Company created: ${pc.cyan(`GTM — ${name}`)} (${prefix})`);
  } catch (e: any) {
    s.stop(pc.red(`Failed: ${e.message}`));
    return;
  }

  // Project + workspace
  s.start('Creating project...');
  let projectId: string;
  try {
    const project = await api('POST', `/api/companies/${companyId}/projects`, {
      name: `${name} Launch`,
      description: desc.slice(0, 5000),
    });
    projectId = project.id;
    s.stop(`Project: ${pc.cyan(`${name} Launch`)}`);
  } catch (e: any) {
    s.stop(pc.red(`Failed: ${e.message}`));
    return;
  }

  if (resolvedRepo) {
    try {
      await api('POST', `/api/projects/${projectId}/workspaces`, {
        name: `${name} codebase`,
        isPrimary: true,
        cwd: resolvedRepo,
      });
      p.log.success(`Repository connected: ${pc.dim(resolvedRepo)}`);
    } catch (e: any) {
      p.log.warn(`Workspace: ${e.message}`);
    }
  }

  // Skills
  s.start('Installing GTM skills...');
  let skillCount = 0;
  for (const skill of GTM_SKILLS) {
    try {
      await api('POST', `/api/companies/${companyId}/skills/import`, { source: `skills/${skill}` });
      skillCount++;
    } catch { /* continue */ }
  }
  try { await api('POST', `/api/companies/${companyId}/skills/import`, { source: 'skills/paperclip' }); } catch { /* ok */ }
  s.stop(`${skillCount} GTM skills + paperclip core installed`);

  // CEO
  s.start('Hiring GTM Director...');
  let ceoId: string;
  try {
    const ceoConfig: Record<string, any> = { model: 'claude-sonnet-4-20250514' };
    if (resolvedRepo) ceoConfig.cwd = resolvedRepo;

    const ceo = await api('POST', `/api/companies/${companyId}/agents`, {
      name: 'GTM Director', role: 'ceo', title: 'Go-To-Market Director', icon: 'rocket',
      capabilities: `Orchestrates 7 GTM phases for ${name}. ${desc}`,
      adapterType: 'claude_local', adapterConfig: ceoConfig,
      runtimeConfig: { heartbeat: { enabled: true, intervalSec: 600, wakeOnDemand: true } },
      desiredSkills: ['paperclip', 'gtm-director'],
    });
    ceoId = ceo.id;
    s.stop(`GTM Director hired`);
  } catch (e: any) {
    s.stop(pc.red(`Failed: ${e.message}`));
    return;
  }

  // Specialist agents
  s.start('Hiring specialist agents...');
  const agentIds: Record<string, string> = {};
  for (const def of AGENT_DEFS) {
    try {
      const config: Record<string, any> = { model: 'claude-sonnet-4-20250514' };
      if (def.needsRepo && resolvedRepo) config.cwd = resolvedRepo;

      const agent = await api('POST', `/api/companies/${companyId}/agents`, {
        name: def.name, role: def.role, title: def.title, icon: def.icon,
        reportsTo: ceoId,
        capabilities: `${def.title} for ${name}. ${desc}`,
        adapterType: 'claude_local', adapterConfig: config,
        runtimeConfig: { heartbeat: { enabled: true, intervalSec: 300, wakeOnDemand: true } },
        desiredSkills: ['paperclip', def.skill],
      });
      agentIds[def.name] = agent.id;
    } catch { /* continue */ }
  }
  s.stop(`${Object.keys(agentIds).length} specialists hired`);

  // Goals
  s.start('Creating phase goals...');
  const goalIds: string[] = [];
  for (let i = 0; i < GOAL_DEFS.length; i++) {
    try {
      const goal = await api('POST', `/api/companies/${companyId}/goals`, {
        title: `Phase ${i + 1}: ${GOAL_DEFS[i]}`,
        description: `GTM Phase ${i + 1} for ${name}.`,
        level: 'team', status: 'active',
      });
      goalIds.push(goal.id);
    } catch { goalIds.push(''); }
  }
  s.stop(`${goalIds.filter(Boolean).length} phase goals created`);

  // Phase 1 issues
  s.start('Creating Phase 1 tasks...');
  for (const task of PHASE1_TASKS) {
    try {
      await api('POST', `/api/companies/${companyId}/issues`, {
        title: task.title,
        description: `${task.desc}\n\nProduct: ${name} — ${desc}${productUrl ? `\nURL: ${productUrl}` : ''}`,
        status: 'todo', priority: 'high', projectId,
        goalId: goalIds[0] || undefined,
        assigneeAgentId: agentIds['Strategist'] || undefined,
      });
    } catch { /* continue */ }
  }
  s.stop(`${PHASE1_TASKS.length} Phase 1 tasks created`);

  // Routines
  s.start('Creating routines...');
  for (const r of ROUTINE_DEFS) {
    const agentId = agentIds[r.agent];
    if (!agentId) continue;
    try {
      const routine = await api('POST', `/api/companies/${companyId}/routines`, {
        title: r.title, description: `${r.desc} Product: ${name}.`,
        assigneeAgentId: agentId, projectId, status: 'paused',
        concurrencyPolicy: 'skip_if_active', catchUpPolicy: 'skip_missed',
      });
      await api('POST', `/api/routines/${routine.id}/triggers`, {
        kind: 'schedule', cronExpression: r.cron, timezone: 'UTC',
      });
    } catch { /* continue */ }
  }
  s.stop('Routines created (paused until ready)');

  // -----------------------------------------------------------------------
  // Done!
  // -----------------------------------------------------------------------
  p.note(
    [
      `Dashboard:  ${pc.cyan(`/${prefix}/dashboard`)}`,
      `Org chart:  ${pc.cyan(`/${prefix}/org`)}`,
      `Issues:     ${pc.cyan(`/${prefix}/issues`)}`,
      `Goals:      ${pc.cyan(`/${prefix}/goals`)}`,
      resolvedRepo ? `Workspace:  ${pc.dim(resolvedRepo)}` : '',
    ].filter(Boolean).join('\n'),
    `GTM — ${name}`,
  );

  p.log.step('Next steps:');
  p.log.message(`  1. Open the dashboard at ${pc.cyan(`${baseUrl}/${prefix}/dashboard`)}`);
  p.log.message(`  2. Trigger the Strategist's first heartbeat`);
  p.log.message(`  3. The Strategist researches your market via web search`);
  p.log.message(`  4. Approve Phase 1 to unlock Phases 2 + 4`);

  p.outro(pc.green('GTM system ready — go get your first customers! 🚀'));
}

/**
 * Quick check offered at the end of onboard/run — returns true if user
 * chose to set up GTM, false if skipped.
 */
export async function offerGtmSetup(opts: GtmOptions): Promise<boolean> {
  const answer = await p.confirm({
    message: 'Set up a Go-To-Market company to launch a product?',
    initialValue: false,
  });
  if (p.isCancel(answer) || !answer) return false;
  await gtmCommand(opts);
  return true;
}
