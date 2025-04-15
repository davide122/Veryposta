"use client";
import { useState } from 'react';

export default function AffiliateModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    isError: false,
    message: ''
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
      const response = await fetch('/api/affiliate', {
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
        setFormData({ name: '', email: '', phone: '', city: '', message: '' });
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 bg-black">
      <div className="bg-white rounded-3xl p-8 max-w-xl w-full  overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#1d3a6b]">Diventa Affiliato VeryPosta</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {formStatus.isSubmitted && !formStatus.isError ? (
          <div className="text-center py-8 bg-white shadow-2xl rounded-3xl p-10 space-y-6 w-full z-10">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-bold mb-2">Richiesta Inviata!</h3>
            <p className="text-gray-600 mb-6">{formStatus.message}</p>
            <button 
              onClick={onClose}
              className="bg-[#1d3a6b] text-white px-6 py-3 rounded-full font-bold hover:bg-[#16305b] transition"
            >
              Chiudi
            </button>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-4 ">
            {formStatus.isSubmitted && formStatus.isError && (
              <div className="p-4 rounded-xl bg-red-100 text-red-700">
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
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
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
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
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
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
                placeholder="+39 123 456 7890"
                required
              />
            </div>
            
            <div>
              <label htmlFor="city" className="block font-bold text-sm mb-1">Città</label>
              <input
                type="text"
                id="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
                placeholder="Roma"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block font-bold text-sm mb-1">Messaggio (opzionale)</label>
              <textarea
                id="message"
                rows="3"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
                placeholder="Scrivi qui eventuali domande o richieste..."
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={formStatus.isSubmitting}
              className="w-full bg-[#ebd00b] text-[#1d3a6b] px-6 py-3 rounded-full text-lg font-bold hover:bg-yellow-400 transition disabled:opacity-70 mt-4"
            >
              {formStatus.isSubmitting ? 'Invio in corso...' : 'Invia Richiesta'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}