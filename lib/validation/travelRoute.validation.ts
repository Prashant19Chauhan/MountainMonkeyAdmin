import { z } from "zod";

/* =========================
   ObjectId Validator (v4)
 ========================= */

const objectId = z
  .string()
  .min(1, "Reference ID cannot be empty")
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid database reference ID format");

/* =========================
   Travel Details
 ========================= */

const travelDetailsSchema = z
  .object({
    mode: z
      .string()
      .min(1, "Transit mode is required")
      .min(2, "Transit mode must contain at least 2 characters"),

    minCost: z
      .number({ message: "Minimum transit cost must be a numeric value" })
      .min(0, "Minimum transit cost cannot be a negative value"),

    maxCost: z
      .number({ message: "Maximum transit cost must be a numeric value" })
      .min(0, "Maximum transit cost cannot be a negative value"),

    duration: z
      .number({ message: "Duration must be a numeric value in minutes" })
      .min(0, "Duration cannot be a negative value"),

    provider: z
      .string()
      .min(1, "Transit operator/provider is required")
      .min(2, "Transit operator must contain at least 2 characters"),

    distance: z
      .number({ message: "Distance must be a numeric value in kilometers" })
      .min(0, "Distance cannot be a negative value"),

    difficultyInTravelling: z
      .string()
      .min(1, "Transit difficulty description is required")
      .min(2, "Transit difficulty description must contain at least 2 characters"),
  })
  .refine((data) => data.maxCost >= data.minCost, {
    message: "Maximum transit cost must be greater than or equal to minimum transit cost",
    path: ["maxCost"],
  });

/* =========================
   Step Schema
 ========================= */

const stepSchema = z
  .object({
    stepId: z
      .string()
      .min(1, "Step ID cannot be empty"),

    from: z.object({
      name: z
        .string()
        .min(1, "Origin step name is required"),

      location: z
        .object({
          address: z.string().optional(),

          coordinates: z
            .object({
              longitude: z
                .number({ message: "Longitude coordinates must be a number" })
                .min(-180, "Longitude must be between -180 and 180")
                .max(180, "Longitude must be between -180 and 180")
                .optional(),
              latitude: z
                .number({ message: "Latitude coordinates must be a number" })
                .min(-90, "Latitude must be between -90 and 90")
                .max(90, "Latitude must be between -90 and 90")
                .optional(),
            })
            .optional(),

          mainCity: objectId.optional(),
        })
        .optional(),
    }),

    to: z.object({
      name: z
        .string()
        .min(1, "Destination step name is required"),

      location: z
        .object({
          address: z.string().optional(),

          coordinates: z
            .object({
              longitude: z
                .number({ message: "Longitude coordinates must be a number" })
                .min(-180, "Longitude must be between -180 and 180")
                .max(180, "Longitude must be between -180 and 180")
                .optional(),
              latitude: z
                .number({ message: "Latitude coordinates must be a number" })
                .min(-90, "Latitude must be between -90 and 90")
                .max(90, "Latitude must be between -90 and 90")
                .optional(),
            })
            .optional(),

          mainCity: objectId.optional(),
        })
        .optional(),
    }),

    travelDetails: travelDetailsSchema,

    previousRoutesTrack: z.array(z.string()).optional(),

    isDestinationReached: z.boolean().optional(),

    totalMinCost: z
      .number({ message: "Cumulative minimum cost must be a numeric value" })
      .min(0, "Cumulative minimum cost cannot be negative"),
      
    totalMaxCost: z
      .number({ message: "Cumulative maximum cost must be a numeric value" })
      .min(0, "Cumulative maximum cost cannot be negative"),
      
    totalDuration: z
      .number({ message: "Cumulative duration must be a numeric value" })
      .min(0, "Cumulative duration cannot be negative"),
      
    totalDistance: z
      .number({ message: "Cumulative distance must be a numeric value" })
      .min(0, "Cumulative distance cannot be negative"),
      
    totalStops: z
      .number({ message: "Cumulative stops must be a numeric value" })
      .min(0, "Cumulative stops count cannot be negative"),
  })
  .refine((data) => data.totalMaxCost >= data.totalMinCost, {
    message: "Cumulative maximum cost must be greater than or equal to cumulative minimum cost",
    path: ["totalMaxCost"],
  });

/* =========================
   Main Schema
 ========================= */

export const travelRouteSchema = z
  .object({
    name: z
      .string()
      .min(1, "Transit route name is required")
      .min(2, "Transit route name must be at least 2 characters"),

    from: z.object({
      id: objectId,
      name: z
        .string()
        .min(1, "Origin city anchor name is required"),
    }),

    to: z.object({
      id: objectId,
      name: z
        .string()
        .min(1, "Destination city anchor name is required"),
    }),

    StepRoutes: z
      .array(stepSchema)
      .min(1, "At least one step route connection leg is required in the timeline index"),
    
    _id: objectId.optional(),
  })
  .strict();

export type TravelRouteInput = z.infer<typeof travelRouteSchema>;