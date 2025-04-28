"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FadeIn, SlideIn } from "../../components/AnimationProvider";
import styles from "../corsi.module.css";
import MyNav from "../../components/MyNav";
import NewsletterBanner from "@/app/components/NewsletterBanner";

export default function CorsoDettaglio() {
  const router = useRouter();
  const params = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [corso, setCorso] = useState(null);
  const [activeTab, setActiveTab] = useState('moduli');
  const [currentModulo, setCurrentModulo] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizRisposte, setQuizRisposte] = useState({});
  const [quizCompletato, setQuizCompletato] = useState(false);
  const [quizRisultato, setQuizRisultato] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false)

  // Dati di esempio per il corso
  const corsiData = {
    1: {
      id: 1,
      titolo: "Fondamenti di Spedizioni Internazionali",
      descrizione: "Impara le basi delle spedizioni internazionali, normative doganali e best practice per gestire al meglio il servizio di spedizioni.",
      livello: "Base",
      durata: "4 ore",
      immagine: "/corsi/spedizioni-base.svg",
      progresso: 0,
      videoUrl: "https://www.youtube.com/embed/98YSF_ZNXwE", // URL di esempio per il video
      moduli: [
        {
          id: 1,
          titolo: "Introduzione alle spedizioni internazionali",
          durata: "45 minuti",
          completato: false,
          contenuto: "<p>Le spedizioni internazionali rappresentano un servizio fondamentale per qualsiasi punto VeryPosta. In questo modulo introduttivo, esploreremo i concetti base delle spedizioni internazionali, le differenze tra i vari servizi disponibili e come scegliere la soluzione migliore per i clienti.</p><p>Argomenti trattati:</p><ul><li>Panoramica dei servizi di spedizione internazionale</li><li>Differenze tra spedizioni UE ed extra-UE</li><li>Documentazione necessaria per le spedizioni internazionali</li><li>Tariffe e tempistiche di consegna</li></ul>",
          quiz: [
            {
              domanda: "Quale documento è sempre necessario per una spedizione extra-UE?",
              opzioni: [
                "Fattura commerciale",
                "Certificato di origine",
                "Lettera di vettura aerea",
                "Polizza di carico marittima"
              ],
              risposta_corretta: 0
            },
            {
              domanda: "Per le spedizioni all'interno dell'UE è necessario compilare una dichiarazione doganale?",
              opzioni: [
                "Sì, sempre",
                "No, mai",
                "Solo per merci di valore superiore a 1000€",
                "Solo per merci pericolose"
              ],
              risposta_corretta: 1
            },
            {
              domanda: "Quale tra questi non è un corriere internazionale partner di VeryPosta?",
              opzioni: [
                "DHL",
                "FedEx",
                "Amazon Shipping",
                "UPS"
              ],
              risposta_corretta: 2
            }
          ]
        },
        {
          id: 2,
          titolo: "Normative doganali e documentazione",
          durata: "60 minuti",
          completato: false,
          contenuto: "<p>Le normative doganali sono un aspetto cruciale delle spedizioni internazionali. In questo modulo, approfondiremo le procedure doganali, i documenti necessari e come evitare problemi durante lo sdoganamento.</p><p>Argomenti trattati:</p><ul><li>Procedure doganali per paesi extra-UE</li><li>Compilazione corretta della documentazione doganale</li><li>Calcolo di dazi e imposte</li><li>Gestione delle restrizioni all'importazione</li></ul>",
          quiz: [
            {
              domanda: "Cosa indica il codice HS nelle spedizioni internazionali?",
              opzioni: [
                "Il paese di origine della merce",
                "La classificazione doganale del prodotto",
                "Il valore assicurato del pacco",
                "La priorità di consegna"
              ],
              risposta_corretta: 1
            }
          ]
        },
        {
          id: 3,
          titolo: "Imballaggio e preparazione delle spedizioni",
          durata: "45 minuti",
          completato: false,
          contenuto: "<p>Un imballaggio adeguato è essenziale per garantire che le spedizioni arrivino a destinazione in perfette condizioni. Questo modulo copre le migliori pratiche di imballaggio e preparazione delle spedizioni internazionali.</p>",
          quiz: []
        },
        {
          id: 4,
          titolo: "Tracciamento e gestione dei problemi",
          durata: "45 minuti",
          completato: false,
          contenuto: "<p>Il tracciamento delle spedizioni e la gestione dei problemi sono servizi fondamentali per i clienti. In questo modulo, imparerai come utilizzare i sistemi di tracciamento e come gestire efficacemente eventuali problemi o reclami.</p>",
          quiz: []
        },
        {
          id: 5,
          titolo: "Strategie di pricing e upselling",
          durata: "45 minuti",
          completato: false,
          contenuto: "<p>Definire il giusto prezzo per i servizi di spedizione e proporre servizi aggiuntivi può aumentare significativamente i ricavi del tuo punto VeryPosta. Questo modulo ti insegnerà strategie efficaci di pricing e upselling.</p>",
          quiz: []
        }
      ]
    },
    2: {
      id: 2,
      titolo: "Servizi Postali Avanzati",
      descrizione: "Scopri tutti i servizi postali avanzati e come proporli efficacemente ai clienti per massimizzare le opportunità di business.",
      livello: "Intermedio",
      durata: "6 ore",
      immagine: "/corsi/servizi-postali.svg",
      progresso: 0,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // URL di esempio per il video
      moduli: [
        {
          id: 1,
          titolo: "Servizi a valore aggiunto",
          durata: "60 minuti",
          completato: false,
          contenuto: "<p>I servizi postali a valore aggiunto rappresentano un'importante fonte di ricavi per il tuo punto VeryPosta. In questo modulo, esploreremo tutti i servizi disponibili e come proporli ai clienti.</p>",
          quiz: []
        }
      ]
    }
  };

  useEffect(() => {
    // Verifica se l'utente è autenticato
    const token = localStorage.getItem('authToken');
    const storedUserData = localStorage.getItem('userData');
    
    if (!token || !storedUserData) {
      // Utente non autenticato, reindirizza alla pagina di accesso
      router.push('/accesso');
      return;
    }

    setIsAuthenticated(true);
    setUserData(JSON.parse(storedUserData));
    
    // Carica i dati del corso
    if (params.id && corsiData[params.id]) {
      setCorso(corsiData[params.id]);
      // Imposta il primo modulo come attivo
      if (corsiData[params.id].moduli && corsiData[params.id].moduli.length > 0) {
        setCurrentModulo(corsiData[params.id].moduli[0]);
      }
    } else {
      // Corso non trovato, reindirizza alla pagina dei corsi
      router.push('/corsi');
    }
    
    setLoading(false);
  }, [params.id, router]);

  const handleModuloClick = (modulo) => {
    setCurrentModulo(modulo);
    setShowQuiz(false);
    setQuizCompletato(false);
    setQuizRisultato(null);
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setQuizRisposte({});
    setQuizCompletato(false);
    setQuizRisultato(null);
  };

  const handleRispostaChange = (index, rispostaIndex) => {
    setQuizRisposte(prev => ({
      ...prev,
      [index]: rispostaIndex
    }));
  };

  const handleQuizSubmit = () => {
    // Calcola il risultato del quiz
    let corrette = 0;
    currentModulo.quiz.forEach((domanda, index) => {
      if (quizRisposte[index] === domanda.risposta_corretta) {
        corrette++;
      }
    });
    
    const percentuale = Math.round((corrette / currentModulo.quiz.length) * 100);
    const superato = percentuale >= 70; // Considera superato con almeno il 70%
    
    setQuizRisultato({
      corrette,
      totale: currentModulo.quiz.length,
      percentuale,
      superato
    });
    
    setQuizCompletato(true);
    
    // In un'implementazione reale, qui si salverebbe il risultato nel database
    // Esempio: saveQuizResult(corso.id, currentModulo.id, percentuale, superato);
  };

  if (loading) {
    return (
      <div className={styles.corsiContainer}>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!corso) {
    return (
      <div className={styles.corsiContainer}>
        <div className="flex flex-col justify-center items-center h-screen">
          <h2 className={styles.sectionTitle}>Corso non trovato</h2>
          <Link href="/corsi" className={styles.backButton}>
            Torna alla lista dei corsi
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.corsiContainer}>
      <NewsletterBanner></NewsletterBanner>
      {/* Pattern decorativo */}
      <div className="z-0">
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
      <MyNav />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Header con breadcrumb e titolo */}
        <FadeIn>
          <div className="mb-8">
            <div className="flex items-center text-sm text-black mb-4">
              <Link href="/corsi" className="hover:text-[#1d3a6b] transition-colors">
                Corsi
              </Link>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-[#1d3a6b] font-medium">{corso.titolo}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-[#1d3a6b] mb-2">{corso.titolo}</h1>
            
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="px-3 py-1 bg-[#1d3a6b]/10 text-[#1d3a6b] text-sm font-semibold rounded-full">
                {corso.livello}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-black text-sm font-medium rounded-full flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {corso.durata}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-black text-sm font-medium rounded-full flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {corso.moduli.length} moduli
              </span>
            </div>
            
            <p className="text-black max-w-3xl">{corso.descrizione}</p>
          </div>
        </FadeIn>
        
        {/* Contenuto principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar con lista moduli */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <FadeIn delay={2}>
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 sticky top-24">
                <div className="p-5 bg-[#1d3a6b] text-white">
                  <h3 className="text-xl font-bold">Moduli del corso</h3>
                  <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#ebd00b] rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${(corso.moduli.filter(m => m.completato).length / corso.moduli.length) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1 text-white/80">
                    <span>Progresso</span>
                    <span>{corso.moduli.filter(m => m.completato).length}/{corso.moduli.length} completati</span>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {corso.moduli.map((modulo, index) => (
                    <div 
                      key={modulo.id}
                      className={`p-4 cursor-pointer transition-colors ${currentModulo && currentModulo.id === modulo.id ? 'bg-[#1d3a6b]/5' : 'hover:bg-gray-50'}`}
                      onClick={() => handleModuloClick(modulo)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${modulo.completato ? 'bg-green-500 text-white' : 'bg-gray-100 text-black'}`}>
                          {modulo.completato ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-grow">
                          <h4 className={`font-medium ${currentModulo && currentModulo.id === modulo.id ? 'text-[#1d3a6b]' : 'text-black'}`}>{modulo.titolo}</h4>
                          <div className="flex items-center text-sm text-black mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {modulo.durata}
                            {modulo.quiz && modulo.quiz.length > 0 && (
                              <span className="ml-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Quiz
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
          
          {/* Contenuto principale */}
          <div className="lg:col-span-2 order-1 lg:order-2 ">
            <FadeIn>
              {/* Video del corso */}
              <div className="bg-white rounded-2xl border-4 border-[#1d3a6b] shadow-lg overflow-hidden h-80">
  <div className="aspect-w-16 aspect-h-9 h-80">
    <iframe
      src={`${corso.videoUrl}?controls=0&modestbranding=1&rel=0`}
      title={corso.titolo}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      className="w-full h-full"
    />
  </div>
</div>
              
              {/* Tabs per navigare tra contenuti */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-6 my-4">
                <div className="border-b border-gray-100">
                  <div className="flex">
                    <button 
                      className={`px-6 py-4 text-sm font-medium ${activeTab === 'moduli' ? 'text-[#1d3a6b] border-b-2 border-[#1d3a6b]' : 'text-black hover:text-gray-700'}`}
                      onClick={() => setActiveTab('moduli')}
                    >
                      Contenuto del modulo
                    </button>
                    <button 
                      className={`px-6 py-4 text-sm font-medium ${activeTab === 'info' ? 'text-[#1d3a6b] border-b-2 border-[#1d3a6b]' : 'text-black hover:text-gray-700'}`}
                      onClick={() => setActiveTab('info')}
                    >
                      Informazioni sul corso
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  {activeTab === 'moduli' && currentModulo && !showQuiz && (
                    <div>
                      <h2 className="text-2xl font-bold text-[#1d3a6b] mb-4">{currentModulo.titolo}</h2>
                      <div 
                        className="prose prose-blue max-w-none"
                        dangerouslySetInnerHTML={{ __html: currentModulo.contenuto }}
                      />
                      
                      {currentModulo.quiz && currentModulo.quiz.length > 0 && (
                        <button 
                          className="mt-8 bg-[#1d3a6b] hover:bg-[#2a4e8d] text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center font-medium"
                          onClick={handleStartQuiz}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                          Inizia il quiz
                        </button>
                      )}
                    </div>
                  )}
                  
                  {activeTab === 'moduli' && currentModulo && showQuiz && !quizCompletato && (
                    <div>
                      <h2 className="text-2xl font-bold text-[#1d3a6b] mb-6">Quiz: {currentModulo.titolo}</h2>
                      
                      {currentModulo.quiz.map((domanda, index) => (
                        <div key={index} className="mb-8 text-black p-6 rounded-lg">
                          <div className="text-lg font-medium text-black mb-4">{index + 1}. {domanda.domanda}</div>
                          <div className="space-y-3">
                            {domanda.opzioni.map((opzione, opzioneIndex) => (
                              <div 
                                key={opzioneIndex}
                                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                                  quizRisposte[index] === opzioneIndex 
                                    ? 'border-[#1d3a6b] bg-[#1d3a6b]/5' 
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                                }`}
                                onClick={() => handleRispostaChange(index, opzioneIndex)}
                              >
                                <div className="flex items-center">
                                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                                    quizRisposte[index] === opzioneIndex 
                                      ? 'border-[#1d3a6b] bg-[#1d3a6b] text-white' 
                                      : 'border-gray-300'
                                  }`}>
                                    {quizRisposte[index] === opzioneIndex && (
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    )}
                                  </div>
                                  <span>{opzione}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      
                      <button 
                        className="w-full bg-[#1d3a6b] hover:bg-[#2a4e8d] text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleQuizSubmit}
                        disabled={Object.keys(quizRisposte).length !== currentModulo.quiz.length}
                      >
                        Invia risposte
                      </button>
                    </div>
                  )}
                  
                  {activeTab === 'moduli' && quizCompletato && quizRisultato && (
                    <div className="text-center py-8">
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${quizRisultato.superato ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {quizRisultato.superato ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      
                      <h2 className="text-2xl font-bold text-black mb-2">
                        {quizRisultato.superato ? 'Quiz superato!' : 'Quiz non superato'}
                      </h2>
                      
                      <div className="text-5xl font-bold text-[#1d3a6b] mb-4">
                        {quizRisultato.percentuale}%
                      </div>
                      
                      <p className="text-black mb-8">
                        Hai risposto correttamente a {quizRisultato.corrette} domande su {quizRisultato.totale}.
                      </p>
                      
                      <div className="flex justify-center gap-4">
                        <button 
                          className="bg-gray-100 hover:bg-gray-200 text-black py-2 px-6 rounded-lg transition-colors font-medium"
                          onClick={() => setShowQuiz(false)}
                        >
                          Torna al contenuto
                        </button>
                      </div>
                      </div>
                  )}                        {/* chiude il quizCompletato */}
                  {activeTab === 'info' && (    /* apre il tab info */
                    <div>
                      {/* qui il contenuto di “Informazioni sul corso” */}
                    </div>
                  )}                        {/* chiude il tab info */}
                </div>                     {/* chiude <div className="p-6"> */}
              </div>                       {/* chiude il blocco tabs */}
            </FadeIn>                   {/* chiude il FadeIn */}
          </div>                       {/* chiude la colonna principale */}
        </div>                         {/* chiude la grid */}
      </div>                           {/* chiude max-w... */}
    </div>                            
  );                                   {/* chiude il return */}
}                                     {/* chiude la funzione */}
