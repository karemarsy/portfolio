/** Public origin used for canonical URLs and social cards. Set NEXT_PUBLIC_SITE_URL in production. */
export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");
