import { z } from "zod";

export const PLACE_TYPE_OPTIONS = [
  { value: "City", label: "City" },
  { value: "Town", label: "Town" },
  { value: "Village", label: "Village" },
  { value: "National Park", label: "National Park" },
  { value: "Historical Site", label: "Historical Site" },
  { value: "Beach", label: "Beach" },
  { value: "Mountain Peak", label: "Mountain Peak" },
  { value: "Valley", label: "Valley" }
] as const;

export const DEST_CATEGORY_OPTIONS = [
  { value: "Adventure", label: "Adventure" },
  { value: "Pilgrimage", label: "Pilgrimage" },
  { value: "Nature", label: "Nature" },
  { value: "Luxury", label: "Luxury" },
  { value: "Trekking", label: "Trekking" },
  { value: "Honeymoon", label: "Honeymoon" },
  { value: "Historical", label: "Historical" },
  { value: "Beach", label: "Beach" },
  { value: "Offbeat", label: "Offbeat" },
  { value: "Wildlife", label: "Wildlife" },
  { value: "Cultural", label: "Cultural" },
  { value: "Spiritual", label: "Spiritual" },
  { value: "Wellness", label: "Wellness" },
  { value: "Foodie", label: "Foodie" },
  { value: "Road_Trip", label: "Road Trip" },
  { value: "Weekend_Getaway", label: "Weekend Getaway" },
  { value: "Hill_Station", label: "Hill Station" },
  { value: "Desert", label: "Desert" },
  { value: "Rural", label: "Rural" },
  { value: "Urban", label: "Urban" },
  { value: "Backpacking", label: "Backpacking" },
  { value: "Heritage", label: "Heritage" },
  { value: "Snow_Destination", label: "Snow Destination" },
  { value: "Riverside", label: "Riverside" }
] as const;

export const DEST_TAGS_OPTIONS = [
  { value: "Alpine", label: "Alpine" },
  { value: "Tropical", label: "Tropical" },
  { value: "Urban", label: "Urban" },
  { value: "Desert", label: "Desert" },
  { value: "Ancient", label: "Ancient" },
  { value: "Spiritual", label: "Spiritual" },
  { value: "Forest", label: "Forest" },
  { value: "Snowy", label: "Snowy" },
  { value: "Coastal", label: "Coastal" },
  { value: "Rural", label: "Rural" },
  { value: "Volcanic", label: "Volcanic" },
  { value: "High_Altitude", label: "High Altitude" },
  { value: "Lush_Green", label: "Lush Green" },
  { value: "Valley", label: "Valley" },
  { value: "Riverside", label: "Riverside" },
  { value: "Lake", label: "Lake" },
  { value: "Historical_Hub", label: "Historical Hub" },
  { value: "Wildlife_Sanctuary", label: "Wildlife Sanctuary" }
] as const;

export const DEST_MOOD_OPTIONS = [
  { value: "Relaxing", label: "Relaxing" },
  { value: "Adventure", label: "Adventure" },
  { value: "Soulful", label: "Soulful" },
  { value: "Nature", label: "Nature" },
  { value: "Luxury", label: "Luxury" },
  { value: "Vibrant", label: "Vibrant" },
  { value: "Ethereal", label: "Ethereal" },
  { value: "Mystical", label: "Mystical" },
  { value: "Peaceful", label: "Peaceful" },
  { value: "Romantic", label: "Romantic" },
  { value: "Cosmopolitan", label: "Cosmopolitan" },
  { value: "Tranquil", label: "Tranquil" },
  { value: "Exciting", label: "Exciting" },
  { value: "Charming", label: "Charming" },
  { value: "Rejuvenating", label: "Rejuvenating" }
] as const;

export const DEST_SUITABLE_FOR_OPTIONS = [
  { value: "Solo", label: "Solo" },
  { value: "Couples", label: "Couples" },
  { value: "Families", label: "Families" },
  { value: "Groups", label: "Groups" },
  { value: "Digital Nomads", label: "Digital Nomads" },
  { value: "Backpackers", label: "Backpackers" },
  { value: "Seniors", label: "Seniors" },
  { value: "Adventure Seekers", label: "Adventure Seekers" },
  { value: "Nature Lovers", label: "Nature Lovers" },
  { value: "History Buffs", label: "History Buffs" },
  { value: "Wellness Seekers", label: "Wellness Seekers" }
] as const;

export const DEST_TRAVEL_STYLE_OPTIONS = [
  { value: "Backpacking", label: "Backpacking" },
  { value: "Fast-paced", label: "Fast-paced" },
  { value: "Slow Travel", label: "Slow Travel" },
  { value: "Eco-focus", label: "Eco-focus" },
  { value: "Luxury", label: "Luxury" },
  { value: "Road Trip", label: "Road Trip" },
  { value: "Cultural Immersion", label: "Cultural Immersion" },
  { value: "Adventure", label: "Adventure" },
  { value: "Wellness", label: "Wellness" },
  { value: "Bleisure", label: "Bleisure" },
  { value: "Weekend Escapes", label: "Weekend Escapes" }
] as const;

export const destinationSchema = z.object({
  name: z
    .string()
    .min(1, "Destination name is required")
    .min(3, "Destination name must be at least 3 characters"),

  description: z
    .string()
    .min(1, "Detailed description is required")
    .min(10, "Description must contain at least 10 characters"),

  shortDescription: z
    .string()
    .min(1, "Short catchphrase is required")
    .min(5, "Short description must contain at least 5 characters"),

  location: z.object({
    address: z
      .string()
      .min(1, "Detailed address is required")
      .min(3, "Address must contain at least 3 characters"),

    pinCode: z
      .string()
      .min(1, "Postal code is required")
      .min(4, "Postal code must contain at least 4 digits"),

    coordinates: z.object({
      lat: z
        .number({ message: "Latitude must be a valid number" })
        .min(-90, "Latitude must be between -90 and 90")
        .max(90, "Latitude must be between -90 and 90")
        .optional(),
      lng: z
        .number({ message: "Longitude must be a valid number" })
        .min(-180, "Longitude must be between -180 and 180")
        .max(180, "Longitude must be between -180 and 180")
        .optional()
    }),

    altitude: z
      .number({ message: "Altitude must be a valid number" })
      .min(0, "Altitude cannot be negative")
      .optional()
  }),

  mainCity: z
    .string()
    .min(1, "Main regional city hub selection is required"),

  placeType: z.enum(PLACE_TYPE_OPTIONS.map(o => o.value) as [string, ...string[]]),

  categories: z
    .array(z.enum(DEST_CATEGORY_OPTIONS.map(o => o.value) as [string, ...string[]]))
    .min(1, "Select at least one destination classification category"),

  nearbyDestinations: z.array(
    z.object({
      destinationId: z
        .string()
        .min(1, "Nearby destination selection is required"),
      distance: z
        .number({ message: "Distance must be a numeric value" })
        .min(0, "Distance cannot be a negative value")
        .optional(),
      travelTime: z
        .number({ message: "Travel time must be a numeric value" })
        .min(0, "Travel time cannot be a negative value")
        .optional(),
      routeType: z
        .string()
        .min(1, "Route transit mode selection is required")
    })
  ).optional(),

  budgetEstimate: z.object({
    dailyAvg: z
      .number({ message: "Daily average budget must be a numeric value" })
      .min(0, "Daily average cost cannot be negative")
      .optional(),
    budget: z
      .number({ message: "Standard budget must be a numeric value" })
      .min(0, "Standard budget cost cannot be negative")
      .optional(),
    luxury: z
      .number({ message: "Premium luxury budget must be a numeric value" })
      .min(0, "Premium luxury cost cannot be negative")
      .optional()
  }).optional(),

  images: z
    .array(z.string().url("Each gallery entry must be a valid visual asset URL"))
    .optional(),

  videos: z
    .array(z.string().url("Each media video entry must be a valid URL link"))
    .optional(),

  aiMetadata: z.object({
    tags: z
      .array(z.enum(DEST_TAGS_OPTIONS.map(o => o.value) as [string, ...string[]]))
      .min(1, "Establish at least one semantic tag for travelers matching"),

    mood: z
      .array(z.enum(DEST_MOOD_OPTIONS.map(o => o.value) as [string, ...string[]]))
      .min(1, "Establish at least one regional mood type"),

    suitableFor: z
      .array(z.enum(DEST_SUITABLE_FOR_OPTIONS.map(o => o.value) as [string, ...string[]]))
      .min(1, "Establish at least one traveler profile match recommendation"),

    travelStyle: z
      .array(z.enum(DEST_TRAVEL_STYLE_OPTIONS.map(o => o.value) as [string, ...string[]]))
      .min(1, "Establish at least one stylistic travel category classification"),

    highlights: z.array(
      z.object({
        title: z
          .string()
          .min(1, "Experiential highlight title is required")
          .min(3, "Experiential highlight title must contain at least 3 characters"),
        description: z
          .string()
          .min(1, "Experiential detail narrative is required")
          .min(5, "Experiential details description must contain at least 5 characters")
      })
    )
  }),

  _id: z.string().optional(),

  status: z.string().optional()
});

export type destinationInput = z.infer<typeof destinationSchema>;