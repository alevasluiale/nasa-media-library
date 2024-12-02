import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Layout,
  Typography,
  Descriptions,
  Image,
  Space,
  Button,
  Tag,
  Spin,
} from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { getNasaCollection } from "../api";
import { NasaCollection } from "../types";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

export const ShowPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [collection, setCollection] = useState<NasaCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No ID provided");
      setLoading(false);
      return;
    }

    const fetchCollection = async () => {
      try {
        const data = await getNasaCollection(id);
        setCollection(data);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch collection:", error);
        setError("Failed to load the collection. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <Content className="p-4 md:p-8 flex items-center justify-center min-h-screen">
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  if (error || !collection) {
    return (
      <Layout>
        <Content className="p-4 md:p-8">
          <Space direction="vertical" size="large">
            <Button
              type="primary"
              icon={<LeftOutlined />}
              onClick={() => navigate(-1)}
            >
              Back to Search
            </Button>
            <Typography.Text type="danger">
              {error || "Collection not found"}
            </Typography.Text>
          </Space>
        </Content>
      </Layout>
    );
  }

  const metadata = collection.data[0];

  // Get unique images by filtering duplicates based on href
  const images =
    collection.links
      ?.filter((link) => link.rel === "preview")
      .filter(
        (link, index, self) =>
          index === self.findIndex((t) => t.href === link.href),
      ) || [];

  return (
    <Layout>
      <Content className="p-4 md:p-8">
        <Space direction="vertical" size="large" className="w-full">
          <Button
            type="primary"
            icon={<LeftOutlined />}
            onClick={() => navigate(-1)}
          >
            Back to Search
          </Button>

          <Title level={2}>{metadata.title}</Title>

          <Descriptions
            bordered
            column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
          >
            {metadata.location && (
              <Descriptions.Item label="Location" span={2}>
                {metadata.location}
              </Descriptions.Item>
            )}
            {metadata.photographer && (
              <Descriptions.Item label="Photographer" span={2}>
                {metadata.photographer}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Date" span={2}>
              {new Date(metadata.date_created).toLocaleDateString()}
            </Descriptions.Item>
          </Descriptions>

          {metadata.description && (
            <Paragraph>{metadata.description}</Paragraph>
          )}

          {metadata.keywords && metadata.keywords.length > 0 && (
            <Space wrap>
              {metadata.keywords.map((keyword) => (
                <Tag key={keyword}>{keyword}</Tag>
              ))}
            </Space>
          )}

          <Image.PreviewGroup>
            <Space wrap size="large">
              {images.map((image, index) => (
                <Image
                  key={index}
                  src={image.href}
                  alt={`${metadata.title} - ${index + 1}`}
                  width={300}
                  placeholder={<Spin />}
                />
              ))}
            </Space>
          </Image.PreviewGroup>
        </Space>
      </Content>
    </Layout>
  );
};
