import api from "./api";

export async function getGeolocation(address: string): Promise<Geo | null> {
  try {
    const response = await api.geolocationInstance.get(
      `/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1&limit=1`,
    );

    const [location] = response.data;

    if (location) {
      const { lat, lon: lng } = location;
      return { lat, lng };
    }

    return null;
  } catch (error) {
    console.error("Error fetching geolocation:", error);
    return null;
  }
}
