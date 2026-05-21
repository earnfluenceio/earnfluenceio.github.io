const fs = require('fs');
const path = require('path');

const REPO = path.join(__dirname, '..');

function extractProse(file) {
  let html = fs.readFileSync(file, 'utf8');
  if (html.charCodeAt(0) === 0xfeff) html = html.slice(1);
  const start = html.indexOf('<section class="mb-12">');
  if (start === -1) {
    const alt = html.indexOf('<div class="prose');
    if (alt === -1) return '';
    const end = html.indexOf('</div></div></div></main>', alt);
    return cleanProse(html.slice(alt, end > alt ? end : html.indexOf('</main>', alt)));
  }
  const end = html.indexOf('</div></div></div></main>', start);
  let chunk = html.slice(start, end > start ? end : html.indexOf('</main>', start));
  return cleanProse(chunk);
}

function cleanProse(chunk) {
  // Strip Tailwind classes
  chunk = chunk.replace(/\sclass="[^"]*"/g, '');
  // Remove numbered badge spans in headings
  chunk = chunk.replace(/<span>\d+<\/span>/g, '');
  // Terminology
  chunk = chunk
    .replace(/\bMerchants\b/g, 'Brands')
    .replace(/\bmerchants\b/g, 'brands')
    .replace(/\bMerchant\b/g, 'Brand')
    .replace(/\bmerchant\b/g, 'brand')
    .replace(/\bInfluencers\b/g, 'Creators')
    .replace(/\binfluencers\b/g, 'creators')
    .replace(/\bInfluencer\b/g, 'Creator')
    .replace(/\binfluencer\b/g, 'creator')
    .replace(/Affiliates\/Creators/g, 'Creators')
    .replace(/Affiliates/g, 'Creators');
  return chunk;
}

// Re-use nav/footer/head from build script inline
function head(title, desc) {
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
  <link rel="stylesheet" href="/assets/css/static.css">
</head>
<body>`;
}

function nav() {
  return `<header class="site-header">
  <input type="checkbox" id="nav-toggle" class="nav-check" aria-hidden="true">
  <label for="nav-toggle" class="nav-mobile-backdrop" aria-hidden="true"></label>
  <nav>
    <a href="/" class="nav-logo"><div class="logo-mark">E</div>Earnfluence</a>
    <ul class="nav-links">
    <li><a href="/for-brands/">For Brands</a></li>
    <li><a href="/for-creators/">For Creators</a></li>
    <li><a href="/for-agencies/">For Agencies</a></li>
    <li><a href="/pricing/">Pricing</a></li>
    <li><a href="/resources/">Resources</a></li>
    </ul>
    <div class="nav-actions">
      <a href="/login/" class="btn-text">Log in</a>
      <a href="/signup/" class="btn-primary">Start free</a>
    </div>
    <label for="nav-toggle" class="nav-burger" aria-label="Toggle menu">
      <svg class="nav-icon-open" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      <svg class="nav-icon-close" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
    </label>
    <div class="nav-mobile-panel">
      <a href="/for-brands/">For Brands</a>
      <a href="/for-creators/">For Creators</a>
      <a href="/for-agencies/">For Agencies</a>
      <a href="/pricing/">Pricing</a>
      <a href="/resources/">Resources</a>
      <a href="/login/">Log in</a>
      <a href="/signup/" class="btn-primary" style="text-align:center;margin-top:0.5rem;">Start free</a>
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

function legalPage(title, desc, prose) {
  return `${head(title, desc)}
${nav()}
<div class="content-page">
  <h1>${title.replace(' — Earnfluence', '')}</h1>
  <p style="color:var(--ink-light);font-size:0.88rem;margin-bottom:2rem;">Effective Date: April 21, 2026</p>
  ${prose}
</div>
${footer()}
</body>
</html>`;
}

const privacyProse = extractProse(path.join(__dirname, '_privacy_orig.html'));
const termsProse = extractProse(path.join(__dirname, '_terms_orig.html'));

fs.writeFileSync(path.join(REPO, 'privacy-policy/index.html'), legalPage('Privacy Policy — Earnfluence', 'Earnfluence privacy policy.', privacyProse));
fs.writeFileSync(path.join(REPO, 'terms-of-service/index.html'), legalPage('Terms of Service — Earnfluence', 'Earnfluence terms of service.', termsProse));

console.log('Legal pages fixed');
