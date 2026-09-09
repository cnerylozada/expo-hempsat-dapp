import { LatLng } from "react-native-maps";

export const LOCATION_OFF_TITLE = "Location is turned off";
export const LOCATION_OFF_MESSAGE =
  "Turn location on in your device settings to continue.";

// Location is on, but this app isn't allowed to use it.
export const PERMISSION_DENIED_TITLE = "Location access denied";
export const PERMISSION_DENIED_MESSAGE =
  "Please enable location access in your device settings.";

const EARTH_RADIUS_METERS = 6378137;
const SQUARE_METERS_PER_HECTARE = 10000;

const toRadians = (deg: number) => (deg * Math.PI) / 180;

/**
 * Area enclosed by a polygon's vertices, in m². Returns 0 below 3 points,
 * where there is no area to measure.
 *
 * Shoelace formula on an equirectangular projection centred at the polygon's
 * average latitude — accurate enough for farm-sized areas (a few hundred
 * metres to a few km); no geodesic library (@turf/*) is installed for this.
 */
export function polygonAreaInSquareMeters(points: LatLng[]): number {
  if (points.length < 3) return 0;

  const avgLatRad =
    toRadians(points.reduce((sum, p) => sum + p.latitude, 0)) / points.length;

  const projected = points.map((p) => ({
    x: toRadians(p.longitude) * EARTH_RADIUS_METERS * Math.cos(avgLatRad),
    y: toRadians(p.latitude) * EARTH_RADIUS_METERS,
  }));

  let sum = 0;
  for (let i = 0; i < projected.length; i++) {
    const current = projected[i];
    const next = projected[(i + 1) % projected.length];
    sum += current.x * next.y - next.x * current.y;
  }

  return Math.abs(sum) / 2;
}

/**
 * Farms are measured in hectares once they're any real size; m² only stays
 * readable for the small end.
 */
export const formatArea = (squareMeters: number) =>
  squareMeters >= SQUARE_METERS_PER_HECTARE
    ? `${(squareMeters / SQUARE_METERS_PER_HECTARE).toFixed(2)} ha`
    : `${Math.round(squareMeters).toLocaleString()} m²`;
