export interface SEOFormData {
  // Basic SEO
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  canonicalUrl: string;
  keywords: string[];
  secondaryKeywords: string[];

  // Robots
  index: boolean;
  follow: boolean;
  noArchive: boolean;
  noSnippet: boolean;
  noImageIndex: boolean;

  // Open Graph
  ogTitle: string;
  ogType: string;
  ogDescription: string;
  ogSiteName: string;
  ogLocale: string;
  ogImageUrl: string;
  ogImageAlt: string;
  ogImageWidth: number;
  ogImageHeight: number;
  ogUrl: string;

  // Twitter
  twitterCardType: string;
  twitterCreator: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImageUrl: string;

  // Schema & Advanced
  schemaType: string;
  breadcrumbTitle: string;
  customStructuredData: string;
  faqSchema: { question: string; answer: string }[];
  hreflang: { language: string; url: string }[];

  // Sitemap
  includeInSitemap: boolean;
  changeFrequency: string;
  priority: number;
  lastModified: string;
  seoScore?: number;
}