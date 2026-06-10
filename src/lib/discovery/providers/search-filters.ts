import {
  isConstructionIndustry,
  isRealEstateIndustry,
  matchesConstructionBusinessName,
  matchesRealEstateBusinessName,
} from "./industry-tags";
import type { NominatimResult, NominatimSearchResult } from "./nominatim";

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function extractResultCity(result: NominatimSearchResult): string {
  return (
    result.address.city ||
    result.address.town ||
    result.address.municipality ||
    result.address.village ||
    ""
  ).trim();
}

export function isWithinBoundingBox(
  lat: number,
  lon: number,
  boundingbox: NominatimResult["boundingbox"]
): boolean {
  const [south, north, west, east] = boundingbox.map(Number);
  return lat >= south && lat <= north && lon >= west && lon <= east;
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

export function distanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function matchesRegion(
  result: NominatimSearchResult,
  queryCity: string,
  location: NominatimResult,
  maxDistanceKm = 40
): boolean {
  if (matchesCity(result, queryCity, location)) {
    return true;
  }

  if (
    location.state &&
    result.address.state &&
    normalize(result.address.state) !== normalize(location.state)
  ) {
    return false;
  }

  if (
    typeof result.lat === "number" &&
    typeof result.lon === "number" &&
    typeof location.lat === "number" &&
    typeof location.lon === "number"
  ) {
    return (
      distanceKm(location.lat, location.lon, result.lat, result.lon) <=
      maxDistanceKm
    );
  }

  return false;
}

export function matchesCity(
  result: NominatimSearchResult,
  queryCity: string,
  location: NominatimResult
): boolean {
  const city = extractResultCity(result);
  const normalizedCity = normalize(queryCity);

  if (city && (normalize(city).includes(normalizedCity) || normalizedCity.includes(normalize(city)))) {
    return true;
  }

  if (normalize(result.displayName).includes(normalizedCity)) {
    return true;
  }

  if (
    typeof result.lat === "number" &&
    typeof result.lon === "number" &&
    isWithinBoundingBox(result.lat, result.lon, location.boundingbox)
  ) {
    return true;
  }

  return false;
}

export function isLikelyBusinessResult(
  result: NominatimSearchResult,
  industry: string
): boolean {
  if (/\bbank\b/i.test(result.name)) {
    return false;
  }

  if (result.class === "tourism") {
    return false;
  }

  if (result.class === "landuse" && result.type === "construction") {
    return false;
  }

  if (result.class === "office" && result.type === "government") {
    return false;
  }

  if (result.class === "emergency") {
    return false;
  }

  if (result.class === "amenity" && result.type === "library") {
    return isRealEstateIndustry(industry) ? false : true;
  }

  if (isRealEstateIndustry(industry)) {
    if (result.type === "estate_agent") {
      return result.class === "shop" || result.class === "office";
    }

    if (result.class === "office" && result.type === "yes") {
      return matchesRealEstateBusinessName(result.name);
    }

    return matchesRealEstateBusinessName(result.name);
  }

  if (result.class === "building" && !result.extratags.website) {
    if (result.type === "yes" || result.type === "industrial") {
      return isConstructionIndustry(industry)
        ? matchesConstructionBusinessName(result.name)
        : false;
    }
  }

  if (result.class === "office") {
    return (
      result.type !== "architect" ||
      (isConstructionIndustry(industry) &&
        matchesConstructionBusinessName(result.name))
    );
  }

  if (result.class === "craft") {
    return true;
  }

  if (result.class === "shop" && isConstructionIndustry(industry)) {
    return matchesConstructionBusinessName(result.name);
  }

  if (isConstructionIndustry(industry)) {
    return matchesConstructionBusinessName(result.name);
  }

  return result.class === "amenity" || result.class === "shop";
}
