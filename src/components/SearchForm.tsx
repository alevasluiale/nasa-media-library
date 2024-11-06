import React from "react";
import { Form, Input, DatePicker, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface SearchFormProps {
  onSearch: (query: string, yearStart?: string, yearEnd?: string) => void;
  loading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  loading,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    onSearch(
      values.query,
      values.yearStart?.year().toString(),
      values.yearEnd?.year().toString(),
    );
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        name="query"
        label="Search Query"
        rules={[{ required: true, message: "Please enter a search query" }]}
      >
        <Input placeholder="Enter search terms..." />
      </Form.Item>
      <Space>
        <Form.Item name="yearStart" label="Year Start">
          <DatePicker picker="year" />
        </Form.Item>
        <Form.Item name="yearEnd" label="Year End">
          <DatePicker picker="year" />
        </Form.Item>
      </Space>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          icon={<SearchOutlined />}
          loading={loading}
        >
          Search
        </Button>
      </Form.Item>
    </Form>
  );
};
