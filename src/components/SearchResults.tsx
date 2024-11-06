import React from "react";
import { Card, List, Space } from "antd";
import { Link } from "react-router-dom";
import { NasaCollection } from "../types";

interface SearchResultsProps {
  results: NasaCollection[];
  loading: boolean;
}
export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading,
}) => {
  return (
    <List
      grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
      dataSource={results}
      loading={loading}
      renderItem={(item) => {
        const data = item.data[0];
        const thumbnail = item.links?.find(
          (link) => link.rel === "preview",
        )?.href;

        return (
          <List.Item>
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
                      {data.location && <span>Location: {data.location}</span>}
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
  );
};
