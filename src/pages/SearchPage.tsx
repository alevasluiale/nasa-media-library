import React, { useState } from "react";
import { Layout, Typography } from "antd";
import { SearchForm } from "../components/SearchForm";
import { SearchResults } from "../components/SearchResults";
import { searchNasaImages } from "../api";
import { NasaCollection } from "../types";

const { Content } = Layout;
const { Title } = Typography;

export const SearchPage: React.FC = () => {
  const [results, setResults] = useState<NasaCollection[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (
    query: string,
    yearStart?: string,
    yearEnd?: string,
  ) => {
    try {
      setLoading(true);
      const response = await searchNasaImages(query, yearStart, yearEnd);
      setResults(response.collection.items);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="h-screen w-full min-h-screen overflow-y-auto">
      <Content>
        <Title level={2}>NASA Media Library Search</Title>
        <SearchForm onSearch={handleSearch} loading={loading} />
        <SearchResults results={results} loading={loading} />
      </Content>
    </Layout>
  );
};
