// components/product/ProductDescriptionSections.tsx
import Image from 'next/image';
import { ProductDescription } from '@/types/product';

interface ProductDescriptionSectionsProps {
  descriptions: ProductDescription[];
}

export function ProductDescriptionSections({ descriptions }: ProductDescriptionSectionsProps) {
  if (!descriptions || descriptions.length === 0) {
    return null;
  }

  // Trier par ordre
  const sortedDescriptions = [...descriptions].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Découvrez les détails
        </h2>
        <p className="text-gray-600">
          Explorez les caractéristiques et spécifications de ce produit
        </p>
      </div>

      {sortedDescriptions.map((section, index) => (
        <div
          key={section.id}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
            index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
          }`}
        >
          
          {/* Contenu texte */}
          <div className={`space-y-4 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
            <h3 className="text-2xl font-bold text-gray-900 leading-tight">
              {section.title}
            </h3>
            <div 
              className="prose prose-gray max-w-none text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: section.description.replace(/\n/g, '<br>') 
              }}
            />
          </div>

          {/* Image - CORRIGÉ: Vérification src */}
          {section.imageUrl && section.imageUrl.trim() !== '' ? (
            <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
              <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 shadow-lg">
                <Image
                  src={section.imageUrl}
                  alt={section.imageAlt || section.title}
                  fill
                  className="object-cover transition-transform duration-500"
                />
              </div>
              
              {/* Overlay décoratif */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl" />
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-purple-500/10 rounded-full blur-lg" />
            </div>
          ) : (
            // Placeholder si pas d'image
            <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
              <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 shadow-lg">
                <span className="text-gray-400">Image non disponible</span>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Séparateur décoratif */}
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}