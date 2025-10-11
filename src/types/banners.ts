// types/banner.ts

// Type pour un banner depuis Firebase
export interface FirebaseBanner {
  id: string;
  title: string;
  alt: string;
  
  // Image desktop (format paysage 1500x350)
  imageUrl: string;
  
  // Image mobile (format portrait 1080x1350) - NOUVEAU ⭐
  mobileImageUrl?: string;
  
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
  mobileAutoplayDelay?: number; // NOUVEAU : délai différent sur mobile
  showDots?: boolean;
  showArrows?: boolean;
  height?: string;
  mobileHeight?: string;
  className?: string;
}