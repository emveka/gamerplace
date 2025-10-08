// types/banner.ts

// Type pour un banner depuis Firebase
export interface FirebaseBanner {
  id: string;
  title: string;
  alt: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  order: number;
  createdAt: { seconds: number; nanoseconds: number } | null;
  updatedAt: { seconds: number; nanoseconds: number } | null;
}

// Type pour les props du composant Banner
export interface BannerProps {
  banners: FirebaseBanner[];
  autoplay?: boolean;
  autoplayDelay?: number;
  showDots?: boolean;
  showArrows?: boolean;
  height?: string;
  mobileHeight?: string;
  className?: string;
}