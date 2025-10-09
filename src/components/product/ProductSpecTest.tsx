// components/product/ProductSpecTest.tsx
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
 * Composant ProductSpecTest avec design table horizontale minimaliste
 * 
 * Ce composant affiche les spécifications techniques d'un produit
 * dans un layout horizontal ultra-clean avec des accents jaunes.
 */
export function ProductSpecTest() {
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
        { label: "Format boîtier", value: "Petit Tour / Moyen Tour / Grand Tour | Taille du PC" },
        { label: "Usage recommandé", value: "Gaming / Streaming / Création / Bureautique / Designers" },
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
        { label: "Disque principal", value: "SSD NVMe 1 To" },
        { label: "Disque secondaire", value: "Aucun / En Option / SSD NVME 1 To" },
      ]
    },
    {
      title: "ALIMENTATION",
      items: [
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

  return (
    <div className="w-full bg-white p-8">
      {/* Titre principal avec bordure jaune à gauche */}
      <div className="border-l-4 border-yellow-500 pl-6 mb-8">
        <h2 className="text-3xl font-light text-gray-900">Spécifications Techniques</h2>
      </div>
      
      {/* Sections de spécifications */}
      <div className="space-y-6">
        {mockSpecs.map((section, idx) => (
          <div key={idx}>
            {/* En-tête de section avec ligne horizontale jaune et titre centré */}
            <div className="flex items-center gap-3 mb-4">
              {/* Ligne jaune qui s'étend jusqu'au titre */}
              <div className="h-px bg-yellow-500 flex-1"></div>
              
              {/* Titre de la section centré */}
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-900 whitespace-nowrap">
                {section.title}
              </h3>
              
              {/* Ligne jaune qui s'étend après le titre */}
              <div className="h-px bg-yellow-500 flex-1"></div>
            </div>
            
            {/* Grille horizontale des spécifications */}
            {/* 
              - grid-cols-2: 2 colonnes sur mobile
              - md:grid-cols-3: 3 colonnes sur tablette
              - lg:grid-cols-5: 5 colonnes sur desktop
              - gap-x-8: espacement horizontal de 2rem
              - gap-y-4: espacement vertical de 1rem
            */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-4">
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx} className="group">
                  {/* Label de la spécification (texte gris clair) */}
                  <p className="text-xs text-gray-400 mb-1.5">
                    {item.label}
                  </p>
                  
                  {/* Valeur de la spécification (texte noir, en gras) */}
                  <p className="text-sm text-gray-900 font-medium">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}