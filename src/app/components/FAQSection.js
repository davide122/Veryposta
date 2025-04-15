"use client";
import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  // Dati delle FAQ
  const faqData = [
    {
      question: "Quanto costa aprire un punto VeryPosta?",
      answer: "L'investimento iniziale per aprire un punto VeryPosta è di €400 + IVA. Il contratto ha una durata triennale con rinnovo automatico e include formazione, supporto e accesso a convenzioni nazionali vantaggiose."
    },
    {
      question: "Che tipo di formazione viene fornita?",
      answer: "Offriamo una formazione completa per l'avviamento che copre tutti gli aspetti operativi, legali e digitali necessari per gestire un punto VeryPosta. La formazione è continua e viene aggiornata regolarmente per garantire che i nostri affiliati siano sempre al passo con le novità del settore."
    },
    {
      question: "Quali servizi posso offrire come affiliato?",
      answer: "Come affiliato VeryPosta potrai offrire una vasta gamma di servizi: spedizioni nazionali e internazionali, servizi postali, energia e telefonia, servizi CAF/Patronato, SPID, firme digitali, PEC, pratiche amministrative e molto altro. Il nostro modello multiservizi ti permette di diversificare l'offerta e aumentare le opportunità di guadagno."
    },
    {
      question: "È necessaria esperienza precedente nel settore?",
      answer: "No, non è necessaria esperienza precedente nel settore. Il nostro programma di formazione è progettato per fornire tutte le competenze necessarie anche a chi parte da zero. Ciò che conta è la motivazione, l'attitudine al cliente e la voglia di imparare."
    },
    {
      question: "Posso aprire un punto VeryPosta nella mia città?",
      answer: "La possibilità di aprire un punto VeryPosta nella tua città dipende dalla disponibilità territoriale. Contattaci per verificare se la tua zona è disponibile. La nostra strategia di espansione prevede una distribuzione equilibrata dei punti per garantire a ciascun affiliato un bacino d'utenza adeguato."
    },
    {
      question: "Che tipo di supporto riceverò dopo l'apertura?",
      answer: "Offriamo un supporto continuo che include assistenza tecnica, operativa e commerciale. Avrai accesso a un referente dedicato, materiali di marketing aggiornati, supporto per campagne promozionali locali e formazione continua. Inoltre, la nostra piattaforma digitale ti permetterà di gestire facilmente tutti i servizi."
    },
    {
      question: "Quanto spazio è necessario per un punto VeryPosta?",
      answer: "Un punto VeryPosta può essere avviato in uno spazio di almeno 25-30 mq. L'importante è che il locale sia facilmente accessibile, preferibilmente con vetrina su strada e in una zona con buon passaggio pedonale. Forniamo linee guida per l'allestimento e supporto nella progettazione degli spazi."
    },
    {
      question: "Quali sono i tempi di apertura di un nuovo punto?",
      answer: "I tempi medi per l'apertura di un nuovo punto VeryPosta, dalla firma del contratto all'operatività, sono di circa 30-45 giorni. Questo periodo include la formazione iniziale, l'allestimento del locale e l'installazione dei sistemi informatici necessari."
    },
    {
      question: "Posso integrare VeryPosta con un'attività già esistente?",
      answer: "Sì, il franchising VeryPosta può essere integrato con attività commerciali già esistenti come tabaccherie, cartolerie, negozi di telefonia o altre attività compatibili. Questa integrazione può rappresentare un'ottima opportunità per diversificare l'offerta e aumentare il fatturato di un'attività già avviata."
    },
    {
      question: "Come funziona la fatturazione e quali sono le percentuali di guadagno?",
      answer: "Il sistema di fatturazione è semplice e trasparente. Per ogni servizio offerto, riceverai una percentuale del valore della transazione che varia in base alla tipologia di servizio. Le percentuali di guadagno sono competitive e vengono dettagliate durante la fase di presentazione del progetto. Inoltre, la nostra piattaforma gestionale ti permette di monitorare in tempo reale tutti i servizi erogati e i relativi guadagni."
    }
  ];

  // Gestisce il toggle delle FAQ
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-6 sm:px-10 lg:px-12 w-full max-w-[1600px] mx-auto text-[#1d3a6b]">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-4">
          Domande <span className="text-[#ebd00b]">Frequenti</span>
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 font-poppins max-w-2xl mx-auto">
          Tutto ciò che devi sapere sul franchising VeryPosta
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {faqData.map((faq, index) => (
          <div key={index} className="mb-4">
            <button
              onClick={() => toggleFAQ(index)}
              className={`w-full text-left p-6 rounded-xl flex justify-between items-center transition-colors ${activeIndex === index ? 'bg-[#1d3a6b] text-white' : 'bg-gray-50 hover:bg-gray-100'}`}
              aria-expanded={activeIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="font-bold text-lg">{faq.question}</span>
              <span className="text-2xl">
                {activeIndex === index ? '−' : '+'}
              </span>
            </button>
            
            <div 
              id={`faq-answer-${index}`}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              aria-hidden={activeIndex !== index}
            >
              <div className="p-6 bg-gray-50 rounded-b-xl border-t border-gray-200">
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-600 mb-6">Non hai trovato la risposta che cercavi?</p>
        <button 
          onClick={() => document.getElementById('contatti').scrollIntoView({ behavior: 'smooth' })}
          className="bg-[#ebd00b] text-[#1d3a6b] px-6 py-3 rounded-full font-bold hover:bg-yellow-400 transition"
        >
          Contattaci
        </button>
      </div>
    </section>
  );
}