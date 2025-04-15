import { NextResponse } from 'next/server';

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
    description: 'Spedisci pacchi in Italia e all'estero con VeryPosta. Tariffe competitive, tracciamento completo e consegna garantita per tutte le tue spedizioni.',
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
    description: 'Attiva il tuo SPID con VeryPosta in modo semplice e veloce. Assistenza completa per ottenere l'identità digitale per accedere ai servizi online.',
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

// Funzione per estrarre i termini di ricerca dall'URL di provenienza
function extractSearchTerms(referer) {
  if (!referer) return null;
  
  // Supporto per Google, Bing e altri motori di ricerca principali
  const searchEngines = [
    { domain: 'google', param: 'q' },
    { domain: 'bing', param: 'q' },
    { domain: 'yahoo', param: 'p' },
    { domain: 'duckduckgo', param: 'q' },
    { domain: 'yandex', param: 'text' },
    { domain: 'baidu', param: 'wd' }
  ];
  
  try {
    const url = new URL(referer);
    const hostname = url.hostname.toLowerCase();
    
    // Identifica il motore di ricerca
    const searchEngine = searchEngines.find(engine => hostname.includes(engine.domain));
    if (!searchEngine) return null;
    
    // Estrai la query di ricerca
    const searchQuery = url.searchParams.get(searchEngine.param);
    if (!searchQuery) return null;
    
    return searchQuery.toLowerCase();
  } catch (error) {
    console.error('Errore nell\'analisi del referer:', error);
    return null;
  }
}

// Funzione per trovare i metadati ottimizzati in base ai termini di ricerca
function findOptimizedMetadata(searchTerms) {
  if (!searchTerms) return null;
  
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
  
  return null;
}

export function middleware(request) {
  // Ottieni l'URL di provenienza
  const referer = request.headers.get('referer');
  
  // Estrai i termini di ricerca
  const searchTerms = extractSearchTerms(referer);
  
  // Se non ci sono termini di ricerca o non proviene da un motore di ricerca, continua normalmente
  if (!searchTerms) {
    return NextResponse.next();
  }
  
  // Trova i metadati ottimizzati
  const optimizedMetadata = findOptimizedMetadata(searchTerms);
  
  // Se non ci sono metadati ottimizzati, continua normalmente
  if (!optimizedMetadata) {
    return NextResponse.next();
  }
  
  // Clona la risposta
  const response = NextResponse.next();
  
  // Aggiungi i metadati ottimizzati come header personalizzati
  // Questi verranno letti dal layout.js per modificare i meta tag
  response.headers.set('x-seo-title', optimizedMetadata.title);
  response.headers.set('x-seo-description', optimizedMetadata.description);
  response.headers.set('x-seo-keywords', optimizedMetadata.keywords.join(','));
  
  // Aggiungi un cookie per memorizzare i termini di ricerca
  // Utile per personalizzare il contenuto della pagina
  response.cookies.set('search_terms', searchTerms, {
    maxAge: 3600, // 1 ora
    path: '/'
  });
  
  return response;
}

// Configura il middleware per essere eseguito su tutte le pagine
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};