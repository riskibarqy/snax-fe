export interface Url {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  userId: string;
  clicks: number;
}

export interface UrlStats {
  totalClicks: number;
  dailyClicks: {
    date: string;
    clicks: number;
  }[];
}

export interface CreateUrlDto {
  originalUrl: string;
  customCode?: string;
} 