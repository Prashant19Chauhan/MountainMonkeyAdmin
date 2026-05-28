import { z } from "zod";

export const STAY_AMENITIES_OPTIONS = [
  { value: "wifi", label: "Free WiFi" },
  { value: "pool", label: "Swimming Pool" },
  { value: "parking", label: "Free Parking" },
  { value: "gym", label: "Fitness Center / Gym" },
  { value: "spa", label: "Wellness Spa" },
  { value: "restaurant", label: "In-house Restaurant" },
  { value: "bar", label: "Bar / Lounge" },
  { value: "room_service", label: "Room Service" },
  { value: "ac", label: "Air Conditioning" },
  { value: "tv", label: "Smart TV" },
  { value: "heater", label: "Room Heater" },
  { value: "laundry", label: "Laundry Service" },
  { value: "pet_friendly", label: "Pet Friendly" },
  { value: "wheelchair_accessible", label: "Wheelchair Accessible" },
  { value: "bonfire", label: "Bonfire Evening" },
  { value: "trekking_guide", label: "Trekking Guide" },
  { value: "kids_play_area", label: "Kids Play Area" },
  { value: "campfire", label: "Campfire Facility" },
  { value: "breakfast_included", label: "Complimentary Breakfast" },
  { value: "kitchenette", label: "In-room Kitchenette" },
  { value: "balcony", label: "Private Balcony" },
  { value: "lake_view", label: "Lake View" },
  { value: "mountain_view", label: "Mountain View" },
  { value: "garden", label: "Private Garden" },
  { value: "game_room", label: "Indoor Game Room" },
  { value: "conference_hall", label: "Conference Hall" },
  { value: "doctor_on_call", label: "Doctor on Call" }
] as const;

export const STAY_TAGS_OPTIONS = [
  { value: "luxury", label: "Premium / Luxury" },
  { value: "mountain_view", label: "Mountain View" },
  { value: "family_friendly", label: "Family Friendly" },
  { value: "riverfront", label: "Riverfront" },
  { value: "eco_lodge", label: "Eco-Lodge / Green" },
  { value: "heritage", label: "Heritage / Historic" },
  { value: "cozy", label: "Cozy & Warm" },
  { value: "budget", label: "Budget Friendly" },
  { value: "romantic", label: "Romantic Escape" },
  { value: "offbeat", label: "Offbeat / Secluded" },
  { value: "forest_view", label: "Forest View" },
  { value: "lakeview", label: "Lakeview" },
  { value: "backpacker_hub", label: "Backpacker Hub" },
  { value: "boutique", label: "Boutique Vibe" },
  { value: "secluded", label: "Secluded & Quiet" },
  { value: "pet_friendly", label: "Pet Friendly Stays" }
] as const;

export const STAY_SUITABLE_FOR_OPTIONS = [
  { value: "couples", label: "Couples" },
  { value: "families", label: "Families" },
  { value: "business_travelers", label: "Business Travelers" },
  { value: "solo_travelers", label: "Solo Travelers" },
  { value: "groups", label: "Groups" },
  { value: "backpackers", label: "Backpackers" },
  { value: "wellness_seekers", label: "Wellness Seekers" },
  { value: "honeymooners", label: "Honeymooners" },
  { value: "digital_nomads", label: "Digital Nomads" },
  { value: "pet_owners", label: "Pet Owners" }
] as const;

export const STAY_TYPE_OPTIONS = [
  { value: "boutique", label: "Boutique Hotel" },
  { value: "heritage", label: "Heritage Stay" },
  { value: "resort", label: "Premium Resort" },
  { value: "glamping", label: "Glamping / Luxury Camp" },
  { value: "homestay", label: "Homestay / Local Host" },
  { value: "hostel", label: "Hostel / Social Hub" },
  { value: "cottage", label: "Cottage" },
  { value: "villa", label: "Luxury Villa" },
  { value: "hotel", label: "Standard Hotel" },
  { value: "camp", label: "Adventure Camping" },
  { value: "cabin", label: "Wood Cabin" },
  { value: "treehouse", label: "Treehouse" },
  { value: "guest_house", label: "Guesthouse" }
] as const;

/* ==========================================
   COMMON VALIDATORS
========================================== */

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId")
  .optional()
  .or(z.literal(""));

/* ==========================================
   ROOM SCHEMA
========================================== */

const roomSchema = z.object({
  typeOfRoom: z
    .string()
    .min(2, "Room type is required"),

  pricePerNight: z.object({
    min: z
      .number("Minimum room price is required")
      .min(0, "Minimum room price cannot be negative"),

    max: z
      .number("Maximum room price is required")
      .min(0, "Maximum room price cannot be negative")
  })
    .refine((data) => data.max >= data.min, {
      message: "Maximum room price must be greater than minimum",
      path: ["max"]
    }),

  capacity: z
    .number("Room capacity is required")
    .min(1, "Capacity must be at least 1"),

  amenities: z.array(z.string()),

  availability: z.object({
    totalRooms: z
      .number()
      .min(0, "Total rooms cannot be negative"),

    availableRooms: z
      .number()
      .min(0, "Available rooms cannot be negative")
  })
    .refine((data) => data.availableRooms <= data.totalRooms, {
      message: "Available rooms cannot exceed total rooms",
      path: ["availableRooms"]
    }),

  roomImages: z.array(z.string()).optional()
});

/* ==========================================
   POLICY SCHEMA
========================================== */

const policySchema = z.object({
  policyName: z
    .string()
    .min(3, "Policy name must be at least 3 characters"),

  policyDescription: z
    .string()
    .min(10, "Policy description must be at least 10 characters")
});

/* ==========================================
   MAIN VALIDATION SCHEMA
========================================== */

export const staySchemaValidation = z.object({

  // ==========================================
  // BASIC INFO
  // ==========================================

  name: z
    .string()
    .min(3, "Stay name must be at least 3 characters")
    .trim(),

  shortDescription: z
    .string()
    .min(10, "Short description must be at least 10 characters")
    .trim(),

  longDescription: z
    .string()
    .min(20, "Long description must be at least 20 characters")
    .trim(),

  type: z.enum([
    "hotel",
    "hostel",
    "homestay",
    "resort",
    "villa"
  ]),

  starRating: z
    .number()
    .min(1, "Minimum star rating is 1")
    .max(5, "Maximum star rating is 5"),

  // ==========================================
  // RELATIONS
  // ==========================================

  destinationId: objectId,

  mainCity: objectId,

  // ==========================================
  // LOCATION
  // ==========================================

  location: z.object({
    address: z
      .string()
      .min(5, "Address must be at least 5 characters"),

    coordinates: z.object({
      lat: z
        .number()
        .min(-90, "Latitude must be greater than -90")
        .max(90, "Latitude must be less than 90"),

      lng: z
        .number()
        .min(-180, "Longitude must be greater than -180")
        .max(180, "Longitude must be less than 180")
    }),

    altitude: z
      .number()
      .min(0, "Altitude cannot be negative")
  }),

  // ==========================================
  // PRICE RANGE
  // ==========================================

  priceRange: z.object({
    min: z
      .number()
      .min(0, "Minimum price cannot be negative"),

    max: z
      .number()
      .min(0, "Maximum price cannot be negative")
  })
    .refine((data) => data.max >= data.min, {
      message: "Maximum price must be greater than minimum price",
      path: ["max"]
    }),

  // ==========================================
  // ROOMS
  // ==========================================

  rooms: z
    .array(roomSchema)
    .min(1, "At least one room is required"),

  // ==========================================
  // AMENITIES
  // ==========================================

  amenities: z.array(z.enum(STAY_AMENITIES_OPTIONS.map(o => o.value) as [string, ...string[]])).optional(),

  // ==========================================
  // POLICIES
  // ==========================================

  policies: z.array(policySchema).optional(),

  // ==========================================
  // CONNECTIVITY
  // ==========================================

  connectivity: z.object({
    nearestAirport: z
      .string()
      .min(2, "Nearest airport is required"),

    nearestRailway: z
      .string()
      .min(2, "Nearest railway station is required"),

    nearestBusStop: z
      .string()
      .min(2, "Nearest bus stop is required"),

    popularPlaces: z.array(
      z.object({
        name: z
          .string()
          .min(2, "Place name is required"),

        distance: z
          .number()
          .min(0, "Distance cannot be negative")
      })
    ).optional()
  }),

  // ==========================================
  // SAFETY RATINGS
  // ==========================================

  safetyMeasuresRatings: z.object({
    emergencyContact: z.number().min(0).max(5),
    firstAid: z.number().min(0).max(5),
    security: z.number().min(0).max(5),
    fireSafety: z.number().min(0).max(5),
    hygiene: z.number().min(0).max(5),
    staffTraining: z.number().min(0).max(5),
    sanitizationProtocols: z.number().min(0).max(5)
  }),

  // ==========================================
  // CANCELLATION POLICY
  // ==========================================

  cancellationPolicy: z
    .array(policySchema)
    .optional(),

  // ==========================================
  // AI META DATA
  // ==========================================

  aiMetaData: z.object({
    tags: z.array(z.enum(STAY_TAGS_OPTIONS.map(o => o.value) as [string, ...string[]])).optional(),

    suitableFor: z
      .array(z.enum(STAY_SUITABLE_FOR_OPTIONS.map(o => o.value) as [string, ...string[]]))
      .optional(),

    stayType: z
      .array(z.enum(STAY_TYPE_OPTIONS.map(o => o.value) as [string, ...string[]]))
      .optional()
  }).optional(),

  // ==========================================
  // AI SCORES
  // ==========================================

  aiScore: z.object({
    valueForMoney: z
      .number()
      .min(0)
      .max(100)
      .optional(),

    locationScore: z
      .number()
      .min(0)
      .max(100)
      .optional(),

    cleanliness: z
      .number()
      .min(0)
      .max(100)
      .optional(),

    overall: z
      .number()
      .min(0)
      .max(100)
      .optional()
  }).optional(),

  // ==========================================
  // POPULARITY
  // ==========================================

  popularityScore: z
    .number()
    .min(0)
    .max(100)
    .optional(),

  // ==========================================
  // IMAGES
  // ==========================================

  images: z.array(z.string()).optional()
});

/* ==========================================
   TYPES
========================================== */

export type StayInputType = z.infer<typeof staySchemaValidation>;