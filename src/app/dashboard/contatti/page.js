'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ContactManagement() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const router = useRouter();

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
      alert('Risposta inviata con successo!');
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

  if (loading) return <div className="p-8 text-center">Caricamento messaggi...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Errore: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gestione Messaggi di Contatto</h1>
      
      {/* Filtri */}
      <div className="mb-6">
        <label className="mr-2">Filtra per stato:</label>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">Tutti</option>
          <option value="new">Nuovi</option>
          <option value="read">Letti</option>
          <option value="replied">Risposti</option>
          <option value="archived">Archiviati</option>
        </select>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Lista messaggi */}
        <div className="md:w-1/2 lg:w-2/5">
          <h2 className="text-xl font-semibold mb-4">Messaggi ({filteredMessages.length})</h2>
          
          {filteredMessages.length === 0 ? (
            <p className="text-gray-500">Nessun messaggio trovato</p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              {filteredMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedMessage?.id === message.id ? 'bg-blue-50' : ''} ${
                    message.status === 'new' ? 'font-semibold' : ''
                  }`}
                  onClick={() => handleSelectMessage(message)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{message.name}</p>
                      <p className="text-sm text-gray-600">{message.email}</p>
                      <p className="text-sm text-gray-500 mt-1">{formatDate(message.created_at)}</p>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        message.status === 'new' ? 'bg-red-100 text-red-800' :
                        message.status === 'read' ? 'bg-blue-100 text-blue-800' :
                        message.status === 'replied' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {message.status === 'new' ? 'Nuovo' :
                         message.status === 'read' ? 'Letto' :
                         message.status === 'replied' ? 'Risposto' :
                         'Archiviato'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm mt-2 line-clamp-2">{message.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Dettaglio messaggio */}
        <div className="md:w-1/2 lg:w-3/5">
          <h2 className="text-xl font-semibold mb-4">Dettaglio Messaggio</h2>
          
          {selectedMessage ? (
            <div className="border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium">{selectedMessage.name}</h3>
                  <p className="text-gray-600">{selectedMessage.email} | {selectedMessage.phone}</p>
                  <p className="text-sm text-gray-500">Ricevuto il {formatDate(selectedMessage.created_at)}</p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedMessage.status}
                    onChange={(e) => updateMessageStatus(selectedMessage.id, e.target.value)}
                    className="border rounded p-1 text-sm"
                  >
                    <option value="new">Nuovo</option>
                    <option value="read">Letto</option>
                    <option value="replied">Risposto</option>
                    <option value="archived">Archiviato</option>
                  </select>
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Elimina
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium mb-2">Messaggio:</h4>
                <p className="whitespace-pre-line">{selectedMessage.message}</p>
              </div>
              
              {selectedMessage.reply_message && (
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium mb-2">Risposta inviata:</h4>
                  <p className="whitespace-pre-line">{selectedMessage.reply_message}</p>
                  <p className="text-sm text-gray-500 mt-2">Inviata il {formatDate(selectedMessage.reply_date)}</p>
                </div>
              )}
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Invia risposta:</h4>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full border rounded-lg p-3 min-h-[120px]"
                  placeholder="Scrivi qui la tua risposta..."
                ></textarea>
                <button
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Invia Risposta
                </button>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg p-6 text-center text-gray-500">
              Seleziona un messaggio per visualizzare i dettagli
            </div>
          )}
        </div>
      </div>
    </div>
  );
}