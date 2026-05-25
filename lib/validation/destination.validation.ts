import { z } from "zod";

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

  placeType: z
    .string()
    .min(1, "Place typology is required"),

  categories: z
    .array(z.string())
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
      .array(z.string())
      .min(1, "Establish at least one semantic tag for travelers matching"),

    mood: z
      .array(z.string())
      .min(1, "Establish at least one regional mood type"),

    suitableFor: z
      .array(z.string())
      .min(1, "Establish at least one traveler profile match recommendation"),

    travelStyle: z
      .array(z.string())
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