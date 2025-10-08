// src/components/category/CategoryHeader.tsx - Version responsive réduite de 20%
import Image from 'next/image';
import { Category } from '@/types/category';

interface CategoryHeaderProps {
  category: Category;
}

// Fonction pour formater le texte avec les marqueurs **texte**
function formatTextWithBoldHeader(text: string) {
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

export function CategoryHeader({ category }: CategoryHeaderProps) {
  if (category.imageUrl) {
    return (
      <header className="mb-3 lg:mb-5">
        <div className="relative h-24 sm:h-32 lg:h-40 mb-3 overflow-hidden rounded-lg lg:rounded-none">
          <Image
            src={category.imageUrl}
            alt={`Catégorie ${category.name}`}
            fill
            className="object-cover"
            priority
            quality={90}
            sizes="(max-width: 768px) 100vw, (max-width: 1500px) 100vw, 1500px"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
            <div className="p-2.5 sm:p-3 lg:p-5 w-full">
              <div className="flex items-center gap-1.5 lg:gap-2.5">
                <div className="w-0.5 sm:w-1 h-5 sm:h-6 lg:h-7 bg-yellow-500 flex-shrink-0"></div>
                <h1 
                  className="text-base sm:text-lg lg:text-2xl font-bold text-white drop-shadow-lg"
                  itemProp="name"
                >
                  {category.name}
                </h1>
              </div>
              {category.description && (
                <div className="text-white/90 mt-1.5 drop-shadow max-w-full lg:max-w-4xl ml-2 sm:ml-3 lg:ml-4 leading-relaxed text-[10px] sm:text-xs lg:text-sm">
                  {formatTextWithBoldHeader(category.description)}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="mb-3 lg:mb-3">
      <div className="flex items-center gap-1.5 lg:gap-2.5 mb-2.5 lg:mb-3">
        <div className="w-0.5 sm:w-1 h-5 sm:h-6 lg:h-7 bg-yellow-500 flex-shrink-0"></div>
        <h1 
          className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900"
          itemProp="name"
        >
          {category.name}
        </h1>
      </div>
      
      {category.description && (
        <div className="ml-2 sm:ml-3 lg:ml-4">
          <div className="text-gray-600 leading-relaxed text-justify max-w-full lg:max-w-6xl text-[10px] sm:text-xs lg:text-sm">
            {formatTextWithBoldHeader(category.description)}
          </div>
        </div>
      )}
    </header>
  );
}