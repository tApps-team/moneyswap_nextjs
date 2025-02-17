import { City } from "@/entities/location/city";
import { Name } from "@/shared/types";

export type Country = {
  id: number;
  name: Name;
  icon_url: string;
  cities: City[];
  is_popular: boolean;
};
export type LocationInfo = {
  id: number;
  name: Name;
  code_name: string;
  country: {
    name: Name;
    icon_url: string;
  };
};
