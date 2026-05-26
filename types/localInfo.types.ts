export interface FoodBestPlace {
  name?: string;
  location?: string;
}

export interface LocalFoodItem {
  name?: string;
  description?: string;
  images?: string[];
  typeOfFood?: string; // veg, non-veg, dessert, street
  bestPlaces?: FoodBestPlace[];
}

export interface FamousPlaceItem {
  name?: string;
  description?: string;
  images?: string[];
  type?: string; // tourist_spot, hidden_gem, religious, nature, market
  bestTimeToVisit?: string;
  entryFee?: number;
  timings?: string;
}

export interface CultureAndEtiquette {
  traditions?: string[];
  festivals?: string[];
  localEtiquette?: string[];
}

export interface MythOrStory {
  title?: string;
  story?: string;
}

export interface PrecautionItem {
  title?: string;
  description?: string;
  severity?: "low" | "medium" | "high";
}

export interface EmergencyContact {
  authority?: string;
  number?: string;
}

export interface SafetyInfo {
  overallSafety?: number; // 1-10
  tips?: string[];
  emergencyContacts?: EmergencyContact[];
}

export interface ClothingGuide {
  summer?: string[];
  winter?: string[];
  religiousPlaces?: string[];
  generalTips?: string[];
}

export interface UsefulPhrase {
  local?: string;
  english?: string;
}

export interface LocalInfo {
  _id?: string;
  metaDataId?: string | any;
  destinationId?: string | any;
  adminId?: string;
  slug?: string;
  language?: string[];
  currency?: string;
  bestTimeToVisit?: string;
  famousFood?: LocalFoodItem[];
  famousPlaces?: FamousPlaceItem[];
  culture?: CultureAndEtiquette;
  mythsAndStories?: MythOrStory[];
  precautions?: PrecautionItem[];
  safety?: SafetyInfo;
  clothing?: ClothingGuide;
  dos?: string[];
  donts?: string[];
  localTips?: string[];
  phrases?: UsefulPhrase[];
  aiSummary?: string;
  embedding?: number[];
  popularityScore?: number;
  lastUpdated?: string;
  createdAt?: string;
  updatedAt?: string;
}
