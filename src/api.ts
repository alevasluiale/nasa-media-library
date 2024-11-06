import { NasaCollection, NasaSearchResponse } from "./types.ts";

const NASA_API_BASE = "https://images-api.nasa.gov";

export const searchNasaImages = async (
  query: string,
  yearStart?: string,
  yearEnd?: string,
): Promise<NasaSearchResponse> => {
  const params = new URLSearchParams({
    q: query,
    media_type: "image",
  });

  if (yearStart) params.append("year_start", yearStart);
  if (yearEnd) params.append("year_end", yearEnd);

  const response = await fetch(`${NASA_API_BASE}/search?${params}`);
  if (!response.ok) throw new Error("Failed to fetch NASA images");
  return response.json();
};

export const getNasaCollection = async (
  nasaId: string,
): Promise<NasaCollection> => {
  const response = await fetch(`${NASA_API_BASE}/asset/${nasaId}`);
  if (!response.ok) throw new Error("Failed to fetch NASA collection");
  return response.json();
};
