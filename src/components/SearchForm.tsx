import React from "react";
import { Form, Input, DatePicker, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FormProps } from "../types.ts";
import { Dayjs } from "dayjs";

interface SearchFormProps {
  onSearch: (query: string, yearStart?: string, yearEnd?: string) => void;
  loading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  loading,
}) => {
  const [form] = Form.useForm<FormProps>();

  const handleSubmit = (values: FormProps) => {
    onSearch(
      values.query,
      values.yearStart?.year().toString(),
      values.yearEnd?.year().toString(),
    );
  };

  return (
    <div className="w-full bg-gray-50 flex items-start justify-center pt-12">
      <div className="w-full max-w-xl px-4 md:px-6">
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="horizontal"
          className="w-full bg-red p-6 rounded-lg shadow-sm"
        >
          <Form.Item
            name="query"
            label="Search Query"
            rules={[{ required: true, message: "Please enter a search query" }]}
            className="mb-6"
          >
            <Input placeholder="Enter search terms..." />
          </Form.Item>

          <Form.Item name="yearStart" label="Year Start">
            <DatePicker picker="year" className="w-full" />
          </Form.Item>

          <Form.Item
            name="yearEnd"
            label="Year End"
            rules={[
              () => ({
                validator(_, value: Dayjs) {
                  const startYear = form.getFieldValue("yearStart") as Dayjs;
                  if (!value || !startYear || value.year() > startYear.year()) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("End year must be greater than start year"),
                  );
                },
              }),
            ]}
          >
            <DatePicker picker="year" className="w-full" />
          </Form.Item>

          <Form.Item className="mb-0 text-center">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
              className="w-32"
            >
              Search
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
