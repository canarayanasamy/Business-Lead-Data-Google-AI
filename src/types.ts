export interface Lead {
  serialNumber: number;
  name: string;
  address: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  otherDetails: string;
  sourceUrls: string[];
}

export interface SearchParams {
  industry: string;
  location: string;
  keyword?: string;
  details?: string;
  area?: string;
  maxResults: number;
}
