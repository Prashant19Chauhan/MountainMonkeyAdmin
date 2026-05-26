import { Coordinate, RatingSummary } from "./destination.types";

export interface PackageDestinationInfo {
  id?: string | any;
  coordinates?: Coordinate;
}

export interface PackageDuration {
  days?: number;
  nights?: number;
}

export interface PackagePricing {
  basePrice?: number;
  discountedPrice?: number;
  currency?: string;
  perPerson?: boolean;
  taxesIncluded?: boolean;
}

export interface PackageActivityInfo {
  id: string | any;
  priceRangeForPackage?: {
    min?: number;
    max?: number;
  };
}

export interface PackageAccommodationInfo {
  stayId: string | any;
  priceRangeForPackage?: {
    min?: number;
    max?: number;
  };
}

export interface PackageTransport {
  included?: boolean;
  modes?: string[];
}

export interface PackageMeals {
  included?: boolean;
  plan?: string[];
}

export interface PackageAvailability {
  startDate?: string;
  endDate?: string;
  maxSeats?: number;
  availableSeats?: number;
}

export interface ItineraryDay {
  day?: number;
  title?: string;
  description?: string;
}

export interface Review {
  userId?: string;
  rating?: number;
  comment?: string;
  createdAt?: string;
}

export interface PackageAiMetadata {
  tags?: string[];
  mood?: string[];
  suitableFor?: string[];
  difficultyLevel?: "easy" | "moderate" | "hard";
  bestSeason?: string[];
  highlights?: string[];
  languagesSupported?: string[];
  popularityScore?: number;
  embedding?: number[];
}

export interface PackageVendor {
  vendorId?: string;
  name?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface PackageAnalytics {
  views?: number;
  bookings?: number;
  clicks?: number;
}

export interface TourPackage {
  _id?: string;
  metaDataId?: string | any;
  adminId: string;
  title: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  destination: PackageDestinationInfo;
  duration?: PackageDuration;
  pricing?: PackagePricing;
  categories?: string[];
  activities?: PackageActivityInfo[];
  accommodations?: PackageAccommodationInfo[];
  transport?: PackageTransport;
  meals?: PackageMeals;
  availability?: PackageAvailability;
  itinerary?: ItineraryDay[];
  images?: string[];
  videos?: string[];
  ratings?: RatingSummary;
  reviews?: Review[];
  inclusions?: string[];
  exclusions?: string[];
  aiMetadata?: PackageAiMetadata;
  vendor?: PackageVendor;
  analytics?: PackageAnalytics;
  status?: "draft" | "active" | "inactive";
  isFeatured?: boolean;
  currentPrice?: number;
  createdAt?: string;
  updatedAt?: string;
}
