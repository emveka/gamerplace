// hooks/useMetadata.ts
'use client';

import { useEffect, useState } from 'react';

interface MetadataState {
  title: string;
  description: string;
  canonical?: string;
}

/**
 * Hook pour gérer les métadonnées dynamiques côté client
 * Utile pour les pages avec du contenu qui change dynamiquement
 */
export function useMetadata(initialMetadata: MetadataState) {
  const [metadata, setMetadata] = useState<MetadataState>(initialMetadata);

  useEffect(() => {
    // Met à jour le titre de la page
    if (metadata.title) {
      document.title = metadata.title;
    }

    // Met à jour la meta description
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta && metadata.description) {
      descriptionMeta.setAttribute('content', metadata.description);
    }

    // Met à jour l'URL canonique
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink && metadata.canonical) {
      canonicalLink.setAttribute('href', metadata.canonical);
    }
  }, [metadata]);

  return {
    metadata,
    updateMetadata: setMetadata,
    updateTitle: (title: string) => setMetadata(prev => ({ ...prev, title })),
    updateDescription: (description: string) => setMetadata(prev => ({ ...prev, description })),
    updateCanonical: (canonical: string) => setMetadata(prev => ({ ...prev, canonical }))
  };
}