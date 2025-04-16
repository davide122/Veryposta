"use client";
import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';

export default function ContactSection() {
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

  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  const animation = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(50px)',
    config: { tension: 280, friction: 20 }
  });

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

  return (
    <section id="contatti" className="py-24 px-6 sm:px-10 lg:px-12 w-full max-w-[1600px] mx-auto text-[#1d3a6b]">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-4">
          Contatta<span className="text-[#ebd00b]">ci</span>
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 font-poppins max-w-2xl mx-auto">
          Siamo qui per rispondere a tutte le tue domande sul franchising VeryPosta.
        </p>
      </div>

      <animated.div 
        ref={ref}
        style={animation}
        className="max-w-2xl mx-auto bg-white rounded-3xl shadow-md p-8 sm:p-10"
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome e Cognome
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#ebd00b] focus:border-transparent transition"
              placeholder="Inserisci il tuo nome"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#ebd00b] focus:border-transparent transition"
              placeholder="La tua email"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Telefono
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#ebd00b] focus:border-transparent transition"
              placeholder="Il tuo numero di telefono"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Messaggio
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows="4"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#ebd00b] focus:border-transparent transition"
              placeholder="Scrivi il tuo messaggio"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={formStatus.isSubmitting}
            className="w-full bg-[#ebd00b] text-[#1d3a6b] px-6 py-3 rounded-full text-lg font-bold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formStatus.isSubmitting ? 'Invio in corso...' : 'Invia Messaggio'}
          </button>

          {formStatus.isSubmitted && (
            <div
              className={`mt-4 p-4 rounded-xl ${formStatus.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
            >
              {formStatus.message}
            </div>
          )}
        </form>
      </animated.div>
    </section>
  );
}