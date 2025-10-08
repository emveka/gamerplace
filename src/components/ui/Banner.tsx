// components/ui/Banner.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Types pour le banner
interface FirebaseBanner {
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

interface BannerProps {
  banners: FirebaseBanner[];
  autoplay?: boolean;
  autoplayDelay?: number;
  showDots?: boolean;
  showArrows?: boolean;
  height?: string;
  mobileHeight?: string;
  className?: string;
}

export function Banner({
  banners,
  autoplay = true,
  autoplayDelay = 5000,
  showDots = true,
  showArrows = true,
  height = "h-96",
  mobileHeight = "h-64",
  className = "",
}: BannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoplay);

  // Filtrer les banners actifs et les trier par ordre
  const activeBanners = banners
    .filter((banner: FirebaseBanner) => banner.isActive)
    .sort((a: FirebaseBanner, b: FirebaseBanner) => a.order - b.order);

  // Gestion de l'autoplay
  useEffect(() => {
    if (!isAutoPlaying || activeBanners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
    }, autoplayDelay);

    return () => clearInterval(interval);
  }, [currentSlide, isAutoPlaying, activeBanners.length, autoplayDelay]);

  // Navigation vers slide précédent
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
    setIsAutoPlaying(false);
  };

  // Navigation vers slide suivant
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
    setIsAutoPlaying(false);
  };

  // Navigation vers slide spécifique
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  // Redémarrer l'autoplay après 10 secondes d'inactivité
  const restartAutoplay = () => {
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (!activeBanners || activeBanners.length === 0) {
    return (
      <div className={`${mobileHeight} md:${height} bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center ${className}`}>
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Gamerplace.ma</h2>
          <p className="text-gray-300">Chargement des promotions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${mobileHeight} md:${height} overflow-hidden ${className}`}>
      {/* Container des slides */}
      <div className="relative w-full h-full">
        {activeBanners.map((banner: FirebaseBanner, index: number) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Wrapper avec lien si linkUrl existe */}
            {banner.linkUrl ? (
              <Link href={banner.linkUrl} className="block w-full h-full">
                <div className="relative w-full h-full cursor-pointer group">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.alt || banner.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, 100vw"
                    quality={90}
                  />
                  {/* Overlay au hover */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={banner.imageUrl}
                  alt={banner.alt || banner.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 100vw"
                  quality={90}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Flèches de navigation */}
      {showArrows && activeBanners.length > 1 && (
        <>
          <button
            onClick={() => {
              prevSlide();
              restartAutoplay();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-10"
            aria-label="Banner précédent"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => {
              nextSlide();
              restartAutoplay();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-10"
            aria-label="Banner suivant"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicateurs (dots) */}
      {showDots && activeBanners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {activeBanners.map((_: FirebaseBanner, index: number) => (
            <button
              key={index}
              onClick={() => {
                goToSlide(index);
                restartAutoplay();
              }}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? "bg-yellow-400 scale-125"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Aller au banner ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Indicateur de chargement - SUPPRIMÉ */}
    </div>
  );
}