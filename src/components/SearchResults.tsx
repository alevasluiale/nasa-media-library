import React, { useCallback, useRef } from "react";
import { Card, List, Space, Spin } from "antd";
import { Link } from "react-router-dom";
import { NasaCollection } from "../types";

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
          rootMargin: "100px",
          threshold: 0.1,
        },
      );

      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore, onLoadMore],
  );
  return (
    <>
      <List
        className="flex px-4 overflow-y-auto"
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
        dataSource={results}
        loading={loading}
        renderItem={(item, index) => {
          const data = item.data[0];
          const thumbnail = item.links?.find(
            (link) => link.rel === "preview",
          )?.href;

          const isLastElement = index === results.length - 1;

          return (
            <List.Item ref={isLastElement ? lastElementRef : undefined}>
              <Link to={`/show/${encodeURIComponent(item.href)}`}>
                <Card
                  hoverable
                  cover={
                    thumbnail && (
                      <img
                        alt={data.title}
                        src={thumbnail}
                        style={{ height: 200, objectFit: "cover" }}
                      />
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
              </Link>
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
