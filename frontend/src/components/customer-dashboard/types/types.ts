export type CustomerTab = "liked" | "shared" | "stats";

export interface CustomerProfile {
  name: string;
  email: string;
  avatarUrl: string;
  memberSince: string;
  savedDealsCount: number;
}

export interface LikedStore {
  id: string;
  name: string;
  brand: string;
  category: string;
  rating: number;
  reviewsCount: number;
  address: string;
  distanceKm: number;
  isOpen: boolean;
  imageUrl: string;
  likedAt: string;
  featuredDeal?: string;
  lat: number;
  lng: number;
}

export interface SharedItem {
  id: string;
  title: string;
  storeName: string;
  category: string;
  sharedUrl: string;
  sharedAt: string;
  platform: "Copy Link" | "WhatsApp" | "Facebook" | "Twitter";
  clicksCount: number;
  imageUrl: string;
  notes?: string;
}

export interface CustomerStat {
  label: string;
  value: string | number;
  trend: string;
  description: string;
}
