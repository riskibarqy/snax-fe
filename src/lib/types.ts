export interface Url {
  id: string;
  shortCode: string;
  originalUrl: string;
  userId: string;
  createdAt: string;
  expiresAt?: string;
  clicks: number;
  lastClicked?: string;
  domainId?: string;
  domain?: Domain;
  tags: Tag[];
}

export interface Domain {
  id: string;
  domain: string;
  userId: string;
  verified: boolean;
  createdAt: string;
  urls: Url[];
}

export interface Tag {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
}

export interface CreateUrlRequest {
  url: string;
  expiresAt?: string;
  customCode?: string;
  domainId?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string | { message: string };
}

export interface UrlAnalytics {
  totalClicks: number;
  lastClicked?: string;
  createdAt: string;
  expiresAt?: string;
} 