import { Name } from "@/shared/types";
import { Country, LocationInfo } from "../model/country-types";

export type GetCountriesDtoResponse = Country[];
export type GetCountriesDtoRequest = {};

export type GetSpecificCityResponse = LocationInfo;
export type GetSpecificCityRequest = { codeName: string };
