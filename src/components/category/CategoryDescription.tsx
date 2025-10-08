// src/components/category/CategoryDescription.tsx
import { Category } from '@/types/category';

interface CategoryDescriptionProps {
  category: Category;
}

// Fonction pour formater le texte avec les marqueurs **texte**
function formatTextWithBold(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={index} className="font-bold text-black">
          {boldText}
        </strong>
      );
    }
    return part;
  });
}

export function CategoryDescription({ category }: CategoryDescriptionProps) {
  if (!category.descriptionLongue && (!category.keywords || category.keywords.length === 0)) {
    return null;
  }

  return (
    <>
      {/* Description longue - Section indépendante */}
      {category.descriptionLongue && (
        <div 
          className="text-gray-600 text-justify text-sm leading-relaxed  sm:text-base mb-8"
          itemProp="text"
          itemScope 
          itemType="https://schema.org/AboutPage"
        >
          <h2 className="text-2xl font-bold text-gray-900  mb-6">
            {category.name}
          </h2>
          <div className="text-sm whitespace-pre-line">
            {formatTextWithBold(category.descriptionLongue)}
          </div>
        </div>
      )}

      {/* SEO Keywords - Section indépendante */}
      {category.keywords && category.keywords.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            Mots-clés associés :
          </h3>
          <div className="flex flex-wrap gap-2" role="list" aria-label="Mots-clés de la catégorie">
            {category.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-colors"
                role="listitem"
                itemProp="keywords"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Hidden structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CategoryPage",
            "name": category.name,
            "description": category.description,
            "url": `https://gamerplace.ma/categories/${category.slug}`,
            "mainEntity": {
              "@type": "ItemList",
              "name": `Produits ${category.name}`,
              "description": category.description,
              "numberOfItems": "products.length", // Will be replaced dynamically
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Accueil",
                  "item": "https://gamerplace.ma"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Catégories",
                  "item": "https://gamerplace.ma/categories"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": category.name,
                  "item": `https://gamerplace.ma/categories/${category.slug}`
                }
              ]
            }
          })
        }}
      />
    </>
  );
}
