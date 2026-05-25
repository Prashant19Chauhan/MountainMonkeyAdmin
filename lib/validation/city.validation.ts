import { z } from "zod";

export const citySchema = z.object({
  _id: z.string().optional(),
  
  name: z
    .string()
    .min(1, "Location name is required")
    .min(2, "Location name must be at least 2 characters"),
    
  country: z
    .string()
    .min(1, "Country is required")
    .min(2, "Country must be at least 2 characters"),
    
  state: z
    .string()
    .min(1, "State is required")
    .min(2, "State must be at least 2 characters"),
    
  city: z
    .string()
    .min(1, "City is required")
    .min(2, "City must be at least 2 characters"),
    
  address: z
    .string()
    .min(1, "Address is required")
    .min(5, "Address must be at least 5 characters"),
    
  locationCoordinates: z.object({
    type: z.string().default("Point"),
    coordinates: z
      .array(
        z.number({ message: "Coordinate must be a numeric value" })
      )
      .length(2, "Coordinates must consist of exactly two values [longitude, latitude]"),
  }),
  
  altitude: z
    .number({ message: "Altitude must be a numeric value" })
    .min(0, "Altitude cannot be a negative value"),
    
  timezone: z
    .string()
    .min(1, "Timezone is required"),
    
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must contain at least 10 characters"),
    
  status: z.string().optional(),
});

export type CityInput = z.infer<typeof citySchema>;