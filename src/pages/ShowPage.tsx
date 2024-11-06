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
} from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { getNasaCollection } from "../api";
import { NasaCollection } from "../types";

const { Content } = Layout;
const { Title } = Typography;

export const ShowPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [collection, setCollection] = useState<NasaCollection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchCollection = async () => {
        try {
          const data = await getNasaCollection(decodeURIComponent(id));
          setCollection(data);
        } catch (error) {
          console.error("Failed to fetch collection:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchCollection();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!collection) return <div>Collection not found</div>;

  const metadata = collection.data[0];
  const images =
    collection.links?.filter((link) => link.rel === "preview") || [];

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

          <Descriptions bordered>
            {metadata.location && (
              <Descriptions.Item label="Location">
                {metadata.location}
              </Descriptions.Item>
            )}
            {metadata.photographer && (
              <Descriptions.Item label="Photographer">
                {metadata.photographer}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Date">
              {new Date(metadata.date_created).toLocaleDateString()}
            </Descriptions.Item>
          </Descriptions>

          {metadata.description && (
            <Typography.Paragraph>{metadata.description}</Typography.Paragraph>
          )}

          {metadata.keywords && (
            <Space wrap>
              {metadata.keywords.map((keyword) => (
                <Tag key={keyword}>{keyword}</Tag>
              ))}
            </Space>
          )}

          <Image.PreviewGroup>
            <Space wrap>
              {images.map((image, index) => (
                <Image
                  key={index}
                  src={image.href}
                  alt={`${metadata.title} - ${index + 1}`}
                  width={300}
                />
              ))}
            </Space>
          </Image.PreviewGroup>
        </Space>
      </Content>
    </Layout>
  );
};
