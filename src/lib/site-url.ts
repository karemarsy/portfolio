/**
 * Public origin used for canonical URLs and social cards.
 * Order: NEXT_PUBLIC_SITE_URL (set this once the custom domain is live),
 * then Vercel's production domain, then the deployment URL, then local dev.
 */
const origin =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000";

export const siteUrl = new URL(origin);
