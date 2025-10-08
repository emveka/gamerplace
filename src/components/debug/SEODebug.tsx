// components/debug/SEODebug.tsx
'use client';

import { useEffect, useState } from 'react';

interface SEOData {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  headings: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
    hierarchy: string[];
  };
  content: {
    paragraphs: number;
    totalWords: number;
    images: number;
    imagesWithoutAlt: number;
    internalLinks: number;
    externalLinks: number;
  };
  technical: {
    hasSchema: boolean;
    hasOpenGraph: boolean;
    isHttps: boolean;
    hasBreadcrumbs: boolean;
  };
}

// Type pour les onglets
type TabKey = 'meta' | 'structure' | 'content' | 'technical';

export function SEODebug() {
  const [seoData, setSeoData] = useState<SEOData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('meta');

  useEffect(() => {
    // Métadonnées de base
    const title = document.title || '';
    const metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    const description = metaDescription?.content || '';
    const metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
    const keywords = metaKeywords?.content || '';
    const canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    const canonical = canonicalLink?.href || window.location.href;

    // Analyse des titres H1-H6
    const h1 = document.querySelectorAll('h1').length;
    const h2 = document.querySelectorAll('h2').length;
    const h3 = document.querySelectorAll('h3').length;
    const h4 = document.querySelectorAll('h4').length;
    const h5 = document.querySelectorAll('h5').length;
    const h6 = document.querySelectorAll('h6').length;
    
    const allHeadings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      .map(h => `${h.tagName}: ${h.textContent?.slice(0, 50)}...`);

    // Analyse du contenu
    const paragraphs = document.querySelectorAll('p').length;
    const allText = document.body.innerText || '';
    const totalWords = allText.split(/\s+/).filter(word => word.length > 0).length;
    
    const images = document.querySelectorAll('img').length;
    const imagesWithoutAlt = document.querySelectorAll('img:not([alt]), img[alt=""]').length;
    
    const allLinks = document.querySelectorAll('a[href]');
    const internalLinks = Array.from(allLinks).filter(link => 
      link.getAttribute('href')?.startsWith('/') || 
      link.getAttribute('href')?.includes(window.location.hostname)
    ).length;
    const externalLinks = allLinks.length - internalLinks;

    // Analyse technique
    const hasSchema = document.querySelector('script[type="application/ld+json"]') !== null;
    const hasOpenGraph = document.querySelector('meta[property^="og:"]') !== null;
    const isHttps = window.location.protocol === 'https:';
    const hasBreadcrumbs = document.querySelector('[data-testid="breadcrumb"], .breadcrumb, nav[aria-label*="breadcrumb"]') !== null;

    setSeoData({
      title,
      description,
      keywords,
      canonical,
      headings: {
        h1, h2, h3, h4, h5, h6,
        hierarchy: allHeadings
      },
      content: {
        paragraphs,
        totalWords,
        images,
        imagesWithoutAlt,
        internalLinks,
        externalLinks
      },
      technical: {
        hasSchema,
        hasOpenGraph,
        isHttps,
        hasBreadcrumbs
      }
    });
  }, []);

  // Afficher seulement en mode développement
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!seoData) {
    return null;
  }

  const getScoreColor = (condition: boolean) => condition ? 'text-green-600' : 'text-red-600';
  const getStatusIcon = (condition: boolean) => condition ? '✅' : '❌';

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        SEO Debug {isVisible ? '✕' : '🔍'}
      </button>
      
      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-white border border-gray-300 rounded-lg shadow-xl w-[500px] max-h-[600px] overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b bg-gray-50">
            {[
              { key: 'meta' as TabKey, label: 'Meta', icon: '📝' },
              { key: 'structure' as TabKey, label: 'Structure', icon: '🗂️' },
              { key: 'content' as TabKey, label: 'Contenu', icon: '📄' },
              { key: 'technical' as TabKey, label: 'Technique', icon: '⚙️' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 p-2 text-xs font-medium transition-colors ${
                  activeTab === tab.key 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4 overflow-y-auto max-h-[520px]">
            {/* Onglet Meta */}
            {activeTab === 'meta' && (
              <div className="space-y-3">
                <h3 className="font-bold text-lg text-gray-800">📝 Métadonnées</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Title:</label>
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">
                    {seoData.title || <span className="text-red-500">❌ Manquant</span>}
                  </p>
                  <span className={`text-xs ${getScoreColor(seoData.title.length >= 30 && seoData.title.length <= 60)}`}>
                    {seoData.title.length} caractères {seoData.title.length > 60 ? '⚠️ Trop long' : seoData.title.length < 30 ? '⚠️ Trop court' : '✅'}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Description:</label>
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">
                    {seoData.description || <span className="text-red-500">❌ Manquant</span>}
                  </p>
                  <span className={`text-xs ${getScoreColor(seoData.description.length >= 120 && seoData.description.length <= 160)}`}>
                    {seoData.description.length} caractères {seoData.description.length > 160 ? '⚠️ Trop long' : seoData.description.length < 120 ? '⚠️ Trop court' : '✅'}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Keywords:</label>
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">
                    {seoData.keywords || <span className="text-orange-500">⚠️ Aucun</span>}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Canonical URL:</label>
                  <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded border break-all">
                    {seoData.canonical}
                  </p>
                </div>
              </div>
            )}

            {/* Onglet Structure */}
            {activeTab === 'structure' && (
              <div className="space-y-3">
                <h3 className="font-bold text-lg text-gray-800">🗂️ Structure des Titres</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="font-semibold mb-2">Comptage:</h4>
                    <div className="space-y-1 text-sm">
                      <div className={getScoreColor(seoData.headings.h1 === 1)}>
                        H1: {seoData.headings.h1} {getStatusIcon(seoData.headings.h1 === 1)}
                      </div>
                      <div>H2: {seoData.headings.h2}</div>
                      <div>H3: {seoData.headings.h3}</div>
                      <div>H4: {seoData.headings.h4}</div>
                      <div>H5: {seoData.headings.h5}</div>
                      <div>H6: {seoData.headings.h6}</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="font-semibold mb-2">Validation:</h4>
                    <div className="space-y-1 text-sm">
                      <div className={getScoreColor(seoData.headings.h1 === 1)}>
                        {getStatusIcon(seoData.headings.h1 === 1)} H1 unique
                      </div>
                      <div className={getScoreColor(seoData.headings.h2 > 0)}>
                        {getStatusIcon(seoData.headings.h2 > 0)} H2 présents
                      </div>
                      <div className={getScoreColor(seoData.headings.hierarchy.length > 2)}>
                        {getStatusIcon(seoData.headings.hierarchy.length > 2)} Structure hiérarchique
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Hiérarchie des titres:</h4>
                  <div className="bg-gray-50 p-2 rounded max-h-32 overflow-y-auto">
                    {seoData.headings.hierarchy.length > 0 ? (
                      <div className="space-y-1">
                        {seoData.headings.hierarchy.map((heading, index) => (
                          <div key={index} className="text-xs text-gray-600">
                            {heading}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-red-500 text-sm">❌ Aucun titre trouvé</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Contenu */}
            {activeTab === 'content' && (
              <div className="space-y-3">
                <h3 className="font-bold text-lg text-gray-800">📄 Analyse du Contenu</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="font-semibold mb-2">Texte:</h4>
                    <div className="space-y-1 text-sm">
                      <div>Paragraphes: {seoData.content.paragraphs}</div>
                      <div className={getScoreColor(seoData.content.totalWords >= 300)}>
                        Mots: {seoData.content.totalWords} {getStatusIcon(seoData.content.totalWords >= 300)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="font-semibold mb-2">Images:</h4>
                    <div className="space-y-1 text-sm">
                      <div>Total: {seoData.content.images}</div>
                      <div className={getScoreColor(seoData.content.imagesWithoutAlt === 0)}>
                        Sans ALT: {seoData.content.imagesWithoutAlt} {getStatusIcon(seoData.content.imagesWithoutAlt === 0)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-semibold mb-2">Liens:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Internes:</span> {seoData.content.internalLinks}
                    </div>
                    <div>
                      <span className="font-medium">Externes:</span> {seoData.content.externalLinks}
                    </div>
                  </div>
                  <div className={`text-xs mt-1 ${getScoreColor(seoData.content.internalLinks >= 3)}`}>
                    {getStatusIcon(seoData.content.internalLinks >= 3)} Maillage interne suffisant
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded">
                  <h4 className="font-semibold mb-2 text-blue-800">📊 Score Contenu:</h4>
                  <div className="space-y-1 text-sm">
                    <div className={getScoreColor(seoData.content.totalWords >= 300)}>
                      {getStatusIcon(seoData.content.totalWords >= 300)} Longueur suffisante (300+ mots)
                    </div>
                    <div className={getScoreColor(seoData.content.imagesWithoutAlt === 0)}>
                      {getStatusIcon(seoData.content.imagesWithoutAlt === 0)} Images optimisées
                    </div>
                    <div className={getScoreColor(seoData.content.internalLinks >= 3)}>
                      {getStatusIcon(seoData.content.internalLinks >= 3)} Bon maillage interne
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Technique */}
            {activeTab === 'technical' && (
              <div className="space-y-3">
                <h3 className="font-bold text-lg text-gray-800">⚙️ Aspects Techniques</h3>
                
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="font-semibold mb-2">Sécurité & Performance:</h4>
                    <div className="space-y-1 text-sm">
                      <div className={getScoreColor(seoData.technical.isHttps)}>
                        {getStatusIcon(seoData.technical.isHttps)} HTTPS activé
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="font-semibold mb-2">Données Structurées:</h4>
                    <div className="space-y-1 text-sm">
                      <div className={getScoreColor(seoData.technical.hasSchema)}>
                        {getStatusIcon(seoData.technical.hasSchema)} Schema.org / JSON-LD
                      </div>
                      <div className={getScoreColor(seoData.technical.hasOpenGraph)}>
                        {getStatusIcon(seoData.technical.hasOpenGraph)} Open Graph tags
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="font-semibold mb-2">Navigation:</h4>
                    <div className="space-y-1 text-sm">
                      <div className={getScoreColor(seoData.technical.hasBreadcrumbs)}>
                        {getStatusIcon(seoData.technical.hasBreadcrumbs)} Fil d&lsquo;Ariane (Breadcrumbs)
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-3 rounded">
                    <h4 className="font-semibold mb-2 text-green-800">🎯 Score Technique:</h4>
                    <div className="space-y-1 text-sm">
                      {Object.values(seoData.technical).filter(Boolean).length} / {Object.keys(seoData.technical).length} critères respectés
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}