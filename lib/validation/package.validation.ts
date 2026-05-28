import { z } from "zod";

export const PKG_CATEGORY_OPTIONS = [
  { value: "honeymoon", label: "Honeymoon" },
  { value: "adventure", label: "Adventure" },
  { value: "family", label: "Family" },
  { value: "solo", label: "Solo" },
  { value: "luxury", label: "Luxury" },
  { value: "budget", label: "Budget" },
  { value: "spiritual", label: "Spiritual" },
  { value: "wildlife", label: "Wildlife" },
  { value: "wellness", label: "Wellness" },
  { value: "roadtrip", label: "Road Trip" },
  { value: "trekking", label: "Trekking" },
  { value: "beach", label: "Beach" },
  { value: "cultural", label: "Cultural" },
  { value: "weekend_getaway", label: "Weekend Getaway" },
  { value: "nature", label: "Nature" },
  { value: "backpacking", label: "Backpacking" },
  { value: "eco_tourism", label: "Eco Tourism" },
  { value: "festival", label: "Festival" },
  { value: "photography", label: "Photography" },
  { value: "cruise", label: "Cruise" },
  { value: "winter_special", label: "Winter Special" },
  { value: "summer_special", label: "Summer Special" },
  { value: "monsoon_special", label: "Monsoon Special" }
] as const;

export const PKG_TRANSPORT_OPTIONS = [
  { value: "flight", label: "Flight" },
  { value: "cab", label: "Cab / Taxi" },
  { value: "bus", label: "Bus" },
  { value: "train", label: "Train" },
  { value: "ferry", label: "Ferry" },
  { value: "walk", label: "Walking" },
  { value: "jeep", label: "Jeep Safari" },
  { value: "motorbike", label: "Motorbike" },
  { value: "bicycle", label: "Bicycle" },
  { value: "shuttle", label: "Shuttle" },
  { value: "cruiser", label: "Cruiser Boat" }
] as const;

export const PKG_MEALS_OPTIONS = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "all_inclusive", label: "All Inclusive" },
  { value: "self_catering", label: "Self Catering" },
  { value: "half_board", label: "Half Board (MAP)" },
  { value: "full_board", label: "Full Board (AP)" },
  { value: "tea_snacks", label: "High Tea & Snacks" }
] as const;

export const PKG_TAGS_OPTIONS = [
  { value: "snow", label: "Snowy" },
  { value: "nature", label: "Nature" },
  { value: "romantic", label: "Romantic" },
  { value: "peaceful", label: "Peaceful" },
  { value: "trekking", label: "Trekking" },
  { value: "heritage", label: "Heritage" },
  { value: "photography", label: "Photography" },
  { value: "camping", label: "Camping" },
  { value: "boating", label: "Boating" },
  { value: "high_altitude", label: "High Altitude" },
  { value: "offbeat", label: "Offbeat" },
  { value: "luxury", label: "Luxury" },
  { value: "backpacker", label: "Backpacker" },
  { value: "wildlife", label: "Wildlife" },
  { value: "street_food", label: "Street Food" },
  { value: "shopping", label: "Shopping" },
  { value: "adventure", label: "Adventure" },
  { value: "cultural", label: "Cultural" }
] as const;

export const PKG_MOOD_OPTIONS = [
  { value: "relaxing", label: "Relaxing" },
  { value: "adventurous", label: "Adventurous" },
  { value: "spiritual", label: "Spiritual" },
  { value: "thrilling", label: "Thrilling" },
  { value: "romantic", label: "Romantic" },
  { value: "educational", label: "Educational" },
  { value: "rejuvenating", label: "Rejuvenating" },
  { value: "peaceful", label: "Peaceful" },
  { value: "vibrant", label: "Vibrant" },
  { value: "mystical", label: "Mystical" }
] as const;

export const PKG_SUITABLE_FOR_OPTIONS = [
  { value: "couple", label: "Couples" },
  { value: "family", label: "Families" },
  { value: "friends", label: "Groups / Friends" },
  { value: "solo", label: "Solo Travelers" },
  { value: "kids", label: "Kids-friendly" },
  { value: "seniors", label: "Seniors-friendly" },
  { value: "corporate", label: "Corporate Groups" },
  { value: "students", label: "Students" },
  { value: "nature_lovers", label: "Nature Lovers" },
  { value: "backpackers", label: "Backpackers" }
] as const;

export const PKG_BEST_SEASON_OPTIONS = [
  { value: "winter", label: "Winter" },
  { value: "summer", label: "Summer" },
  { value: "monsoon", label: "Monsoon" },
  { value: "spring", label: "Spring" },
  { value: "autumn", label: "Autumn" },
  { value: "all_year", label: "All Year" },
  { value: "shoulder_season", label: "Shoulder Season" }
] as const;

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
    .array(z.enum(PKG_CATEGORY_OPTIONS.map(o => o.value) as [string, ...string[]]))
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
        z.enum(PKG_TRANSPORT_OPTIONS.map(o => o.value) as [string, ...string[]])
      )
      .min(1, "Establish at least one transit transport mode classification"),
  }),

  /* 🍽️ Meals */
  meals: z.object({
    included: z.boolean(),
    plan: z
      .array(
        z.enum(PKG_MEALS_OPTIONS.map(o => o.value) as [string, ...string[]])
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
    tags: z.array(z.enum(PKG_TAGS_OPTIONS.map(o => o.value) as [string, ...string[]])).optional(),
    mood: z.array(z.enum(PKG_MOOD_OPTIONS.map(o => o.value) as [string, ...string[]])).optional(),
    suitableFor: z.array(z.enum(PKG_SUITABLE_FOR_OPTIONS.map(o => o.value) as [string, ...string[]])).optional(),

    difficultyLevel: z.enum(["easy", "moderate", "hard"], {
      message: "Select a difficulty level classification matching traveler stamina profile",
    }),

    bestSeason: z.array(z.enum(PKG_BEST_SEASON_OPTIONS.map(o => o.value) as [string, ...string[]])).optional(),
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
