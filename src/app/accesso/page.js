"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginModal from '../components/LoginModal';
import Link from 'next/link';

export default function AccessoPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userType, setUserType] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Verifica se l'utente è già autenticato
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        // Reindirizza alla dashboard appropriata
        router.push(`/dashboard/${user.role}`);
      } catch (error) {
        console.error('Errore nel parsing dei dati utente:', error);
      }
    }
  }, [router]);

  const handleLoginClick = (type) => {
    setUserType(type);
    setShowLoginModal(true);
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
            Area <span className="text-[#ebd00b]">Riservata</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 font-poppins max-w-2xl mx-auto">
            Accedi all'area riservata di VeryPosta in base al tuo ruolo.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Card Affiliato */}
          <div className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-all p-8 text-center">
            <div className="text-5xl mb-6">🏪</div>
            <h2 className="text-2xl font-bold mb-4">Point Affiliato</h2>
            <p className="text-gray-600 mb-8">
              Accedi alla dashboard del tuo punto VeryPosta per gestire servizi, pratiche e comunicazioni.
            </p>
            <button 
              onClick={() => handleLoginClick('affiliate')}
              className="w-full bg-[#ebd00b] text-[#1d3a6b] px-6 py-3 rounded-full font-bold hover:bg-yellow-400 transition"
            >
              Accedi come Affiliato
            </button>
          </div>

          {/* Card Staff */}
          <div className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-all p-8 text-center">
            <div className="text-5xl mb-6">👨‍💼</div>
            <h2 className="text-2xl font-bold mb-4">Staff VeryPosta</h2>
            <p className="text-gray-600 mb-8">
              Area riservata allo staff per supporto tecnico, gestione comunicazioni e assistenza affiliati.
            </p>
            <button 
              onClick={() => handleLoginClick('staff')}
              className="w-full bg-[#1d3a6b] text-white px-6 py-3 rounded-full font-bold hover:bg-[#16305b] transition"
            >
              Accedi come Staff
            </button>
          </div>

          {/* Card Amministrazione */}
          <div className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-all p-8 text-center">
            <div className="text-5xl mb-6">🔐</div>
            <h2 className="text-2xl font-bold mb-4">Amministr
              azione</h2>
            <p className="text-gray-600 mb-8">
              Accesso riservato agli amministratori per la gestione completa del franchising e delle operazioni.
            </p>
            <button 
              onClick={() => handleLoginClick('admin')}
              className="w-full bg-[#1d3a6b] text-white px-6 py-3 rounded-full font-bold hover:bg-[#16305b] transition"
            >
              Accedi come Admin
            </button>
          </div>
        </div>

        {/* Informazioni aggiuntive */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Hai bisogno di assistenza?</h3>
          <p className="text-gray-600 mb-6">
            Se hai problemi di accesso o hai dimenticato le tue credenziali, contatta il supporto tecnico.
          </p>
          <Link 
            href="/contatti"
            className="inline-block border-2 border-[#ebd00b] text-[#1d3a6b] px-6 py-3 rounded-full text-lg font-bold hover:bg-[#ebd00b] transition"
          >
            Contatta il Supporto
          </Link>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
        />
      )}
    </main>
  );
}