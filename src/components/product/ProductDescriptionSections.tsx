// components/product/ProductDescriptionSections.tsx
import Image from 'next/image';
import { ProductDescription } from '@/types/product';

interface ProductDescriptionSectionsProps {
  descriptions: ProductDescription[];
  productTitle?: string; // Nouveau prop pour le titre du produit
}

/**
 * Fonction utilitaire pour vérifier si une URL est valide
 * @param url - L'URL à vérifier
 * @returns boolean - true si l'URL est valide, false sinon
 */
const isValidUrl = (url: string): boolean => {
  // Vérifications de base
  if (!url || url.trim() === '') return false;
  
  // Vérifier si c'est un état temporaire d'upload
  if (url === 'pending-upload' || url === 'uploading' || url === 'processing') {
    return false;
  }
  
  try {
    // Tentative de création d'un objet URL
    new URL(url);
    return true;
  } catch {
    // Si l'URL n'est pas valide, URL constructor lance une exception
    return false;
  }
};

/**
 * Fonction utilitaire pour vérifier si c'est un état de chargement
 * @param url - L'URL à vérifier
 * @returns boolean - true si c'est un état de chargement
 */
const isUploadState = (url: string): boolean => {
  const uploadStates = ['pending-upload', 'uploading', 'processing', 'upload-failed'];
  return uploadStates.includes(url);
};

export function ProductDescriptionSections({ descriptions, productTitle }: ProductDescriptionSectionsProps) {
  if (!descriptions || descriptions.length === 0) {
    return null;
  }

  // Trier par ordre
  const sortedDescriptions = [...descriptions].sort((a, b) => a.order - b.order);

  return (
    <div>
      {/* Titre avec le même style que les autres sections */}
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900 border-l-4 border-yellow-500 pl-3 md:pl-4">
        Description du {productTitle || 'produit'}
      </h2>
      
      <div className="space-y-8 md:space-y-12">
        {sortedDescriptions.map((section, index) => (
          <div
            key={section.id}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center ${
              index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
            }`}
          >
            
            {/* Contenu texte */}
            <div className={`space-y-3 md:space-y-4 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-tight">
                {section.title}
              </h3>
              <div 
                className="text-sm md:text-base text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: section.description.replace(/\n/g, '<br>') 
                }}
              />
            </div>

            {/* Section Image avec gestion des états d'upload */}
            <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
              <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 shadow-lg rounded-lg">
                
                {/* Image valide - Affichage normal */}
                {section.imageUrl && isValidUrl(section.imageUrl) && (
                  <Image
                    src={section.imageUrl}
                    alt={section.imageAlt || section.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                )}

                {/* État d'upload en cours */}
                {section.imageUrl && isUploadState(section.imageUrl) && (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4 md:p-6">
                    {/* Spinner d'upload */}
                    <div className="animate-spin rounded-full h-8 md:h-12 w-8 md:w-12 border-b-2 border-blue-500 mb-3 md:mb-4"></div>
                    
                    <p className="text-gray-500 text-xs md:text-sm font-medium">
                      {section.imageUrl === 'pending-upload' && 'Upload en attente...'}
                      {section.imageUrl === 'uploading' && 'Upload en cours...'}
                      {section.imageUrl === 'processing' && 'Traitement en cours...'}
                      {section.imageUrl === 'upload-failed' && 'Échec de l\'upload'}
                    </p>
                    
                    {section.imageUrl === 'upload-failed' && (
                      <button 
                        className="mt-2 text-blue-500 hover:text-blue-700 text-xs md:text-sm underline"
                        onClick={() => {
                          // Ici vous pourriez déclencher une fonction de retry
                          console.log('Retry upload for section:', section.id);
                        }}
                      >
                        Réessayer
                      </button>
                    )}
                  </div>
                )}

                {/* Pas d'image ou URL invalide */}
                {(!section.imageUrl || 
                  (section.imageUrl.trim() !== '' && 
                   !isValidUrl(section.imageUrl) && 
                   !isUploadState(section.imageUrl))) && (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4 md:p-6">
                    {/* Icône placeholder */}
                    <div className="w-12 md:w-16 h-12 md:h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3 md:mb-4">
                      <svg 
                        className="w-6 md:w-8 h-6 md:h-8 text-gray-400" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                        />
                      </svg>
                    </div>
                    
                    <p className="text-gray-400 text-xs md:text-sm">
                      Image non disponible
                    </p>
                    
                    {/* Affichage pour debug en mode développement */}
                    {process.env.NODE_ENV === 'development' && section.imageUrl && (
                      <p className="text-xs text-red-500 mt-2 break-all">
                        URL invalide: {section.imageUrl}
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Overlays décoratifs - seulement si image valide */}
              {section.imageUrl && isValidUrl(section.imageUrl) && (
                <>
                  <div className="absolute -bottom-2 md:-bottom-4 -right-2 md:-right-4 w-16 md:w-24 h-16 md:h-24 bg-blue-500/10 rounded-full blur-xl" />
                  <div className="absolute -top-2 md:-top-4 -left-2 md:-left-4 w-12 md:w-16 h-12 md:h-16 bg-purple-500/10 rounded-full blur-lg" />
                </>
              )}
            </div>
          </div>
        ))}

        {/* Séparateur décoratif */}
        <div className="flex items-center justify-center py-6 md:py-8">
          <div className="flex items-center gap-2">
            <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-blue-500 rounded-full"></div>
            <div className="w-6 md:w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-purple-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}