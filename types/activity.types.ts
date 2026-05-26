import { Coordinate, RatingSummary } from "./destination.types";
import { Review } from "./package.types";

export interface ActivityTiming {
  openingTime?: string;
  closingTime?: string;
  duration?: number; // in minutes
}

export interface ActivityPricing {
  price?: number;
  currency?: string;
  isFree?: boolean;
}

export interface ActivityAgeLimit {
  min?: number;
  max?: number;
}

export interface ActivitySafetyInfo {
  precautions?: string[];
  riskLevel?: "low" | "medium" | "high";
}

export interface ActivityProvider {
  name?: string;
  contact?: string;
  website?: string;
}

export interface ActivityAiScore {
  popularity?: number;
  experienceQuality?: number;
  valueForMoney?: number;
  uniqueness?: number;
}

export interface Activity {
  _id?: string;
  metaDataId?: string | any;
  name?: string;
  slug?: string;
  adminId?: string;
  destinationId?: string | any;
  type?: string;
  category?: string[];
  shortDescription?: string;
  longDescription?: string;
  location?: {
    address?: string;
    coordinates?: Coordinate;
    mainCity?: string | any;
  };
  timing?: ActivityTiming;
  bestTimeToVisit?: string;
  pricing?: ActivityPricing;
  difficultyLevel?: "easy" | "moderate" | "hard";
  ageLimit?: ActivityAgeLimit;
  requiredItems?: string[];
  safetyInfo?: ActivitySafetyInfo;
  providers?: ActivityProvider[];
  ratings?: RatingSummary;
  reviews?: Review[];
  images?: string[];
  tags?: string[];
  aiScore?: ActivityAiScore;
  recommendedFor?: string[];
  timeSlotPreference?: string[];
  aiSummary?: string;
  embedding?: number[];
  popularityScore?: number;
  currentPrice?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
