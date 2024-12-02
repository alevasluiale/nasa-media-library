import React, { useCallback, useRef, useState } from "react";
import { Layout, Typography } from "antd";
import { SearchForm } from "../components/SearchForm";
import { SearchResults } from "../components/SearchResults";
import { searchNasaImages } from "../api";
import { NasaCollection, Query } from "../types";

const { Content } = Layout;
const { Title } = Typography;

export const SearchPage: React.FC = () => {
  const resultsRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentQuery, setCurrentQuery] = useState<Query>();
  const [results, setResults] = useState<NasaCollection[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const handleSearch = async (query: Query) => {
    try {
      setLoading(true);
      setCurrentQuery(query);
      const response = await searchNasaImages(query);
      // Scroll results area to top
      if (resultsRef.current) {
        resultsRef.current.scrollTop = 0;
      }
      setResults(response.collection.items);
      setHasMore(response.collection.items.length > 0);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !currentQuery) return;

    try {
      setLoading(true);
      const nextPage = currentPage + 1;
      const response = await searchNasaImages(currentQuery, nextPage);

      const newItems = response.collection.items;
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setResults((prev) => [...prev, ...newItems]);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error("Failed to load more results:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentQuery, loading, hasMore]);

  return (
    <Layout className="h-screen">
      <Content className="flex flex-col h-full">
        <div className="flex-none p-4">
          <Title level={3}>NASA Media Library</Title>
          <SearchForm onSearch={handleSearch} loading={loading} />
        </div>
        <div className="flex-1 mb-2 overflow-auto" ref={resultsRef}>
          <SearchResults
            results={results}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={loadMore}
          />
        </div>
      </Content>
    </Layout>
  );
};
