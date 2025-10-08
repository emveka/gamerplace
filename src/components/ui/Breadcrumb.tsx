// src/components/ui/Breadcrumb.tsx - Version avec 2 niveaux maximum
import Link from 'next/link';

interface BreadcrumbItem {
  href: string;
  label: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  if (!items || items.length === 0) {
    return null;
  }

  // Filtrer pour enlever "Produits"
  const filteredItems = items.filter(item => 
    item.label.toLowerCase() !== 'produits'
  );

  if (filteredItems.length === 0) {
    return null;
  }

  // Garder Accueil + les 4 derniers éléments maximum (dont la page actuelle)
  let displayItems: BreadcrumbItem[] = [];
  
  // Trouver l'index de "Accueil"
  const accueilIndex = filteredItems.findIndex(item => 
    item.label.toLowerCase() === 'accueil'
  );

  if (accueilIndex !== -1) {
    displayItems.push(filteredItems[accueilIndex]);
  }

  // Prendre les 4 derniers éléments (en excluant Accueil s'il est déjà ajouté)
  const remainingItems = filteredItems.filter(item => 
    item.label.toLowerCase() !== 'accueil'
  );
  
  // Prendre maximum les 4 derniers éléments
  const lastFourItems = remainingItems.slice(-4);
  displayItems = [...displayItems, ...lastFourItems];

  if (displayItems.length === 0) {
    return null;
  }

  return (
    <nav className="mb-4" aria-label="Breadcrumb">
      <ol 
        className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 overflow-hidden"
        itemScope 
        itemType="https://schema.org/BreadcrumbList"
      >
        {displayItems.map((item, index) => (
          <li 
            key={`${item.href}-${index}`}
            className="flex items-center whitespace-nowrap"
            itemScope 
            itemType="https://schema.org/ListItem"
            itemProp="itemListElement"
          >
            {index > 0 && <span className="mr-1 sm:mr-2 text-gray-400 text-xs">/</span>}
            {item.current ? (
              <span 
                className="text-gray-900 font-medium truncate max-w-[120px] sm:max-w-none"
                itemProp="name"
                aria-current="page"
                title={item.label}
              >
                {item.label}
              </span>
            ) : (
              <Link 
                href={item.href}
                className="hover:text-gray-900 transition-colors truncate max-w-[100px] sm:max-w-none"
                itemProp="item"
                title={item.label}
              >
                <span itemProp="name">{item.label}</span>
              </Link>
            )}
            <meta itemProp="position" content={String(index + 1)} />
          </li>
        ))}
      </ol>
    </nav>
  );
}