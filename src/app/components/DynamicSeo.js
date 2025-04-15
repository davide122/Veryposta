"use client";
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { usePathname } from 'next/navigation';

/**
 * Componente per gestire la SEO dinamica in base ai termini di ricerca
 * Legge i cookie impostati dal middleware e modifica dinamicamente i meta tag
 */
export default function DynamicSeo({ defaultTitle, defaultDescription, defaultKeywords }) {
  const [seoData, setSeoData] = useState({
    title: defaultTitle,
    description: defaultDescription,
    keywords: defaultKeywords || []
  });
  
  const pathname = usePathname();

  useEffect(() => {
    // Funzione per leggere i cookie
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };

    // Leggi i termini di ricerca dal cookie
    const searchTerms = getCookie('search_terms');
    
    if (searchTerms) {
      // Personalizza il contenuto in base ai termini di ricerca
      customizeContent(searchTerms);
      
      // Leggi i metadati personalizzati dai meta tag (impostati dal middleware)
      const metaTitle = document.querySelector('meta[name="x-seo-title"]')?.getAttribute('content');
      const metaDescription = document.querySelector('meta[name="x-seo-description"]')?.getAttribute('content');
      const metaKeywords = document.querySelector('meta[name="x-seo-keywords"]')?.getAttribute('content');
      
      if (metaTitle || metaDescription || metaKeywords) {
        setSeoData({
          title: metaTitle || defaultTitle,
          description: metaDescription || defaultDescription,
          keywords: metaKeywords ? metaKeywords.split(',') : defaultKeywords || []
        });
      }
    }
  }, [pathname, defaultTitle, defaultDescription, defaultKeywords]);

  // Funzione per personalizzare il contenuto della pagina in base ai termini di ricerca
  const customizeContent = (searchTerms) => {
    // Evidenzia le sezioni pertinenti in base ai termini di ricerca
    setTimeout(() => {
      try {
        // Converti i termini di ricerca in minuscolo per un confronto case-insensitive
        const terms = searchTerms.toLowerCase();
        
        // Mappa delle sezioni e dei termini correlati
        const sectionMap = {
          'perche': ['perché', 'motivo', 'vantaggi', 'scegliere'],
          'servizi': ['servizi', 'postali', 'spedizioni', 'energia', 'telefonia', 'caf', 'patronato', 'spid', 'firma', 'pec'],
          'vantaggi': ['vantaggi', 'affiliazione', 'benefici', 'guadagno'],
          'media': ['foto', 'immagini', 'video', 'gallery', 'testimonianze'],
          'contatti': ['contatti', 'contattare', 'informazioni', 'richiesta']
        };
        
        // Verifica quali sezioni sono rilevanti per i termini di ricerca
        let foundRelevantSection = false;
        
        for (const [sectionId, relatedTerms] of Object.entries(sectionMap)) {
          const isRelevant = relatedTerms.some(term => terms.includes(term));
          const section = document.getElementById(sectionId);
          
          if (section && isRelevant) {
            // Evidenzia la sezione rilevante
            section.classList.add('search-highlight');
            foundRelevantSection = true;
            
            // Aggiungi uno stile per evidenziare la sezione
            if (!document.getElementById('dynamic-seo-styles')) {
              const style = document.createElement('style');
              style.id = 'dynamic-seo-styles';
              style.innerHTML = `
                .search-highlight {
                  animation: pulse 2s infinite;
                  scroll-margin-top: 100px;
                }
                @keyframes pulse {
                  0% { box-shadow: 0 0 0 0 rgba(235, 208, 11, 0.4); }
                  70% { box-shadow: 0 0 0 10px rgba(235, 208, 11, 0); }
                  100% { box-shadow: 0 0 0 0 rgba(235, 208, 11, 0); }
                }
              `;
              document.head.appendChild(style);
            }
            
            // Scorri automaticamente alla prima sezione rilevante
            if (foundRelevantSection) {
              section.scrollIntoView({ behavior: 'smooth', block: 'start' });
              break;
            }
          }
        }
      } catch (error) {
        console.error('Errore nella personalizzazione del contenuto:', error);
      }
    }, 1000); // Attendi che il DOM sia completamente caricato
  };

  return (
    <Head>
      {/* Aggiorna dinamicamente i meta tag */}
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      <meta name="keywords" content={seoData.keywords.join(', ')} />
      
      {/* Aggiorna anche i meta tag per Open Graph e Twitter */}
      <meta property="og:title" content={seoData.title} />
      <meta property="og:description" content={seoData.description} />
      <meta name="twitter:title" content={seoData.title} />
      <meta name="twitter:description" content={seoData.description} />
    </Head>
  );
}