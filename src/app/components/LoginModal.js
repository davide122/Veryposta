"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginModal = ({ show, handleClose, isOpen, onClose, loginType }) => {
  // Supporta entrambi i set di props (show/handleClose e isOpen/onClose)
  const isVisible = show || isOpen;
  const closeModal = handleClose || onClose;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let endpoint = '/api/auth';
      if (loginType === 'affiliate') {
        endpoint = '/api/auth/affiliate';
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, userType: loginType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Errore durante il login');
      }

      // Salva il token e i dati utente
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));

      // Reindirizza in base al tipo di utente
      if (loginType === 'admin' || data.user.role === 'admin') {
        router.push('/dashboard/admin');
      } else if (loginType === 'staff' || data.user.role === 'staff') {
        router.push('/dashboard/staff');
      } else if (loginType === 'affiliate' || data.user.role === 'affiliate') {
        router.push('/dashboard/affiliate');
      }

      closeModal();
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#1d3a6b]">
            {loginType === 'admin' && 'Accesso Amministratore'}
            {loginType === 'staff' && 'Accesso Staff'}
            {loginType === 'affiliate' && 'Accesso Affiliato'}
          </h2>
          <button 
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-100 text-red-700 mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-bold text-sm mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            disabled={loading}
            className="w-full bg-[#1d3a6b] text-white px-6 py-3 rounded-full text-lg font-bold hover:bg-[#16305b] transition disabled:opacity-70 mt-4"
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;