'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ContactManagement() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  // Verifica autenticazione e carica dati utente
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUserData = localStorage.getItem('userData');
    
    if (!token || !storedUserData) {
      router.push('/accesso');
      return;
    }
    
    try {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    } catch (error) {
      console.error('Errore nel parsing dei dati utente:', error);
      router.push('/accesso');
    }
  }, [router]);

  // Carica i messaggi dal server
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/contact');
        
        if (!response.ok) {
          throw new Error('Errore nel caricamento dei messaggi');
        }
        
        const data = await response.json();
        setMessages(data.success ? data.data : []);
      } catch (err) {
        setError(err.message);
        console.error('Errore:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, []);

  // Filtra i messaggi in base allo stato selezionato
  const filteredMessages = statusFilter === 'all' 
    ? messages 
    : messages.filter(msg => msg.status === statusFilter);

  // Gestisce la selezione di un messaggio
  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
    setReplyText(message.reply_message || '');
    
    // Se il messaggio è nuovo, aggiornalo a 'letto'
    if (message.status === 'new') {
      updateMessageStatus(message.id, 'read');
    }
  };

  // Aggiorna lo stato di un messaggio
  const updateMessageStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/contact?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Errore nell\'aggiornamento dello stato');
      }
      
      // Aggiorna lo stato locale
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, status } : msg
      ));
      
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
    } catch (err) {
      console.error('Errore:', err);
      setError(err.message);
    }
  };

  // Invia una risposta al messaggio
  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    
    try {
      const response = await fetch(`/api/contact?id=${selectedMessage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reply_message: replyText,
          status: 'replied',
        }),
      });
      
      if (!response.ok) {
        throw new Error('Errore nell\'invio della risposta');
      }
      
      const data = await response.json();
      
      // Aggiorna lo stato locale
      setMessages(messages.map(msg => 
        msg.id === selectedMessage.id ? data.data : msg
      ));
      
      setSelectedMessage(data.data);
    } catch (err) {
      console.error('Errore:', err);
      setError(err.message);
    }
  };

  // Elimina un messaggio
  const handleDeleteMessage = async (id) => {
    if (!confirm('Sei sicuro di voler eliminare questo messaggio?')) return;
    
    try {
      const response = await fetch(`/api/contact?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Errore nell\'eliminazione del messaggio');
      }
      
      // Rimuovi il messaggio dalla lista
      setMessages(messages.filter(msg => msg.id !== id));
      
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
        setReplyText('');
      }
    } catch (err) {
      console.error('Errore:', err);
      setError(err.message);
    }
  };

  // Formatta la data in formato leggibile
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('it-IT');
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ebd00b] border-t-[#1d3a6b] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1d3a6b] font-semibold">Caricamento messaggi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-[#1d3a6b]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-2xl font-black tracking-tight">
              <span className="text-[#1d3a6b]">Very</span>
              <span className="text-[#ebd00b]">Posta</span>
              <span className="text-[#1d3a6b] ml-2 text-lg">| Admin Panel</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-semibold">{userData?.name || 'Admin User'}</p>
              <p className="text-sm text-gray-500">Amministratore</p>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <nav className="space-y-1">
                <Link 
                  href="/dashboard/admin"
                  className="w-full text-left px-4 py-2 rounded-lg flex items-center hover:bg-gray-50"
                >
                  <span className="mr-3">📊</span>
                  Dashboard
                </Link>
                <Link 
                  href="/dashboard/admin"
                  className="w-full text-left px-4 py-2 rounded-lg flex items-center hover:bg-gray-50"
                >
                  <span className="mr-3">🏢</span>
                  Franchising
                </Link>
                <Link 
                  href="/dashboard/admin"
                  className="w-full text-left px-4 py-2 rounded-lg flex items-center hover:bg-gray-50"
                >
                  <span className="mr-3">🏪</span>
                  Affiliati
                </Link>
                <Link 
                  href="/dashboard/admin"
                  className="w-full text-left px-4 py-2 rounded-lg flex items-center hover:bg-gray-50"
                >
                  <span className="mr-3">🛠️</span>
                  Servizi
                </Link>
                <Link 
                  href="/dashboard/contatti"
                  className="w-full text-left px-4 py-2 rounded-lg flex items-center bg-[#ebd00b] text-[#1d3a6b] font-medium"
                >
                  <span className="mr-3">✉️</span>
                  Gestione Contatti
                </Link>
                <Link 
                  href="/dashboard/admin"
                  className="w-full text-left px-4 py-2 rounded-lg flex items-center hover:bg-gray-50"
                >
                  <span className="mr-3">⚙️</span>
                  Sistema
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-4 space-y-6">
            {/* Header e Filtri */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <h1 className="text-2xl font-bold text-[#1d3a6b] mb-4 md:mb-0">Gestione Messaggi di Contatto</h1>
                <div className="flex items-center">
                  <label className="mr-2 font-medium text-gray-700">Filtra per stato:</label>
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#1d3a6b] focus:outline-none"
                  >
                    <option value="all">Tutti</option>
                    <option value="new">Nuovi</option>
                    <option value="read">Letti</option>
                    <option value="replied">Risposti</option>
                    <option value="archived">Archiviati</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {filteredMessages.length} messaggi trovati
                  {statusFilter !== 'all' && ` con stato "${statusFilter === 'new' ? 'Nuovo' : statusFilter === 'read' ? 'Letto' : statusFilter === 'replied' ? 'Risposto' : 'Archiviato'}"`}
                </div>
                <div className="text-sm text-gray-600">
                  {messages.filter(m => m.status === 'new').length} nuovi messaggi
                </div>
              </div>
            </div>

            {/* Contenuto principale */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                  <p>{error}</p>
                </div>
              )}

              {filteredMessages.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="text-5xl mb-4">✉️</div>
                  <p className="text-xl font-medium mb-2">Nessun messaggio trovato</p>
                  <p>Non ci sono messaggi corrispondenti ai filtri selezionati.</p>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row">
                  {/* Lista messaggi */}
                  <div className="lg:w-2/5 border-r border-gray-200">
                    <div className="overflow-y-auto max-h-[70vh]">
                      {filteredMessages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${selectedMessage?.id === message.id ? 'bg-blue-50' : ''}`}
                          onClick={() => handleSelectMessage(message)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <p className={`font-medium ${message.status === 'new' ? 'text-blue-700' : 'text-gray-800'}`}>
                                  {message.name}
                                </p>
                                {message.status === 'new' && (
                                  <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full"></span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{message.email}</p>
                              <p className="text-xs text-gray-500 mt-1">{formatDate(message.created_at)}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${message.status === 'new' ? 'bg-blue-100 text-blue-800' : message.status === 'read' ? 'bg-gray-100 text-gray-800' : message.status === 'replied' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {message.status === 'new' ? 'Nuovo' : message.status === 'read' ? 'Letto' : message.status === 'replied' ? 'Risposto' : 'Archiviato'}
                            </span>
                          </div>
                          <p className="text-sm mt-2 line-clamp-2 text-gray-700">{message.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dettaglio messaggio */}
                  <div className="lg:w-3/5 p-6">
                    {selectedMessage ? (
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{selectedMessage.name}</h3>
                            <div className="flex items-center text-gray-600 mt-1">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                              </svg>
                              {selectedMessage.email}
                            </div>
                            {selectedMessage.phone && (
                              <div className="flex items-center text-gray-600 mt-1">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                </svg>
                                {selectedMessage.phone}
                              </div>
                            )}
                            <p className="text-sm text-gray-500 mt-2">Ricevuto il {formatDate(selectedMessage.created_at)}</p>
                          </div>
                          <div className="flex gap-2">
                            <select
                              value={selectedMessage.status}
                              onChange={(e) => updateMessageStatus(selectedMessage.id, e.target.value)}
                              className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#1d3a6b] focus:outline-none"
                            >
                              <option value="new">Nuovo</option>
                              <option value="read">Letto</option>
                              <option value="replied">Risposto</option>
                              <option value="archived">Archiviato</option>
                            </select>
                            <button
                              onClick={() => handleDeleteMessage(selectedMessage.id)}
                              className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-2 rounded-lg text-sm transition-colors flex items-center"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                              Elimina
                            </button>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl mb-6">
                          <h4 className="font-medium mb-3 text-gray-800 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                            </svg>
                            Messaggio:
                          </h4>
                          <p className="whitespace-pre-line text-gray-700 bg-white p-4 rounded-lg border border-gray-200">{selectedMessage.message}</p>
                        </div>

                        {selectedMessage.reply_message && (
                          <div className="bg-blue-50 p-6 rounded-xl mb-6">
                            <h4 className="font-medium mb-3 text-gray-800 flex items-center">
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
                              </svg>
                              Risposta inviata:
                            </h4>
                            <p className="whitespace-pre-line text-gray-700 bg-white p-4 rounded-lg border border-gray-200">{selectedMessage.reply_message}</p>
                            <p className="text-sm text-gray-500 mt-3 flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              Inviata il {formatDate(selectedMessage.reply_date)}
                            </p>
                          </div>
                        )}

                        <div className="mt-6">
                          <h4 className="font-medium mb-3 text-gray-800 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            Invia risposta:
                          </h4>
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-4 min-h-[150px] focus:ring-2 focus:ring-[#1d3a6b] focus:outline-none"
                            placeholder="Scrivi qui la tua risposta..."
                          ></textarea>
                          <div className="mt-4 flex justify-end">
                            <button
                              onClick={handleSendReply}
                              disabled={!replyText.trim()}
                              className="bg-[#1d3a6b] text-white px-6 py-3 rounded-lg hover:bg-[#152c52] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
                            >
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                              </svg>
                              Invia Risposta
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-center p-10">
                        <div>
                          <div className="text-5xl mb-4">📨</div>
                          <h3 className="text-xl font-medium text-gray-800 mb-2">Nessun messaggio selezionato</h3>
                          <p className="text-gray-600">Seleziona un messaggio dalla lista per visualizzare i dettagli</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}