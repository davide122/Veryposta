"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { getCookie, getDynamicMetadata, highlightRelevantSections } from '../utils/seoUtils';

// Crea un contesto per i termini di ricerca
const SearchTermsContext = createContext({
  searchTerms: null,
  dynamicMetadata: null,
  isFromSearchEngine: false
});

/**
 * Provider che gestisce i termini di ricerca e i metadati dinamici
 * Questo componente deve essere inserito nel layout principale dell'applicazione
 */
export function SearchTermsProvider({ children, defaultMetadata }) {
  const [searchData, setSearchData] = useState({
    searchTerms: null,
    dynamicMetadata: defaultMetadata,
    isFromSearchEngine: false
  });

  useEffect(() => {
    // Leggi i termini di ricerca dal cookie (impostato dal middleware)
    const searchTerms = getCookie('search_terms');
    
    if (searchTerms) {
      // Ottieni i metadati dinamici in base ai termini di ricerca
      const dynamicMetadata = getDynamicMetadata(searchTerms, defaultMetadata);
      
      // Aggiorna lo stato
      setSearchData({
        searchTerms,
        dynamicMetadata,
        isFromSearchEngine: true
      });
      
      // Aggiorna dinamicamente i meta tag
      updateMetaTags(dynamicMetadata);
      
      // Evidenzia le sezioni pertinenti
      highlightRelevantSections(searchTerms);
      
      // Personalizza il contenuto in base ai termini di ricerca
      customizeContent(searchTerms);
    }
  }, [defaultMetadata]);

  // Funzione per aggiornare dinamicamente i meta tag
  const updateMetaTags = (metadata) => {
    if (typeof document === 'undefined') return;
    
    // Aggiorna il titolo della pagina
    document.title = metadata.title;
    
    // Aggiorna i meta tag
    const metaTags = {
      'description': metadata.description,
      'keywords': metadata.keywords.join(', ')
    };
    
    // Aggiorna i meta tag esistenti o creane di nuovi
    Object.entries(metaTags).forEach(([name, content]) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    });
    
    // Aggiorna anche i meta tag Open Graph e Twitter
    const ogTags = {
      'og:title': metadata.title,
      'og:description': metadata.description,
      'twitter:title': metadata.title,
      'twitter:description': metadata.description
    };
    
    Object.entries(ogTags).forEach(([property, content]) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    });
  };

  // Funzione per personalizzare il contenuto in base ai termini di ricerca
  const customizeContent = (searchTerms) => {
    if (typeof document === 'undefined') return;
    
    // Aggiungi un banner informativo per mostrare che il contenuto è personalizzato
    setTimeout(() => {
      try {
        // Verifica se il banner esiste già
        if (!document.getElementById('search-terms-banner')) {
          const banner = document.createElement('div');
          banner.id = 'search-terms-banner';
          banner.className = 'fixed bottom-4 right-4 bg-[#ebd00b] text-[#1d3a6b] px-4 py-2 rounded-lg shadow-lg z-50 max-w-xs';
          banner.innerHTML = `
            <p class="text-sm font-medium">Contenuto personalizzato in base alla tua ricerca: "${searchTerms}"</p>
            <button class="text-xs underline mt-1" onclick="this.parentNode.remove()">Chiudi</button>
          `;
          document.body.appendChild(banner);
          
          // Rimuovi il banner dopo 10 secondi
          setTimeout(() => {
            banner.remove();
          }, 10000);
        }
      } catch (error) {
        console.error('Errore nella creazione del banner:', error);
      }
    }, 2000);
  };

  return (
    <SearchTermsContext.Provider value={searchData}>
      {children}
    </SearchTermsContext.Provider>
  );
}

// Hook personalizzato per utilizzare il contesto dei termini di ricerca
export function useSearchTerms() {
  return useContext(SearchTermsContext);
}