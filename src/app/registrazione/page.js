"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegistrazionePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    postal_code: '',
    tax_id: ''
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
    
    // Validazione password
    if (formData.password !== formData.confirmPassword) {
      setFormStatus({
        isSubmitting: false,
        isSubmitted: true,
        isError: true,
        message: 'Le password non corrispondono'
      });
      return;
    }

    setFormStatus({
      isSubmitting: true,
      isSubmitted: false,
      isError: false,
      message: ''
    });

    try {
      const response = await fetch('/api/affiliate/register', {
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
        
        // Reindirizza alla pagina di accesso dopo 3 secondi
        setTimeout(() => {
          router.push('/accesso');
        }, 3000);
      } else {
        setFormStatus({
          isSubmitting: false,
          isSubmitted: true,
          isError: true,
          message: result.message || 'Si è verificato un errore. Riprova più tardi.'
        });
      }
    } catch (error) {
      console.error('Errore durante la registrazione:', error);
      setFormStatus({
        isSubmitting: false,
        isSubmitted: true,
        isError: true,
        message: 'Si è verificato un errore di connessione. Riprova più tardi.'
      });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-[#f6f7fb] font-sans text-[#1d3a6b]">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/70 border-b border-gray-200 shadow-sm">
        <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-6 flex justify-between items-center">
          <Link href="/" className="text-3xl font-black tracking-tight">
            <span className="text-[#1d3a6b]">Very</span>
            <span className="text-[#ebd00b]">Posta</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-6 sm:px-10 lg:px-12 max-w-[1600px] mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-6">
            Diventa <span className="text-[#ebd00b]">Affiliato</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 font-poppins max-w-2xl mx-auto">
            Compila il form per richiedere di diventare un punto affiliato VeryPosta.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-md p-8">
          {formStatus.isSubmitted && !formStatus.isError ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-bold mb-2">Registrazione Completata!</h3>
              <p className="text-gray-600 mb-6">{formStatus.message}</p>
              <p className="text-gray-600 mb-6">Sarai reindirizzato alla pagina di accesso tra pochi secondi...</p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {formStatus.isSubmitted && formStatus.isError && (
                <div className="p-4 rounded-xl bg-red-100 text-red-700">
                  {formStatus.message}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block font-bold text-sm mb-1">Nome e Cognome *</label>
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
                  <label htmlFor="email" className="block font-bold text-sm mb-1">Email *</label>
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
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block font-bold text-sm mb-1">Telefono *</label>
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
                  <label htmlFor="city" className="block font-bold text-sm mb-1">Città *</label>
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
              </div>
              
              <div>
                <label htmlFor="address" className="block font-bold text-sm mb-1">Indirizzo</label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
                  placeholder="Via Roma, 123"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="postal_code" className="block font-bold text-sm mb-1">CAP</label>
                  <input
                    type="text"
                    id="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
                    placeholder="00100"
                  />
                </div>
                
                <div>
                  <label htmlFor="tax_id" className="block font-bold text-sm mb-1">Codice Fiscale / P.IVA</label>
                  <input
                    type="text"
                    id="tax_id"
                    value={formData.tax_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
                    placeholder="RSSMRA80A01H501U"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block font-bold text-sm mb-1">Password *</label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
                    placeholder="••••••••"
                    required
                    minLength="8"
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block font-bold text-sm mb-1">Conferma Password *</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
                    placeholder="••••••••"
                    required
                    minLength="8"
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="mr-2" 
                  required
                />
                <label htmlFor="terms" className="text-sm">
                  Accetto i <Link href="/termini" className="text-[#1d3a6b] hover:underline">Termini e Condizioni</Link> e la <Link href="/privacy" className="text-[#1d3a6b] hover:underline">Privacy Policy</Link>
                </label>
              </div>
              
              <button
                type="submit"
                disabled={formStatus.isSubmitting}
                className="w-full bg-[#ebd00b] text-[#1d3a6b] px-6 py-3 rounded-full text-lg font-bold hover:bg-yellow-400 transition disabled:opacity-70 mt-4"
              >
                {formStatus.isSubmitting ? 'Registrazione in corso...' : 'Registrati'}
              </button>
              
              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Hai già un account? <Link href="/accesso" className="text-[#1d3a6b] font-bold hover:underline">Accedi</Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}