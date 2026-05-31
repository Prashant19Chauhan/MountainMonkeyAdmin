import { z } from "zod";

export const hubSchema = z.object({
  _id: z.string().optional(),
  cityId: z.string().min(1, "City cluster reference is required"),
  name: z.string().min(2, "Hub name must be at least 2 characters"),
  type: z.enum(["BUS_STAND", "RAILWAY_STATION", "AIRPORT", "METRO_STATION", "TAXI_STAND", "PICKUP_POINT", "CUSTOM_HUB"]),
  address: z.string().min(3, "Address is required"),
  coordinates: z.array(z.number()).length(2, "Coordinates must be [longitude, latitude]")
});

export const operatorSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(2, "Operator brand must be at least 2 characters"),
  logo: z.string().optional(),
  supportNumber: z.string().min(5, "Support number is required"),
  supportEmail: z.string().email("Invalid email address")
});

export const vehicleSchema = z.object({
  _id: z.string().optional(),
  operatorId: z.string().min(1, "Operator reference is required"),
  vehicleNumber: z.string().min(2, "Plate registration is required"),
  vehicleName: z.string().min(2, "Vehicle name is required"),
  mode: z.enum(["BUS", "TRAIN", "FLIGHT", "METRO", "CAB", "AUTO"]),
  capacity: z.number().min(1, "Capacity must be at least 1 seat")
});

export const routeSchema = z.object({
  _id: z.string().optional(),
  sourceHubId: z.string().min(1, "Source origin hub is required"),
  destinationHubId: z.string().min(1, "Destination target hub is required"),
  operatorId: z.string().optional(),
  vehicleId: z.string().optional(),
  mode: z.enum(["BUS", "TRAIN", "FLIGHT", "METRO"]),
  distanceKm: z.number().min(1, "Distance must be at least 1 Km"),
  durationMin: z.number().min(1, "Duration must be at least 1 minute"),
  basePrice: z.number().min(0, "Base price cannot be negative"),
  currentPrice: z.number().min(0, "Current dynamic rate cannot be negative"),
  active: z.boolean().default(true)
});

export const transferSchema = z.object({
  _id: z.string().optional(),
  cityId: z.string().min(1, "City reference is required"),
  sourceHubId: z.string().min(1, "Source origin station is required"),
  destinationHubId: z.string().min(1, "Destination target station is required"),
  transferMode: z.enum(["WALK", "AUTO", "CAB", "METRO", "SHUTTLE"]),
  distanceKm: z.number().min(0.1, "Distance must be at least 0.1 Km"),
  durationMin: z.number().min(1, "Duration must be at least 1 minute"),
  estimatedCost: z.number().min(0, "Estimated cost cannot be negative")
});

export const scheduleSchema = z.object({
  _id: z.string().optional(),
  routeId: z.string().min(1, "Route reference is required"),
  departureTime: z.string().min(1, "Departure date & time is required"),
  arrivalTime: z.string().min(1, "Arrival date & time is required"),
  totalSeats: z.number().min(1, "Total capacity must be at least 1 seat"),
  availableSeats: z.number().min(0, "Available seats cannot be negative"),
  price: z.number().min(0, "Price cannot be negative")
});

export type HubInput = z.infer<typeof hubSchema>;
export type OperatorInput = z.infer<typeof operatorSchema>;
export type VehicleInput = z.infer<typeof vehicleSchema>;
export type RouteInput = z.infer<typeof routeSchema>;
export type TransferInput = z.infer<typeof transferSchema>;
export type ScheduleInput = z.infer<typeof scheduleSchema>;
