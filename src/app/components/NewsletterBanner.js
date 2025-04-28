'use client';

import { useState, useEffect } from 'react';
import styles from '../corsi/corsi.module.css';
import VerificaNewsletterPage from './VerificaNewsletter';

export default function NewsletterBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email'); // email, sent, success
  const [error, setError] = useState('');

  useEffect(() => {
    // se l’utente ha già verificato la mail, mostro il messaggio di successo
    if (document.cookie.includes('newsletterVerified=1')) {
      setIsVisible(true);
      setStep('success');
      setTimeout(handleClose, 3000);
      return;
    }
    // altrimenti apro il banner dopo 5 secondi, se non chiuso in precedenza
    if (!localStorage.getItem('hasClosedNewsletter')) {
      const timer = setTimeout(() => setIsVisible(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hasClosedNewsletter', 'true');
    document.cookie = 'newsletterVerified=; Max-Age=0; path=/';
  };

  const validateEmail = (em) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(email)) {
      setError('Inserisci un indirizzo email valido');
      return;
    }
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        setStep('sent');
      } else {
        setError('Errore invio email, riprova');
      }
    } catch {
      setError('Errore di rete');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative shadow-xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {step === 'success' ? (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-[#1d3a6b] mb-2">Email verificata!</h3>
            <p className="text-gray-800">Grazie, riceverai presto le nostre novità.</p>
          </div>
        ) : step === 'sent' ? (
          <div>
            <h2 className="text-2xl font-bold text-[#1d3a6b] mb-2">Controlla la tua email</h2>
            <p className="text-gray-800">
              Ti abbiamo inviato un link: cliccalo per confermare la tua iscrizione.
            </p>
          </div>
        ) : (
          <form onSubmit={handleEmailSubmit}>
            <h2 className="text-2xl font-bold text-[#1d3a6b] mb-4">Verifica la tua email</h2>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="La tua email"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              required
            />
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-[#1d3a6b] text-white py-3 px-6 rounded-lg hover:bg-[#16305b] transition-colors"
            >
              Invia
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
