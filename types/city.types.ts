import { Coordinate } from "./destination.types";

export interface City {
  _id?: string;
  name?: string;
  state?: string;
  country?: string;
  city?: string;
  address?: string;
  coordinates?: Coordinate;
  altitude?: number;
  timezone?: string;
  description?: string;
  images?: string[];
  status?: string;
}
