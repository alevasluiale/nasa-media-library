import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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

function ShowPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [collection, setCollection] = useState<NasaCollection | null>(
    location.state?.collection || null,
  );
  const [loading, setLoading] = useState(!location.state?.collection);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if we don't have the collection in state
    if (!collection && id) {
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
    }
  }, [id, collection]);

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

  // Get unique images
  const images =
    collection.links
      ?.filter((link) => link.rel === "preview")
      .filter(
        (link, index, self) =>
          index === self.findIndex((t) => t.href === link.href),
      ) || [];
  return (
    <Layout className="overflow-y-auto">
      <Content className="h-screen p-4 md:p-8">
        <Space
          direction="vertical"
          size="large"
          className="w-full"
          align="center"
        >
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
            column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
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

          {/*tailwind classname seems to break it*/}
          {metadata.description && (
            <Paragraph style={{ maxWidth: "500px" }}>
              {metadata.description}
            </Paragraph>
          )}
          <Image.PreviewGroup>
            <Space wrap size="large">
              {images.map((image, index) => (
                <Image
                  key={index}
                  src={image.href.replace("~thumb", "~orig")}
                  alt={`${metadata.title} - ${index + 1}`}
                  placeholder={<Spin />}
                  className="max-h-96"
                />
              ))}
            </Space>
          </Image.PreviewGroup>
          {metadata.keywords && metadata.keywords.length > 0 && (
            <Space wrap className="justify-center mb-4">
              {metadata.keywords.map((keyword) => (
                <Tag key={keyword}>{keyword}</Tag>
              ))}
            </Space>
          )}
        </Space>
      </Content>
    </Layout>
  );
}

export default ShowPage;
