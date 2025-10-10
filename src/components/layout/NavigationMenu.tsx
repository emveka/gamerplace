"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

// Types pour les éléments du menu
type SubMenuItem = {
  label: string;
  href: string;
};

// Type mis à jour pour inclure titleHref
type MenuCategory = {
  title: string;
  titleHref?: string; // Nouveau champ optionnel
  items: SubMenuItem[];
};

type MenuItem = {
  label: string;
  href: string;
  isSpecial?: boolean;
  specialColor?: string;
  hasMegaMenu?: boolean;
  megaMenuCategories?: MenuCategory[];
  megaMenuImage?: {
    src: string;
    alt: string;
    title: string;
    subtitle: string;
  };
};

// Configuration des mega menus pour vos catégories gaming
// SECTION PC GAMERS - Liens adaptés au format /categories/slug
const pcGamersMenu: MenuCategory[] = [
  {
    title: "PC Gamer AMD",
    titleHref: "/categories/pc-gamer-amd", // Lien principal pour la catégorie AMD
    items: [
      { label: "PC Gamer AMD Ryzen 3", href: "/categories/pc-gamer-amd-ryzen-3" },
      { label: "PC Gamer AMD Ryzen 5", href: "/categories/pc-gamer-amd-ryzen-5" },
      { label: "PC Gamer AMD Ryzen 7", href: "/categories/pc-gamer-amd-ryzen-7" },
      { label: "PC Gamer AMD Ryzen 9", href: "/categories/pc-gamer-amd-ryzen-9" },
    ]
  },
  {
    title: "PC Gamer INTEL",
    titleHref: "/categories/pc-gamer-intel", // Lien principal pour la catégorie Intel
    items: [
      { label: "PC GAMER INTEL Core i3", href: "/categories/pc-gamer-intel-core-i3" },
      { label: "PC GAMER INTEL Core i5", href: "/categories/pc-gamer-intel-core-i5" },
      { label: "PC GAMER INTEL Core i7", href: "/categories/pc-gamer-intel-core-i7" },
      { label: "PC GAMER INTEL Core i9", href: "/categories/pc-gamer-intel-core-i9" },
    ]
  },
  {
    title: "PC Gamer PRO",
    titleHref: "/categories/pc-gamer-professionnel", // Lien principal pour la catégorie Pro
    items: [
      { label: "PC GAMER IA", href: "/categories/pc-gamer-ia" }, // Corrigé "Ia" en "IA"
      { label: "PC GAMER Architects", href: "/categories/pc-gamer-architectes" },
      { label: "PC GAMER Streamers", href: "/categories/pc-gamer-streamers" },
      { label: "PC GAMER Designers", href: "/categories/pc-gamer-designers" },
      { label: "PC GAMER Business", href: "/categories/pc-gamer-business" },
      { label: "PC GAMER Developers", href: "/categories/pc-gamer-developpeurs" },
    ]
  }
];

// SECTION KIT EVO GAMERS - Tous les liens adaptés au format /categories/slug
const kitevoGamersMenu: MenuCategory[] = [
  {
    title: "Packs Composants",
    titleHref: "/categories/packs-composants", // Nouveau lien principal
    items: [
      { label: "CPU/CM", href: "/categories/pack-cpu-carte-mere" },
      { label: "CPU/CM/RAM", href: "/categories/pack-cpu-carte-mere-ram" },
      { label: "CPU/CM/Boitier", href: "/categories/pack-cpu-carte-mere-boitier" },
      { label: "Boitier/Alimentation", href: "/categories/pack-boitier-alimentation" },
      { label: "Pack RGB", href: "/categories/pack-rgb" },
    ]
  },
  {
    title: "Packs Périphériques",
    titleHref: "/categories/packs-peripheriques", // Nouveau lien principal
    items: [
      { label: "Souris/Tapis", href: "/categories/pack-souris-tapis" },
      { label: "Souris/Clavier", href: "/categories/pack-souris-clavier" },
      { label: "Ecrans/autres", href: "/categories/pack-ecrans-accessoires" },
      { label: "Pack Périphériques", href: "/categories/pack-peripheriques-complet" },
    ]
  },
  {
    title: "Nos Packs Gamers",
    titleHref: "/categories/packs-gamers-specialises", // Nouveau lien principal
    items: [
      { label: "Pack for Streaming", href: "/categories/pack-streaming" },
      { label: "Pack for Mobilier", href: "/categories/pack-mobilier-gaming" },
      { label: "Pack for Designers", href: "/categories/pack-designers" },
      { label: "Pack for Business", href: "/categories/pack-business" },
    ]
  },
];

// SECTION LAPTOP GAMERS - Tous les liens adaptés au format /categories/slug
const laptopGamersMenu: MenuCategory[] = [
  {
    title: "Laptops",
    titleHref: "/categories/laptops-gaming", // Nouveau lien principal
    items: [
      { label: "Laptops AMD", href: "/categories/laptops-amd" },
      { label: "Laptops INTEL", href: "/categories/laptops-intel" },
    ]
  },
  {
    title: "Accessoires",
    titleHref: "/categories/accessoires-laptop", // Nouveau lien principal
    items: [
      { label: "Refroidisseurs", href: "/categories/refroidisseurs-laptop" },
      { label: "Sacs Gaming", href: "/categories/sacs-gaming-laptop" },
      { label: "Supports", href: "/categories/supports-laptop" },
    ]
  },
  {
    title: "Marques",
    titleHref: "/categories/marques-laptop", // Nouveau lien principal
    items: [
      { label: "ASUS ROG", href: "/categories/laptop-asus-rog" },
      { label: "MSI Gaming", href: "/categories/laptop-msi-gaming" },
      { label: "Alienware", href: "/categories/laptop-alienware" },
      { label: "Razer Blade", href: "/categories/laptop-razer-blade" },
      { label: "HP Omen", href: "/categories/laptop-hp-omen" },
    ]
  }
];

// SECTION COMPOSANTS - Liens adaptés et organisés
const composantsMenu: MenuCategory[] = [
  {
    title: "Cartes Graphiques",
    titleHref: "/categories/cartes-graphiques", // Nouveau lien principal
    items: [
      { label: "NVIDIA GeForce", href: "/categories/nvidia-geforce" }, // Déjà correct
      { label: "AMD Radeon", href: "/categories/amd-radeon" }, // Déjà correct
    ]
  },
  {
    title: "Processeurs",
    titleHref: "/categories/processeurs", // Nouveau lien principal
    items: [
      { label: "Processeurs INTEL Core", href: "/categories/processeurs-intel-core" },
      { label: "Processeurs AMD Ryzen", href: "/categories/processeurs-amd-ryzen" },
    ]
  },
  {
    title: "Cartes Mères",
    titleHref: "/categories/cartes-meres", // Nouveau lien principal
    items: [
      { label: "Cartes mère INTEL", href: "/categories/cartes-meres-intel" },
      { label: "Cartes mère AMD", href: "/categories/cartes-meres-amd" },
    ]
  },
  {
    title: "Stockage Disques",
    titleHref: "/categories/stockage", // Nouveau lien principal
    items: [
      { label: "SSD NVMe", href: "/categories/ssd-nvme" },
      { label: "SSD SATA", href: "/categories/ssd-sata" },
      { label: "Disques durs HDD", href: "/categories/disques-durs-hdd" },
    ]
  },
  {
    title: "Boitiers",
    titleHref: "/categories/boitiers", // Nouveau lien principal
    items: [
      { label: "Boitiers avec RGB", href: "/categories/boitiers-rgb" },
      { label: "Boitiers sans RGB", href: "/categories/boitiers-classiques" },
    ]
  },
  {
    title: "Mémoire RAM",
    titleHref: "/categories/memoire-ram", // Nouveau lien principal
    items: [
      { label: "RAM DDR5", href: "/categories/ram-ddr5" }, // Déjà correct
      { label: "RAM DDR4", href: "/categories/ram-ddr4" }, // Déjà correct
    ]
  },
  {
    title: "Alimentation",
    titleHref: "/categories/alimentations", // Nouveau lien principal
    items: [
      { label: "Alimentations Modulaires", href: "/categories/alimentations-modulaires" },
      { label: "Alimentations Standards", href: "/categories/alimentations-standards" },
    ]
  },
  {
    title: "Refroidissement",
    titleHref: "/categories/refroidissement", // Nouveau lien principal
    items: [
      { label: "AirCooling", href: "/categories/refroidissement-air" },
      { label: "WaterCooling", href: "/categories/refroidissement-liquide" },
    ]
  },
];

// SECTION PERIPHERIQUES - Tous les liens adaptés au format /categories/slug
const peripheriquesMenu: MenuCategory[] = [
  {
    title: "Mobilier Gaming",
    titleHref: "/categories/mobilier-gaming", // Nouveau lien principal
    items: [
      { label: "Chaises Gamer", href: "/categories/chaises-gamer" },
      { label: "Bureaux Gamer", href: "/categories/bureaux-gamer" },
      { label: "Tapis de Sol Gamer", href: "/categories/tapis-sol-gamer" },
    ]
  },
  {
    title: "Souris",
    titleHref: "/categories/souris", // Nouveau lien principal
    items: [
      { label: "Souris Professionnelles", href: "/categories/souris-professionnelles" },
      { label: "Souris Gamer", href: "/categories/souris-gamer" },
      { label: "Tapis de Souris", href: "/categories/tapis-souris" },
    ]
  },
  {
    title: "Claviers",
    titleHref: "/categories/claviers", // Nouveau lien principal
    items: [
      { label: "Claviers Professionnels", href: "/categories/claviers-professionnels" },
      { label: "Claviers Gamers", href: "/categories/claviers-gamer" },
    ]
  },
  {
    title: "Audio",
    titleHref: "/categories/audio", // Nouveau lien principal
    items: [
      { label: "Casques Gamer", href: "/categories/casques-gamer" },
      { label: "Haut-Parleurs", href: "/categories/haut-parleurs" },
      { label: "Microphones", href: "/categories/microphones" },
    ]
  },
  {
    title: "Streaming",
    titleHref: "/categories/streaming", // Nouveau lien principal
    items: [
      { label: "Cartes Vidéos Streaming", href: "/categories/cartes-videos-streaming" },
      { label: "Cartes Son", href: "/categories/cartes-son" },
      { label: "Déco Streaming", href: "/categories/decoration-streaming" },
      { label: "Accessoires Streaming", href: "/categories/accessoires-streaming" },
    ]
  },
  {
    title: "Ecrans Moniteurs",
    titleHref: "/categories/moniteurs", // Nouveau lien principal
    items: [
      { label: "Moniteurs Gaming", href: "/categories/moniteurs-gaming" },
      { label: "Accessoires Ecrans", href: "/categories/accessoires-moniteurs" },
    ]
  },
];

// SECTION CONSOLES - Tous les liens adaptés au format /categories/slug
const consolesMenu: MenuCategory[] = [
  {
    title: "Consoles",
    titleHref: "/categories/consoles", // Nouveau lien principal
    items: [
      { label: "PlayStation 5", href: "/categories/playstation-5" },
      { label: "Xbox", href: "/categories/xbox" },
      { label: "Nintendo", href: "/categories/nintendo" },
      { label: "Jeux Vidéos", href: "/categories/jeux-videos" },
      { label: "Accessoires Consoles", href: "/categories/accessoires-consoles" },
    ]
  },
  {
    title: "Rétro Gaming",
    titleHref: "/categories/retro-gaming", // Nouveau lien principal
    items: [
      { label: "Consoles Rétro Gaming", href: "/categories/consoles-retro" },
      { label: "Jeux Rétro", href: "/categories/jeux-retro" },
      { label: "Accessoires Rétro Gaming", href: "/categories/accessoires-retro" },
    ]
  },
  {
    title: "Arcades",
    titleHref: "/categories/arcades", // Nouveau lien principal
    items: [
      { label: "Bornes Arcade", href: "/categories/bornes-arcade" },
      { label: "Bartop", href: "/categories/bartop" },
    ]
  }
];

// Configuration du menu principal avec vos vraies catégories
// Les liens principaux sont également adaptés au format /categories/slug
const menuItems: MenuItem[] = [
  {
    label: "PC GAMERS",
    href: "/categories/pc-gamer", // Lien principal adapté
    hasMegaMenu: true,
    megaMenuCategories: pcGamersMenu,
    megaMenuImage: {
      src: "/images/pc-gaming-promo.webp",
      alt: "PC Gaming",
      title: "PC Gaming",
      subtitle: "Haute Performance"
    }
  },

  {
    label: "COMPOSANTS",
    href: "/categories/composants", // Lien principal adapté
    hasMegaMenu: true,
    megaMenuCategories: composantsMenu,
    megaMenuImage: {
      src: "/images/computer-cover.webp",
      alt: "Composants PC",
      title: "Composants",
      subtitle: "PC Gaming"
    }
  },
  {
    label: "PACK GAMERS",
    href: "/categories/kit-evo-gamers", // Lien principal adapté
    hasMegaMenu: true,
    megaMenuCategories: kitevoGamersMenu,
    megaMenuImage: {
      src: "/images/setup-gaming-promo.jpg",
      alt: "Setup Gaming",
      title: "Setup",
      subtitle: "Gaming"
    }
  },
  {
    label: "LAPTOP GAMERS",
    href: "/categories/laptop-gamers", // Lien principal adapté
    hasMegaMenu: true,
    megaMenuCategories: laptopGamersMenu,
    megaMenuImage: {
      src: "/images/laptop-gaming-promo.jpg",
      alt: "Laptop Gaming",
      title: "Laptops",
      subtitle: "Gaming"
    }
  },
  
  {
    label: "PERIPHERIQUES",
    href: "/categories/peripheriques", // Lien principal adapté
    hasMegaMenu: true,
    megaMenuCategories: peripheriquesMenu,
    megaMenuImage: {
      src: "/images/test-7.webp",
      alt: "Périphériques Gaming",
      title: "Périphériques",
      subtitle: "Gaming"
    }
  },
  
  {
    label: "CONSOLES",
    href: "/categories/consoles", // Lien principal adapté
    hasMegaMenu: true,
    megaMenuCategories: consolesMenu,
    megaMenuImage: {
      src: "/images/consoles-promo.jpg",
      alt: "Consoles Gaming",
      title: "Consoles",
      subtitle: "Next-Gen"
    }
  },
  {
    label: "NEW ARRIVALS",
    href: "/categories/nouveautes", // Lien adapté même pour les spéciaux
    isSpecial: true,
    specialColor: "#ff6b6b",
  },
  {
    label: "PROMOTIONS",
    href: "/categories/promotions", // Lien adapté même pour les spéciaux
    isSpecial: true,
    specialColor: "#e74c3c",
  },
];

// Configuration des marques - Images statiques optimisées
// Liens marques également adaptés au format /categories/marque-nom
const brands = [
  { 
    name: "Intel", 
    logo: "/brands/intel-logo.png",
    href: "/categories/marque-intel", // Lien adapté
    slug: "intel"
  },
  { 
    name: "NVIDIA", 
    logo: "/brands/nvidia-logo.png",
    href: "/categories/marque-nvidia", // Lien adapté
    slug: "nvidia"
  },
  { 
    name: "AMD", 
    logo: "/brands/amd-logo.png",
    href: "/categories/marque-amd", // Lien adapté
    slug: "amd"
  },
  { 
    name: "ASUS", 
    logo: "/brands/asus-logo.png",
    href: "/categories/marque-asus", // Lien adapté
    slug: "asus"
  },
  { 
    name: "MSI", 
    logo: "/brands/msi-logo.png",
    href: "/categories/marque-msi", // Lien adapté
    slug: "msi"
  },
  { 
    name: "Corsair", 
    logo: "/brands/corsair-logo.png",
    href: "/categories/marque-corsair", // Lien adapté
    slug: "corsair"
  },
  { 
    name: "Razer", 
    logo: "/brands/razer-logo.png",
    href: "/categories/marque-razer", // Lien adapté
    slug: "razer"
  },
  { 
    name: "Logitech", 
    logo: "/brands/logitech-logo.png",
    href: "/categories/marque-logitech", // Lien adapté
    slug: "logitech"
  },
];

export function NavigationMenu() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  
  // Refs pour gérer les timeouts et éviter les fuites mémoire
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Gestion du scroll - Ferme le mega menu lors du scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isMenuVisible) {
        setIsMenuVisible(false);
        setActiveMenu(null);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMenuVisible]);

  // Nettoyage des timeouts - Évite les fuites mémoire
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, []);

  // Gestion améliorée du hover - Entrée dans le menu
  const handleMouseEnter = (itemLabel: string) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }

    hoverTimeoutRef.current = setTimeout(() => {
      setActiveMenu(itemLabel);
      setIsMenuVisible(true);
    }, 150);
  };

  // Gestion améliorée de la sortie - Sortie du menu principal
  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    leaveTimeoutRef.current = setTimeout(() => {
      setIsMenuVisible(false);
      setActiveMenu(null);
    }, 200);
  };

  // Gestion de la sortie du mega menu - Fermeture immédiate
  const handleMegaMenuLeave = () => {
    setIsMenuVisible(false);
    setActiveMenu(null);
    
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
  };

  // Maintenir le mega menu ouvert - Quand on entre dans le mega menu
  const handleMegaMenuEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setIsMenuVisible(true);
  };

  // Trouver l'item actif pour afficher son contenu
  const activeItem = menuItems.find(item => item.label === activeMenu);

  return (
    <>
      {/* Navigation principale */}
      <nav className="bg-yellow-400 border-b border-yellow-500 sticky top-[84px] z-40">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex items-center">
            {/* Menu items principaux */}
            <div 
              className="flex items-center"
              onMouseLeave={handleMouseLeave}
            >
              {menuItems.filter(item => !item.isSpecial).map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.hasMegaMenu && handleMouseEnter(item.label)}
                >
                  <Link
                    href={item.href}
                    className={`px-4 py-1 text-sm font-bold transition-colors whitespace-nowrap flex items-center gap-1 ${
                      activeMenu === item.label && item.hasMegaMenu
                        ? 'bg-yellow-500 text-black'
                        : 'text-black hover:bg-yellow-500'
                    }`}
                  >
                    {item.label}
                    {item.hasMegaMenu && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </Link>
                </div>
              ))}
            </div>

            {/* Items spéciaux (NEW ARRIVALS, PROMOTIONS) */}
            <div className="ml-auto flex items-center">
              {menuItems.filter(item => item.isSpecial).map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-4 py-1 text-sm font-bold text-white transition-colors whitespace-nowrap"
                  style={{ backgroundColor: item.specialColor }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mega menu amélioré */}
{isMenuVisible && activeItem && activeItem.hasMegaMenu && (
  <div 
    className="fixed left-1/2 transform -translate-x-1/2 w-[1500px] bg-white shadow-2xl border-t-4 border-yellow-400 z-30"
    onMouseEnter={handleMegaMenuEnter}
    onMouseLeave={handleMegaMenuLeave}
  >
    <div className="grid grid-cols-6 gap-6 p-6">
      {/* Colonnes des catégories - 5 colonnes */}
      <div className="col-span-5">
        <div className="grid grid-cols-5 gap-4">
          {activeItem.megaMenuCategories?.map((category, index) => (
            <div key={index}>
              {/* Titre cliquable ou non selon titleHref */}
              {category.titleHref ? (
                <Link
                  href={category.titleHref}
                  className="font-bold text-gray-900 text-sm mb-3 border-b border-gray-200 pb-2 block hover:text-yellow-600 transition-colors"
                >
                  {category.title}
                </Link>
              ) : (
                <h3 className="font-bold text-gray-900 text-sm mb-3 border-b border-gray-200 pb-2">
                  {category.title}
                </h3>
              )}
              <ul className="space-y-1.5">
                {category.items.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <Link
                      href={subItem.href}
                      className="text-sm text-gray-600 hover:text-yellow-600 hover:underline transition-colors block"
                    >
                      {subItem.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Image promotionnelle à droite - 1 colonne */}
        <div className="col-span-1">
          {activeItem?.megaMenuImage && (
            <div className="relative bg-gradient-to-br from-gray-800 to-black  p-4 text-white h-full min-h-[260px] overflow-hidden">
              {/* Image de fond */}
              <Image
                src={activeItem.megaMenuImage.src}     
                alt={activeItem.megaMenuImage.alt}
                fill
                sizes="(min-width: 1024px) 320px, 100vw"
                className="object-cover opacity-70"
                priority
              />
              {/* Overlay contenu */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center h-full">
                <h4 className="text-lg font-bold mb-1">
                  {activeItem.megaMenuImage.title}
                </h4>
                <p className="text-base mb-3">
                  {activeItem.megaMenuImage.subtitle}
                </p>
                <Link
                  href={activeItem.href}
                  className="inline-block bg-yellow-400 text-black px-3 py-1.5 rounded text-sm font-semibold hover:bg-yellow-500 transition-colors"
                >
                  Voir tout
                </Link>
              </div>
            </div>
          )}
        </div>
    </div>

    {/* Section des marques améliorée */}
    <div className="px-6 pb-6">
      <div className="pt-4">
        <div className="flex items-center justify-between gap-4">
          {brands.slice(0, 8).map((brand, index) => (
            <div 
              key={index} 
              className="flex-1 flex items-center justify-center"
            >
              {brand.href ? (
                <Link 
                  href={brand.href}
                  className="block hover:opacity-80 transition-opacity duration-200"
                >
                  <Image
                    src={brand.logo}
                    alt={`Logo ${brand.name}`}
                    width={80}
                    height={40}
                    className="h-8 w-auto object-contain transition-all duration-300"
                  />
                </Link>
              ) : (
                <Image
                  src={brand.logo}
                  alt={`Logo ${brand.name}`}
                  width={80}
                  height={40}
                  className="h-8 w-auto object-contain transition-all duration-300 cursor-pointer"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)}
    </>
  );
}