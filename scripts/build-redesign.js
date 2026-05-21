const fs = require('fs');
const path = require('path');

const REPO = path.join(__dirname, '..');
const DL = 'c:/Users/hashm/Downloads';

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function write(file, content) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content);
}

function fixLinks(html) {
  return html
    .replace(/href="\/for-brands"/g, 'href="/for-brands/"')
    .replace(/href="\/for-creators"/g, 'href="/for-creators/"')
    .replace(/href="\/for-agencies"/g, 'href="/for-agencies/"')
    .replace(/href="\/pricing"/g, 'href="/pricing/"')
    .replace(/href="\/resources"/g, 'href="/resources/"')
    .replace(/href="\/privacy"/g, 'href="/privacy-policy/"')
    .replace(/href="\/terms"/g, 'href="/terms-of-service/"')
    .replace(/href="#"/g, 'href="/login/"')
    .replace(/onsubmit="event\.preventDefault\(\);"/g, '')
    .replace(/<form class="early-form"/g, '<form class="early-form" action="/signup/" method="get"')
    .replace(/<input type="email" class="early-input"/g, '<input type="email" name="email" class="early-input"');
}

function nav(active, ctaHref = '/signup/', ctaLabel = 'Start free') {
  const items = [
    ['brands', 'For Brands', '/for-brands/'],
    ['creators', 'For Creators', '/for-creators/'],
    ['agencies', 'For Agencies', '/for-agencies/'],
    ['pricing', 'Pricing', '/pricing/'],
    ['resources', 'Resources', '/resources/'],
  ];
  const links = items.map(([k, label, href]) =>
    `<li><a href="${href}"${active === k ? ' class="active"' : ''}>${label}</a></li>`
  ).join('\n    ');
  const mobileLinks = items.map(([k, label, href]) =>
    `<a href="${href}"${active === k ? ' class="active"' : ''}>${label}</a>`
  ).join('\n      ');
  return `<header class="site-header">
  <input type="checkbox" id="nav-toggle" class="nav-check" aria-hidden="true">
  <label for="nav-toggle" class="nav-mobile-backdrop" aria-hidden="true"></label>
  <nav>
    <a href="/" class="nav-logo"><div class="logo-mark">E</div>Earnfluence</a>
    <ul class="nav-links">
    ${links}
    </ul>
    <div class="nav-actions">
      <a href="/login/" class="btn-text">Log in</a>
      <a href="${ctaHref}" class="btn-primary">${ctaLabel}</a>
    </div>
    <label for="nav-toggle" class="nav-burger" aria-label="Toggle menu">
      <svg class="nav-icon-open" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      <svg class="nav-icon-close" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
    </label>
    <div class="nav-mobile-panel">
      ${mobileLinks}
      <a href="/login/">Log in</a>
      <a href="${ctaHref}" class="btn-primary" style="text-align:center;margin-top:0.5rem;">${ctaLabel}</a>
    </div>
  </nav>
</header>`;
}

function footer() {
  return `<footer>
  <a href="/" class="footer-logo"><div class="logo-mark">E</div>Earnfluence</a>
  <div class="footer-links">
    <a href="/for-brands/">Brands</a><a href="/for-creators/">Creators</a>
    <a href="/for-agencies/">Agencies</a><a href="/pricing/">Pricing</a>
    <a href="/privacy-policy/">Privacy</a><a href="/terms-of-service/">Terms</a>
  </div>
  <div class="footer-copy">© 2026 Earnfluence</div>
</footer>`;
}

function head(title, desc, extraCss = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/site.css">
  <link rel="stylesheet" href="/assets/css/static.css">${extraCss}
</head>
<body>`;
}

function extractBody(html) {
  const m = html.match(/<body>([\s\S]*)<\/body>/i);
  if (!m) throw new Error('No body found');
  let body = m[1];
  body = body.replace(/<nav>[\s\S]*?<\/nav>/, '');
  body = body.replace(/<footer>[\s\S]*?<\/footer>/, '');
  return fixLinks(body.trim());
}

function page(title, desc, active, body, ctaHref, ctaLabel) {
  return `${head(title, desc)}
${nav(active, ctaHref, ctaLabel)}
${body}
${footer()}
</body>
</html>`;
}

// --- CSS ---
const brandsHtml = fs.readFileSync(path.join(DL, 'earnfluence-for-brands (2).html'), 'utf8');
const cssMatch = brandsHtml.match(/<style>([\s\S]*?)<\/style>/);
let baseCss = cssMatch[1];

const extraCss = `
    .ms-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
    .mm-stat-delta.neutral { color: var(--ink-light); }
    .comparison-table { width: 100%; max-width: 920px; margin: 2.75rem auto 0; border-collapse: collapse; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm); }
    .comparison-table th, .comparison-table td { padding: 1rem 1.1rem; text-align: left; font-size: 0.9rem; border-bottom: 1px solid var(--border); }
    .comparison-table th { background: var(--surface-alt); font-weight: 600; color: var(--ink); font-size: 0.85rem; }
    .comparison-table th.us { background: var(--indigo-pale); color: var(--indigo); }
    .comparison-table td:first-child { font-weight: 500; color: var(--ink); }
    .comparison-table td { color: var(--ink-medium); }
    .comparison-table td.us { background: var(--indigo-surface); color: var(--ink); font-weight: 500; }
    .comparison-table tr:last-child td { border-bottom: none; }
    .comparison-table .check { color: var(--green); font-weight: 700; }
    .comparison-table .dash { color: var(--ink-light); }
    .comparison-note { font-size: 0.82rem; color: var(--ink-light); max-width: 700px; margin: 1.25rem auto 0; line-height: 1.6; text-align: center; }
    .audience-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-top: 2.75rem; max-width: 1140px; margin-left: auto; margin-right: auto; padding: 0 2rem; }
    .audience-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 2rem 1.75rem; transition: all 0.2s; display: flex; flex-direction: column; text-decoration: none; color: inherit; }
    .audience-card:hover { border-color: var(--indigo); box-shadow: var(--shadow-lg); transform: translateY(-3px); }
    .audience-card .ac-label { display: inline-block; background: var(--indigo-pale); color: var(--indigo); font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; padding: 0.25rem 0.65rem; border-radius: 100px; margin-bottom: 1rem; width: fit-content; }
    .audience-card h3 { font-weight: 700; font-size: 1.25rem; color: var(--ink); margin-bottom: 0.5rem; }
    .audience-card p { font-size: 0.93rem; color: var(--ink-medium); line-height: 1.6; flex: 1; margin-bottom: 1.25rem; }
    .audience-card .ac-link { color: var(--indigo); font-weight: 600; font-size: 0.92rem; }
    .trust-strip { display: flex; flex-wrap: wrap; justify-content: center; gap: 2rem; padding: 2rem; }
    .trust-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; font-weight: 600; color: var(--ink-medium); }
    .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-top: 2rem; }
    .pricing-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 2rem; display: flex; flex-direction: column; }
    .pricing-card.featured { border-color: var(--indigo); box-shadow: var(--shadow-lg); position: relative; }
    .pricing-card .featured-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--indigo); color: white; font-size: 0.72rem; font-weight: 600; padding: 0.25rem 0.75rem; border-radius: 100px; }
    .pricing-card h3 { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; }
    .pricing-price { font-size: 2.5rem; font-weight: 700; color: var(--ink); margin-bottom: 0.25rem; }
    .pricing-price span { font-size: 1rem; font-weight: 500; color: var(--ink-light); }
    .pricing-note { font-size: 0.85rem; color: var(--indigo); font-weight: 600; margin-bottom: 0.75rem; }
    .pricing-desc { font-size: 0.9rem; color: var(--ink-medium); margin-bottom: 1rem; }
    .pricing-features { list-style: none; margin: 0 0 1.5rem; flex: 1; padding: 0; }
    .pricing-features li { font-size: 0.88rem; color: var(--ink-medium); padding: 0.35rem 0; padding-left: 1.25rem; position: relative; }
    .pricing-features li::before { content: '✓'; position: absolute; left: 0; color: var(--green); font-weight: 700; }
    .auth-wrap { max-width: 420px; margin: 4rem auto; padding: 0 1.25rem; }
    .auth-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow); }
    .auth-card h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
    .auth-card .auth-sub { color: var(--ink-medium); font-size: 0.92rem; margin-bottom: 1.5rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.35rem; color: var(--ink); }
    .form-input { width: 100%; padding: 0.65rem 0.85rem; border: 1px solid var(--border-strong); border-radius: var(--radius); font-family: inherit; font-size: 0.95rem; box-sizing: border-box; }
    .form-input:focus { outline: none; border-color: var(--indigo); box-shadow: 0 0 0 3px var(--indigo-pale); }
    .auth-footer { text-align: center; margin-top: 1.25rem; font-size: 0.88rem; color: var(--ink-medium); }
    .auth-footer a { color: var(--indigo); font-weight: 500; text-decoration: none; }
    .role-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem; }
    .role-card { border: 1px solid var(--border); border-radius: var(--radius); padding: 1.25rem 1rem; text-align: center; text-decoration: none; color: inherit; transition: all 0.2s; }
    .role-card:hover { border-color: var(--indigo); background: var(--indigo-pale); }
    .role-card strong { display: block; font-size: 1rem; margin-bottom: 0.25rem; }
    .role-card span { font-size: 0.82rem; color: var(--ink-medium); }
    .content-page { max-width: 720px; margin: 0 auto; padding: 3rem 2rem 5rem; }
    .content-page h1 { font-size: 2rem; font-weight: 700; margin-bottom: 1.5rem; }
    .content-page h2 { font-size: 1.25rem; font-weight: 600; margin: 2rem 0 0.75rem; color: var(--ink); }
    .content-page p, .content-page li { color: var(--ink-medium); line-height: 1.7; margin-bottom: 0.75rem; }
    .content-page ul { padding-left: 1.25rem; margin-bottom: 1rem; }
    .site-header { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.85); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); }
    .site-header nav { position: relative; border-bottom: none; }
    .nav-check { position: absolute; opacity: 0; pointer-events: none; }
    .nav-burger { display: none; cursor: pointer; padding: 0.5rem; color: var(--ink-medium); margin-left: auto; }
    .nav-burger svg { width: 24px; height: 24px; display: block; }
    .nav-icon-close { display: none; }
    .nav-mobile-panel { display: none; }
    .nav-mobile-backdrop { display: none; }
    .btn-full { width: 100%; text-align: center; }
    .section-center { text-align: center; }
    .section-center .section-title, .section-center .section-lead { margin-left: auto; margin-right: auto; }
`;

baseCss = baseCss.replace(
  '@media (max-width: 900px) {\n      .nav-links { display: none; }',
  `@media (max-width: 900px) {
      .nav-links { display: none; }
      .nav-actions { display: none; }
      .nav-burger { display: flex; align-items: center; }
      .nav-check:checked ~ .nav-mobile-backdrop { display: block; position: fixed; inset: 0; top: 64px; background: rgba(15,13,32,0.3); z-index: 98; }
      .nav-check:checked ~ nav .nav-mobile-panel { display: flex; flex-direction: column; position: absolute; top: 100%; left: 0; right: 0; background: var(--surface); border-bottom: 1px solid var(--border); padding: 1rem; gap: 0.25rem; z-index: 99; box-shadow: var(--shadow); }
      .nav-check:checked ~ nav .nav-mobile-panel a { text-decoration: none; color: var(--ink-medium); font-size: 0.95rem; font-weight: 500; padding: 0.65rem 0.85rem; border-radius: 6px; }
      .nav-check:checked ~ nav .nav-mobile-panel a:hover, .nav-check:checked ~ nav .nav-mobile-panel a.active { color: var(--indigo); background: var(--indigo-pale); }
      .nav-check:checked ~ nav .nav-burger .nav-icon-open { display: none; }
      .nav-check:checked ~ nav .nav-burger .nav-icon-close { display: block; }`
);

baseCss += extraCss;
baseCss += `
    @media (max-width: 900px) {
      .audience-grid, .pricing-grid { grid-template-columns: 1fr; }
      .comparison-table { font-size: 0.82rem; }
      .comparison-table th, .comparison-table td { padding: 0.7rem 0.55rem; }
      .role-grid { grid-template-columns: 1fr; }
    }
`;

write(path.join(REPO, 'assets/css/site.css'), baseCss.trim());

const appCss = fs.readFileSync(path.join(__dirname, 'app.css.template'), 'utf8');
write(path.join(REPO, 'assets/css/app.css'), appCss);

write(path.join(REPO, 'assets/css/static.css'), '.nav-check{position:absolute;opacity:0;pointer-events:none}');

// --- Landing pages ---
const refs = [
  ['earnfluence-for-brands (2).html', 'for-brands', 'brands', 'Earnfluence for Brands — Built for founders today. Built to last as you scale.', 'Affiliate software for SaaS, courses, digital products, and paid newsletters.', '/signup/brand/', 'Start free'],
  ['earnfluence-for-creators.html', 'for-creators', 'creators', 'Earnfluence for Creators — Promote what you love. Get paid on time.', 'The creator dashboard for affiliate programs. Real-time conversions, transparent attribution, automated payouts.', '/signup/creator/', 'Join free'],
  ['earnfluence-for-agencies-v3 (1).html', 'for-agencies', 'agencies', 'Earnfluence for Agencies — Run every client\'s affiliate program from one place', 'The affiliate platform built for agencies. Multi-client dashboard, white-label portals, bulk payouts.', '/signup/', 'Request access'],
];

for (const [file, dir, active, title, desc, cta, ctaLabel] of refs) {
  const html = fs.readFileSync(path.join(DL, file), 'utf8');
  const body = extractBody(html);
  write(path.join(REPO, dir, 'index.html'), page(title, desc, active, body, cta, ctaLabel));
}

// --- Homepage ---
const homeBody = `
<div class="hero">
  <div class="hero-eyebrow">Affiliate platform</div>
  <h1>Affiliate software for <span class="gradient">brands, creators, and agencies.</span></h1>
  <p class="hero-sub">Launch programs in minutes. Track every conversion. Pay creators on time. One platform that scales with you.</p>
  <div class="hero-actions">
    <a href="/for-brands/" class="btn-primary">Start free</a>
    <a href="/pricing/" class="btn-secondary">View pricing</a>
  </div>
  <p class="hero-note">No credit card required for brands. Free for creators, always.</p>
</div>

<div class="section section-center" style="padding-top:2rem;">
  <div class="section-eyebrow">Who it's for</div>
  <h2 class="section-title">Built for every side of affiliate marketing.</h2>
  <p class="section-lead">Whether you run a program, promote products, or manage clients — Earnfluence has you covered.</p>
  <div class="audience-grid">
    <a href="/for-brands/" class="audience-card">
      <span class="ac-label">For Brands</span>
      <h3>Built for founders today. Built to last as you scale.</h3>
      <p>Affiliate software you won't outgrow. Start free, launch your program in minutes, and scale without switching tools.</p>
      <span class="ac-link">Learn more →</span>
    </a>
    <a href="/for-creators/" class="audience-card">
      <span class="ac-label">For Creators</span>
      <h3>Promote what you love. Get paid on time.</h3>
      <p>Real-time conversions, transparent attribution, automated payouts on Stripe and PayPal. Free for creators, always.</p>
      <span class="ac-link">Learn more →</span>
    </a>
    <a href="/for-agencies/" class="audience-card">
      <span class="ac-label">For Agencies</span>
      <h3>Run every client's program from one place.</h3>
      <p>Multi-client dashboard, white-label portals, bulk payouts, and pricing that scales with your roster.</p>
      <span class="ac-link">Learn more →</span>
    </a>
  </div>
</div>

<div class="section-band">
  <div class="section section-center section-tight">
    <div class="trust-strip">
      <span class="trust-item">✓ Stripe verified</span>
      <span class="trust-item">✓ PayPal Commerce Platform</span>
      <span class="trust-item">✓ Subscription-aware tracking</span>
      <span class="trust-item">✓ Automated payouts</span>
    </div>
  </div>
</div>

<div class="early-section" id="early-access">
  <div class="early-glow"></div>
  <div class="early-inner">
    <div class="early-eyebrow">Limited Cohort</div>
    <h2>Be one of the first on Earnfluence.</h2>
    <p>Founding users get priority support, roadmap input, and locked-in pricing.</p>
    <form class="early-form" action="/signup/" method="get">
      <input type="email" name="email" class="early-input" placeholder="you@example.com" required>
      <button type="submit" class="btn-primary">Get started</button>
    </form>
  </div>
</div>`;

write(path.join(REPO, 'index.html'), page(
  'Earnfluence — Affiliate platform for brands, creators, and agencies',
  'Affiliate software for SaaS, courses, digital products, and agencies. Start free, track conversions, automate payouts.',
  'home',
  homeBody,
  '/signup/',
  'Start free'
).replace('class="active">For Brands', '>For Brands').replace('nav-links', 'nav-links').replace('<li><a href="/for-brands/"', '<li><a href="/for-brands/"'));

// Fix home nav - no active item
write(path.join(REPO, 'index.html'), `${head('Earnfluence — Affiliate platform for brands, creators, and agencies', 'Affiliate software for SaaS, courses, digital products, and agencies. Start free, track conversions, automate payouts.')}
${nav(null, '/signup/', 'Start free')}
${homeBody}
${footer()}
</body>
</html>`);

// --- Resources ---
write(path.join(REPO, 'resources/index.html'), page(
  'Resources — Earnfluence',
  'Guides, docs, and resources for affiliate marketing with Earnfluence.',
  'resources',
  `<div class="section section-center section-tight" style="padding-top:6rem;">
  <div class="section-eyebrow">Resources</div>
  <h1 class="section-title">Coming soon</h1>
  <p class="section-lead">We're building guides, documentation, and playbooks for brands, creators, and agencies. Check back soon.</p>
  <div class="hero-actions" style="margin-top:2rem;">
    <a href="/for-brands/" class="btn-primary">Explore for Brands</a>
    <a href="/for-creators/" class="btn-secondary">Explore for Creators</a>
  </div>
</div>`,
  '/signup/',
  'Start free'
));

// --- Pricing ---
write(path.join(REPO, 'pricing/index.html'), page(
  'Pricing — Earnfluence',
  'Flat pricing for affiliate programs. Start free, upgrade when your program generates real revenue.',
  'pricing',
  `<div class="hero" style="padding-bottom:2rem;">
  <div class="hero-eyebrow">Pricing</div>
  <h1>Flat pricing. <span class="gradient">No transaction fees.</span></h1>
  <p class="hero-sub">We're finalizing tiers now. Start free and upgrade when your program is generating real revenue.</p>
</div>
<div class="section" style="padding-top:0;">
  <div class="pricing-grid">
    <div class="pricing-card">
      <h3>Launch</h3>
      <div class="pricing-price">$0 <span>/month</span></div>
      <p class="pricing-note">Free to start</p>
      <p class="pricing-desc">Everything you need to launch your first affiliate program.</p>
      <ul class="pricing-features">
        <li>Tracking links and promo codes</li>
        <li>Stripe &amp; PayPal integration</li>
        <li>Brand &amp; creator dashboards</li>
        <li>Manual payout support</li>
        <li>Basic performance reporting</li>
        <li>Email support</li>
      </ul>
      <a href="/signup/brand/" class="btn-secondary btn-full">Start free</a>
    </div>
    <div class="pricing-card featured">
      <span class="featured-badge">Most popular</span>
      <h3>Growth</h3>
      <div class="pricing-price">TBD <span>/month</span></div>
      <p class="pricing-note">Finalizing tiers</p>
      <p class="pricing-desc">Scale with automation, discovery, and advanced reporting.</p>
      <ul class="pricing-features">
        <li>Everything in Launch</li>
        <li>Creator tiers &amp; onboarding</li>
        <li>One-click PayPal payouts</li>
        <li>Custom domain support</li>
        <li>Advanced analytics</li>
        <li>Creator approval system</li>
      </ul>
      <a href="/signup/brand/" class="btn-primary btn-full">Request access</a>
    </div>
    <div class="pricing-card">
      <h3>Scale</h3>
      <div class="pricing-price">Custom</div>
      <p class="pricing-desc">Dedicated support for high-growth brands and agencies.</p>
      <ul class="pricing-features">
        <li>Everything in Growth</li>
        <li>Automated payouts</li>
        <li>Multi-client dashboard</li>
        <li>White-label portals</li>
        <li>Dedicated account manager</li>
        <li>Migration support</li>
      </ul>
      <a href="/for-agencies/#early-access" class="btn-secondary btn-full">Contact us</a>
    </div>
  </div>
  <p style="text-align:center;margin-top:2rem;color:var(--ink-light);font-size:0.9rem;">Creators never pay. <a href="/for-creators/" style="color:var(--indigo);">Join free as a creator →</a></p>
</div>`,
  '/signup/brand/',
  'Start free'
));

// --- Auth pages ---
write(path.join(REPO, 'login/index.html'), page(
  'Log in — Earnfluence',
  'Log in to your Earnfluence brand or creator dashboard.',
  null,
  `<div class="auth-wrap">
  <div class="auth-card">
    <h1>Log in</h1>
    <p class="auth-sub">Access your brand or creator dashboard.</p>
    <form action="/dashboard/" method="get">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" class="form-input" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" class="form-input" required>
      </div>
      <button type="submit" class="btn-primary btn-full">Log in</button>
    </form>
    <p class="auth-footer">Don't have an account? <a href="/signup/">Sign up free</a></p>
  </div>
</div>`,
  '/signup/',
  'Start free'
));

write(path.join(REPO, 'signup/index.html'), page(
  'Sign up — Earnfluence',
  'Create a free Earnfluence account as a brand or creator.',
  null,
  `<div class="auth-wrap">
  <div class="auth-card">
    <h1>Get started</h1>
    <p class="auth-sub">Choose how you want to use Earnfluence.</p>
    <div class="role-grid">
      <a href="/signup/brand/" class="role-card">
        <strong>Brand</strong>
        <span>Run an affiliate program</span>
      </a>
      <a href="/signup/creator/" class="role-card">
        <strong>Creator</strong>
        <span>Promote &amp; earn commissions</span>
      </a>
    </div>
    <p class="auth-footer">Agency? <a href="/for-agencies/#early-access">Request access</a> · Already have an account? <a href="/login/">Log in</a></p>
  </div>
</div>`,
  '/signup/',
  'Start free'
));

function signupPage(role, title, desc, action) {
  return page(title, desc, null, `<div class="auth-wrap">
  <div class="auth-card">
    <h1>${role === 'brand' ? 'Start your program' : 'Join as a creator'}</h1>
    <p class="auth-sub">${role === 'brand' ? 'Create your brand account. No credit card required.' : 'Free for creators, always.'}</p>
    <form action="${action}" method="get">
      <div class="form-group">
        <label for="name">${role === 'brand' ? 'Brand name' : 'Display name'}</label>
        <input type="text" id="name" name="name" class="form-input" required>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" class="form-input" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" class="form-input" required minlength="8">
      </div>
      <button type="submit" class="btn-primary btn-full">${role === 'brand' ? 'Start free' : 'Join free'}</button>
    </form>
    <p class="auth-footer"><a href="/signup/">← Back</a> · <a href="/login/">Log in</a></p>
  </div>
</div>`, '/signup/', 'Start free');
}

write(path.join(REPO, 'signup/brand/index.html'), signupPage('brand', 'Sign up — Brand — Earnfluence', 'Create a free brand account on Earnfluence.', '/dashboard/brand/'));
write(path.join(REPO, 'signup/creator/index.html'), signupPage('creator', 'Sign up — Creator — Earnfluence', 'Create a free creator account on Earnfluence.', '/dashboard/creator/'));

// --- Legal (read existing content snippets) ---
function readTextBetween(file, startMarker) {
  const html = fs.readFileSync(file, 'utf8');
  const idx = html.indexOf(startMarker);
  if (idx === -1) return '';
  const mainEnd = html.indexOf('</main>', idx);
  const chunk = mainEnd > idx ? html.slice(idx, mainEnd) : html.slice(idx);
  return chunk
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 8000);
}

const privacyRaw = fs.existsSync(path.join(REPO, 'privacy-policy/index.html'))
  ? fs.readFileSync(path.join(REPO, 'privacy-policy/index.html'), 'utf8') : '';
const termsRaw = fs.existsSync(path.join(REPO, 'terms-of-service/index.html'))
  ? fs.readFileSync(path.join(REPO, 'terms-of-service/index.html'), 'utf8') : '';

function extractLegalContent(raw, fallbackTitle) {
  const h1 = raw.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const sections = [];
  const re = /<h2[^>]*>([\s\S]*?)<\/h2>([\s\S]*?)(?=<h2|$)/gi;
  let m;
  while ((m = re.exec(raw)) !== null) {
    const heading = m[1].replace(/<[^>]+>/g, '').trim();
    let body = m[2].replace(/<p[^>]*>/gi, '\n<p>').replace(/<\/p>/gi, '</p>\n')
      .replace(/merchant/gi, 'brand').replace(/influencer/gi, 'creator');
    sections.push(`<h2>${heading}</h2>${body}`);
  }
  if (!sections.length) {
    return `<h1>${fallbackTitle}</h1><p>We respect your privacy and are committed to protecting your personal data. This policy describes how Earnfluence collects, uses, and safeguards information when you use our affiliate platform.</p>
<h2>Information we collect</h2><p>We collect information you provide when creating an account, running affiliate programs, or participating as a creator — including name, email, payment details, and program activity.</p>
<h2>How we use information</h2><p>We use data to operate the platform, process commissions and payouts, provide support, and improve our services.</p>
<h2>Contact</h2><p>Questions about this policy? Contact us at privacy@earnfluence.com.</p>`;
  }
  const title = h1 ? h1[1].replace(/<[^>]+>/g, '').trim() : fallbackTitle;
  return `<h1>${title}</h1>${sections.join('')}`;
}

write(path.join(REPO, 'privacy-policy/index.html'), page(
  'Privacy Policy — Earnfluence',
  'Earnfluence privacy policy.',
  null,
  `<div class="content-page">${extractLegalContent(privacyRaw, 'Privacy Policy')}</div>`,
  '/signup/', 'Start free'
));

write(path.join(REPO, 'terms-of-service/index.html'), page(
  'Terms of Service — Earnfluence',
  'Earnfluence terms of service.',
  null,
  `<div class="content-page">${extractLegalContent(termsRaw, 'Terms of Service')}</div>`,
  '/signup/', 'Start free'
));

// --- 404 ---
const notFoundBody = `<div class="section section-center" style="padding-top:6rem;padding-bottom:6rem;">
  <div class="section-eyebrow">404</div>
  <h1 class="section-title">Page not found</h1>
  <p class="section-lead">The page you're looking for doesn't exist or has moved.</p>
  <div class="hero-actions" style="margin-top:2rem;">
    <a href="/" class="btn-primary">Go home</a>
    <a href="/for-brands/" class="btn-secondary">For Brands</a>
  </div>
</div>`;

for (const p of ['404.html', '404/index.html', '_not-found/index.html']) {
  write(path.join(REPO, p), `${head('Page not found — Earnfluence', 'Page not found.')}
${nav(null, '/signup/', 'Start free')}
${notFoundBody}
${footer()}
</body>
</html>`);
}

// --- Dashboard shell helpers ---
function appHead(title) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/site.css">
  <link rel="stylesheet" href="/assets/css/app.css">
  <link rel="stylesheet" href="/assets/css/static.css">
</head>
<body>`;
}

const icon = {
  dash: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  users: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>',
  megaphone: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 6a13 13 0 008.4-2.8A1 1 0 0121 4v12a1 1 0 01-1.6.8A13 13 0 0111 14H5a2 2 0 01-2-2V8a2 2 0 012-2z"/></svg>',
  settings: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
  link: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 14L21 3M21 3v6M21 3h-6"/><path d="M21 14v5a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h5"/></svg>',
  dollar: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
};

function brandSidebar(active) {
  const items = [
    ['overview', 'Dashboard', '/dashboard/brand/', icon.dash],
    ['approvals', 'Approvals', '/dashboard/brand/approvals/', icon.users],
    ['promo', 'Promo Codes', '/dashboard/brand/promo-codes/', icon.megaphone],
    ['settings', 'Settings', '/dashboard/brand/settings/', icon.settings],
  ];
  const navItems = items.map(([k, label, href, ic]) =>
    `<a href="${href}" class="app-nav-item${active === k ? ' active' : ''}">${ic}${label}</a>`
  ).join('\n        ');
  return `<aside class="app-sidebar">
      <a href="/dashboard/brand/" class="app-sidebar-brand"><div class="logo-mark">E</div> Earnfluence</a>
      <nav class="app-sidebar-nav">
        <div class="app-nav-section">Brand</div>
        ${navItems}
      </nav>
      <div class="app-sidebar-footer"><a href="/"><span class="app-avatar">A</span> Log out</a></div>
    </aside>`;
}

function creatorSidebar(active) {
  const items = [
    ['overview', 'Dashboard', '/dashboard/creator/', icon.dash],
    ['links', 'Links &amp; codes', '/dashboard/creator/', icon.link],
    ['earnings', 'Earnings', '/dashboard/creator/', icon.dollar],
    ['settings', 'Settings', '/dashboard/creator/settings/', icon.settings],
  ];
  const navItems = items.map(([k, label, href, ic]) =>
    `<a href="${href}" class="app-nav-item${active === k ? ' active' : ''}">${ic}${label}</a>`
  ).join('\n        ');
  return `<aside class="app-sidebar">
      <a href="/dashboard/creator/" class="app-sidebar-brand"><div class="logo-mark">E</div> Earnfluence</a>
      <nav class="app-sidebar-nav">
        <div class="app-nav-section">Creator</div>
        ${navItems}
      </nav>
      <div class="app-sidebar-footer"><a href="/"><span class="app-avatar">C</span> Log out</a></div>
    </aside>`;
}

function appPage(title, sidebar, content) {
  return `${appHead(title)}
<div class="app-shell">
  ${sidebar}
  <div class="app-main">
    <div class="app-content">${content}</div>
  </div>
</div>
</body></html>`;
}

// Brand dashboard overview
write(path.join(REPO, 'dashboard/brand/index.html'), appPage('Overview — Brand Dashboard — Earnfluence', brandSidebar('overview'), `
<div class="app-page-header">
  <div><h1>Program overview</h1><p>Last 30 days · 42 active creators</p></div>
  <a href="/dashboard/brand/campaigns/new/" class="btn-primary">+ New campaign</a>
</div>
<div class="app-stats">
  <div class="app-stat"><div class="app-stat-label">Tracked revenue</div><div class="app-stat-val">$124.5k</div><div class="app-stat-delta">↑ 12.5%</div></div>
  <div class="app-stat"><div class="app-stat-label">Pending payouts</div><div class="app-stat-val">$4,230</div><div class="app-stat-delta neutral">Net-30</div></div>
  <div class="app-stat"><div class="app-stat-label">Active creators</div><div class="app-stat-val">42</div><div class="app-stat-delta">↑ 4 new</div></div>
  <div class="app-stat"><div class="app-stat-label">Paid commissions</div><div class="app-stat-val">$18.4k</div><div class="app-stat-delta neutral">Lifetime</div></div>
</div>
<div class="app-grid-2">
  <div class="app-card">
    <div class="app-card-head">Active campaigns</div>
    <table class="app-table">
      <thead><tr><th>Campaign</th><th class="text-right">Commission</th><th class="text-right">Activity</th></tr></thead>
      <tbody>
        <tr><td>Summer Launch 2026</td><td class="text-right"><span class="app-badge indigo">15%</span></td><td class="text-right">140</td></tr>
        <tr><td>Default Storewide</td><td class="text-right"><span class="app-badge indigo">10%</span></td><td class="text-right">420</td></tr>
        <tr><td>VIP Partners</td><td class="text-right"><span class="app-badge indigo">25%</span></td><td class="text-right">85</td></tr>
      </tbody>
    </table>
  </div>
  <div class="app-card">
    <div class="app-card-head">Top creators</div>
    <table class="app-table">
      <thead><tr><th>Creator</th><th class="text-right">Orders</th><th class="text-right">Owed</th></tr></thead>
      <tbody>
        <tr><td><span class="app-avatar">S</span>Sarah Tech Reviews</td><td class="text-right">124</td><td class="text-right">$2,480</td></tr>
        <tr><td><span class="app-avatar">D</span>DesignDaily</td><td class="text-right">98</td><td class="text-right">$1,640</td></tr>
        <tr><td><span class="app-avatar">C</span>CodeWithChris</td><td class="text-right">45</td><td class="text-right">$850</td></tr>
      </tbody>
    </table>
  </div>
</div>`));

write(path.join(REPO, 'dashboard/brand/approvals/index.html'), appPage('Approvals — Brand Dashboard — Earnfluence', brandSidebar('approvals'), `
<div class="app-page-header"><div><h1>Creator approvals</h1><p>Review and approve creator applications.</p></div></div>
<div class="app-card">
  <table class="app-table">
    <thead><tr><th>Creator</th><th>Applied</th><th>Channel</th><th class="text-right">Action</th></tr></thead>
    <tbody>
      <tr><td><span class="app-avatar">A</span>Alex Rivera</td><td>Mar 18, 2026</td><td>YouTube · 48k</td><td class="text-right"><span class="app-badge">Pending</span></td></tr>
      <tr><td><span class="app-avatar">M</span>Maya Chen</td><td>Mar 17, 2026</td><td>Newsletter · 12k</td><td class="text-right"><span class="app-badge">Pending</span></td></tr>
      <tr><td><span class="app-avatar">J</span>Jordan Lee</td><td>Mar 15, 2026</td><td>Podcast · 25k</td><td class="text-right"><span class="app-badge indigo">Approved</span></td></tr>
    </tbody>
  </table>
</div>`));

write(path.join(REPO, 'dashboard/brand/promo-codes/index.html'), appPage('Promo Codes — Brand Dashboard — Earnfluence', brandSidebar('promo'), `
<div class="app-page-header"><div><h1>Promo codes</h1><p>Manage tracking codes for your creators.</p></div><a href="#" class="btn-primary">+ New code</a></div>
<div class="app-card">
  <table class="app-table">
    <thead><tr><th>Code</th><th>Creator</th><th>Discount</th><th class="text-right">Uses (30d)</th></tr></thead>
    <tbody>
      <tr><td><strong>ALEX20</strong></td><td>Alex Rivera</td><td>20% off</td><td class="text-right">142</td></tr>
      <tr><td><strong>MAYA15</strong></td><td>Maya Chen</td><td>15% off</td><td class="text-right">98</td></tr>
      <tr><td><strong>VIP25</strong></td><td>Jordan Lee</td><td>25% off</td><td class="text-right">71</td></tr>
    </tbody>
  </table>
</div>`));

write(path.join(REPO, 'dashboard/brand/settings/index.html'), appPage('Settings — Brand Dashboard — Earnfluence', brandSidebar('settings'), `
<div class="app-page-header"><div><h1>Settings &amp; billing</h1><p>Manage your program and account.</p></div></div>
<div class="app-card" style="padding:1.5rem;">
  <div class="app-form-group"><label>Brand name</label><input type="text" value="Acme SaaS"></div>
  <div class="app-form-group"><label>Default commission</label><input type="text" value="20% recurring"></div>
  <div class="app-form-group"><label>Payout schedule</label><select><option>Monthly</option><option>Bi-weekly</option></select></div>
  <button type="button" class="btn-primary">Save changes</button>
</div>`));

write(path.join(REPO, 'dashboard/brand/campaigns/new/index.html'), appPage('New Campaign — Brand Dashboard — Earnfluence', brandSidebar('overview'), `
<div class="app-page-header"><div><h1>Create campaign</h1><p>Set commission rules for a new affiliate campaign.</p></div></div>
<div class="app-card" style="padding:1.5rem;">
  <form action="/dashboard/brand/" method="get">
    <div class="app-form-group"><label>Campaign name</label><input type="text" name="name" required placeholder="Summer Launch 2026"></div>
    <div class="app-form-row">
      <div class="app-form-group"><label>Commission type</label><select name="type"><option>Percentage</option><option>Flat</option><option>Recurring</option></select></div>
      <div class="app-form-group"><label>Rate</label><input type="text" name="rate" placeholder="20%"></div>
    </div>
    <div class="app-form-group"><label>Description</label><textarea rows="3" placeholder="Optional notes for creators"></textarea></div>
    <button type="submit" class="btn-primary">Create campaign</button>
  </form>
</div>`));

// Creator dashboard
write(path.join(REPO, 'dashboard/creator/index.html'), appPage('Dashboard — Creator — Earnfluence', creatorSidebar('overview'), `
<div class="app-page-header"><div><h1>Earnings overview</h1><p>Last 30 days · 4 active programs</p></div></div>
<div class="app-stats">
  <div class="app-stat"><div class="app-stat-label">Total earnings</div><div class="app-stat-val">$4,820</div><div class="app-stat-delta">↑ 22.4%</div></div>
  <div class="app-stat"><div class="app-stat-label">Conversions</div><div class="app-stat-val">138</div><div class="app-stat-delta">↑ 14.1%</div></div>
  <div class="app-stat"><div class="app-stat-label">Clicks</div><div class="app-stat-val">3,241</div><div class="app-stat-delta">↑ 8.8%</div></div>
  <div class="app-stat"><div class="app-stat-label">Next payout</div><div class="app-stat-val">$1,240</div><div class="app-stat-delta neutral">Friday</div></div>
</div>
<div class="app-card">
  <div class="app-card-head">Programs</div>
  <table class="app-table">
    <thead><tr><th>Program</th><th class="text-right">Earnings</th><th class="text-right">Conversions</th><th class="text-right">Status</th></tr></thead>
    <tbody>
      <tr><td>Program 1</td><td class="text-right">$2,140</td><td class="text-right">62</td><td class="text-right"><span class="app-badge">Paid</span></td></tr>
      <tr><td>Program 2</td><td class="text-right">$1,480</td><td class="text-right">38</td><td class="text-right"><span class="app-badge">Paid</span></td></tr>
      <tr><td>Program 3</td><td class="text-right">$840</td><td class="text-right">22</td><td class="text-right"><span class="app-badge amber">Friday</span></td></tr>
    </tbody>
  </table>
</div>`));

write(path.join(REPO, 'dashboard/creator/settings/index.html'), appPage('Settings — Creator — Earnfluence', creatorSidebar('settings'), `
<div class="app-page-header"><div><h1>Settings</h1><p>Manage your creator profile and payout details.</p></div></div>
<div class="app-card" style="padding:1.5rem;">
  <div class="app-form-group"><label>Display name</label><input type="text" value="Alex Rivera"></div>
  <div class="app-form-group"><label>Payout method</label><select><option>Stripe</option><option>PayPal</option></select></div>
  <div class="app-form-group"><label>Email</label><input type="email" value="alex@example.com"></div>
  <button type="button" class="btn-primary">Save changes</button>
</div>`));

write(path.join(REPO, 'dashboard/index.html'), page(
  'Dashboard — Earnfluence',
  'Choose your Earnfluence dashboard.',
  null,
  `<div class="auth-wrap" style="max-width:520px;">
  <div class="auth-card">
    <h1>Select dashboard</h1>
    <p class="auth-sub">Which account are you logging into?</p>
    <div class="role-grid">
      <a href="/dashboard/brand/" class="role-card"><strong>Brand</strong><span>Program overview</span></a>
      <a href="/dashboard/creator/" class="role-card"><strong>Creator</strong><span>Earnings &amp; links</span></a>
    </div>
  </div>
</div>`,
  '/signup/', 'Start free'
));

// Marketplace
write(path.join(REPO, 'marketplace/index.html'), page(
  'Marketplace — Earnfluence',
  'Discover affiliate programs on Earnfluence.',
  null,
  `<div class="section">
  <div class="app-page-header"><div><h1 class="section-title" style="max-width:none;">Program marketplace</h1><p class="section-lead">Browse programs open to creators.</p></div></div>
  <div class="marketplace-grid">
    <a href="/campaigns/m_1/" class="marketplace-card"><h3>Acme SaaS</h3><p>20% recurring · SaaS</p><span class="app-badge indigo">Open</span></a>
    <a href="/campaigns/m_2/" class="marketplace-card"><h3>DesignKit Pro</h3><p>15% one-time · Digital product</p><span class="app-badge indigo">Open</span></a>
    <a href="/campaigns/m_3/" class="marketplace-card"><h3>CourseFlow</h3><p>25% · Online courses</p><span class="app-badge indigo">Open</span></a>
    <a href="/campaigns/m_4/" class="marketplace-card"><h3>NewsletterOS</h3><p>30% recurring · Newsletter</p><span class="app-badge indigo">Open</span></a>
    <a href="/campaigns/m_5/" class="marketplace-card"><h3>TemplateHub</h3><p>10% · Templates</p><span class="app-badge indigo">Open</span></a>
    <a href="/campaigns/m_6/" class="marketplace-card"><h3>AnalyticsPlus</h3><p>20% recurring · SaaS</p><span class="app-badge indigo">Open</span></a>
  </div>
</div>`,
  '/signup/creator/', 'Join free'
));

const campaigns = [
  ['m_1', 'Acme SaaS', '20% recurring commission on all subscription sales.'],
  ['m_2', 'DesignKit Pro', '15% commission on one-time template purchases.'],
  ['m_3', 'CourseFlow', '25% commission on course enrollments.'],
  ['m_4', 'NewsletterOS', '30% recurring on paid newsletter subscriptions.'],
  ['m_5', 'TemplateHub', '10% commission on template sales.'],
  ['m_6', 'AnalyticsPlus', '20% recurring on SaaS subscriptions.'],
];

for (const [slug, name, desc] of campaigns) {
  write(path.join(REPO, `campaigns/${slug}/index.html`), page(
    `${name} — Campaign — Earnfluence`,
    desc,
    null,
    `<div class="section section-tight">
  <div class="section-eyebrow">Affiliate program</div>
  <h1 class="section-title">${name}</h1>
  <p class="section-lead">${desc}</p>
  <div class="feat-card" style="margin-top:2rem;">
    <h4>Program details</h4>
    <p>Cookie window: 30 days · Payout: Monthly via Stripe or PayPal · Free to join as a creator.</p>
    <div class="hero-actions" style="justify-content:flex-start;margin-top:1.25rem;">
      <a href="/signup/creator/" class="btn-primary">Apply to join</a>
      <a href="/marketplace/" class="btn-secondary">← Back to marketplace</a>
    </div>
  </div>
</div>`,
    '/signup/creator/', 'Join free'
  ));
}

// Delete old paths
function rmrf(p) {
  if (!fs.existsSync(p)) return;
  if (fs.statSync(p).isDirectory()) {
    for (const f of fs.readdirSync(p)) rmrf(path.join(p, f));
    fs.rmdirSync(p);
  } else fs.unlinkSync(p);
}

for (const old of ['merchants', 'influencers', 'signup/merchant', 'signup/influencer', 'dashboard/merchant', 'dashboard/influencer']) {
  rmrf(path.join(REPO, old));
}

console.log('Full site redesign complete');
