import type { Dayjs } from "dayjs";

export interface NasaImage {
  href: string;
  title: string;
  location?: string;
  photographer?: string;
  description?: string;
  keywords?: string[];
  date_created: string;
}

export interface NasaCollection {
  href: string;
  data: Array<{
    title: string;
    location?: string;
    photographer?: string;
    description?: string;
    keywords?: string[];
    date_created: string;
    media_type: string;
  }>;
  links: Array<{
    href: string;
    rel: string;
    render?: string;
  }>;
}

export interface NasaSearchResponse {
  collection: {
    items: NasaCollection[];
    metadata: {
      total_hits: number;
    };
  };
}

export interface FormProps {
  query: string;
  yearStart: Dayjs;
  yearEnd: Dayjs;
}
