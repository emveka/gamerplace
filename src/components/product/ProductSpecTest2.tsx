// components/product/ProductSpecTest2.tsx
'use client';

/**
 * Interface pour un item de spécification
 */
interface SpecItem {
  label: string;
  value: string;
}

/**
 * Interface pour une section de spécifications
 */
interface SpecSection {
  title: string;
  items: SpecItem[];
}

/**
 * Composant ProductSpecTest2 avec design portrait 2 colonnes - Version Mobile Optimisée
 * 
 * Ce composant affiche les spécifications techniques d'un produit
 * en format portrait sur 2 colonnes avec design minimaliste jaune.
 * Optimisé pour mobile avec espacements réduits.
 */
export function ProductSpecTest2() {
  // Données mock reproduisant exactement la structure de l'image
  const mockSpecs: SpecSection[] = [
    {
      title: "INFORMATIONS GÉNÉRALES",
      items: [
        { label: "Désignation", value: "LDLC PC ART" },
        { label: "Marque", value: "LDLC" },
        { label: "Modèle", value: "PC ART V4" },
        { label: "Système d'exploitation", value: "Sans Windows - Non monté" },
        { label: "Connexion WIFI", value: "oui/non" },
        { label: "Format boîtier", value: "Petit Tour / Moyen Tour / Grand Tour" },
        { label: "Usage recommandé", value: "Gaming / Streaming / Création" },
      ]
    },
    {
      title: "AFFICHAGES ET CARTE GRAPHIQUE",
      items: [
        { label: "Modèle graphique", value: "NVIDIA GeForce RTX 5060" },
        { label: "Taille mémoire vidéo", value: "8 Go" },
        { label: "Sorties vidéo", value: "HDMI, DisplayPort" },
        { label: "Résolution en jeu optimale", value: "Full HD 1080p" },
        { label: "Nombre d'écran(s)", value: "4" },
      ]
    },
    {
      title: "PROCESSEUR",
      items: [
        { label: "Marque", value: "AMD / Intel" },
        { label: "Type de processeur", value: "Ryzen 5 5600 / i5-13400F" },
        { label: "Processeur", value: "AMD Ryzen 5" },
        { label: "Fréquence CPU", value: "3.6 GHz / 4.4 GHz Turbo" },
        { label: "Cœurs / Threads", value: "6 cœurs / 12 threads" },
      ]
    },
    {
      title: "MÉMOIRE",
      items: [
        { label: "Modèle", value: "KINGSTON Fury" },
        { label: "RGB", value: "oui / non" },
        { label: "Capacité RAM totale", value: "16 Go" },
        { label: "Nombre barrettes", value: "2x8 Go" },
        { label: "Fréquence", value: "3200 mhz" },
      ]
    },
    {
      title: "STOCKAGE",
      items: [
        { label: "Modèle SSD", value: "Verbatim SSD" },
        { label: "Disque principal", value: "SSD NVMe 1 To" },
        { label: "Disque secondaire", value: "Aucun / En Option / SSD NVME 1 To" },
      ]
    },
    {
      title: "ALIMENTATION",
      items: [
        { label: "Marque", value: "Prostrike" },
        { label: "Modèle", value: "80+ Bronze / Gold" },
        { label: "Puissance", value: "650 Watt" },
        { label: "Certification", value: "80+ Bronze / Gold" },
        { label: "Modulaire", value: "Oui/Non" },
      ]
    },
    {
      title: "ÉQUIPEMENT",
      items: [
        { label: "Clavier fournis", value: "Non" },
        { label: "Souris fournis", value: "Non" },
        { label: "Tapis de souris fournis", value: "Non" },
        { label: "Casque fournis", value: "Non" },
      ]
    },
    {
      title: "GARANTIES",
      items: [
        { label: "Garantie", value: "1 an" },
      ]
    },
  ];

  // Diviser les sections en deux colonnes de manière équilibrée
  // Première moitié des sections dans la colonne gauche
  const leftColumnSections = mockSpecs.slice(0, Math.ceil(mockSpecs.length / 2));
  // Deuxième moitié des sections dans la colonne droite
  const rightColumnSections = mockSpecs.slice(Math.ceil(mockSpecs.length / 2));

  return (
    <div className="w-full bg-white p- sm:p-4 md:p-6 lg:p-8">
      {/* Titre principal avec bordure jaune à gauche - Responsive */}
      <div className="border-l-2 sm:border-l-4 border-yellow-500 pl-3 sm:pl-4 md:pl-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-gray-900">
          Spécifications Techniques PC GAMER
        </h2>
      </div>
      
      {/* Layout responsive : 1 colonne sur mobile, 2 colonnes sur desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        
        {/* Colonne de gauche */}
        <div className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10">
          {leftColumnSections.map((section, idx) => (
            <div key={`left-${idx}`}>
              {/* En-tête de section avec ligne horizontale jaune et titre centré - Responsive */}
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-4">
                {/* Ligne jaune qui s'étend jusqu'au titre */}
                <div className="h-px bg-yellow-500 flex-1"></div>
                
                {/* Titre de la section centré - Taille responsive */}
                <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide sm:tracking-widest text-gray-900 whitespace-nowrap px-1 sm:px-2">
                  {section.title}
                </h3>
                
                {/* Ligne jaune qui s'étend après le titre */}
                <div className="h-px bg-yellow-500 flex-1"></div>
              </div>
              
              {/* Liste verticale des spécifications - Espacement réduit sur mobile */}
              <div className="space-y-2 sm:space-y-3">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="group">
                    {/* Label de la spécification (texte gris clair) - Taille responsive */}
                    <p className="text-[10px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1">
                      {item.label}
                    </p>
                    
                    {/* Valeur de la spécification (texte noir, en gras) - Taille responsive */}
                    <p className="text-xs sm:text-sm text-gray-900 font-medium leading-tight">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Colonne de droite */}
        <div className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10">
          {rightColumnSections.map((section, idx) => (
            <div key={`right-${idx}`}>
              {/* En-tête de section avec ligne horizontale jaune et titre centré - Responsive */}
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-4">
                {/* Ligne jaune qui s'étend jusqu'au titre */}
                <div className="h-px bg-yellow-500 flex-1"></div>
                
                {/* Titre de la section centré - Taille responsive */}
                <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide sm:tracking-widest text-gray-900 whitespace-nowrap px-1 sm:px-2">
                  {section.title}
                </h3>
                
                {/* Ligne jaune qui s'étend après le titre */}
                <div className="h-px bg-yellow-500 flex-1"></div>
              </div>
              
              {/* Liste verticale des spécifications - Espacement réduit sur mobile */}
              <div className="space-y-2 sm:space-y-3">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="group">
                    {/* Label de la spécification (texte gris clair) - Taille responsive */}
                    <p className="text-[10px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1">
                      {item.label}
                    </p>
                    
                    {/* Valeur de la spécification (texte noir, en gras) - Taille responsive */}
                    <p className="text-xs sm:text-sm text-gray-900 font-medium leading-tight">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}