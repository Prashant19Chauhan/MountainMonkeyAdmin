import { z } from "zod";

/* =========================================
   COMMON
 ========================================= */

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid database reference ID format");

const optionalObjectId = z
  .string()
  .optional()
  .refine(
    (val) => !val || /^[0-9a-fA-F]{24}$/.test(val),
    "Invalid database reference ID format"
  );

/* =========================================
   ENUMS
 ========================================= */

const foodTypeEnum = z.enum(["veg", "non-veg", "dessert", "street"], {
  message: "Select a food category typology (e.g. Vegetarian, Street food)",
});

const placeTypeEnum = z.enum(
  ["tourist_spot", "hidden_gem", "religious", "nature", "market"],
  {
    message: "Select a local attraction spot typology",
  }
);

const severityEnum = z.enum(["low", "medium", "high"], {
  message: "Select a valid risk severity index (Low, Medium, or High)",
});

/* =========================================
   SUB SCHEMAS
 ========================================= */

const foodSchema = z.object({
  name: z
    .string()
    .min(1, "Local delicacy name is required")
    .min(2, "Delicacy name must contain at least 2 characters"),

  description: z.string().optional(),

  images: z
    .array(z.string().url("Each food entry must be a valid media asset URL"))
    .default([]),

  typeOfFood: foodTypeEnum,

  bestPlaces: z
    .array(
      z.object({
        name: z
          .string()
          .min(1, "Best venue vendor name is required")
          .min(2, "Venue name must contain at least 2 characters"),

        location: z
          .string()
          .min(1, "Delicacy venue address is required")
          .min(2, "Delicacy venue address must contain at least 2 characters"),
      })
    )
    .default([]),
});

const placeSchema = z.object({
  name: z
    .string()
    .min(1, "Attraction name is required")
    .min(2, "Attraction name must contain at least 2 characters"),

  description: z.string().optional(),

  images: z
    .array(z.string().url("Each visual attachment must be a valid image asset URL"))
    .default([]),

  type: placeTypeEnum,

  bestTimeToVisit: z.string().optional(),

  entryFee: z
    .number({ message: "Entry fee pricing must be a numeric value" })
    .min(0, "Entry fee cannot be a negative value")
    .default(0),

  timings: z.string().optional(),
});

const precautionSchema = z.object({
  title: z
    .string()
    .min(1, "Precaution/alert advisory heading is required")
    .min(2, "Alert advisory title must contain at least 2 characters"),

  description: z
    .string()
    .min(1, "Detailed safety instructions are required")
    .min(5, "Safety details instruction must contain at least 5 characters"),

  severity: severityEnum,
});

const phraseSchema = z.object({
  local: z
    .string()
    .min(1, "Native dialect phrase is required"),

  english: z
    .string()
    .min(1, "English translation is required"),
});

const mythSchema = z.object({
  title: z
    .string()
    .min(1, "Folk legend/myth title is required")
    .min(2, "Legend narrative title must contain at least 2 characters"),

  story: z
    .string()
    .min(1, "Folk story narrative is required")
    .min(10, "Legend narrative details must contain at least 10 characters"),
});

/* =========================================
   MAIN SCHEMA
 ========================================= */

export const createLocalInfoFrontendSchema = z.object({
  /* ======================================
     DESTINATION
  ====================================== */

  destinationId: optionalObjectId,

  /* ======================================
     BASIC INFO
  ====================================== */

  language: z
    .array(z.string())
    .min(1, "Establish at least one regional native dialect spoken language"),

  currency: z
    .string()
    .default("INR"),

  bestTimeToVisit: z.string().optional(),

  /* ======================================
     FOOD
  ====================================== */

  famousFood: z.array(foodSchema).default([]),

  /* ======================================
     PLACES
  ====================================== */

  famousPlaces: z.array(placeSchema).default([]),

  /* ======================================
     CULTURE
  ====================================== */

  culture: z
    .object({
      traditions: z.array(z.string()).default([]),

      festivals: z.array(z.string()).default([]),

      localEtiquette: z.array(z.string()).default([]),
    })
    .default({
      traditions: [],
      festivals: [],
      localEtiquette: [],
    }),

  /* ======================================
     MYTHS
  ====================================== */

  mythsAndStories: z.array(mythSchema).default([]),

  /* ======================================
     PRECAUTIONS
  ====================================== */

  precautions: z.array(precautionSchema).default([]),

  /* ======================================
     SAFETY
  ====================================== */

  safety: z
    .object({
      overallSafety: z
        .number({ message: "Safety index metrics must be a valid numeric rating" })
        .min(1, "Safety rating metric must be at least 1")
        .max(10, "Safety rating metric cannot exceed 10")
        .default(5),

      tips: z.array(z.string()).default([]),

      emergencyContacts: z
        .array(
          z.object({
            authority: z
              .string()
              .min(1, "Crisis agency department is required")
              .min(2, "Department name must contain at least 2 characters"),

            number: z
              .string()
              .min(1, "Emergency hotlines connection number is required")
              .min(3, "Emergency hotlines must contain at least 3 digits"),
          })
        )
        .default([]),
    })
    .default({
      overallSafety: 5,
      tips: [],
      emergencyContacts: [],
    }),

  /* ======================================
     CLOTHING
  ====================================== */

  clothing: z
    .object({
      summer: z.array(z.string()).default([]),

      winter: z.array(z.string()).default([]),

      religiousPlaces: z.array(z.string()).default([]),

      generalTips: z.array(z.string()).default([]),
    })
    .default({
      summer: [],
      winter: [],
      religiousPlaces: [],
      generalTips: [],
    }),

  /* ======================================
     DOS & DONTS
  ====================================== */

  dos: z.array(z.string()).default([]),

  donts: z.array(z.string()).default([]),

  /* ======================================
     TIPS
  ====================================== */

  localTips: z.array(z.string()).default([]),

  /* ======================================
     PHRASES
  ====================================== */

  phrases: z.array(phraseSchema).default([]),

  /* ======================================
     AI
  ====================================== */

  aiSummary: z.string().optional(),

  embedding: z.array(z.number()).optional(),

  /* ======================================
     METADATA
  ====================================== */

  popularityScore: z
    .number({ message: "Popularity index score must be a valid numeric value" })
    .min(0, "Popularity score index must be at least 0")
    .max(100, "Popularity score index cannot exceed 100")
    .default(0),
});

export type LocalInfoInputType = z.infer<typeof createLocalInfoFrontendSchema>;