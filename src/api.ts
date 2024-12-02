import { NasaCollection, NasaSearchResponse, Query } from "./types.ts";

const NASA_API_BASE = "https://images-api.nasa.gov";

export const searchNasaImages = async (
  query: Query,
  page: number = 1,
): Promise<NasaSearchResponse> => {
  const params = new URLSearchParams({
    q: query.search,
    media_type: "image",
    page: page.toString(),
  });

  if (query.yearStart) params.append("year_start", query.yearStart);
  if (query.yearEnd) params.append("year_end", query.yearEnd);

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
