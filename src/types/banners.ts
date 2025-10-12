// types/banner.ts - Version site synchronisée avec l'admin

import { Timestamp } from "firebase/firestore";

// ===== TYPE FIREBASE BANNER (Site) =====
// Utilisé côté site avec les timestamps sérialisés de Firebase
export interface FirebaseBanner {
  id: string;
  title: string;
  imageUrl: string;           // Image desktop (1500x350)
  mobileImageUrl?: string;    // Image mobile (1080x1350)
  alt: string;                // Alt text pour l'image desktop
  mobileAlt?: string;         // NOUVEAU ✅ Alt text pour l'image mobile (optionnel)
  linkUrl: string;
  isActive: boolean;
  order: number;
  createdAt: { seconds: number; nanoseconds: number } | null;
  updatedAt: { seconds: number; nanoseconds: number } | null;
}

// ===== TYPE BANNER ADMIN (pour compatibilité) =====
// Utilisé côté admin avec Timestamp Firebase natif
export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  mobileImageUrl?: string;
  alt: string;
  mobileAlt?: string;
  linkUrl: string;
  isActive: boolean;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ===== PROPS DU COMPOSANT BANNER =====
export interface BannerProps {
  banners: FirebaseBanner[];
  autoplay?: boolean;
  autoplayDelay?: number;
  mobileAutoplayDelay?: number;
  showDots?: boolean;
  showArrows?: boolean;
  showMobileDots?: boolean;      // ✅ Contrôler les dots sur mobile
  mobileDotsSize?: 'small' | 'medium' | 'large'; // ✅ Taille des dots mobile
  showProgressBar?: boolean;     // ✅ Barre de progression
  height?: string;
  mobileHeight?: string;
  maxHeightDesktop?: string;
  className?: string;
  debug?: boolean;
}

// ===== HELPER FUNCTIONS SYNCHRONISÉES =====

/**
 * Obtient le bon alt text selon le contexte (desktop/mobile)
 * @param banner - Le banner
 * @param isMobile - Si on est sur mobile
 * @returns L'alt text approprié
 */
export function getBannerAltText(banner: FirebaseBanner | Banner, isMobile: boolean = false): string {
  if (isMobile && banner.mobileImageUrl && banner.mobileAlt) {
    return banner.mobileAlt;
  }
  return banner.alt;
}

/**
 * Obtient la bonne image selon le contexte (desktop/mobile)
 * @param banner - Le banner
 * @param isMobile - Si on est sur mobile
 * @returns L'URL de l'image appropriée
 */
export function getBannerImageUrl(banner: FirebaseBanner | Banner, isMobile: boolean = false): string {
  if (isMobile && banner.mobileImageUrl) {
    return banner.mobileImageUrl;
  }
  return banner.imageUrl;
}

/**
 * Convertit un Banner (admin) en FirebaseBanner (site)
 * @param banner - Banner avec Timestamp
 * @returns FirebaseBanner avec timestamps sérialisés
 */
export function bannerToFirebaseBanner(banner: Banner): FirebaseBanner {
  return {
    ...banner,
    createdAt: banner.createdAt ? {
      seconds: banner.createdAt.seconds,
      nanoseconds: banner.createdAt.nanoseconds
    } : null,
    updatedAt: banner.updatedAt ? {
      seconds: banner.updatedAt.seconds,
      nanoseconds: banner.updatedAt.nanoseconds
    } : null
  };
}

// ===== CONSTANTES SYNCHRONISÉES =====
export const BANNER_IMAGE_RATIOS = {
  desktop: {
    width: 1500,
    height: 350,
    ratio: '1500:350',
    aspectRatio: 'aspect-[1500/350]'
  },
  mobile: {
    width: 1080,
    height: 1350,
    ratio: '4:5',
    aspectRatio: 'aspect-[4/5]'
  }
} as const;

export const BANNER_LIMITS = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  acceptedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  maxBanners: 10
} as const;