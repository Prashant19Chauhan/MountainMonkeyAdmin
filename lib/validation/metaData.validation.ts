import { z } from "zod";

/* =========================================================
   SEO / Metadata Validation Schema
========================================================= */

export const seoValidationSchema = z.object({
  metaTitle: z
    .string()
    .min(3, "Meta title must be at least 3 characters")
    .max(70, "Meta title should not exceed 70 characters"),

  metaDescription: z
    .string()
    .min(20, "Meta description must be at least 20 characters")
    .max(160, "Meta description should not exceed 160 characters"),

  keywords: z.array(z.string()).optional(),

  focusKeyword: z.string().optional(),

  secondaryKeywords: z.array(z.string()).optional(),

  canonicalUrl: z.string().url("Invalid canonical URL").optional(),

  robots: z
    .object({
      index: z.boolean().default(true),

      follow: z.boolean().default(true),

      noarchive: z.boolean().default(false),

      nosnippet: z.boolean().default(false),

      noimageindex: z.boolean().default(false)
    })
    .optional(),

  openGraph: z
    .object({
      title: z.string().optional(),

      description: z.string().optional(),

      image: z.string().url("Invalid OpenGraph image URL").optional(),

      imageAlt: z.string().optional(),

      type: z.string().default("website"),

      url: z.string().url("Invalid OpenGraph URL").optional(),

      siteName: z.string().optional(),

      locale: z.string().default("en_US")
    })
    .optional(),

  twitter: z
    .object({
      card: z.string().default("summary_large_image"),

      title: z.string().optional(),

      description: z.string().optional(),

      image: z.string().url("Invalid Twitter image URL").optional(),

      creator: z.string().optional()
    })
    .optional(),

  schemaType: z.string().optional(),

  structuredData: z.any().optional(),

  faqSchema: z
    .array(
      z.object({
        question: z
          .string()
          .min(3, "FAQ question is required"),

        answer: z
          .string()
          .min(3, "FAQ answer is required")
      })
    )
    .optional(),

  breadcrumbTitle: z.string().optional(),

  alternateLanguages: z
    .array(
      z.object({
        language: z.string(),

        url: z.string().url("Invalid alternate language URL")
      })
    )
    .optional(),

  ogImageWidth: z.number().optional(),

  ogImageHeight: z.number().optional(),

  priority: z
    .number()
    .min(0)
    .max(1)
    .default(0.8),

  changeFrequency: z
    .enum([
      "always",
      "hourly",
      "daily",
      "weekly",
      "monthly",
      "yearly",
      "never"
    ])
    .default("weekly"),

  lastModified: z
    .union([
      z.date(),
      z.string().datetime()
    ])
    .optional(),

  sitemapInclude: z.boolean().default(true),

  seoScore: z
    .number()
    .min(0)
    .max(100)
    .optional()
});