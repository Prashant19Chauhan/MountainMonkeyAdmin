import { z } from "zod";

/* =====================================================
   Common Validators
 ===================================================== */

// ObjectId Validator
const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, {
    message: "Invalid Mongo database ObjectId format",
  });

/* =====================================================
   Destination Schema
 ===================================================== */

export const destinationSchema = z.object({
  id: objectId,
  coordinates: z.object({
    lat: z
      .number({ message: "Latitude coordinates must be a numeric value" })
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90"),
    lng: z
      .number({ message: "Longitude coordinates must be a numeric value" })
      .min(-180, "Longitude must be between -180 and 180")
      .max(180, "Longitude must be between -180 and 180"),
  }),
});

/* =====================================================
   Pricing Schema
 ===================================================== */

export const pricingSchema = z.object({
  basePrice: z
    .number({ message: "Base price must be a valid numeric value" })
    .min(0, "Base price cannot be a negative value"),

  discountedPrice: z
    .number({ message: "Discounted price must be a valid numeric value" })
    .min(0, "Discounted price cannot be a negative value")
    .optional(),

  currency: z
    .string()
    .min(1, "Currency selection code is required (e.g. INR)"),

  perPerson: z.boolean(),
  
  taxesIncluded: z.boolean(),
}).refine(
  (data) => !data.discountedPrice || data.discountedPrice <= data.basePrice,
  {
    message: "Discounted commercial package pricing must be less than or equal to standard base price",
    path: ["discountedPrice"],
  }
);

/* =====================================================
   Vendor Schema
 ===================================================== */

export const vendorSchema = z.object({
  vendorId: objectId,
  name: z
    .string()
    .min(1, "Vendor name is required")
    .min(2, "Vendor name must contain at least 2 characters"),
    
  contactEmail: z
    .string()
    .min(1, "Vendor contact email is required")
    .email("Invalid vendor support/contact email address format"),
    
  contactPhone: z
    .string()
    .min(1, "Vendor contact hotline is required")
    .min(5, "Contact phone hotlines must contain at least 5 digits"),
});

/* =====================================================
   Main Package Schema
 ===================================================== */

export const createPackageSchema = z.object({
  /* 🆔 Basic Info */
  title: z
    .string()
    .min(1, "Package title is required")
    .min(3, "Title must contain at least 3 characters"),
    
  slug: z.string().optional(),
  
  description: z
    .string()
    .min(1, "Detailed tour package description is required")
    .min(10, "Detailed description must contain at least 10 characters"),
    
  shortDescription: z
    .string()
    .min(1, "Short catchphrase is required")
    .min(5, "Short catchphrase must contain at least 5 characters"),

  /* 🌍 Destination */
  destination: destinationSchema,

  /* ⏳ Duration */
  duration: z.object({
    days: z
      .number({ message: "Days must be a numeric value" })
      .int("Days duration must be a whole number index value")
      .positive("Days duration must be at least 1"),
      
    nights: z
      .number({ message: "Nights must be a numeric value" })
      .int("Nights duration must be a whole number index value")
      .nonnegative("Nights duration cannot be a negative value"),
  }).refine((data) => data.nights === data.days - 1, {
    message: "Standard travel itinerary timeline requires Nights duration to equal Days - 1",
    path: ["nights"],
  }),

  /* 💰 Pricing */
  pricing: pricingSchema,

  /* 🏷️ Categories */
  categories: z
    .array(
      z.enum([
        "honeymoon",
        "adventure",
        "family",
        "solo",
        "luxury",
        "budget",
        "spiritual",
        "wildlife",
      ])
    )
    .min(1, "Select at least one package classification category"),

  /* 🎯 Activities */
  activities: z.array(
    z.object({
      id: objectId,
      priceRangeForPackage: z.object({
        min: z
          .number({ message: "Minimum price must be a numeric value" })
          .min(0, "Minimum activity cost reference cannot be negative"),
        max: z
          .number({ message: "Maximum price must be a numeric value" })
          .min(0, "Maximum activity cost reference cannot be negative"),
      }).refine((data) => data.min <= data.max, {
        message: "Maximum activity budget bracket must be greater than or equal to minimum activity budget bracket",
        path: ["max"],
      }),
    })
  ).optional(),

  /* 🏨 Accommodations */
  accommodations: z.array(
    z.object({
      stayId: objectId,
      priceRangeForPackage: z.object({
        min: z
          .number({ message: "Minimum price must be a numeric value" })
          .min(0, "Minimum stay cost reference cannot be negative"),
        max: z
          .number({ message: "Maximum price must be a numeric value" })
          .min(0, "Maximum stay cost reference cannot be negative"),
      }).refine((data) => data.min <= data.max, {
        message: "Maximum accommodation budget bracket must be greater than or equal to minimum accommodation budget bracket",
        path: ["max"],
      }),
    })
  ).optional(),

  /* 🚗 Transport */
  transport: z.object({
    included: z.boolean(),
    modes: z
      .array(
        z.string().min(1, "Logistical transport mode description cannot be empty")
      )
      .min(1, "Establish at least one transit transport mode classification"),
  }),

  /* 🍽️ Meals */
  meals: z.object({
    included: z.boolean(),
    plan: z
      .array(
        z.string().min(1, "Food plan meal description cannot be empty")
      )
      .optional(),
  }),

  /* 📅 Availability */
  availability: z.object({
    startDate: z.preprocess(
      (val) => (typeof val === "string" ? new Date(val) : val),
      z.date().optional()
    ),
    endDate: z.preprocess(
      (val) => (typeof val === "string" ? new Date(val) : val),
      z.date().optional()
    ),
    maxSeats: z
      .number({ message: "Max seat bookings capacity must be a numeric value" })
      .int("Seats capacity must be a whole number")
      .positive("Seats capacity must be at least 1")
      .optional(),
    availableSeats: z
      .number({ message: "Available bookings capacity must be a numeric value" })
      .int("Available capacity must be a whole number")
      .nonnegative("Available bookings capacity cannot be negative")
      .optional(),
  }).optional(),

  /* 🗺️ Itinerary */
  itinerary: z.array(
    z.object({
      day: z
        .number({ message: "Day index must be a numeric value" })
        .int("Itinerary day index must be a whole number")
        .positive("Itinerary day index must be at least 1"),
        
      title: z
        .string()
        .min(1, "Day outline title is required")
        .min(3, "Day outline title must contain at least 3 characters"),
        
      description: z
        .string()
        .min(1, "Day experiential details description is required")
        .min(5, "Day experiential description details must contain at least 5 characters"),
    })
  ).min(1, "Establish at least one complete day itinerary timeline entry"),

  /* 📸 Media */
  images: z
    .array(z.string().url("Each gallery entry must be a valid visual asset URL"))
    .optional(),
    
  videos: z
    .array(z.string().url("Each media video entry must be a valid URL link"))
    .optional(),

  /* 📋 Inclusions / Exclusions */
  inclusions: z
    .array(
      z.string().min(1, "Premium inclusions feature description cannot be empty")
    )
    .min(1, "Establish at least one travel package inclusion feature standard"),
    
  exclusions: z
    .array(
      z.string().min(1, "Package exclusions description cannot be empty")
    )
    .optional(),

  /* 🤖 AI Metadata */
  aiMetadata: z.object({
    tags: z.array(z.string()).optional(),
    mood: z.array(z.string()).optional(),
    suitableFor: z.array(z.string()).optional(),
    
    difficultyLevel: z.enum(["easy", "moderate", "hard"], {
      message: "Select a difficulty level classification matching traveler stamina profile",
    }),
    
    bestSeason: z.array(z.string()).optional(),
    highlights: z.array(z.string()).optional(),
    languagesSupported: z.array(z.string()).optional(),
    
    popularityScore: z
      .number({ message: "Popularity index score must be a valid numeric rating" })
      .min(0, "Popularity score index must be at least 0")
      .max(100, "Popularity score index cannot exceed 100")
      .default(0),
  }),

  /* 👤 Vendor */
  vendor: vendorSchema,

  /* ⚙️ System Fields */
  status: z.enum(["draft", "active", "inactive"]).default("draft"),
  isFeatured: z.boolean().default(false)
});

export type CreatePackageFormValues = z.infer<typeof createPackageSchema>;
