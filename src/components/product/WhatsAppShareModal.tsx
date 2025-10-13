// components/product/WhatsAppShareModal.tsx
'use client';

import { useState } from 'react';

interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    title: string;
    price: number;
    slug: string;
  };
}

export function WhatsAppShareModal({ isOpen, onClose, product }: WhatsAppShareModalProps) {
  if (!isOpen) return null;

  const productUrl = `${window.location.origin}/products/${product.slug}`;
  
  // Numéro WhatsApp de votre boutique (remplacez par le vrai numéro)
  const shopWhatsApp = "212600000000"; // Format international sans +
  
  const handleShareOffer = () => {
    const message = `Salut ! 👋\n\nRegarde cette offre sur Gamerplace.ma :\n\n🎮 ${product.title}\n💰 ${product.price.toLocaleString()} DH\n\n🔗 ${productUrl}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  const handleContactUs = () => {
    const message = `Salut ! 👋\n\nJ'ai une question concernant ce produit :\n\n🎮 ${product.title}\n💰 ${product.price.toLocaleString()} DH\n🔗 ${productUrl}\n\nMa question : `;
    
    const whatsappUrl = `https://wa.me/${shopWhatsApp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Partager via WhatsApp
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          
          {/* Option 1: Partager l'offre */}
          <button
            onClick={handleShareOffer}
            className="w-full flex items-center gap-3 p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all group"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-gray-900 group-hover:text-green-700">
                Envoyer cette offre
              </div>
              <div className="text-sm text-gray-600">
                Partager le produit avec vos amis
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Option 2: Nous contacter */}
          <button
            onClick={handleContactUs}
            className="w-full flex items-center gap-3 p-4 border-2 border-yellow-200 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 transition-all group"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-gray-900 group-hover:text-yellow-700">
                Nous envoyer un message
              </div>
              <div className="text-sm text-gray-600">
                Poser une question sur ce produit
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 rounded-b-lg">
          <p className="text-xs text-gray-500 text-center">
            Vous serez redirigé vers WhatsApp
          </p>
        </div>
      </div>
    </div>
  );
}