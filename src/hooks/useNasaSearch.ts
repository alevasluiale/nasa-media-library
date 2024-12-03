import { useState, useCallback } from "react";
import { searchNasaImages, getNasaCollection } from "../api";
import { NasaCollection, Query } from "../types";

interface UseNasaSearchResult {
  results: NasaCollection[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  currentPage: number;
  currentQuery?: Query;
  search: (query: Query) => Promise<void>;
  loadMore: () => Promise<void>;
  getCollection: (id: string) => Promise<NasaCollection>;
  reset: () => void;
}

export function useNasaSearch(): UseNasaSearchResult {
  const [results, setResults] = useState<NasaCollection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentQuery, setCurrentQuery] = useState<Query>();

  const search = useCallback(async (query: Query) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentQuery(query);
      setCurrentPage(1);

      const response = await searchNasaImages(query);
      setResults(response.collection.items);
      setHasMore(response.collection.items.length > 0);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("An error occurred during search"),
      );
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !currentQuery) return;

    try {
      setLoading(true);
      setError(null);
      const nextPage = currentPage + 1;

      const response = await searchNasaImages(currentQuery, nextPage);
      const newItems = response.collection.items;

      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setResults((prev) => [...prev, ...newItems]);
        setCurrentPage(nextPage);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("An error occurred while loading more results"),
      );
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentQuery, hasMore, loading]);

  const getCollection = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const collection = await getNasaCollection(id);
      return collection;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to fetch collection");
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResults([]);
    setLoading(false);
    setError(null);
    setHasMore(true);
    setCurrentPage(1);
    setCurrentQuery(undefined);
  }, []);

  return {
    results,
    loading,
    error,
    hasMore,
    currentPage,
    currentQuery,
    search,
    loadMore,
    getCollection,
    reset,
  };
}
