"use client";
import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

export default function ServiceModal({ isOpen, onClose, service }) {
  // Animazione per il modal
  const modalAnimation = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateY(0)' : 'translateY(-50px)',
    config: { tension: 280, friction: 20 }
  });

  // Contenuto dei servizi
  const serviceContent = {
    "Servizi Postali": {
      icon: "✉️",
      title: "Servizi Postali",
      description: "Offriamo una gamma completa di servizi postali per privati e aziende, garantendo consegne rapide e affidabili.",
      features: [
        "Invio di lettere e raccomandate",
        "Gestione della corrispondenza",
        "Caselle postali private",
        "Servizi di affrancatura",
        "Ritiro e consegna a domicilio"
      ],
      benefits: "Risparmia tempo e denaro affidandoti ai nostri servizi postali professionali. Garantiamo sicurezza e puntualità per ogni tua spedizione."
    },
    "Spedizioni": {
      icon: "📦",
      title: "Spedizioni",
      description: "Soluzioni di spedizione nazionali e internazionali per pacchi di qualsiasi dimensione, con tracciamento in tempo reale.",
      features: [
        "Spedizioni nazionali e internazionali",
        "Imballaggio professionale",
        "Tracciamento in tempo reale",
        "Assicurazione spedizioni",
        "Ritiro a domicilio"
      ],
      benefits: "Affidati a partner di livello mondiale per le tue spedizioni. Offriamo le migliori tariffe e garantiamo consegne puntuali ovunque nel mondo."
    },
    "Energia": {
      icon: "⚡",
      title: "Energia",
      description: "Gestione completa di contratti luce e gas, con consulenza personalizzata per trovare l'offerta più adatta alle tue esigenze.",
      features: [
        "Attivazione contratti luce e gas",
        "Volture e subentri",
        "Consulenza risparmio energetico",
        "Gestione pratiche amministrative",
        "Monitoraggio consumi"
      ],
      benefits: "Risparmia sulle bollette con le nostre offerte energetiche competitive. Ti aiutiamo a scegliere il piano più adatto alle tue esigenze di consumo."
    },
    "Telefonia": {
      icon: "📱",
      title: "Telefonia",
      description: "Servizi di telefonia mobile e fissa, con attivazione di nuove linee, portabilità del numero e assistenza tecnica.",
      features: [
        "Attivazione nuove linee",
        "Portabilità del numero",
        "Piani tariffari personalizzati",
        "Assistenza tecnica",
        "Gestione contratti e fatturazione"
      ],
      benefits: "Resta sempre connesso con i nostri servizi di telefonia. Offriamo piani tariffari competitivi e un'assistenza clienti dedicata."
    },
    "CAF/Patronato": {
      icon: "📄",
      title: "CAF/Patronato",
      description: "Assistenza fiscale e previdenziale completa, con compilazione di dichiarazioni dei redditi, pratiche INPS e consulenza personalizzata.",
      features: [
        "Dichiarazione dei redditi",
        "Pratiche INPS e previdenziali",
        "Consulenza fiscale",
        "Successioni e donazioni",
        "Assistenza bonus e agevolazioni"
      ],
      benefits: "Affidati ai nostri esperti per gestire al meglio la tua situazione fiscale e previdenziale. Massimizziamo i tuoi benefici e minimizziamo gli errori."
    },
    "SPID": {
      icon: "🔐",
      title: "SPID",
      description: "Attivazione e gestione dell'identità digitale SPID, per accedere ai servizi online della Pubblica Amministrazione in modo sicuro.",
      features: [
        "Attivazione identità SPID",
        "Assistenza all'utilizzo",
        "Recupero credenziali",
        "Supporto tecnico",
        "Aggiornamento dati personali"
      ],
      benefits: "Accedi a tutti i servizi online della Pubblica Amministrazione con un'unica identità digitale sicura. Ti guidiamo in ogni fase del processo di attivazione."
    },
    "Firme Digitali": {
      icon: "✍️",
      title: "Firme Digitali",
      description: "Rilascio e rinnovo di certificati di firma digitale, per autenticare documenti elettronici con pieno valore legale.",
      features: [
        "Rilascio certificati di firma",
        "Rinnovo certificati",
        "Assistenza all'utilizzo",
        "Verifica validità firme",
        "Supporto tecnico dedicato"
      ],
      benefits: "Semplifica la tua vita professionale con la firma digitale. Firma documenti legalmente validi ovunque ti trovi, risparmiando tempo e risorse."
    },
    "PEC": {
      icon: "📧",
      title: "PEC",
      description: "Attivazione e gestione di caselle di Posta Elettronica Certificata, per comunicazioni con valore legale equiparato alla raccomandata.",
      features: [
        "Attivazione caselle PEC",
        "Rinnovo abbonamenti",
        "Assistenza tecnica",
        "Recupero credenziali",
        "Configurazione dispositivi"
      ],
      benefits: "Comunica in modo sicuro e con valore legale grazie alla PEC. Ideale per professionisti, aziende e privati che necessitano di certezza nelle comunicazioni."
    },
    "Pratiche": {
      icon: "📋",
      title: "Pratiche",
      description: "Gestione di pratiche amministrative di vario genere, dalla richiesta di certificati al disbrigo di pratiche auto e molto altro.",
      features: [
        "Pratiche auto e patenti",
        "Richiesta certificati",
        "Visure catastali e camerali",
        "Pratiche comunali",
        "Assistenza burocratica"
      ],
      benefits: "Risparmia tempo prezioso affidando a noi le tue pratiche amministrative. Gestiamo ogni aspetto burocratico con professionalità ed efficienza."
    },
    "Altri Servizi": {
      icon: "🔍",
      title: "Altri Servizi",
      description: "Una vasta gamma di servizi aggiuntivi per soddisfare ogni esigenza, dalle fotocopie alla consulenza personalizzata.",
      features: [
        "Servizi di stampa e fotocopie",
        "Scansione documenti",
        "Servizi di traduzione",
        "Consulenza personalizzata",
        "Servizi web e digitali"
      ],
      benefits: "Un unico punto di riferimento per tutte le tue necessità. Qualunque sia il tuo bisogno, siamo qui per offrirti una soluzione professionale e conveniente."
    }
  };

  // Se il servizio non esiste, usa un contenuto predefinito
  const currentService = service && serviceContent[service.name] ? 
    serviceContent[service.name] : 
    {
      icon: "🔍",
      title: "Servizio",
      description: "Informazioni dettagliate su questo servizio saranno disponibili presto.",
      features: ["Caratteristica 1", "Caratteristica 2", "Caratteristica 3"],
      benefits: "Benefici del servizio."
    };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <animated.div 
        style={modalAnimation} 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#1d3a6b] flex items-center">
            <span className="mr-3 text-3xl">{currentService.icon}</span>
            {currentService.title}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl focus:outline-none"
            aria-label="Chiudi"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#1d3a6b] mb-2">Descrizione</h3>
            <p className="text-gray-700">{currentService.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#1d3a6b] mb-2">Caratteristiche</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {currentService.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#1d3a6b] mb-2">Vantaggi</h3>
            <p className="text-gray-700">{currentService.benefits}</p>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => window.location.href = '/contatti'}
              className="bg-[#ebd00b] text-[#1d3a6b] px-6 py-3 rounded-full font-bold hover:bg-yellow-400 transition"
            >
              Richiedi Informazioni
            </button>
          </div>
        </div>
      </animated.div>
    </div>
  );
}