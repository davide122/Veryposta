"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import LoginModal from "../components/LoginModal";
import { FadeIn, SlideIn } from "../components/AnimationProvider";
import styles from "./corsi.module.css";
import MyNav from "../components/MyNav";
import NewsletterBanner from "../components/NewsletterBanner";

export default function CorsiPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
const heroSlides = [
  {
    title: (
      <>
        <span className="relative inline-block">Formazione</span> Professionale VeryPosta
      </>
    ),
    subtitle: "Migliora le tue competenze con i nostri corsi specializzati e diventa un esperto nel settore dei servizi postali e spedizioni",
    image: "/corsinew.png"
  },
  {
    title: (
      <>
        <span className="relative inline-block">Scopri</span> i Servizi per ogni Punto
      </>
    ),
    subtitle: "Dalla SPID alla PEC, dai contratti luce al CAF: tutto in un solo posto",
    image: "/servizipunto.png"
  },
  {
    title: (
      <>
        <span className="relative inline-block">Diventa</span> un Affiliato VeryPosta
      </>
    ),
    subtitle: "Apri il tuo punto multiservizi con formazione, supporto e brand ufficiale",
    image: "/affiliate.png"
  }
];

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, 10000);
  return () => clearInterval(interval);
}, []);

  // Dati dei corsi organizzati per categorie in stile Netflix
  const [categorieCorsi, setCategorieCorsi] = useState([
    {
      id: 1,
      titolo: "Corsi più popolari",
      corsi: [
        {
          id: 1,
          titolo: "Fondamenti di Spedizioni Internazionali",
          descrizione: "Impara le basi delle spedizioni internazionali, normative doganali e best practice per gestire al meglio il servizio di spedizioni.",
          livello: "Base",
          durata: "4 ore",
          immagine: "/corsi/spedizioni-base.svg",
          progresso: 0,
          moduli: 5,
          completati: 0
        },
        {
          id: 2,
          titolo: "Servizi Postali Avanzati",
          descrizione: "Scopri tutti i servizi postali avanzati e come proporli efficacemente ai clienti per massimizzare le opportunità di business.",
          livello: "Intermedio",
          durata: "6 ore",
          immagine: "/corsi/servizi-postali.svg",
          progresso: 0,
          moduli: 8,
          completati: 0
        },
        {
          id: 3,
          titolo: "Marketing per Punti VeryPosta",
          descrizione: "Strategie di marketing locale per promuovere il tuo punto VeryPosta e attirare nuovi clienti nella tua zona.",
          livello: "Intermedio",
          durata: "5 ore",
          immagine: "/corsi/marketing.svg",
          progresso: 0,
          moduli: 6,
          completati: 0
        },
      ]
    },
    {
      id: 2,
      titolo: "Corsi per principianti",
      corsi: [
        {
          id: 1,
          titolo: "Fondamenti di Spedizioni Internazionali",
          descrizione: "Impara le basi delle spedizioni internazionali, normative doganali e best practice per gestire al meglio il servizio di spedizioni.",
          livello: "Base",
          durata: "4 ore",
          immagine: "/corsi/spedizioni-base.svg",
          progresso: 0,
          moduli: 5,
          completati: 0
        },
        {
          id: 5,
          titolo: "Introduzione ai Servizi VeryPosta",
          descrizione: "Panoramica completa di tutti i servizi offerti da VeryPosta e come presentarli ai clienti.",
          livello: "Base",
          durata: "3 ore",
          immagine: "/corsi/servizi-postali.svg",
          progresso: 0,
          moduli: 4,
          completati: 0
        },
      ]
    },
    {
      id: 3,
      titolo: "Corsi avanzati",
      corsi: [
        {
          id: 3,
          titolo: "Gestione Pratiche Amministrative",
          descrizione: "Tutte le procedure per gestire correttamente le pratiche amministrative, dalla compilazione alla presentazione.",
          livello: "Avanzato",
          durata: "8 ore",
          immagine: "/corsi/pratiche-admin.svg",
          progresso: 0,
          moduli: 10,
          completati: 0
        },
        {
          id: 6,
          titolo: "Strategie Avanzate di Business",
          descrizione: "Tecniche avanzate per massimizzare i profitti e sviluppare il tuo punto VeryPosta.",
          livello: "Avanzato",
          durata: "10 ore",
          immagine: "/corsi/marketing.svg",
          progresso: 0,
          moduli: 12,
          completati: 0
        },
      ]
    },
    {
      id: 4,
      titolo: "Marketing e promozione",
      corsi: [
        {
          id: 4,
          titolo: "Marketing per Punti VeryPosta",
          descrizione: "Strategie di marketing locale per promuovere il tuo punto VeryPosta e attirare nuovi clienti nella tua zona.",
          livello: "Intermedio",
          durata: "5 ore",
          immagine: "/corsi/marketing.svg",
          progresso: 0,
          moduli: 6,
          completati: 0
        },
        {
          id: 7,
          titolo: "Social Media per VeryPosta",
          descrizione: "Come utilizzare i social media per promuovere il tuo punto VeryPosta e aumentare la visibilità online.",
          livello: "Intermedio",
          durata: "4 ore",
          immagine: "/corsi/marketing.svg",
          progresso: 0,
          moduli: 5,
          completati: 0
        },
      ]
    },
  ]);
  
  // Tutti i corsi in un unico array (per retrocompatibilità)
  const [corsi, setCorsi] = useState([]);
  
  useEffect(() => {
    // Estrai tutti i corsi dalle categorie e rimuovi i duplicati
    const tuttiCorsi = [];
    const corsiIds = new Set();
    
    categorieCorsi.forEach(categoria => {
      categoria.corsi.forEach(corso => {
        if (!corsiIds.has(corso.id)) {
          tuttiCorsi.push(corso);
          corsiIds.add(corso.id);
        }
      });
    });
    
    setCorsi(tuttiCorsi);
  }, [categorieCorsi]);

  useEffect(() => {
    // Verifica se l'utente è autenticato
    const token = localStorage.getItem('authToken');
    const storedUserData = localStorage.getItem('userData');
    
    if (token && storedUserData) {
      setIsAuthenticated(true);
      setUserData(JSON.parse(storedUserData));
      
      // In un'implementazione reale, qui si recupererebbero i progressi dell'utente dal database
      // Esempio: fetchUserProgress(JSON.parse(storedUserData).id);
      
      // Simuliamo alcuni corsi iniziati per la sezione "Continua a guardare"
      const corsiInCorso = [
        {
          id: 1,
          titolo: "Fondamenti di Spedizioni Internazionali",
          descrizione: "Impara le basi delle spedizioni internazionali, normative doganali e best practice per gestire al meglio il servizio di spedizioni.",
          livello: "Base",
          durata: "4 ore",
          immagine: "/corsi/spedizioni-base.svg",
          progresso: 40,
          moduli: 5,
          completati: 2
        },
        {
          id: 4,
          titolo: "Marketing per Punti VeryPosta",
          descrizione: "Strategie di marketing locale per promuovere il tuo punto VeryPosta e attirare nuovi clienti nella tua zona.",
          livello: "Intermedio",
          durata: "5 ore",
          immagine: "/corsi/marketing.svg",
          progresso: 16,
          moduli: 6,
          completati: 1
        }
      ];
      
      // Aggiungiamo la categoria "Continua a guardare" all'inizio dell'array
      if (corsiInCorso.length > 0) {
        setCategorieCorsi(prev => [
          {
            id: 0,
            titolo: "Continua a guardare",
            corsi: corsiInCorso
          },
          ...prev
        ]);
      }
    }
  }, []);

  const handleCorsoClick = (corso) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    router.push(`/corsi/${corso.id}`);
  };

  return (
    <div className="">
         <MyNav />
         <NewsletterBanner />
    <div className={styles.corsiContainer}>
       <div className="z0">
       <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 righe">
                <defs>
                  <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M0 20 L40 20 M20 0 L20 40" stroke="white" strokeWidth="1" fill="none" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />
              </svg>
       </div>
      {/* Navbar */}
   
      
      {/* Hero Section - Redesigned con layout a due colonne e pattern decorativo */}
      <FadeIn>
  <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
    <div className={styles.heroSection}>
      {/* Pattern decorativo */}
      <div className="absolute inset-0 opacity-10 overflow-hidden">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20 L40 20 M20 0 L20 40" stroke="white" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      {/* Cerchi decorativi */}
     

      {/* Contenitore slider orizzontale */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-1000"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {heroSlides.map((slide, index) => (
            <div
            key={index}
            className={`relative min-w-full flex flex-col lg:flex-row items-center justify-between gap-10 px-6 py-16 transition-colors duration-500 ${
              index % 2 === 0 ? 'bg-[#1d3a6b]' : 'bg-[#1d3a6b]'
            }`}
          >
            {/* Pattern a righe per ogni slide */}
            <div className="absolute inset-0 opacity-10 overflow-hidden z-0">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id={`grid-pattern-${index}`} width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M0 20 L40 20 M20 0 L20 40" stroke="white" strokeWidth="1" fill="none" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#grid-pattern-${index})`} />
              </svg>
            </div>
          
              <div className={styles.heroContent}>
                <div className={styles.heroLeft}>
                  <div className="relative">
                  
                    <h1 className={styles.heroTitle}>{slide.title}</h1>
                  </div>
                  <p className={styles.heroSubtitle}>{slide.subtitle}</p>
                </div>
                <div className={styles.heroRight}>
                  <div className="relative">
                    <Image
                      src={slide.image}
                      alt="Hero Slide"
                      width={500}
                      height={300}
                      className={styles.heroImage}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</FadeIn>

      {/* Corsi Section - Stile Netflix con categorie e slider orizzontali */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16 ">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-[#1d3a6b] mb-4">Catalogo Corsi</h2>
          <div className="w-20 h-1 bg-[#ebd00b] mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Esplora la nostra selezione di corsi progettati per aiutarti a eccellere nel tuo punto VeryPosta
          </p>
        </div>

        {/* Categorie di corsi in stile Netflix */}
        {categorieCorsi.map((categoria) => (
          <div key={categoria.id} className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#1d3a6b]">{categoria.titolo}</h3>
              {categoria.corsi.length > 3 && (
                <button className="text-[#1d3a6b] hover:text-[#ebd00b] transition-colors font-medium flex items-center">
                  Vedi tutti
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Slider orizzontale per i corsi */}
            <div className="relative">
              {/* Controlli slider (opzionali) */}
              {categoria.corsi.length > 3 && (
                <>
                  <button className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md text-[#1d3a6b] hover:text-[#ebd00b] transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md text-[#1d3a6b] hover:text-[#ebd00b] transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
              
              {/* Contenitore scorrevole orizzontale */}
              <div className={`flex space-x-6 overflow-x-auto pb-4 ${styles['scrollbar-hide']}`}>
                {categoria.corsi.map((corso) => (
                  <div 
                    key={corso.id} 
                    className="flex-none w-[300px] group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100  transform  hover:scale-101"
                    onClick={() => handleCorsoClick(corso)}
                  >
                    <div className="relative h-40 bg-gradient-to-br from-[#1d3a6b] to-[#2a4e8d] flex items-center justify-center p-4 overflow-hidden">
                      <div className="absolute inset-0 opacity-10">
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                              <path d="M0 20 L40 20 M20 0 L20 40" stroke="white" strokeWidth="1" fill="none" />
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                        </svg>
                      </div>
                      <Image 
                        src={corso.immagine} 
                        alt={corso.titolo} 
                        width={120} 
                        height={120} 
                        className="relative z-10 transform transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-5 flex-grow flex flex-col">
                      <div className="flex justify-between items-center mb-2">
                        <span className="px-2 py-1 bg-[#1d3a6b]/10 text-[#1d3a6b] text-xs font-semibold rounded-full">
                          {corso.livello}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {corso.durata}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#1d3a6b] mb-2 line-clamp-2 group-hover:text-[#2a4e8d]">{corso.titolo}</h3>
                      <p className="text-gray-600 mb-4 text-sm line-clamp-3 flex-grow">{corso.descrizione}</p>
                      
                      {isAuthenticated ? (
                        <div className="mt-auto">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
                            <div 
                              className="h-full bg-[#ebd00b] rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${(corso.completati / corso.moduli) * 100}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{Math.round((corso.completati / corso.moduli) * 100)}%</span>
                            <span>{corso.completati}/{corso.moduli}</span>
                          </div>
                          {corso.completati > 0 && (
                            <button 
                              className="mt-2 w-full bg-[#1d3a6b] hover:bg-[#2a4e8d] text-white text-sm py-1.5 px-3 rounded-lg transition-colors flex items-center justify-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCorsoClick(corso);
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                              Continua
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="mt-auto pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-center text-[#1d3a6b] text-sm font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Accedi per visualizzare
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Vantaggi della formazione - Redesigned */}
      <div className="bg-gray-50 py-16 mt-12">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#1d3a6b] mb-4">Vantaggi della Formazione VeryPosta</h2>
            <div className="w-20 h-1 bg-[#ebd00b] mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Scopri perché i nostri corsi sono essenziali per il tuo successo professionale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeIn>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-[#1d3a6b] h-full flex flex-col">
                <div className="bg-[#1d3a6b]/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 text-3xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#1d3a6b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#1d3a6b] mb-4">Tracciamento Progressi</h3>
                <p className="text-gray-600 leading-relaxed">
                  Monitora facilmente i tuoi progressi e riprendi da dove hai lasciato in qualsiasi momento. La nostra piattaforma salva automaticamente i tuoi avanzamenti.
                </p>
              </div>
            </FadeIn>
            
            <FadeIn delay={200}>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-[#ebd00b] h-full flex flex-col">
                <div className="bg-[#ebd00b]/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 text-3xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#ebd00b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#1d3a6b] mb-4">Quiz Interattivi</h3>
                <p className="text-gray-600 leading-relaxed">
                  Verifica la tua comprensione con quiz interattivi alla fine di ogni modulo. Ricevi feedback immediato e consolida le tue conoscenze attraverso esercizi pratici.
                </p>
              </div>
            </FadeIn>
            
            <FadeIn delay={400}>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-[#1d3a6b] h-full flex flex-col">
                <div className="bg-[#1d3a6b]/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 text-3xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#1d3a6b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#1d3a6b] mb-4">Certificati Ufficiali</h3>
                <p className="text-gray-600 leading-relaxed">
                  Ottieni certificati ufficiali VeryPosta al completamento dei corsi. Aggiungi queste credenziali al tuo curriculum e dimostra la tua competenza professionale.
                </p>
              </div>
            </FadeIn>
          </div>
          
          {!isAuthenticated && (
            <div className="mt-12 text-center">
              <button 
                onClick={() => setShowLoginModal(true)}
                className="px-8 py-4 bg-[#1d3a6b] text-white font-bold text-lg rounded-full hover:bg-[#2a4e8d] transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Inizia il tuo percorso formativo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)} 
          onLogin={(token, user) => {
            setIsAuthenticated(true);
            setUserData(user);
            setShowLoginModal(false);
          }}
        />
      )}
    </div>

    </div>
  );
}