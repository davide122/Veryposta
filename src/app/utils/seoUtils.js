/**
 * Utility per la gestione della SEO dinamica
 */

/**
 * Estrae i parametri di query dall'URL corrente
 * @returns {Object} Oggetto con i parametri di query
 */
export function getQueryParams() {
  if (typeof window === 'undefined') return {};
  
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  return params;
}

/**
 * Legge un cookie specifico
 * @param {string} name Nome del cookie da leggere
 * @returns {string|null} Valore del cookie o null se non esiste
 */
export function getCookie(name) {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

/**
 * Ottiene i metadati SEO dinamici in base ai termini di ricerca
 * @param {string} searchTerms Termini di ricerca
 * @param {Object} defaultMetadata Metadati predefiniti
 * @returns {Object} Metadati ottimizzati
 */
export function getDynamicMetadata(searchTerms, defaultMetadata) {
  if (!searchTerms) return defaultMetadata;
  
  // Mappa dei termini di ricerca e relativi metadati ottimizzati
  const searchTermsMap = {
    // Termini relativi al franchising
    'franchising': {
      title: 'VeryPosta - Franchising Multiservizi | Opportunità di Business',
      description: 'Apri un franchising VeryPosta nella tua città. Investimento contenuto, supporto completo e formazione continua per il tuo successo imprenditoriale.',
      keywords: ['franchising multiservizi', 'aprire un franchising', 'opportunità di business', 'VeryPosta franchising']
    },
    'aprire franchising': {
      title: 'Come Aprire un Franchising VeryPosta | Guida Completa',
      description: 'Scopri come aprire un franchising VeryPosta con soli €400+IVA. Formazione, supporto e tecnologia inclusi per avviare la tua attività multiservizi.',
      keywords: ['aprire franchising', 'avviare attività multiservizi', 'franchising economico', 'VeryPosta']
    },
    'costo franchising': {
      title: 'Costo Franchising VeryPosta | Investimento Contenuto',
      description: 'Investi solo €400+IVA per aprire un franchising VeryPosta. Scopri tutti i vantaggi economici e il supporto incluso nel nostro modello di business.',
      keywords: ['costo franchising', 'investimento franchising', 'franchising economico', 'VeryPosta costi']
    },
    
    // Termini relativi ai servizi
    'servizi postali': {
      title: 'Servizi Postali VeryPosta | Spedizioni e Corrispondenza',
      description: 'VeryPosta offre servizi postali completi: spedizioni nazionali e internazionali, raccomandate, pacchi e corrispondenza con la massima affidabilità.',
      keywords: ['servizi postali', 'spedizioni', 'corrispondenza', 'raccomandate', 'VeryPosta']
    },
    'spedizioni': {
      title: 'Servizio Spedizioni VeryPosta | Pacchi Nazionali e Internazionali',
      description: "Spedisci pacchi in Italia e all'estero con VeryPosta. Tariffe competitive, tracciamento completo e consegna garantita per tutte le tue spedizioni.",
      keywords: ['spedizioni pacchi', 'spedizioni internazionali', 'corriere espresso', 'VeryPosta spedizioni']
    },
    'energia': {
      title: 'Servizi Energia VeryPosta | Offerte Luce e Gas Convenienti',
      description: 'Scopri le migliori offerte per luce e gas con VeryPosta. Risparmia sulle bollette e ottieni consulenza personalizzata per le tue utenze domestiche.',
      keywords: ['offerte luce gas', 'risparmio bollette', 'servizi energia', 'VeryPosta energia']
    },
    'telefonia': {
      title: 'Servizi Telefonia VeryPosta | Offerte Mobile e Fisso',
      description: 'Le migliori tariffe di telefonia mobile e fissa con VeryPosta. Confronta operatori, attiva nuove linee e ottieni assistenza personalizzata.',
      keywords: ['offerte telefonia', 'tariffe mobile', 'telefonia fissa', 'VeryPosta telefonia']
    },
    'caf': {
      title: 'Servizi CAF e Patronato VeryPosta | Assistenza Fiscale',
      description: 'VeryPosta offre servizi CAF e Patronato professionali: 730, ISEE, RED, successioni e pratiche fiscali con consulenti esperti e qualificati.',
      keywords: ['CAF', 'patronato', 'assistenza fiscale', '730', 'ISEE', 'VeryPosta']
    },
    'spid': {
      title: 'Attivazione SPID VeryPosta | Identità Digitale Facile',
      description: "Attiva il tuo SPID con VeryPosta in modo semplice e veloce. Assistenza completa per ottenere l'identità digitale per accedere ai servizi online.",
      keywords: ['SPID', 'identità digitale', 'attivazione SPID', 'VeryPosta SPID']
    },
    'firma digitale': {
      title: 'Firma Digitale VeryPosta | Certificati e Attivazione',
      description: 'Ottieni la tua firma digitale con VeryPosta. Servizio completo di attivazione, rinnovo e assistenza per firmare documenti con validità legale.',
      keywords: ['firma digitale', 'certificato firma', 'firma elettronica', 'VeryPosta firma']
    },
    'pec': {
      title: 'PEC VeryPosta | Posta Elettronica Certificata',
      description: 'Attiva la tua casella PEC con VeryPosta. Posta elettronica certificata sicura, economica e con validità legale per privati e aziende.',
      keywords: ['PEC', 'posta elettronica certificata', 'mail certificata', 'VeryPosta PEC']
    },
    
    // Termini relativi all'affiliazione
    'affiliazione': {
      title: 'Affiliazione VeryPosta | Diventa Partner Ufficiale',
      description: 'Diventa affiliato VeryPosta e offri servizi multimediali nella tua attività. Formazione, supporto e tecnologia per aumentare il tuo fatturato.',
      keywords: ['affiliazione', 'diventare partner', 'punto servizi', 'VeryPosta affiliazione']
    },
    'punto servizi': {
      title: 'Apri un Punto Servizi VeryPosta | Multiservizi Innovativo',
      description: 'Trasforma la tua attività in un punto servizi VeryPosta. Offri servizi postali, digitali e di consulenza con il supporto di un brand affermato.',
      keywords: ['punto servizi', 'multiservizi', 'servizi in franchising', 'VeryPosta point']
    }
  };
  
  // Cerca corrispondenze esatte
  for (const [term, metadata] of Object.entries(searchTermsMap)) {
    if (searchTerms.includes(term)) {
      return metadata;
    }
  }
  
  // Se non ci sono corrispondenze esatte, cerca corrispondenze parziali
  for (const [term, metadata] of Object.entries(searchTermsMap)) {
    const words = term.split(' ');
    for (const word of words) {
      if (word.length > 3 && searchTerms.includes(word)) {
        return metadata;
      }
    }
  }
  
  return defaultMetadata;
}

/**
 * Evidenzia le sezioni pertinenti in base ai termini di ricerca
 * @param {string} searchTerms Termini di ricerca
 */
export function highlightRelevantSections(searchTerms) {
  if (!searchTerms || typeof document === 'undefined') return;
  
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
}