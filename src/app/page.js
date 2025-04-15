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
import { FadeIn, ScaleIn, SlideIn, Parallax, HoverEffect } from "./components/AnimationProvider";
import { useInView } from "react-intersection-observer";
import { useSpring, animated, config } from "@react-spring/web";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

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
  const [showROICalculator, setshowROICalculator]=useState(false)
  // Animazione per lo scroll indicator
  const [scrollIndicator, scrollIndicatorApi] = useSpring(() => ({
    opacity: 1,
    y: 0,
    config: { tension: 150, friction: 12 }
  }));
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
  
  // Schema markup per i rich snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "VeryPosta",
    "url": "https://veryposta.it",
    "logo": "https://veryposta.it/dsx.png",
    "description": "VeryPosta offre un franchising multiservizi innovativo con supporto reale, formazione continua e tecnologia inclusa.",
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
      "description": "Diventa affiliato VeryPosta con un investimento iniziale contenuto"
    }
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

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({
      isSubmitting: true,
      isSubmitted: false,
      isError: false,
      message: ''
    });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (response.ok) {
        setFormStatus({
          isSubmitting: false,
          isSubmitted: true,
          isError: false,
          message: result.message
        });
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setFormStatus({
          isSubmitting: false,
          isSubmitted: true,
          isError: true,
          message: result.message || 'Si è verificato un errore. Riprova più tardi.'
        });
      }
    } catch (error) {
      console.error('Errore durante l\'invio del form:', error);
      setFormStatus({
        isSubmitting: false,
        isSubmitted: true,
        isError: true,
        message: 'Si è verificato un errore di connessione. Riprova più tardi.'
      });
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <main className="bg-gradient-to-br from-white to-[#f6f7fb] font-sans text-[#1d3a6b]">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/70 border-b border-gray-200 shadow-sm">
      <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-6 flex justify-between items-center">
        
        {/* Logo */}
        <div className="text-3xl font-black tracking-tight">
          <span className="text-[#1d3a6b]">Very</span>
          <span className="text-[#ebd00b]">Posta</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex gap-10 font-poppins text-lg font-semibold items-center">
          <a onClick={() => scrollToSection('perche')} className="hover:text-[#ebd00b] transition cursor-pointer">Perché</a>
          <a onClick={() => scrollToSection('servizi')} className="hover:text-[#ebd00b] transition cursor-pointer">Servizi</a>
          <a onClick={() => scrollToSection('vantaggi')} className="hover:text-[#ebd00b] transition cursor-pointer">Vantaggi</a>
          <a onClick={() => scrollToSection('media')} className="hover:text-[#ebd00b] transition cursor-pointer">Gallery</a>
          <a onClick={() => scrollToSection('contatti')} className="hover:text-[#ebd00b] transition cursor-pointer">Contatti</a>
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex gap-4 items-center">
          <Link 
            href="/accesso" 
            className="text-[#1d3a6b] hover:text-[#ebd00b] transition font-semibold"
          >
            Area Riservata
          </Link>
          <button 
            onClick={() => setShowAffiliateModal(true)} 
            className="bg-[#ebd00b] text-[#1d3a6b] px-7 py-3 text-lg rounded-full font-bold hover:bg-yellow-400 transition"
          >
            Diventa Affiliato
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="lg:hidden text-3xl text-[#1d3a6b] font-bold"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-40 flex flex-col items-center justify-center gap-8 text-2xl font-poppins font-semibold text-[#1d3a6b] animate-fade-in">
          <button className="absolute top-6 right-6 text-4xl" onClick={() => setIsOpen(false)}>×</button>
          <a onClick={() => scrollToSection('perche')} className="cursor-pointer">Perché</a>
          <a onClick={() => scrollToSection('servizi')} className="cursor-pointer">Servizi</a>
          <a onClick={() => scrollToSection('vantaggi')} className="cursor-pointer">Vantaggi</a>
          <a onClick={() => scrollToSection('media')} className="cursor-pointer">Gallery</a>
          <a onClick={() => scrollToSection('contatti')} className="cursor-pointer">Contatti</a>
          <Link 
            href="/accesso" 
            className="text-[#1d3a6b] hover:text-[#ebd00b] transition font-semibold"
            onClick={() => setIsOpen(false)}
          >
            Area Riservata
          </Link>
          <button 
            onClick={() => {
              setIsOpen(false);
              setShowAffiliateModal(true);
            }} 
            className="bg-[#ebd00b] text-[#1d3a6b] px-6 py-3 rounded-full font-bold text-xl hover:bg-yellow-400 transition"
          >
            Diventa Affiliato
          </button>
        </div>
      )}
    </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col-reverse lg:flex-row items-center justify-center pt-40 px-6 sm:px-10 lg:px-12 max-w-[1700px] mx-auto gap-16 lg:gap-20 relative">
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
                  onClick={() => setShowAffiliateModal(true)} 
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
            className="w-[700px] sm:w-[700px] lg:w-[700px] xl:w-[1600px] h-auto drop-shadow-2xl parallax-image hero-img"
            priority
          />
        </ScaleIn>
        
        {/* Scroll indicator */}
        <animated.div 
          style={scrollIndicator} 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer"
          onClick={() => scrollToSection('perche')}
        >
          <span className="text-sm text-gray-500 mb-2">Scopri di più</span>
          <div className="w-6 h-10 border-2 border-[#1d3a6b] rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-[#ebd00b] rounded-full animate-bounce"></div>
          </div>
        </animated.div>
      </section>


      {/* Perché VeryPosta */}
      <section id="perche" className="py-24 px-6 sm:px-10 lg:px-12 w-full max-w-[1600px] mx-auto text-[#1d3a6b]">
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
              desc: "Dashboard gestionali e strumenti digitali pronti all’uso."
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

      <section id="servizi" className="py-24 px-6 sm:px-10 lg:px-12 w-full max-w-[1600px] mx-auto text-[#1d3a6b]">
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
      <div key={i} className="bg-white p-6 rounded-3xl shadow-md hover:shadow-lg transition-all">
        <div className="text-3xl sm:text-4xl mb-3">{s.icon}</div>
        <p className="font-poppins text-sm sm:text-base text-[#1d3a6b] font-medium">{s.name}</p>
      </div>
    ))}
  </div>
</section>




  <div className="absolute h-50 w-full overflow-hidden leading-none z-0 rotate">
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

<section id="vantaggi" className="py-24 px-6 sm:px-10 lg:px-12 w-full max-w-[1600px] mx-auto  text-[#1d3a6b]">
  <div className="grid lg:grid-cols-2 gap-16 items-center">
    
    {/* Lista vantaggi */}
    <div>
      <h2 className="text-2xl sm:text-4xl lg:text-6xl font-black leading-tight tracking-tight mb-8">
        Vantaggi dell'<span className="text-[#ebd00b]">Affiliazione</span>
      </h2>
      <ul className="space-y-6 text-lg sm:text-xl font-poppins text-gray-700">
        {[
          "Investimento iniziale contenuto (€400 + IVA)",
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
      <div className="text-6xl text-[#ebd00b] font-serif mb-4">“</div>
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


<section id="media" className="py-24 px-6 sm:px-10 lg:px-12 w-full max-w-[1600px] mx-auto text-[#1d3a6b]">
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
  <div className="relative z-10 grid md:grid-cols-2 gap-5 items-center w-full max-w-[1600px] mx-auto pb-20">

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
        width={600}
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
  className="relative text-[#1d3a6b] overflow-hidden py-24 px-6 sm:px-10 lg:px-12 max-w-[1600px] mx-auto"
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
        onClick={() => setShowAffiliateModal(true)} 
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




<section id="sedi" className="py-24 px-6 sm:px-10 lg:px-12 w-full max-w-[1600px] mx-auto text-[#1d3a6b] ">
  <div className="text-center mb-16">
    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-4">
      Le nostre <span className="text-[#ebd00b]">Sedi</span>
    </h2>
    <p className="text-lg sm:text-xl text-gray-600 font-poppins max-w-2xl mx-auto">
      VeryPosta cresce ogni giorno: scopri dove puoi trovarci e contattare i nostri Point ufficiali.
    </p>
  </div>

  <div className="grid lg:grid-cols-2 gap-16 items-center">
    {/* Mappa illustrata */}
    <div className="w-full flex justify-center">
      <img
        src="/sedioperative.png"
        alt="Mappa delle sedi VeryPosta in Italia - Trova il punto VeryPosta più vicino a te"
        className="w-full max-w-2xl rounded-3xl "
      />
    </div>

    {/* Dettagli sedi */}
    <div className="space-y-10 font-poppins">
      <div className="bg-[#f6f7fb] rounded-2xl p-6 shadow-md hover:shadow-lg transition">
        <h3 className="text-2xl font-bold mb-2"> VeryPosta Aragona</h3>
        <p className="text-gray-700 text-base sm:text-lg">Via Roma 204, Aragona (AG)</p>
        <p className="text-gray-500 text-sm">Aperto dal lunedì al sabato</p>
      </div>

      <div className="bg-[#f6f7fb] rounded-2xl p-6 shadow-md hover:shadow-lg transition">
        <h3 className="text-2xl font-bold mb-2"> VeryPosta Porto Empedocle</h3>
        <p className="text-gray-700 text-base sm:text-lg">Via Milano, Porto Empedocle (AG)</p>
        <p className="text-gray-500 text-sm">Aperto dal lunedì al sabato</p>
      </div>
    </div>
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


      {/* Modals */}
      <AffiliateModal 
        isOpen={showAffiliateModal} 
        onClose={() => setShowAffiliateModal(false)} 
      />
      
      {showLocationMap && (
        <LocationMap
          isOpen={showLocationMap}
          onClose={() => setShowLocationMap(false)}
        />
      )}
      
      {showROICalculator && (
        <ROICalculator
          isOpen={showROICalculator}
          onClose={() => setShowROICalculator(false)}
        />
      )}
      
      {/* ChatBot */}
      <ChatBot />
    </main>
  );
}
