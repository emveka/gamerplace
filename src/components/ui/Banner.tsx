// components/ui/Banner.tsx - Avec support pour mobileAlt
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { getBannerAltText, getBannerImageUrl } from "@/types/banners";

interface FirebaseBanner {
  id: string;
  title: string;
  alt: string;
  mobileAlt?: string;          // ✅ Ajouté : Alt text pour mobile
  imageUrl: string;           // Desktop : 1500x350 (ratio 4.29:1)
  mobileImageUrl?: string;    // Mobile : 1080x1350 (ratio 4:5)
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
  mobileAutoplayDelay?: number;
  showDots?: boolean;
  showArrows?: boolean;
  showMobileDots?: boolean;
  mobileDotsSize?: 'small' | 'medium' | 'large';
  showProgressBar?: boolean;
  className?: string;
  debug?: boolean;
  maxHeightDesktop?: string;
}

export function Banner({
  banners,
  autoplay = true,
  autoplayDelay = 5000,
  mobileAutoplayDelay = 3500,
  showDots = true,
  showArrows = true,
  showMobileDots = false,
  mobileDotsSize = 'small',
  showProgressBar = true,
  className = "",
  debug = false,
  maxHeightDesktop = "max-h-96",
}: BannerProps) {
  // ===== ÉTATS =====
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoplay);
  const [isMobile, setIsMobile] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // États pour la gestion du swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const autoplayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ===== DÉTECTION MOBILE =====
  useEffect(() => {
    setIsHydrated(true);
    
    const checkMobile = () => {
      if (typeof window === 'undefined') return;
      
      const newIsMobile = window.innerWidth < 768;
      
      if (debug && newIsMobile !== isMobile) {
        console.log(`📱 Mode changé: ${newIsMobile ? 'Mobile' : 'Desktop'} (${window.innerWidth}px)`);
        console.log(`🎯 Dots mobile: ${showMobileDots ? 'Activés' : 'Désactivés'}`);
        console.log(`📊 Barre progression: ${showProgressBar ? 'Activée' : 'Désactivée'}`);
      }
      
      setIsMobile(newIsMobile);
    };
    
    checkMobile();
    
    if (typeof window !== 'undefined') {
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, [debug, isMobile, showMobileDots, showProgressBar]);

  // ===== FILTRAGE ET TRI DES BANNERS =====
  const activeBanners = banners
    .filter((banner: FirebaseBanner) => banner.isActive)
    .sort((a: FirebaseBanner, b: FirebaseBanner) => a.order - b.order);

  // ===== DEBUG INFO =====
  useEffect(() => {
    if (debug) {
      console.log('🖼️ Banners actifs:', activeBanners.length);
      console.log('📱 Configuration mobile:', {
        showMobileDots,
        mobileDotsSize,
        showProgressBar
      });
    }
  }, [activeBanners, debug, showMobileDots, mobileDotsSize, showProgressBar]);

  // ===== DÉLAI D'AUTOPLAY DYNAMIQUE =====
  const currentDelay = isMobile ? mobileAutoplayDelay : autoplayDelay;

  // ===== GESTION DE L'AUTOPLAY =====
  useEffect(() => {
    if (!isAutoPlaying || activeBanners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
    }, currentDelay);

    return () => clearInterval(interval);
  }, [currentSlide, isAutoPlaying, activeBanners.length, currentDelay]);

  // ===== FONCTIONS DE NAVIGATION =====
  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
    pauseAutoplay();
  }, [activeBanners.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
    pauseAutoplay();
  }, [activeBanners.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    pauseAutoplay();
  }, []);

  const pauseAutoplay = useCallback(() => {
    setIsAutoPlaying(false);
    
    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current);
    }
    
    autoplayTimeoutRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 10000);
  }, []);

  useEffect(() => {
    return () => {
      if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current);
      }
    };
  }, []);

  // ===== GESTION DES SWIPES =====
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    pauseAutoplay();
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  // ===== CALCUL DES CLASSES CSS POUR LES RATIOS EXACTS =====
  const containerClasses = isHydrated 
    ? (isMobile 
        ? "aspect-[4/5] w-full"
        : `aspect-[1500/350] w-full ${maxHeightDesktop}`)
    : `aspect-[4/5] md:aspect-[1500/350] w-full md:${maxHeightDesktop}`;

  // ===== CLASSES POUR LES DOTS MOBILE =====
  const getMobileDotsClasses = () => {
    switch (mobileDotsSize) {
      case 'small':
        return {
          container: 'w-8 h-8 flex items-center justify-center',
          dot: 'w-2 h-2'
        };
      case 'medium':
        return {
          container: 'w-10 h-10 flex items-center justify-center',
          dot: 'w-2.5 h-2.5'
        };
      case 'large':
        return {
          container: 'w-11 h-11 flex items-center justify-center',
          dot: 'w-3 h-3'
        };
    }
  };

  const mobileDotsClasses = getMobileDotsClasses();

  // ===== RENDU SI PAS DE BANNERS =====
  if (!activeBanners || activeBanners.length === 0) {
    return (
      <div className={`${containerClasses} bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden ${className}`}>
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Gamerplace.ma</h2>
          <p className="text-gray-300">Chargement des promotions...</p>
        </div>
      </div>
    );
  }

  // ===== RENDU PRINCIPAL =====
  return (
    <div 
      className={`relative ${containerClasses} overflow-hidden bg-black ${className}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Debug Panel */}
      {debug && (
        <div className="absolute top-2 left-2 bg-black/90 text-white p-3 rounded text-xs z-50 max-w-xs">
          <div className="font-semibold text-yellow-400 mb-1">🛠 Debug Info</div>
          <div>Mode: {isMobile ? 'Mobile' : 'Desktop'}</div>
          <div>Largeur: {isHydrated && typeof window !== 'undefined' ? window.innerWidth : 'SSR'}px</div>
          <div className="text-blue-300">
            Ratio: {isMobile ? '4:5 (1080:1350)' : '1500:350 (4.29:1)'}
          </div>
          <div>Dots mobile: {showMobileDots && isMobile ? '✅' : '❌'}</div>
          <div>Progress bar: {showProgressBar ? '✅' : '❌'}</div>
          <div>Slide: {currentSlide + 1}/{activeBanners.length}</div>
        </div>
      )}

      {/* Container des slides */}
      <div className="relative w-full h-full">
        {activeBanners.map((banner: FirebaseBanner, index: number) => {
          
          // Lazy loading intelligent
          const shouldLoad = 
            index === currentSlide || 
            index === (currentSlide + 1) % activeBanners.length ||
            index === (currentSlide - 1 + activeBanners.length) % activeBanners.length;
          
          // ✅ Utilisation des fonctions helpers pour image et alt
          const imageUrl = getBannerImageUrl(banner, isHydrated && isMobile);
          const altText = getBannerAltText(banner, isHydrated && isMobile);
          
          const imageQuality = isMobile ? 75 : 90;

          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {banner.linkUrl ? (
                <Link href={banner.linkUrl} className="block w-full h-full">
                  <div className="relative w-full h-full cursor-pointer group">
                    {shouldLoad && (
                      <Image
                        src={imageUrl}
                        alt={altText}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, 100vw"
                        quality={imageQuality}
                      />
                    )}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block" />
                  </div>
                </Link>
              ) : (
                <div className="relative w-full h-full">
                  {shouldLoad && (
                    <Image
                      src={imageUrl}
                      alt={altText}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, 100vw"
                      quality={imageQuality}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Flèches de navigation (Desktop uniquement) */}
      {showArrows && activeBanners.length > 1 && !isMobile && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-yellow-500 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-20"
            aria-label="Banner précédent"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-yellow-500 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-20"
            aria-label="Banner suivant"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* ===== INDICATEURS (DOTS) ===== */}
      {showDots && activeBanners.length > 1 && (
        <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {/* Desktop : toujours afficher les dots normaux */}
          {!isMobile && activeBanners.map((_: FirebaseBanner, index: number) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`
                w-3 h-3 transition-all duration-200 rounded-full
                ${index === currentSlide
                  ? "bg-yellow-400 scale-110" 
                  : "bg-white/60 hover:bg-white/90"
                }
              `}
              aria-label={`Aller au banner ${index + 1}`}
            />
          ))}
          
          {/* Mobile : afficher les dots seulement si showMobileDots est true */}
          {isMobile && showMobileDots && activeBanners.map((_: FirebaseBanner, index: number) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`
                ${mobileDotsClasses.container} transition-all duration-200 rounded-full
                ${index === currentSlide
                  ? "bg-yellow-400/20 scale-110" 
                  : "bg-white/10 hover:bg-white/20"
                }
              `}
              aria-label={`Aller au banner ${index + 1}`}
            >
              <span className={`
                ${mobileDotsClasses.dot} rounded-full transition-all duration-200
                ${index === currentSlide ? "bg-yellow-400" : "bg-white/80"}
              `} />
            </button>
          ))}
        </div>
      )}

      {/* ===== BARRE DE PROGRESSION ===== */}
      {showProgressBar && activeBanners.length > 1 && (
        <div className="absolute top-0 left-0 right-0 z-20">
          {/* Version mobile : barre plus visible */}
          {isMobile ? (
            <div className="h-1.5 bg-black/30 backdrop-blur-sm">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all ease-out shadow-sm"
                style={{
                  width: `${((currentSlide + 1) / activeBanners.length) * 100}%`,
                  transition: 'width 0.3s ease-out'
                }}
              />
            </div>
          ) : (
            // Version desktop : barre discrète
            <div className="h-1 bg-white/20">
              <div 
                className="h-full bg-yellow-400 transition-all ease-out"
                style={{
                  width: `${((currentSlide + 1) / activeBanners.length) * 100}%`,
                  transition: 'width 0.3s ease-out'
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* ===== INDICATEUR "GLISSER" (PREMIER AFFICHAGE MOBILE) ===== */}
      {isMobile && activeBanners.length > 1 && currentSlide === 0 && !showMobileDots && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-6 pointer-events-none z-15 animate-pulse">
          <div className="flex items-center gap-2 bg-black/70 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span className="text-white text-xs font-medium">Glisser pour naviguer</span>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      )}

      {/* ===== COMPTEUR DISCRET (ALTERNATIVE AUX DOTS) ===== */}
      {isMobile && !showMobileDots && !showProgressBar && activeBanners.length > 1 && (
        <div className="absolute bottom-3 right-3 z-20">
          <div className="bg-black/60 px-2 py-1 rounded-full backdrop-blur-sm">
            <span className="text-white text-xs font-medium">
              {currentSlide + 1} / {activeBanners.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}