// components/product/ProductVideoPlayer.tsx
'use client';

import { useState } from 'react';

interface ProductVideoPlayerProps {
  videoUrl?: string; // Rendre optionnel
  productTitle: string;
}

export function ProductVideoPlayer({ videoUrl, productTitle }: ProductVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Extraire l'ID de la vidéo YouTube
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = videoUrl ? getYouTubeVideoId(videoUrl) : null;
  const hasValidVideo = videoId !== null;

  const thumbnailUrl = hasValidVideo ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '/images/video-placeholder.jpg';
  const embedUrl = hasValidVideo ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : '';

  const openModal = () => {
    if (hasValidVideo) {
      setShowModal(true);
      setIsPlaying(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setIsPlaying(false);
  };

  return (
    <>
      <div className="space-y-2">
        

        {/* Aperçu de la vidéo */}
        <div className="relative max-w-4xl mx-auto">
          <div 
            className={`relative aspect-video bg-gray-100 l overflow-hidden shadow-lg ${hasValidVideo ? 'cursor-pointer group' : 'cursor-not-allowed'}`}
            onClick={hasValidVideo ? openModal : undefined}
          >
            {hasValidVideo ? (
              <>
                <img
                  src={thumbnailUrl}
                  alt={`Vidéo de présentation - ${productTitle}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Overlay avec bouton play */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-6 group-hover:scale-110 transition-transform shadow-xl">
                    <svg className="w-12 h-12 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>

                {/* Badge "Vidéo" */}
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Vidéo
                </div>
              </>
            ) : (
              /* Placeholder pour absence de vidéo */
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <div className="text-center space-y-4">
                  <div className="bg-gray-300 rounded-full p-8 mx-auto w-24 h-24 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Aucune vidéo disponible</p>
                    <p className="text-gray-500 text-sm">Une vidéo sera bientôt ajoutée pour ce produit</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal avec vidéo */}
      {showModal && hasValidVideo && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl aspect-video">
            {/* Bouton fermer */}
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Iframe YouTube */}
            <iframe
              src={embedUrl}
              title={`Vidéo de présentation - ${productTitle}`}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}