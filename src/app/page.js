"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import AffiliateModal from "./components/AffiliateModal";
import ChatBot from "./components/ChatBot";
import LocationMap from "./components/LocationMap";
import ROICalculator from "./components/ROICalculator";
import FAQSection from "./components/FAQSection";
import TestimonialsSection from "./components/TestimonialsSection";
import VantaggiSection from "./components/VantaggiSection";
import ContactSection from "./components/ContactSection";
import { FadeIn, ScaleIn, SlideIn, Parallax, HoverEffect } from "./components/AnimationProvider";
import { useInView } from "react-intersection-observer";
import { useSpring, animated, config } from "@react-spring/web";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import ServiceModal from "./components/ServiceModal";
import Footer from "./components/footer";
import PreventivoSpedizione from "./components/CalcoloPreventivo";
import { track } from '@vercel/analytics';

// Componente per i meta tag delle sezioni
const SectionMeta = ({ id, title, description }) => {
  return (
    <section id={id} itemScope itemType="https://schema.org/WebPageElement" itemProp="mainContentOfPage">
      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={description} />
    </section>
  );
};

export default function HeroVeryPosta() {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showAffiliateModal, setShowAffiliateModal] = useState(false);
  const [showLocationMap, setShowLocationMap] = useState(false);
  const [showROICalculator, setshowROICalculator] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [showOffers, setShowOffers] = useState(false);
  const [currentOffers, setCurrentOffers] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    isError: false,
    message: ''
  });
  // Animazione per lo scroll indicator
  const [scrollIndicator, scrollIndicatorApi] = useSpring(() => ({
    opacity: 1,
    y: 0,
    config: { tension: 150, friction: 12 }
  }));
  
  // Schema markup per i rich snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "VeryPosta",
    "url": "https://veryposta.it",
    "logo": "https://veryposta.it/dsx.png",
    "description": "VeryPosta offre un franchising multiservizi innovativo con supporto reale, formazione continua e tecnologia inclusa. Servizi postali, energia, telefonia e molto altro in un unico punto.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IT"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+39-000-000000",
      "contactType": "customer service",
      "email": "info@veryposta.it",
      "availableLanguage": "Italian"
    },
    "sameAs": [
      "https://www.facebook.com/veryposta",
      "https://www.instagram.com/veryposta",
      "https://www.linkedin.com/company/veryposta"
    ],
    "offers": {
      "@type": "Offer",
      "name": "Franchising VeryPosta",
      "description": "Diventa affiliato VeryPosta con un investimento iniziale accessibile e competitivo. Formazione completa, supporto dedicato e tecnologia inclusa."
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": "30"
    }
  };

  // Schema markup per le recensioni
  const reviewsJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Josef Cap"
        },
        "reviewBody": "Consiglio vivamente, spedizione accurata e pedana ben imballata. I pacchi sono arrivati a destinazione in perfetto stato e in tempi molto rapidi."
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Mariaconcetta Tabone"
        },
        "reviewBody": "Spedisco spesso pacchi da Torino ed è da un anno che usufruisco del precisissimo servizio di Very Posta Multiservice. Professionalità e affidabilità garantite.",
        "reviewBody": "Spedisco spesso pacchi da Torino ed è da un anno che usufruisco del precisissimo servizio di Very Posta Multiservice. Professionalità e affidabilità garantite."
      }
    ]
  };

  useEffect(() => {
    setIsVisible(true);
    
    // Animazione dello scroll indicator
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 100) {
        scrollIndicatorApi.start({ opacity: 0, y: 20 });
      } else {
        scrollIndicatorApi.start({ opacity: 1, y: 0 });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollIndicatorApi]);

  // Gestione visibilità form
  useEffect(() => {
    const tipoSelect = document.getElementById('tipo');
    const formLuce = document.getElementById('formLuce');
    const formGas = document.getElementById('formGas');

    if (tipoSelect && formLuce && formGas) {
      const handleTipoChange = () => {
        const selectedValue = tipoSelect.value;
        formLuce.classList.toggle('hidden', selectedValue !== 'luce');
        formGas.classList.toggle('hidden', selectedValue !== 'gas');
      };

      tipoSelect.addEventListener('change', handleTipoChange);
      return () => tipoSelect.removeEventListener('change', handleTipoChange);
    }
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData(e.target);
    
    track('Contact Form Submit', {
      hasName: !!formData.name,
      hasEmail: !!formData.email,
      hasPhone: !!formData.phone,
      hasMessage: !!formData.message
    });
    const tipo = formDataObj.get("tipo");
    
    // Salva i dati nel database
    try {
      // Prepara i dati da inviare
      const dataToSave = {
        tipo: tipo,
        // Dati comuni
        name: formData.name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        message: `Richiesta preventivo ${tipo}`,
        // Dati specifici per luce
        ...(tipo === 'luce' && {
          consumoFattura: formDataObj.get("consumoFattura"),
          periodoFattura: formDataObj.get("periodoFattura"),
          potenzaImpegnata: formDataObj.get("potenzaImpegnata"),
          tariffa: formDataObj.get("tariffa"),
          mercato: formDataObj.get("mercato")
        }),
        // Dati specifici per gas
        ...(tipo === 'gas' && {
          consumoFatturaGas: formDataObj.get("consumoFatturaGas"),
          periodoFatturaGas: formDataObj.get("periodoFatturaGas"),
          zonaClimatica: formDataObj.get("zonaClimatica"),
          utilizzo: formDataObj.get("utilizzo")
        }),
        status: 'new',
        created_at: new Date().toISOString()
      };
      
      // Invia i dati all'API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });
      
      const result = await response.json();
z      
      if (response.ok) {
        // Mostra messaggio di successo
        alert('Richiesta inviata con successo! Ti contatteremo presto.');
      } else {
        console.error('Errore durante il salvataggio dei dati:', result.message);
        alert('Si è verificato un errore. Riprova più tardi.');
      }
    } catch (error) {
      console.error('Errore durante l\'invio del form:', error);
      alert('Si è verificato un errore di connessione. Riprova più tardi.');
    }
    
    // Calcolo per luce
    if (tipo === "luce") {
      const consumoFattura = parseFloat(formDataObj.get("consumoFattura"));
      const periodoFattura = parseFloat(formDataObj.get("periodoFattura"));
      const potenzaImpegnata = parseFloat(formDataObj.get("potenzaImpegnata"));
      const tariffa = formDataObj.get("tariffa");
      const mercato = formDataObj.get("mercato");
      
      // Calcolo consumo giornaliero e mensile
      const consumoGiornaliero = consumoFattura / periodoFattura;
      const consumoMensile = consumoGiornaliero * 30;
      const consumoAnnuale = consumoMensile * 12;
      
      // Calcolo costo attuale
      let costoAttuale = 0;
      if (mercato === "tutelato") {
        costoAttuale = consumoAnnuale * 0.15; // Prezzo tutelato medio
      } else {
        costoAttuale = consumoAnnuale * 0.20; // Prezzo libero medio
      }
      
      // Aggiungi costi fissi
      costoAttuale += potenzaImpegnata * 12 * 30; // Costo potenza mensile
      
      // Calcolo costo con VeryPosta
      const costoVeryPosta = consumoAnnuale * 0.14 + (potenzaImpegnata * 12 * 30);
      const risparmio = costoAttuale - costoVeryPosta;
      const percentualeRisparmio = ((risparmio / costoAttuale) * 100).toFixed(1);
      
      setShowOffers(true);
      setCurrentOffers([
        {
          title: "VeryPosta Luce Smart",
          desc: `Con il tuo consumo attuale di ${consumoAnnuale.toFixed(0)} kWh/anno, potresti risparmiare ${risparmio.toFixed(2)}€ (${percentualeRisparmio}%)`,
          prezzo: "0.14 €/kWh",
          risparmio: "Prezzo fisso per 24 mesi",
          icon: "⚡",
          dettagli: [
            "Prezzo energia bloccato per 24 mesi",
            "Nessun costo di attivazione",
            "Assistenza dedicata 24/7",
            "App per monitorare i consumi"
          ]
        },
        {
          title: "VeryPosta Luce Green",
          desc: "Energia 100% rinnovabile con prezzo variabile",
          prezzo: "0.12 €/kWh",
          risparmio: "Fino al 30% di risparmio",
          icon: "🌱",
          dettagli: [
            "Energia da fonti rinnovabili",
            "Prezzo variabile con tetto massimo",
            "Cashback mensile sui consumi",
            "Monitoraggio consumi in tempo reale"
          ]
        }
      ]);
    }
    
    // Calcolo per gas
    if (tipo === "gas") {
      const consumoFattura = parseFloat(formDataObj.get("consumoFatturaGas"));
      const periodoFattura = parseFloat(formDataObj.get("periodoFatturaGas"));
      const zonaClimatica = formDataObj.get("zonaClimatica");
      const utilizzo = formDataObj.get("utilizzo");
      
      // Calcolo consumo giornaliero e mensile
      const consumoGiornaliero = consumoFattura / periodoFattura;
      const consumoMensile = consumoGiornaliero * 30;
      const consumoAnnuale = consumoMensile * 12;
      
      // Calcolo costo attuale
      let costoAttuale = consumoAnnuale * 0.60; // Prezzo medio Smc
      
      // Calcolo costo con VeryPosta
      const costoVeryPosta = consumoAnnuale * 0.45;
      const risparmio = costoAttuale - costoVeryPosta;
      const percentualeRisparmio = ((risparmio / costoAttuale) * 100).toFixed(1);
      
      setShowOffers(true);
      setCurrentOffers([
        {
          title: "VeryPosta Gas Comfort",
          desc: `Con il tuo consumo attuale di ${consumoAnnuale.toFixed(0)} Smc/anno, potresti risparmiare ${risparmio.toFixed(2)}€ (${percentualeRisparmio}%)`,
          prezzo: "0.45 €/Smc",
          risparmio: "Prezzo fisso per 24 mesi",
          icon: "🔥",
          dettagli: [
            "Prezzo gas bloccato per 24 mesi",
            "Nessun costo di attivazione",
            "Assistenza dedicata 24/7",
            "App per monitorare i consumi"
          ]
        },
        {
          title: "VeryPosta Gas Premium",
          desc: "Tariffa variabile con cashback mensile",
          prezzo: "0.40 €/Smc",
          risparmio: "Fino al 35% di risparmio",
          icon: "💎",
          dettagli: [
            "Prezzo variabile con tetto massimo",
            "Cashback mensile sui consumi",
            "Monitoraggio consumi in tempo reale",
            "Assistenza dedicata"
          ]
        }
      ]);
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      track('Navigation Click', {
        section: id,
        timestamp: new Date().toISOString()
      });
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  // Tracciamento click servizi
  const handleServiceClick = (service) => {
    track('Service Click', {
      serviceName: service.name,
      serviceIcon: service.icon
    });
    setCurrentService(service);
    setShowServiceModal(true);
  };

  // Tracciamento click affiliazione
  const handleAffiliateClick = () => {
    track('Affiliate Button Click', {
      location: 'main_page',
      timestamp: new Date().toISOString()
    });
    setShowAffiliateModal(true);
  };

  // Tracciamento visualizzazione offerte
  const handleOfferView = (offer) => {
    track('Offer View', {
      offerTitle: offer.title,
      offerPrice: offer.prezzo,
      offerType: offer.icon === '⚡' ? 'electricity' : 'gas'
    });
  };

  return (
    <main className="bg-gradient-to-br from-white to-[#f6f7fb] font-sans text-[#1d3a6b] ">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-5 flex justify-between items-center">

        {/* Logo */}
        <div className="text-3xl font-black tracking-tight">
          <span className="text-[#1d3a6b]">Very</span>
          <span className="text-[#ebd00b]">Posta</span>
        </div>

        {/* Menu Desktop */}
        <div className="hidden lg:flex gap-10 font-poppins text-lg font-semibold items-center">
          <a onClick={() => scrollToSection("perche")} className="hover:text-[#ebd00b] cursor-pointer transition">Perché</a>
          <a onClick={() => scrollToSection("servizi")} className="hover:text-[#ebd00b] cursor-pointer transition">Servizi</a>
          <a onClick={() => scrollToSection("vantaggi")} className="hover:text-[#ebd00b] cursor-pointer transition">Vantaggi</a>
          <a onClick={() => scrollToSection("media")} className="hover:text-[#ebd00b] cursor-pointer transition">Gallery</a>
          <a onClick={() => scrollToSection("contatti")} className="hover:text-[#ebd00b] cursor-pointer transition">Contatti</a>
        </div>

        {/* CTA Desktop */}
        <div className="hidden lg:flex gap-4 items-center">
          <Link href="/accesso" className="text-[#1d3a6b] hover:text-[#ebd00b] transition font-semibold">
            Area Riservata
          </Link>
          <button
            onClick={handleAffiliateClick}
            className="bg-[#ebd00b] text-[#1d3a6b] px-7 py-3 text-lg rounded-full font-bold hover:bg-yellow-400 transition"
          >
            Diventa Affiliato
          </button>
        </div>

        {/* Menu toggle Mobile */}
        <button
          className="lg:hidden text-3xl text-[#1d3a6b] font-bold"
          onClick={() => setIsOpen(true)}
          aria-label="Apri menu mobile"
        >
          ☰
        </button>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-[9999] bg-white text-[#1d3a6b] flex flex-col justify-between px-6 py-10 overflow-y-auto shadow-2xl animate-fade-in">
          
          {/* Pulsante chiudi */}
          <div className="flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className="text-5xl font-bold hover:text-[#ebd00b] transition"
              aria-label="Chiudi menu"
            >
              ×
            </button>
          </div>

          {/* Link sezione */}
          <nav className="flex flex-col items-center gap-6 mt-10 text-2xl font-semibold font-poppins">
            {[
              { label: "Perché", id: "perche" },
              { label: "Servizi", id: "servizi" },
              { label: "Vantaggi", id: "vantaggi" },
              { label: "Gallery", id: "media" },
              { label: "Contatti", id: "contatti" }
            ].map(({ label, id }) => (
              <a
                key={id}
                onClick={() => {
                  scrollToSection(id);
                  setIsOpen(false);
                }}
                className="cursor-pointer hover:text-[#ebd00b] transition"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* CTA finali */}
          <div className="mt-10 flex flex-col items-center gap-4">
            <Link
              href="/accesso"
              onClick={() => setIsOpen(false)}
              className="text-lg font-semibold hover:text-[#ebd00b] transition"
            >
              Area Riservata
            </Link>
            <button
              onClick={() => {
                setIsOpen(false);
                setShowAffiliateModal(true);
              }}
              className="bg-[#ebd00b] text-[#1d3a6b] px-7 py-3 rounded-full font-bold text-lg hover:bg-yellow-400 transition w-full max-w-xs"
            >
              Diventa Affiliato
            </button>
          </div>
        </div>
      )}
    </nav>

      {/* Hero Section */}
      
      <section className="min-h-screen flex flex-col-reverse lg:flex-row items-center justify-center pt-40 px-6 sm:px-10 lg:px-12 max-w-[1400px] mx-auto gap-16 lg:gap-20 relative">
        {/* Testi */}
        <FadeIn direction="left" delay={3}>
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-8xl md:text-6xl lg:text-8xl font-black leading-tight tracking-tight mb-6">
              Il Futuro dei <span className="text-[#ebd00b]">Multiservizi</span> è Ora
            </h1>
            <p className="text-base sm:text-lg md:text-xl font-poppins text-gray-700 mb-8 max-w-xl mx-auto lg:mx-0">
              Unisciti a VeryPosta: franchising innovativo, servizi integrati, supporto reale.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <HoverEffect scale={1.05}>
                <button 
                  onClick={handleAffiliateClick} 
                  className="bg-[#ebd00b] text-[#1d3a6b] px-6 py-3 rounded-full text-base sm:text-lg font-bold hover:bg-yellow-400 transition shadow-md w-full"
                >
                  Scopri il Franchising
                </button>
              </HoverEffect>
              <HoverEffect scale={1.05}>
                <button 
                  onClick={() => scrollToSection('contatti')} 
                  className="border-2 border-[#ebd00b] text-[#1d3a6b] px-6 py-3 rounded-full text-base sm:text-lg font-bold hover:bg-[#ebd00b] hover:text-white transition w-full"
                >
                  Contattaci
                </button>
              </HoverEffect>
            </div>
          </div>
        </FadeIn>

        {/* Immagine */}
        <ScaleIn delay={5}>
          <Image
            src="/home.png"
            alt="VeryPosta - Franchising multiservizi innovativo con supporto reale e formazione continua"
            width={1000}
            height={1000}
            className="w-[700px] sm:w-[700px] lg:w-[700px] xl:w-[1200px] h-auto drop-shadow-2xl parallax-image hero-img"
            priority
          />
        </ScaleIn>
        
        {/* Scroll indicator */}
        <animated.div 
          style={scrollIndicator} 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer hidden md:flex"
          onClick={() => scrollToSection('perche')}
        >
          <span className="text-sm text-gray-500 mb-2">Scopri di più</span>
          <div className="w-6 h-10 border-2 border-[#1d3a6b] rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-[#ebd00b] rounded-full animate-bounce"></div>
          </div>
        </animated.div>
      </section>


      {/* Perché VeryPosta */}
      <section id="perche" className="py-24 px-6 sm:px-10 lg:px-12 w-full max-w-[1400px] mx-auto text-[#1d3a6b]">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-4">
            Perché scegliere <span className="text-[#ebd00b]">VeryPosta</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 font-poppins max-w-2xl mx-auto">
            Un franchising multiservizi con vantaggi reali e supporto concreto.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {[
            {
              icon: "🎓",
              title: "Formazione Continua",
              desc: "Corsi sempre aggiornati su aspetti legali, operativi e digitali."
            },
            {
              icon: "🤝",
              title: "Supporto Dedicato",
              desc: "Assistenza personalizzata in fase di avvio e gestione."
            },
            {
              icon: "💻",
              title: "Tecnologia Inclusa",
              desc: "Dashboard gestionali e strumenti digitali pronti all'uso."
            }
          ].map((item, index) => (
            <div key={index} className="bg-[#f6f7fb] rounded-3xl p-8 sm:p-10 shadow-md hover:shadow-lg transition-all text-center">
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
              <p className="text-base sm:text-lg text-gray-600 font-poppins">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Chi Siamo */}
      <section id="chi-siamo" className="py-24 px-6 sm:px-10 lg:px-12 w-full max-w-[1400px] mx-auto text-[#1d3a6b]">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-4">
            La Nostra <span className="text-[#ebd00b]">Storia</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 font-poppins max-w-3xl mx-auto">
            Scopri chi siamo e la visione che guida VeryPosta verso l'innovazione nel settore dei multiservizi
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center bg-gradient-to-br from-[#f6f7fb] to-white p-8 lg:p-12 rounded-3xl shadow-lg border border-gray-100">
          {/* Contenuto testuale */}
          <div className="order-2 md:order-1">
            <FadeIn direction="left">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-1.5 w-12 bg-[#ebd00b] rounded-full"></div>
                  <h3 className="text-xl font-bold text-[#1d3a6b]">La Nostra Visione</h3>
                </div>
                
                <p className="text-lg text-gray-700 font-poppins leading-relaxed">
                  <span className="font-semibold text-[#1d3a6b]">VeryPosta</span> nasce dalla visione imprenditoriale di <span className="font-semibold text-[#1d3a6b]">Veronica Stagno</span>, che nel <span className="font-semibold">2020</span> ha dato vita a un progetto ambizioso: creare una rete di punti multiservizi innovativi in tutta Italia, capaci di rispondere alle esigenze di un mercato in continua evoluzione.
                </p>
                
                <div className="flex items-center gap-3 mb-2 mt-8">
                  <div className="h-1.5 w-12 bg-[#ebd00b] rounded-full"></div>
                  <h3 className="text-xl font-bold text-[#1d3a6b]">La Nostra Missione</h3>
                </div>
                
                <p className="text-lg text-gray-700 font-poppins leading-relaxed">
                  Offriamo soluzioni integrate per privati e aziende, combinando servizi postali tradizionali con consulenze specializzate in ambito energetico, telefonico e amministrativo. Il nostro obiettivo è diventare il punto di riferimento per chiunque necessiti di servizi professionali, garantendo qualità, efficienza e innovazione.
                </p>
                
                <div className="flex items-center gap-3 mb-2 mt-8">
                  <div className="h-1.5 w-12 bg-[#ebd00b] rounded-full"></div>
                  <h3 className="text-xl font-bold text-[#1d3a6b]">Cosa Ci Distingue</h3>
                </div>
                
                <p className="text-lg text-gray-700 font-poppins leading-relaxed">
                  Ciò che ci rende unici è l'approccio orientato al supporto reale degli affiliati, con formazione continua, assistenza dedicata e strumenti tecnologici all'avanguardia. Non siamo solo un franchising, ma un partner che cresce insieme ai propri affiliati, condividendo successi e sfide.
                </p>
                
                <div className="mt-8 flex gap-4">
                  <HoverEffect scale={1.05}>
                    <button 
                      onClick={() => scrollToSection('contatti')} 
                      className="bg-[#ebd00b] text-[#1d3a6b] px-6 py-3 rounded-full text-base font-bold hover:bg-yellow-400 transition shadow-md flex items-center gap-2"
                    >
                      Contattaci
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </HoverEffect>
                </div>
              </div>
            </FadeIn>
          </div>
          
          {/* Immagine della titolare */}
          <div className="flex justify-center order-1 md:order-2">
            <ScaleIn>
              <div className="relative w-full max-w-[350px] mx-auto">
                <div className="absolute -top-6 -left-6 w-24 h-24 sm:w-32 sm:h-32 bg-[#ebd00b]/20 rounded-full blur-2xl z-0"></div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 sm:w-32 sm:h-32 bg-[#1d3a6b]/20 rounded-full blur-2xl z-0"></div>
                
                <div className="relative w-full aspect-[3/4] rounded-3xl shadow-xl border-4 border-white z-10">
                  {/* Sostituire con la foto della titolare quando disponibile */}
                  <img
                    src="/founder.png"
                    alt="Veronica Stagno - Fondatrice di VeryPosta"
                    className="rounded-2xl hover:scale-105 transition-transform duration-700 ease-in-out w-full h-full object-cover"
                  />
                </div>
                
                <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-white px-4 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg z-20 w-[90%] max-w-[250px]">
                  <p className="text-center font-semibold text-[#1d3a6b] text-sm sm:text-base">
                    Veronica Stagno
                    <span className="block text-xs sm:text-sm text-gray-500 mt-1">Fondatrice & CEO</span>
                  </p>
                </div>
              </div>
            </ScaleIn>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {[
            {
              number: "30+",
              label: "Punti Affiliati",
              desc: "in tutta Italia"
            },
            {
              number: "1000+",
              label: "Clienti Soddisfatti",
              desc: "ogni mese"
            },
            {
              number: "20+",
              label: "Servizi Offerti",
              desc: "per privati e aziende"
            }
          ].map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 text-center hover:shadow-lg transition-all">
              <h3 className="text-4xl font-black text-[#ebd00b] mb-2">{stat.number}</h3>
              <p className="text-xl font-bold text-[#1d3a6b] mb-1">{stat.label}</p>
              <p className="text-gray-500">{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="servizi" className="py-24 px-6 sm:px-10 lg:px-12 w-full max-w-[1400px] mx-auto text-[#1d3a6b]">
  <div className="text-center mb-16">
    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-4">
      I nostri <span className="text-[#ebd00b]">Servizi</span>
    </h2>
    <p className="text-lg sm:text-xl text-gray-600 font-poppins max-w-2xl mx-auto">
      Tutto ciò che serve per offrire qualità e professionalità in un unico punto.
    </p>
  </div>

  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-10 text-center">
    {[
      { name: "Servizi Postali", icon: "✉️" },
      { name: "Spedizioni", icon: "📦" },
      { name: "Energia", icon: "⚡" },
      { name: "Telefonia", icon: "📱" },
      { name: "CAF/Patronato", icon: "📄" },
      { name: "SPID", icon: "🔐" },
      { name: "Firme Digitali", icon: "✍️" },
      { name: "PEC", icon: "📧" },
      { name: "Pratiche", icon: "📋" },
      { name: "Altri Servizi", icon: "🔍" }
    ].map((s, i) => (
      <div 
        key={i} 
        className="bg-white p-6 rounded-3xl shadow-md hover:shadow-lg transition-all cursor-pointer"
        onClick={() => handleServiceClick(s)}
      >
        <div className="text-3xl sm:text-4xl mb-3">{s.icon}</div>
        <p className="font-poppins text-sm sm:text-base text-[#1d3a6b] font-medium">{s.name}</p>
      </div>
    ))}
  </div>
</section>




  
<section id="vantaggi" className="py-24 px-6 sm:px-10 lg:px-12 w-full max-w-[1400px] mx-auto  text-[#1d3a6b]">
  <div className="grid lg:grid-cols-2 gap-16 items-center">
    
    {/* Lista vantaggi */}
    <div>
      <h2 className="text-2xl sm:text-4xl lg:text-6xl font-black leading-tight tracking-tight mb-8">
        Vantaggi dell'<span className="text-[#ebd00b]">Affiliazione</span>
      </h2>
      <ul className="space-y-6 text-lg sm:text-xl font-poppins text-gray-700">
        {[
          "Investimento iniziale accessibile e competitivo",
          "Contratto triennale con rinnovo automatico",
          "Formazione completa per l'avviamento",
          "Accesso a convenzioni nazionali vantaggiose",
          "Grafica e materiali espositivi pronti all'uso",
          "Supporto costante e operativo in ogni fase"
        ].map((item, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="text-[#ebd00b] text-2xl">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* Testimonianza */}
    <div className=" rounded-3xl p-8 sm:p-10 ">
      <div className="text-6xl text-[#ebd00b] font-serif mb-4">"</div>
      <p className="text-lg sm:text-xl text-gray-700 font-poppins italic mb-6">
        Con VeryPosta ho potuto ampliare i miei servizi, fidelizzare i clienti e aumentare il mio fatturato. Supporto reale e formazione continua: davvero un punto di svolta.
      </p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#ebd00b] text-[#1d3a6b] flex items-center justify-center text-xl font-bold">M</div>
        <div>
          <div className="font-bold">Mario Rossi</div>
          <div className="text-sm text-gray-500">Affiliato dal 2023</div>
        </div>
      </div>
    </div>

  </div>
</section>


<section id="media" className="py-24 px-6 sm:px-10 lg:px-12 w-full max-w-[1400px] mx-auto text-[#1d3a6b]">
  <div className="text-center mb-16">
    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-4">
      Dentro un <span className="text-[#ebd00b]">VeryPosta Point</span>
    </h2>
    <p className="text-lg sm:text-xl text-gray-600 font-poppins max-w-2xl mx-auto">
      Un piccolo mondo di servizi, design e tecnologia: scopri i nostri spazi.
    </p>
  </div>

  {/* Desktop View */}
  <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="grid grid-cols-2 gap-6 col-span-2">
      {[
        { src: '/arag3.jpg', alt: 'Interno di un punto VeryPosta con servizi multimediali e postali' },
        { src: '/arag2.jpg', alt: 'Sportello clienti VeryPosta con operatore che fornisce assistenza' },
        { src: '/arag4.jpg', alt: 'Area servizi digitali di un punto VeryPosta con postazioni moderne' },
        { src: '/port1.jpg', alt: 'Vetrina esterna di un punto VeryPosta con insegna e grafica ufficiale' }
      ].map((item, i) => (
        <img
          key={i}
          src={item.src}
          alt={item.alt}
          className="w-full rounded-3xl object-cover aspect-[4/3] hover:scale-[1.03] transition-transform shadow-md"
        />
      ))}
    </div>
    <div>
      <video
        src="/videofranch.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full rounded-3xl object-cover aspect-[10/16] hover:scale-[1.01] transition-transform shadow-xl"
      />
    </div>
  </div>

  {/* Mobile Carousel */}
  <div className="lg:hidden">
    <Swiper
      modules={[Pagination]}
      spaceBetween={16}
      slidesPerView={1.1}
      pagination={{ clickable: true }}
      className="pb-10"
    >
      {[
        { src: '/arag3.jpg', alt: 'Interno di un punto VeryPosta con servizi multimediali e postali' },
        { src: '/arag2.jpg', alt: 'Sportello clienti VeryPosta con operatore che fornisce assistenza' },
        { src: '/arag4.jpg', alt: 'Area servizi digitali di un punto VeryPosta con postazioni moderne' },
        { src: '/port1.jpg', alt: 'Vetrina esterna di un punto VeryPosta con insegna e grafica ufficiale' }
      ].map((item, i) => (
        <SwiperSlide key={i}>
          <img
            src={item.src}
            alt={item.alt}
            className="w-full rounded-3xl object-cover aspect-[2/3] shadow-md"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
</section>

{/* Onda decorativa superiore */}



<section
  id="contatti"
  className="relative  text-[#1d3a6b] overflow-hidden min-h-screen flex items-end px-6 sm:px-10 lg:px-12"
>

  {/* Onda Gialla in basso */}
  <div className="absolute bottom-90 left-0 w-full overflow-hidden leading-none z-0">
    <svg
      viewBox="0 0 1440 320"
      className="w-full h-80"
      preserveAspectRatio="none"
    >
      <path
        fill="#ebd00b"
        fillOpacity="1"
        d="M0,64L80,69.3C160,75,320,85,480,101.3C640,117,800,139,960,144C1120,149,1280,139,1360,133.3L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
      ></path>
    </svg>
  </div>

  {/* Contenuto centrale */}
  <div className="relative z-10 grid md:grid-cols-2 gap-5 items-center w-full max-w-[1400px] mx-auto pb-20">

    {/* Colonna sinistra illustrata */}
    <div className="flex flex-col items-start justify-center">
      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-6">
        Pronto a <span className="text-[#ebd00b]">Contattarci?</span>
      </h2>
      <p className="text-lg sm:text-xl text-gray-700 font-poppins mb-10 max-w-lg">
        Scrivici per ricevere informazioni, scoprire il franchising o fissare una call conoscitiva.
      </p>
      <img
        src="/svg.png"
        alt="Contattaci VeryPosta - Modulo di contatto per informazioni sul franchising"
        className="w-full VeryPostasvg"
        width={400}
        height={600}
        loading="lazy"
      />
    </div>

    {/* Form */}
    <form onSubmit={handleFormSubmit} className="bg-white shadow-2xl rounded-3xl p-10 space-y-6 w-full z-10">
      {formStatus.isSubmitted && (
        <div className={`p-4 rounded-xl ${formStatus.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {formStatus.message}
        </div>
      )}
      <div>
        <label htmlFor="name" className="block font-bold text-sm mb-1">Nome e Cognome</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
          placeholder="Mario Rossi"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block font-bold text-sm mb-1">Email</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
          placeholder="email@esempio.it"
          required
        />
      </div>
      <div>
        <label htmlFor="phone" className="block font-bold text-sm mb-1">Telefono</label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
          placeholder="+39 123 456 7890"
          required
        />
      </div>
      <div>
        <label htmlFor="message" className="block font-bold text-sm mb-1">Messaggio</label>
        <textarea
          id="message"
          rows="4"
          value={formData.message}
          onChange={handleInputChange}
          className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
          placeholder="Scrivi qui il tuo messaggio..."
          required
        ></textarea>
      </div>
      <button
        type="submit"
        disabled={formStatus.isSubmitting}
        className="w-full bg-[#1d3a6b] text-white px-6 py-4 rounded-full text-lg font-bold hover:bg-[#16305b] transition disabled:opacity-70"
      >
        {formStatus.isSubmitting ? 'Invio in corso...' : 'Invia Messaggio'}
      </button>
    </form>
  </div>
</section>

<div className="absolute  w-full overflow-hidden leading-none z-0 rotate">
    <svg
      viewBox="0 0 1440 180"
      className="w-full "
      preserveAspectRatio="none"
    
    >
      <path
        fill="#ebd00b"
        fillOpacity="1"
        d="M0,64L80,69.3C160,75,320,85,480,101.3C640,117,800,139,960,144C1120,149,1280,139,1360,133.3L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
      ></path>
    </svg>
  </div>

<section
  id="diventa-point"
  className="relative text-[#1d3a6b] overflow-hidden py-24 px-6 sm:px-10 lg:px-12 max-w-[1400px] mx-auto"
>


  
  {/* Contenuto */}
  <div className="grid md:grid-cols-2 gap-16 items-center">
    {/* Testo a sinistra */}
    <div className="flex flex-col justify-center">
      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-6">
        Diventa un <span className="text-[#ebd00b]">Point</span> VeryPosta
      </h2>
      <p className="text-lg sm:text-xl text-gray-700 font-poppins mb-10 max-w-xl">
        Trasforma la tua attività in un centro multiservizi innovativo con il supporto di un brand solido, strumenti digitali, marketing, formazione e convenzioni nazionali.
      </p>
      <button 
        onClick={handleAffiliateClick} 
        className="w-fit bg-[#ebd00b] text-[#1d3a6b] px-8 py-4 rounded-full text-lg font-bold hover:bg-yellow-400 transition"
      >
        Richiedi Informazioni
      </button>
    </div>

    {/* Illustrazione */}
    <div className="flex justify-center">
      <img
        src="/diventapoint.png"
        alt="Diventa Point VeryPosta - Opportunità di franchising con supporto e formazione"
        className="w-full drop-shadow-xxl"
        width={800}
        height={600}
        loading="lazy"
      />
    </div>
  </div>
</section>



<section id="offerte" className="py-24 px-6 sm:px-10 lg:px-12 w-full max-w-[1400px] mx-auto text-[#1d3a6b]">
  <div className="text-center mb-16">
    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-4">
      Scopri se puoi <span className="text-[#ebd00b]">Risparmiare</span> con VeryPosta
    </h2>
    <p className="text-lg sm:text-xl text-gray-600 font-poppins max-w-2xl mx-auto">
      Inserisci i dati della tua attuale fornitura luce o gas e verifica subito se abbiamo offerte più vantaggiose per te!
    </p>
  </div>

  {/* Formulario */}
  <div className="bg-white shadow-2xl rounded-3xl p-8 sm:p-12 space-y-8 max-w-3xl mx-auto">
    <form 
      onSubmit={handleFormSubmit}
      className="space-y-6"
    >
      {/* Tipo di servizio */}
      <div className="flex flex-col gap-2">
        <label htmlFor="tipo" className="font-semibold">Tipo di servizio</label>
        <select 
          id="tipo" 
          name="tipo" 
          required
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="border border-gray-300 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
        >
          <option value="">Seleziona un servizio</option>
          <option value="luce">Luce</option>
          <option value="gas">Gas</option>
        </select>
      </div>

      {/* Form Luce */}
      {selectedService === 'luce' && (
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="consumoFattura" className="font-semibold">Consumo ultima fattura (kWh)</label>
            <input 
              type="number" 
              id="consumoFattura" 
              name="consumoFattura" 
              required
              placeholder="Es. 250"
              className="border border-gray-300 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="periodoFattura" className="font-semibold">Periodo fattura (giorni)</label>
            <input 
              type="number" 
              id="periodoFattura" 
              name="periodoFattura" 
              required
              placeholder="Es. 30"
              className="border border-gray-300 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="potenzaImpegnata" className="font-semibold">Potenza impegnata (kW)</label>
            <select 
              id="potenzaImpegnata" 
              name="potenzaImpegnata" 
              required
              className="border border-gray-300 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
            >
              <option value="3">3 kW</option>
              <option value="4.5">4.5 kW</option>
              <option value="6">6 kW</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="tariffa" className="font-semibold">Tipo di tariffa</label>
            <select 
              id="tariffa" 
              name="tariffa" 
              required
              className="border border-gray-300 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
            >
              <option value="monoraria">Monoraria</option>
              <option value="bioraria">Bioraria</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="mercato" className="font-semibold">Mercato attuale</label>
            <select 
              id="mercato" 
              name="mercato" 
              required
              className="border border-gray-300 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
            >
              <option value="tutelato">Tutelato</option>
              <option value="libero">Libero</option>
            </select>
          </div>
        </div>
      )}

      {/* Form Gas */}
      {selectedService === 'gas' && (
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="consumoFatturaGas" className="font-semibold">Consumo ultima fattura (Smc)</label>
            <input 
              type="number" 
              id="consumoFatturaGas" 
              name="consumoFatturaGas" 
              required
              placeholder="Es. 100"
              className="border border-gray-300 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="periodoFatturaGas" className="font-semibold">Periodo fattura (giorni)</label>
            <input 
              type="number" 
              id="periodoFatturaGas" 
              name="periodoFatturaGas" 
              required
              placeholder="Es. 30"
              className="border border-gray-300 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="zonaClimatica" className="font-semibold">Zona climatica</label>
            <select 
              id="zonaClimatica" 
              name="zonaClimatica" 
              required
              className="border border-gray-300 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
            >
              <option value="A">A (Sud Italia)</option>
              <option value="B">B (Centro Italia)</option>
              <option value="C">C (Nord Italia)</option>
              <option value="D">D (Alpi)</option>
              <option value="E">E (Montagna)</option>
              <option value="F">F (Alta Montagna)</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="utilizzo" className="font-semibold">Utilizzo principale</label>
            <select 
              id="utilizzo" 
              name="utilizzo" 
              required
              className="border border-gray-300 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
            >
              <option value="riscaldamento">Riscaldamento</option>
              <option value="acqua">Acqua calda</option>
              <option value="cucina">Cucina</option>
              <option value="misto">Utilizzo misto</option>
            </select>
          </div>
        </div>
      )}

      {/* Bottone invio */}
      <div className="text-center">
        <button 
          type="submit" 
          className="bg-[#ebd00b] text-[#1d3a6b] px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition"
        >
          Verifica Risparmio
        </button>
      </div>
    </form>

    {/* Sezione Offerte */}
    {showOffers && (
      <div className="mt-12 space-y-6">
        <h3 className="text-2xl font-bold text-center">Le nostre offerte per te</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {currentOffers.map((offer, index) => (
            <div 
              key={index} 
              className="bg-[#f6f7fb] rounded-3xl p-6 shadow-md hover:shadow-lg transition-all"
              onMouseEnter={() => handleOfferView(offer)}
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{offer.icon}</span>
                <div>
                  <h4 className="text-xl font-bold">{offer.title}</h4>
                  <p className="text-[#ebd00b] font-semibold">{offer.prezzo}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{offer.desc}</p>
              <ul className="space-y-2 mb-4">
                {offer.dettagli.map((dettaglio, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600">
                    <span className="text-[#ebd00b]">✓</span>
                    {dettaglio}
                  </li>
                ))}
              </ul>
              <button 
                className="mt-4 w-full bg-[#1d3a6b] text-white px-6 py-3 rounded-full font-bold hover:bg-[#16305b] transition"
                onClick={handleAffiliateClick}
              >
                Richiedi Informazioni
              </button>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
</section>


{/* <section className="bg-[#ebd00b] text-[#1d3a6b] py-24 text-center px-6 sm:px-10">
  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
    Vuoi aprire il tuo VeryPosta Point?
  </h2>
  <p className="text-lg sm:text-xl mb-10 font-poppins max-w-2xl mx-auto">
    Scopri come diventare affiliato con un investimento minimo e il massimo del supporto.
  </p>
  <div className="flex flex-col sm:flex-row justify-center gap-4">
    <button className="bg-[#1d3a6b] text-white px-8 py-4 text-lg rounded-full font-bold hover:bg-[#142c58] transition">
      Richiedi Informazioni
    </button>
    <button className="border-2 border-[#1d3a6b] text-[#1d3a6b] px-8 py-4 text-lg rounded-full font-bold hover:bg-white transition">
      Scarica la Brochure
    </button>
  </div>
</section> */}
<section
  id="dashboard-section"
  className="w-full py-24 px-0 sm:px-10 lg:px-12 max-w-[1400px] mx-auto text-[#1d3a6b]"
>
  <div className="text-center mb-16 px-6 sm:px-0">
    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-4">
      Il Cuore <span className="text-[#ebd00b]">Digitale</span> di ogni Point
    </h2>
    <p className="text-lg sm:text-xl text-gray-600 font-poppins max-w-2xl mx-auto">
      La nostra dashboard può <br />
      aiutarti a gestire tutto, senza pensieri. Accessibile, veloce
    </p>
  </div>

  {/* Wrapper con comportamento responsive */}
  <div className="relative overflow-x-visible -mx-6 sm:mx-0">
    <div
      className="w-[200vw] sm:w-full max-w-[1200px] mx-auto 
      sm:rounded-3xl sm:overflow-hidden 
      sm:shadow-2xl"
    >
      <img
        src="/Mockup.png" // <-- sostituisci col tuo mockup
        alt="Dashboard Affiliati VeryPosta"
        className="w-full h-auto object-cover"
      />
    </div>
  </div>

  <div className="text-center mt-12 px-6 sm:px-0">
    <p className="text-md text-gray-500 font-medium">
      Tutto a portata di click. In tempo reale. Sempre con stile.
    </p>
  </div>
</section>

<PreventivoSpedizione></PreventivoSpedizione>
      {/* Sezione Vantaggi */}
      <VantaggiSection />

      {/* Sezione FAQ */}
      <FAQSection />

      {/* Sezione Testimonials */}
      <section id="testimonial" className="py-24 px-6 sm:px-10 lg:px-12 w-full max-w-[1400px] mx-auto text-[#1d3a6b]">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-4">
            Cosa dicono i nostri <span className="text-[#ebd00b]">Clienti</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 font-poppins max-w-2xl mx-auto">
            Scopri le esperienze di chi ha scelto i nostri servizi
          </p>
        </div>

        {/* Statistiche */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {[
            { number: "5/5", label: "Valutazione Media" },
            { number: "30+", label: "Point Attivi" },
            { number: "15+", label: "Servizi Integrati" },
            { number: "24/7", label: "Supporto Dedicato" }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-3xl p-6 text-center shadow-md hover:shadow-lg transition-all">
              <div className="text-4xl font-black text-[#ebd00b] mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonianze - Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Josef Cap",
              role: "Cliente",
              location: "Spedizione Francia",
              quote: "Consiglio vivamente, spedizione accurata e pedana ben imballata. I pacchi sono arrivati a destinazione in perfetto stato e in tempi molto rapidi. Davvero dei professionisti, mi affiderò di nuovo a voi per le prossime spedizioni",
              stats: ["5/5 Valutazione", "Spedizione Internazionale", "Imballaggio Professionale"]
            },
            {
              name: "Mariaconcetta Tabone",
              role: "Cliente Fedele",
              location: "Torino",
              quote: "Spedisco spesso pacchi da Torino ed è da un anno che usufruisco del precisissimo servizio di Very Posta Multiservice. Professionalità e affidabilità garantite.",
              stats: ["5/5 Valutazione", "Cliente da 1 anno", "Spedizioni Regolari"]
            },
            {
              name: "Andrea Papaandrea",
              role: "Cliente",
              location: "Servizi Multiservizi",
              quote: "Seri, professionali, e accoglienti. Offrono una grande varietà di servizi. Consigliatissimo!",
              stats: ["5/5 Valutazione", "Servizi Diversificati", "Professionalità"]
            },
            {
              name: "Giusy Castelli",
              role: "Cliente",
              location: "Spedizioni Nord Italia",
              quote: "Molto consigliato. Lo utilizzo spesso per spedizioni pacchi verso il nord Italia. Servizio impeccabile!",
              stats: ["5/5 Valutazione", "Spedizioni Nord Italia", "Servizio Impeccabile"]
            },
            {
              name: "Alessandro",
              role: "Cliente",
              location: "Servizi Postali",
              quote: "Da qualche anno che utilizzo questo esercizio per le spedizioni: ottimo servizio, prezzi convenienti, personale capace e professionale. TUTTO OK!!!",
              stats: ["5/5 Valutazione", "Cliente da anni", "Prezzi Convenienti"]
            },
            {
              name: "Daniela Sardella",
              role: "Cliente",
              location: "Spedizione Milano",
              quote: "Abbiamo spedito 2 valigie per Milano e siamo stati accolti calorosamente da Veronica e il suo staff. Veramente professionali e di grande serietà.",
              stats: ["5/5 Valutazione", "Spedizione Valigie", "Staff Professionale"]
            }
          ].map((testimonial, index) => (
            <div key={index} className="bg-white rounded-3xl p-8 shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-[#ebd00b] flex items-center justify-center text-2xl font-bold text-[#1d3a6b]">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-lg">{testimonial.name}</div>
                  <div className="text-gray-500">{testimonial.role}</div>
                  <div className="text-sm text-gray-400">{testimonial.location}</div>
                </div>
              </div>
              
              <div className="text-gray-600 mb-6 italic">
                &ldquo;{testimonial.quote}&rdquo;
              </div>
              
              <div className="flex flex-wrap gap-2">
                {testimonial.stats.map((stat, i) => (
                  <div key={i} className="bg-[#f6f7fb] text-[#1d3a6b] px-3 py-1 rounded-full text-sm font-medium">
                    {stat}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonianze - Mobile Carousel */}
        <div className="md:hidden">
          <Swiper
            modules={[Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            pagination={{ clickable: true }}
            className="pb-10"
          >
            {[
              {
                name: "Josef Cap",
                role: "Cliente",
                location: "Spedizione Francia",
                quote: "Consiglio vivamente, spedizione accurata e pedana ben imballata. I pacchi sono arrivati a destinazione in perfetto stato e in tempi molto rapidi. Davvero dei professionisti, mi affiderò di nuovo a voi per le prossime spedizioni",
                stats: ["5/5 Valutazione", "Spedizione Internazionale", "Imballaggio Professionale"]
              },
              {
                name: "Mariaconcetta Tabone",
                role: "Cliente Fedele",
                location: "Torino",
                quote: "Spedisco spesso pacchi da Torino ed è da un anno che usufruisco del precisissimo servizio di Very Posta Multiservice. Professionalità e affidabilità garantite.",
                stats: ["5/5 Valutazione", "Cliente da 1 anno", "Spedizioni Regolari"]
              },
              {
                name: "Andrea Papaandrea",
                role: "Cliente",
                location: "Servizi Multiservizi",
                quote: "Seri, professionali, e accoglienti. Offrono una grande varietà di servizi. Consigliatissimo!",
                stats: ["5/5 Valutazione", "Servizi Diversificati", "Professionalità"]
              },
              {
                name: "Giusy Castelli",
                role: "Cliente",
                location: "Spedizioni Nord Italia",
                quote: "Molto consigliato. Lo utilizzo spesso per spedizioni pacchi verso il nord Italia. Servizio impeccabile!",
                stats: ["5/5 Valutazione", "Spedizioni Nord Italia", "Servizio Impeccabile"]
              },
              {
                name: "Alessandro",
                role: "Cliente",
                location: "Servizi Postali",
                quote: "Da qualche anno che utilizzo questo esercizio per le spedizioni: ottimo servizio, prezzi convenienti, personale capace e professionale. TUTTO OK!!!",
                stats: ["5/5 Valutazione", "Cliente da anni", "Prezzi Convenienti"]
              },
              {
                name: "Daniela Sardella",
                role: "Cliente",
                location: "Spedizione Milano",
                quote: "Abbiamo spedito 2 valigie per Milano e siamo stati accolti calorosamente da Veronica e il suo staff. Veramente professionali e di grande serietà.",
                stats: ["5/5 Valutazione", "Spedizione Valigie", "Staff Professionale"]
              }
            ].map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white rounded-3xl p-8 shadow-md">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-[#ebd00b] flex items-center justify-center text-2xl font-bold text-[#1d3a6b]">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-lg">{testimonial.name}</div>
                      <div className="text-gray-500">{testimonial.role}</div>
                      <div className="text-sm text-gray-400">{testimonial.location}</div>
                    </div>
                  </div>
                  
                  <div className="text-gray-600 mb-6 italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {testimonial.stats.map((stat, i) => (
                      <div key={i} className="bg-[#f6f7fb] text-[#1d3a6b] px-3 py-1 rounded-full text-sm font-medium">
                        {stat}
                      </div>
                    ))}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button 
            onClick={handleAffiliateClick}
            className="bg-[#ebd00b] text-[#1d3a6b] px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition"
          >
            Diventa anche tu un Affiliato
          </button>
        </div>
      </section>

      {/* Sezione Contatti */}
      <ContactSection />

      {/* Modali */}
      {showAffiliateModal && (
        <AffiliateModal
          isOpen={showAffiliateModal}
          onClose={() => setShowAffiliateModal(false)}
        />
      )}

      {showLocationMap && (
        <LocationMap
          isOpen={showLocationMap}
          onClose={() => setShowLocationMap(false)}
        />
      )}

      {showROICalculator && (
        <ROICalculator
          isOpen={showROICalculator}
          onClose={() => setshowROICalculator(false)}
        />
      )}

      {showServiceModal && (
        <ServiceModal 
          isOpen={showServiceModal} 
          onClose={() => setShowServiceModal(false)} 
          service={currentService} 
        />
      )}
      
      {/* ChatBot */}
      <ChatBot />

       <Footer></Footer>
    </main>
   
  );
}
