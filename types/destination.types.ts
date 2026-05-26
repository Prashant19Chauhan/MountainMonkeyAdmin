export interface Coordinate {
  lat?: number;
  lng?: number;
}

export interface DestinationLocation {
  address?: string;
  pinCode?: string;
  coordinates?: Coordinate;
  altitude?: number;
}

export interface NearbyDestination {
  destinationId: string | any;
  distance?: number;
  travelTime?: number;
  routeType?: string;
}

export interface BudgetEstimate {
  dailyAvg?: number;
  budget?: number;
  luxury?: number;
}

export interface RatingSummary {
  average?: number;
  count?: number;
}

export interface AiHighlight {
  title?: string;
  description?: string;
}

export interface DestinationAiMetadata {
  tags?: string[];
  mood?: string[];
  suitableFor?: string[];
  travelStyle?: string[];
  highlights?: AiHighlight[];
  embedding?: number[];
}

export interface ConnectionStrength {
  destinationId: string;
  score?: number;
}

export interface DestinationAnalytics {
  searches?: number;
  clicks?: number;
  bookings?: number;
}

export interface Destination {
  _id?: string;
  metaDataId?: string | any;
  name: string;
  adminId?: string;
  slug: string;
  description: string;
  shortDescription: string;
  location: DestinationLocation;
  mainCity?: string | any;
  placeType?: string;
  categories?: string[];
  nearbyDestinations?: NearbyDestination[];
  budgetEstimate?: BudgetEstimate;
  images?: string[];
  videos?: string[];
  ratings?: RatingSummary;
  aiMetadata?: DestinationAiMetadata;
  connectionStrength?: ConnectionStrength[];
  analytics?: DestinationAnalytics;
  status?: "Active" | "Inactive" | "Draft";
  createdAt?: string;
  updatedAt?: string;
}
