import axios from "axios";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface GeoLocation {
  lat: string;
  lng: string;
}

export async function getGeoLocation(address: string): Promise<GeoLocation | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1&limit=1`;

  try {
    const response = await axios.get(url);
    if (response.data.length === 0) {
      throw new Error('Address not found');
    }
    const location = response.data[0];
    return {
      lat: location.lat,
      lng: location.lon
    };
  } catch (error) {
    console.error('Error fetching geolocation:', error);
    return null;
  }
}