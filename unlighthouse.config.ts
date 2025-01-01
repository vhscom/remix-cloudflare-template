import { defineConfig } from '@unlighthouse/core';
import type { UserConfig } from '@unlighthouse/core';

/**
 * Performance budget thresholds by environment.
 * Scores range from 0-100, with higher scores being better.
 * @see https://web.dev/performance-scoring/
 */
const budgets = {
  development: {
    performance: 80, // Relaxed for local dev
    accessibility: 95, // Keep high a11y standards
    'best-practices': 90, // Maintain good practices
    seo: 90, // Strong SEO baseline
  },
  production: {
    performance: 90, // High perf in prod
    accessibility: 100, // Perfect a11y required
    'best-practices': 95, // Strict practices
    seo: 95, // Excellent SEO
  },
} as const;

/**
 * Core application routes to test.
 * Add routes that represent unique page types/templates.
 */
const routes = [
  '/',
  '/healthcheck', // Monitor application health
  '/robots.txt', // Search engine crawling rules
  '/sitemap.xml', // Site structure for crawlers
] as string[];

const isDev = process.env.NODE_ENV === 'development';
const isCI = Boolean(process.env.CI);
const budget = isCI
  ? {
      ...budgets.production,
      accessibility: 80, // GitHub Actions reporting unexpected score
      seo: 60, // Added robots.txt file without Sitemap and arrived here
    }
  : isDev
    ? budgets.development
    : budgets.production;

export default defineConfig({
  site: 'http://127.0.0.1:8787',
  urls: routes,
  scanner: {
    device: 'desktop', // Desktop metrics for CI and dev
    throttle: !isCI, // No throttle in CI
    customSampling: {}, // URL pattern matching
    ignoreI18nPages: true, // Skip i18n variants
    maxRoutes: 200, // Route scan limit
    skipJavascript: false, // Run page scripts
    dynamicSampling: 5, // Sample dynamic routes
    sitemap: false, // Ignore sitemap.xml
    robotsTxt: false, // Ignore robots.txt
    crawler: false, // Don't crawl for URLs
    samples: isDev ? 1 : 5, // More prod samples
    exclude: ['/private/*'], // Skip private routes
  },
  lighthouseOptions: {
    throttlingMethod: 'devtools',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  },
  ci: {
    budget,
    buildStatic: false, // Exclude HTML reports
    reporter: 'jsonSimple', // Simple JSON output
  },
  puppeteerClusterOptions: {
    maxConcurrency: isCI ? 1 : undefined, // Single worker in CI
  },
} satisfies UserConfig);
