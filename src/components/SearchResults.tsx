import React, { useCallback, useRef } from "react";
import { Card, List, Space, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { NasaCollection } from "../types";
import ImageWithLoader from "./ImageWithLoader.tsx";

interface SearchResultsProps {
  results: NasaCollection[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}
export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading,
  hasMore,
  onLoadMore,
}) => {
  const navigate = useNavigate();
  const observer = useRef<IntersectionObserver>();
  const loadingRef = useRef<HTMLDivElement>(null);

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            onLoadMore();
          }
        },
        {
          root: null,
          rootMargin: "1000px",
          threshold: 0.1,
        },
      );

      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore, onLoadMore],
  );

  const handleItemClick = (item: NasaCollection) => {
    navigate(`/show/${encodeURIComponent(item.data[0].nasa_id)}`, {
      state: { collection: item },
    });
  };

  return (
    <>
      <List
        className="px-4 overflow-y-auto"
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
        dataSource={results}
        renderItem={(item, index) => {
          const data = item.data[0];
          const thumbnail = item.links?.find(
            (link) => link.rel === "preview",
          )?.href;

          const isLastElement = index === results.length - 1;

          return (
            <List.Item ref={isLastElement ? lastElementRef : undefined}>
              <div onClick={() => handleItemClick(item)}>
                <Card
                  hoverable
                  cover={
                    thumbnail && (
                      <ImageWithLoader alt={data.title} src={thumbnail} />
                    )
                  }
                >
                  <Card.Meta
                    title={data.title}
                    description={
                      <Space direction="vertical">
                        {data.location && (
                          <span>Location: {data.location}</span>
                        )}
                        {data.photographer && (
                          <span>Photographer: {data.photographer}</span>
                        )}
                      </Space>
                    }
                  />
                </Card>
              </div>
            </List.Item>
          );
        }}
      />
      <div ref={loadingRef} className="w-full flex justify-center p-4">
        {loading && <Spin />}
      </div>
    </>
  );
};
