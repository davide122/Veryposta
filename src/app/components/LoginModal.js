"use client";
import { useState } from 'react';

export default function LoginModal({ isOpen, onClose }) {
  const [userType, setUserType] = useState('affiliate');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

  const handleUserTypeChange = (type) => {
    setUserType(type);
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
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userType
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        // Salva il token e i dati utente in localStorage o in un context
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('userData', JSON.stringify(result.user));
        
        setFormStatus({
          isSubmitting: false,
          isSubmitted: true,
          isError: false,
          message: result.message
        });
        
        // Reindirizza alla dashboard appropriata in base al tipo di utente
        setTimeout(() => {
          window.location.href = `/dashboard/${userType}`;
        }, 1500);
      } else {
        setFormStatus({
          isSubmitting: false,
          isSubmitted: true,
          isError: true,
          message: result.message || 'Si è verificato un errore. Riprova più tardi.'
        });
      }
    } catch (error) {
      console.error('Errore durante l\'accesso:', error);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#1d3a6b]">Accedi a VeryPosta</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {formStatus.isSubmitted && !formStatus.isError ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-bold mb-2">Accesso effettuato!</h3>
            <p className="text-gray-600 mb-6">{formStatus.message}</p>
            <p className="text-gray-600 mb-6">Reindirizzamento in corso...</p>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {formStatus.isSubmitted && formStatus.isError && (
              <div className="p-4 rounded-xl bg-red-100 text-red-700">
                {formStatus.message}
              </div>
            )}
            
            <div className="flex justify-center space-x-4 mb-6">
              <button
                type="button"
                onClick={() => handleUserTypeChange('affiliate')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition ${userType === 'affiliate' ? 'bg-[#ebd00b] text-[#1d3a6b]' : 'bg-gray-200 text-gray-700'}`}
              >
                Point Affiliato
              </button>
              <button
                type="button"
                onClick={() => handleUserTypeChange('staff')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition ${userType === 'staff' ? 'bg-[#ebd00b] text-[#1d3a6b]' : 'bg-gray-200 text-gray-700'}`}
              >
                Staff
              </button>
              <button
                type="button"
                onClick={() => handleUserTypeChange('admin')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition ${userType === 'admin' ? 'bg-[#ebd00b] text-[#1d3a6b]' : 'bg-gray-200 text-gray-700'}`}
              >
                Admin
              </button>
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
              <label htmlFor="password" className="block font-bold text-sm mb-1">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>Ricordami</span>
              </label>
              <a href="#" className="text-[#1d3a6b] hover:underline">Password dimenticata?</a>
            </div>
            
            <button
              type="submit"
              disabled={formStatus.isSubmitting}
              className="w-full bg-[#1d3a6b] text-white px-6 py-3 rounded-full text-lg font-bold hover:bg-[#16305b] transition disabled:opacity-70 mt-4"
            >
              {formStatus.isSubmitting ? 'Accesso in corso...' : 'Accedi'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}