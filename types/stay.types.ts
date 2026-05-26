import { Coordinate, RatingSummary } from "./destination.types";
import { Review } from "./package.types";

export interface RoomPriceRange {
  min?: number;
  max?: number;
}

export interface RoomAvailability {
  totalRooms?: number;
  availableRooms?: number;
}

export interface StayRoom {
  typeOfRoom?: string;
  pricePerNight?: RoomPriceRange;
  capacity?: number;
  amenities?: string[];
  availability?: RoomAvailability;
  roomImages?: string[];
}

export interface StayPolicy {
  policyName?: string;
  policyDescription?: string;
}

export interface ConnectivityPopularPlace {
  name?: string;
  distance?: number;
}

export interface StayConnectivity {
  nearestAirport?: string;
  nearestRailway?: string;
  nearestBusStop?: string;
  popularPlaces?: ConnectivityPopularPlace[];
}

export interface SafetyMeasuresRatings {
  emergencyContact?: number;
  firstAid?: number;
  security?: number;
  fireSafety?: number;
  hygiene?: number;
  staffTraining?: number;
  sanitizationProtocols?: number;
}

export interface StayAiMetadata {
  tags?: string[];
  suitableFor?: string[];
  stayType?: string[];
}

export interface StayAiScore {
  valueForMoney?: number;
  locationScore?: number;
  cleanliness?: number;
  overall?: number;
}

export interface Stay {
  _id?: string;
  metaDataId?: string | any;
  adminId?: string;
  name?: string;
  slug?: string;
  shortDescription?: string;
  longDescription?: string;
  type?: "hotel" | "hostel" | "homestay" | "resort" | "villa";
  starRating?: number;
  destinationId?: string | any;
  location?: {
    address?: string;
    coordinates?: Coordinate;
    altitude?: number;
  };
  mainCity?: string | any;
  priceRange?: RoomPriceRange;
  rooms?: StayRoom[];
  amenities?: string[];
  policies?: StayPolicy[];
  ratings?: RatingSummary;
  reviews?: Review[];
  connectivity?: StayConnectivity;
  safetyMeasuresRatings?: SafetyMeasuresRatings;
  cancellationPolicy?: StayPolicy[];
  aiMetaData?: StayAiMetadata;
  aiScore?: StayAiScore;
  embedding?: number[];
  popularityScore?: number;
  images?: string[];
  currentPrice?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
