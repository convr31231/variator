import fs from 'fs';

function clean(src) {
  return src
    .replace(/export type [^=]+= \{[\s\S]*?\};/g, '')
    .replace(/^export /gm, '')
    .replace(/ as const/g, '')
    .replace(/: Service\[\]/g, '')
    .replace(/: Variator\[\]/g, '')
    .replace(/: CaseStudy\[\]/g, '')
    .replace(/: Review\[\]/g, '')
    .replace(/: FaqItem\[\]/g, '')
    .replace(/function getServiceBySlug\(slug: string\): Service \| undefined/g, 'function getServiceBySlug(slug)')
    .replace(/function getVariatorBySlug\(slug: string\): Variator \| undefined/g, 'function getVariatorBySlug(slug)');
}

const parts = ['site', 'services', 'variators', 'content', 'faq', 'cases', 'reviews'].map((n) =>
  clean(fs.readFileSync(`src/data/${n}.ts`, 'utf8')),
);

let out = 'window.BUSINESS = (function(){\n' + parts.join('\n') + '\n';
out += `function href(path) {
  if (!path || path === '/') return 'index.html';
  let p = String(path).replace(/^\\//, '');
  if (p.endsWith('/')) p = p.slice(0, -1);
  if (!p.includes('.')) p += '.html';
  return p;
}
navLinks.forEach((l) => { l.html = href(l.href); });
priceItems.forEach((p) => { p.html = href(p.href); });
return {
  siteConfig, navLinks, services, getServiceBySlug, variators, getVariatorBySlug,
  symptoms, processSteps, priceItems, advantages, faqItems, cases, publishedCases,
  reviews, publishedReviews, reviewSources, href
};
})();
`;

fs.writeFileSync('js/data.js', out);
try {
  // eslint-disable-next-line no-new-func
  new Function(out);
  console.log('syntax ok', out.length);
} catch (e) {
  console.error('syntax fail', e.message);
  process.exit(1);
}
