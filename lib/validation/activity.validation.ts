import { z } from "zod";

/* =========================================
   COMMON
========================================= */

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");

const optionalObjectId = z
  .string()
  .optional()
  .refine(
    (val) => !val || /^[0-9a-fA-F]{24}$/.test(val),
    "Invalid ObjectId format"
  );

/* =========================================
   ENUMS
========================================= */

export const CATEGORY_OPTIONS = [
  { value: "trekking", label: "Trekking" },
  { value: "paragliding", label: "Paragliding" },
  { value: "museum", label: "Museum" },
  { value: "temple", label: "Temple" },
  { value: "street_food", label: "Street Food" },
  { value: "market", label: "Market" },
  { value: "hiking", label: "Hiking" },
  { value: "camping", label: "Camping" },
  { value: "wildlife_safari", label: "Wildlife Safari" },
  { value: "river_rafting", label: "River Rafting" },
  { value: "scuba_diving", label: "Scuba Diving" },
  { value: "historical_site", label: "Historical Site" },
  { value: "monument", label: "Monument" },
  { value: "heritage_walk", label: "Heritage Walk" },
  { value: "shopping", label: "Shopping" },
  { value: "spa_wellness", label: "Spa & Wellness" },
  { value: "winery_tour", label: "Winery Tour" },
  { value: "cooking_class", label: "Cooking Class" },
  { value: "photography", label: "Photography" },
  { value: "stargazing", label: "Stargazing" },
  { value: "waterfall_trek", label: "Waterfall Trek" },
  { value: "beach_outing", label: "Beach Outing" },
  { value: "cultural_show", label: "Cultural Show" },
  { value: "bungee_jumping", label: "Bungee Jumping" },
  { value: "ziplining", label: "Ziplining" },
  { value: "rock_climbing", label: "Rock Climbing" },
  { value: "caving", label: "Caving" },
  { value: "sightseeing", label: "Sightseeing" },
  { value: "food_tour", label: "Food Tour" },
  { value: "nature_walk", label: "Nature Walk" },
  { value: "boating", label: "Boating" },
  { value: "snow_sports", label: "Snow Sports" },
  { value: "adventure_park", label: "Adventure Park" },
  { value: "theme_park", label: "Theme Park" },
  { value: "cable_car", label: "Cable Car" },
  { value: "snorkeling", label: "Snorkeling" },
  { value: "kayaking", label: "Kayaking" },
  { value: "surfing", label: "Surfing" },
  { value: "canyoning", label: "Canyoning" },
  { value: "cycling_tour", label: "Cycling Tour" },
  { value: "yoga_retreat", label: "Yoga Retreat" },
  { value: "meditation", label: "Meditation" },
  { value: "art_workshop", label: "Art Workshop" },
  { value: "historical_palace", label: "Historical Palace" },
  { value: "monastery", label: "Monastery" },
  { value: "botanical_garden", label: "Botanical Garden" }
] as const;

export const TAGS_OPTIONS = [
  { value: "budget", label: "Budget Friendly" },
  { value: "luxury", label: "Premium / Luxury" },
  { value: "family", label: "Family Friendly" },
  { value: "couple", label: "Romantic / Couple" },
  { value: "solo", label: "Solo Traveler" },
  { value: "adventure", label: "Adventure / Thrill" },
  { value: "relaxing", label: "Relaxing / Leisure" },
  { value: "eco_friendly", label: "Eco-Friendly" },
  { value: "cultural", label: "Cultural" },
  { value: "spiritual", label: "Spiritual" },
  { value: "nature", label: "Nature & Scenic" },
  { value: "wildlife", label: "Wildlife" },
  { value: "foodie", label: "Foodie" },
  { value: "instaworthy", label: "Instagrammable" },
  { value: "offbeat", label: "Offbeat & Hidden" },
  { value: "nightlife", label: "Nightlife" },
  { value: "educational", label: "Educational" },
  { value: "pet_friendly", label: "Pet Friendly" },
  { value: "accessible", label: "Accessible" },
  { value: "seasonal", label: "Seasonal" },
  { value: "thrilling", label: "Thrilling" },
  { value: "scenic", label: "Scenic" },
  { value: "romantic", label: "Romantic" },
  { value: "historic", label: "Historic" },
  { value: "local_experience", label: "Local Experience" },
  { value: "indoor", label: "Indoor" },
  { value: "outdoor", label: "Outdoor" },
  { value: "guided", label: "Guided" }
] as const;

export const RECOMMENDED_FOR_OPTIONS = [
  { value: "solo", label: "Solo" },
  { value: "couple", label: "Couple" },
  { value: "family", label: "Family" },
  { value: "friends", label: "Friends" },
  { value: "adventure_seekers", label: "Adventure Seekers" },
  { value: "nature_lovers", label: "Nature Lovers" },
  { value: "history_buffs", label: "History Buffs" },
  { value: "foodies", label: "Foodies" },
  { value: "senior_citizens", label: "Senior Citizens" },
  { value: "backpackers", label: "Backpackers" },
  { value: "wellness_seekers", label: "Wellness Seekers" },
  { value: "corporate_groups", label: "Corporate Groups" },
  { value: "photographers", label: "Photographers" },
  { value: "families_with_kids", label: "Families with Kids" },
  { value: "student_groups", label: "Student Groups" },
  { value: "pet_owners", label: "Pet Owners" },
  { value: "thrill_seekers", label: "Thrill Seekers" }
] as const;

export const TIME_SLOT_OPTIONS = [
  { value: "early_morning", label: "Early Morning" },
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
  { value: "night", label: "Night" },
  { value: "overnight", label: "Overnight" }
] as const;

const categoryEnum = z.enum(CATEGORY_OPTIONS.map(o => o.value) as [string, ...string[]]);
const difficultyEnum = z.enum(["easy", "moderate", "hard"]);
const riskLevelEnum = z.enum(["low", "medium", "high"]);
const tagsEnum = z.enum(TAGS_OPTIONS.map(o => o.value) as [string, ...string[]]);
const recommendedForEnum = z.enum(RECOMMENDED_FOR_OPTIONS.map(o => o.value) as [string, ...string[]]);
const timeSlotEnum = z.enum(TIME_SLOT_OPTIONS.map(o => o.value) as [string, ...string[]]);

/* =========================================
   NESTED SCHEMAS
========================================= */

const pricingSchema = z.object({
  price: z
    .number()
    .min(0, "Price cannot be negative")
    .default(0),

  currency: z
    .string()
    .default("INR"),

  isFree: z
    .boolean()
    .default(false)
})
  .refine((data) => {
    if (data.isFree) {
      return data.price === 0;
    }

    return true;
  }, {
    message: "Free activities must have price 0",
    path: ["price"]
  });

const timingSchema = z.object({
  openingTime: z.string().optional(),

  closingTime: z.string().optional(),

  duration: z
    .number()
    .min(0, "Duration cannot be negative")
    .optional()
});

const providerSchema = z.object({
  name: z.string().min(2).optional(),

  contact: z.string().optional(),

  website: z
    .union([
      z.literal(""),
      z.string().url("Invalid website URL")
    ])
    .optional()
});

const reviewSchema = z.object({
  userId: objectId,

  rating: z
    .number()
    .min(1)
    .max(5),

  comment: z.string().optional()
});

/* =========================================
   MAIN SCHEMA
========================================= */

export const activityValidationSchema = z.object({

  /* ======================================
     BASIC INFO
  ====================================== */

  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .trim(),

  destinationId: optionalObjectId,

  type: z.string().optional(),

  category: z
    .array(categoryEnum)
    .default([]),

  shortDescription: z
    .string()
    .min(10, "Short description too short"),

  longDescription: z
    .string()
    .min(20, "Long description too short"),

  /* ======================================
     LOCATION
  ====================================== */

  location: z.object({

    address: z
      .string()
      .min(3, "Address is required"),

    coordinates: z.object({

      lat: z
        .number()
        .min(-90)
        .max(90),

      lng: z
        .number()
        .min(-180)
        .max(180)

    }),

    mainCity: optionalObjectId
  }),

  /* ======================================
     TIMING
  ====================================== */

  timing: timingSchema,

  bestTimeToVisit: z.string().optional(),

  /* ======================================
     PRICING
  ====================================== */

  pricing: pricingSchema,

  /* ======================================
     ACTIVITY DETAILS
  ====================================== */

  difficultyLevel: difficultyEnum.default("moderate"),

  ageLimit: z.object({

    min: z
      .number()
      .min(0)
      .default(0),

    max: z
      .number()
      .max(120)
      .default(100)

  }).refine((data) => data.max >= data.min, {
    message: "Max age must be greater than min age",
    path: ["max"]
  }),

  requiredItems: z
    .array(z.string())
    .default([]),

  /* ======================================
     SAFETY
  ====================================== */

  safetyInfo: z.object({

    precautions: z
      .array(z.string())
      .default([]),

    riskLevel: riskLevelEnum.default("low")

  }),

  /* ======================================
     PROVIDERS
  ====================================== */

  providers: z
    .array(providerSchema)
    .default([]),

  /* ======================================
     RATINGS
  ====================================== */

  ratings: z.object({

    average: z
      .number()
      .min(0)
      .max(5)
      .default(0),

    count: z
      .number()
      .min(0)
      .default(0)

  }).optional(),

  reviews: z
    .array(reviewSchema)
    .optional(),

  /* ======================================
     MEDIA
  ====================================== */

  images: z
    .array(z.string().url())
    .optional(),

  /* ======================================
     TAGS
  ====================================== */

  tags: z
    .array(tagsEnum)
    .default([]),

  recommendedFor: z
    .array(recommendedForEnum)
    .default([]),

  timeSlotPreference: z
    .array(timeSlotEnum)
    .default([]),

  /* ======================================
     AI
  ====================================== */

  aiScore: z.object({

    popularity: z.number().min(0).max(100).default(0),

    experienceQuality: z.number().min(0).max(100).default(0),

    valueForMoney: z.number().min(0).max(100).default(0),

    uniqueness: z.number().min(0).max(100).default(0)

  }).optional(),

  aiSummary: z.string().optional(),

  embedding: z
    .array(z.number())
    .optional(),

  popularityScore: z
    .number()
    .min(0)
    .max(100)
    .default(0),

  /* ======================================
     STATUS
  ====================================== */

  isActive: z
    .boolean()
    .default(true)

});

export type ActivityInput = z.infer<
  typeof activityValidationSchema
>;