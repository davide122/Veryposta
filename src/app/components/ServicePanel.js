"use client";
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function ServicePanel({ userRole = 'affiliate' }) {
  // Stati per i servizi e l'interfaccia utente
  const [services, setServices] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Stati per la gestione dei servizi (solo admin)
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [serviceFormData, setServiceFormData] = useState({
    id: null,
    name: '',
    description: '',
    url: '',
    logo: '',
    category: 'energy',
    active: true
  });
  const [isEditing, setIsEditing] = useState(false);
  
  // Categorie di servizi
  const categories = [
    { id: 'all', name: 'Tutti i Servizi', icon: '🏠' },
    { id: 'energy', name: 'Energia', icon: '⚡' },
    { id: 'telecom', name: 'Telefonia', icon: '📱' },
    { id: 'spid', name: 'SPID', icon: '🔐' },
    { id: 'postal', name: 'Servizi Postali', icon: '✉️' },
    { id: 'shipping', name: 'Spedizioni', icon: '📦' },
    { id: 'caf', name: 'CAF/Patronato', icon: '📄' },
  ];

  // Carica i servizi all'avvio del componente
  useEffect(() => {
    fetchServices();
  }, []);

  // Carica i servizi dal server
  const fetchServices = async (category = null) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Ottieni il token di autenticazione dal localStorage
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token di autenticazione non trovato');
      }
      
      // Costruisci l'URL in base alla categoria selezionata
      let url = '/api/services';
      if (category && category !== 'all') {
        url += `?category=${category}`;
      }
      
      // Effettua la richiesta al server
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Errore durante il recupero dei servizi');
      }
      
      const data = await response.json();
      
      // Aggiorna lo stato con i servizi ricevuti
      setServices(data.data);
      
      // Estrai i preferiti dai dati ricevuti
      const favs = data.data
        .filter(service => service.isFavorite)
        .map(service => service.id);
      setFavorites(favs);
      
    } catch (err) {
      console.error('Errore durante il recupero dei servizi:', err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Cambia la categoria attiva
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    fetchServices(categoryId === 'all' ? null : categoryId);
  };

  // Aggiunge o rimuove un servizio dai preferiti
  const toggleFavorite = async (serviceId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token di autenticazione non trovato');
      }
      
      const isFavorite = favorites.includes(serviceId);
      
      // Effettua la richiesta al server per aggiungere o rimuovere dai preferiti
      const url = `/api/services/favorites${isFavorite ? `?serviceId=${serviceId}` : ''}`;
      const response = await fetch(url, {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: isFavorite ? undefined : JSON.stringify({ serviceId })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Errore durante ${isFavorite ? 'la rimozione' : 'l\'aggiunta'} del servizio ai preferiti`);
      }
      
      // Aggiorna lo stato locale dei preferiti
      if (isFavorite) {
        setFavorites(favorites.filter(id => id !== serviceId));
      } else {
        setFavorites([...favorites, serviceId]);
      }
      
      // Aggiorna anche lo stato dei servizi
      setServices(services.map(service => {
        if (service.id === serviceId) {
          return { ...service, isFavorite: !isFavorite };
        }
        return service;
      }));
      
      toast.success(`Servizio ${isFavorite ? 'rimosso dai' : 'aggiunto ai'} preferiti`);
      
    } catch (err) {
      console.error('Errore durante la gestione dei preferiti:', err);
      toast.error(err.message);
    }
  };

  // Apre il modal delle note
  const openNoteModal = (service) => {
    setCurrentService(service);
    setNoteText(service.note || '');
    setShowNoteModal(true);
  };

  // Salva una nota
  const saveNote = async () => {
    if (!currentService) return;
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token di autenticazione non trovato');
      }
      
      // Effettua la richiesta al server per salvare la nota
      const response = await fetch('/api/services/notes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          serviceId: currentService.id,
          note: noteText
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Errore durante il salvataggio della nota');
      }
      
      // Aggiorna lo stato dei servizi con la nuova nota
      setServices(services.map(service => {
        if (service.id === currentService.id) {
          return { ...service, note: noteText };
        }
        return service;
      }));
      
      setShowNoteModal(false);
      toast.success('Nota salvata con successo');
      
    } catch (err) {
      console.error('Errore durante il salvataggio della nota:', err);
      toast.error(err.message);
    }
  };

  // Elimina una nota
  const deleteNote = async () => {
    if (!currentService) return;
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token di autenticazione non trovato');
      }
      
      // Effettua la richiesta al server per eliminare la nota
      const response = await fetch(`/api/services/notes?serviceId=${currentService.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Errore durante l\'eliminazione della nota');
      }
      
      // Aggiorna lo stato dei servizi rimuovendo la nota
      setServices(services.map(service => {
        if (service.id === currentService.id) {
          return { ...service, note: '' };
        }
        return service;
      }));
      
      setShowNoteModal(false);
      toast.success('Nota eliminata con successo');
      
    } catch (err) {
      console.error('Errore durante l\'eliminazione della nota:', err);
      toast.error(err.message);
    }
  };

  // Funzioni per la gestione dei servizi (solo admin)
  
  // Apre il modal per creare un nuovo servizio
  const openCreateServiceModal = () => {
    setServiceFormData({
      id: null,
      name: '',
      description: '',
      url: '',
      logo: '',
      category: 'energy',
      active: true
    });
    setIsEditing(false);
    setShowServiceModal(true);
  };

  // Apre il modal per modificare un servizio esistente
  const openEditServiceModal = (service) => {
    setServiceFormData({
      id: service.id,
      name: service.name,
      description: service.description || '',
      url: service.url,
      logo: service.logo || '',
      category: service.category,
      active: service.active
    });
    setIsEditing(true);
    setShowServiceModal(true);
  };

  // Gestisce i cambiamenti nei campi del form
  const handleServiceFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setServiceFormData({
      ...serviceFormData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Salva un servizio (creazione o modifica)
  const saveService = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token di autenticazione non trovato');
      }
      
      // Determina l'URL e il metodo in base all'operazione (creazione o modifica)
      const url = isEditing ? `/api/services?id=${serviceFormData.id}` : '/api/services';
      const method = isEditing ? 'PUT' : 'POST';
      
      // Effettua la richiesta al server
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(serviceFormData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Errore durante ${isEditing ? 'l\'aggiornamento' : 'la creazione'} del servizio`);
      }
      
      // Chiudi il modal e ricarica i servizi
      setShowServiceModal(false);
      fetchServices(activeCategory === 'all' ? null : activeCategory);
      toast.success(`Servizio ${isEditing ? 'aggiornato' : 'creato'} con successo`);
      
    } catch (err) {
      console.error(`Errore durante ${isEditing ? 'l\'aggiornamento' : 'la creazione'} del servizio:`, err);
      toast.error(err.message);
    }
  };

  // Elimina un servizio
  const deleteService = async (serviceId) => {
    if (!confirm('Sei sicuro di voler eliminare questo servizio?')) return;
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token di autenticazione non trovato');
      }
      
      // Effettua la richiesta al server per eliminare il servizio
      const response = await fetch(`/api/services?id=${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Errore durante l\'eliminazione del servizio');
      }
      
      // Ricarica i servizi
      fetchServices(activeCategory === 'all' ? null : activeCategory);
      toast.success('Servizio eliminato con successo');
      
    } catch (err) {
      console.error('Errore durante l\'eliminazione del servizio:', err);
      toast.error(err.message);
    }
  };

  // Filtra i servizi in base alla categoria attiva
  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(service => service.category === activeCategory);

  // Ottieni i servizi preferiti
  const favoriteServices = services.filter(service => favorites.includes(service.id));

  // Funzione per determinare lo stile in base alla categoria
  const getCategoryStyle = (category) => {
    switch(category) {
      case 'energy':
        return {
          icon: '⚡',
          bgColor: 'bg-gradient-to-br from-yellow-50 to-white',
          iconBg: 'bg-yellow-100'
        };
      case 'telecom':
        return {
          icon: '📱',
          bgColor: 'bg-gradient-to-br from-purple-50 to-white',
          iconBg: 'bg-purple-100'
        };
      case 'spid':
        return {
          icon: '🔐',
          bgColor: 'bg-gradient-to-br from-green-50 to-white',
          iconBg: 'bg-green-100'
        };
      case 'postal':
        return {
          icon: '✉️',
          bgColor: 'bg-gradient-to-br from-blue-50 to-white',
          iconBg: 'bg-blue-100'
        };
      case 'shipping':
        return {
          icon: '📦',
          bgColor: 'bg-gradient-to-br from-orange-50 to-white',
          iconBg: 'bg-orange-100'
        };
      case 'caf':
        return {
          icon: '📄',
          bgColor: 'bg-gradient-to-br from-red-50 to-white',
          iconBg: 'bg-red-100'
        };
      default:
        return {
          icon: '🏠',
          bgColor: 'bg-gradient-to-br from-blue-50 to-white',
          iconBg: 'bg-blue-100'
        };
    }
  };

  // Verifica se un servizio è nei preferiti
  const isFavorite = (serviceId) => {
    return favorites.includes(serviceId);
  };

  // Verifica se un servizio ha una nota
  const hasNote = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return service && service.note && service.note.trim() !== '';
  };

  // Gestisce il click sul pulsante delle note
  const handleNoteClick = (service) => {
    setCurrentService(service);
    setNoteText(service.note || '');
    setShowNoteModal(true);
  };

  // Gestisce la modifica di un servizio (solo admin)
  const handleEditService = (service) => {
    setServiceFormData({
      id: service.id,
      name: service.name,
      description: service.description || '',
      url: service.url,
      logo: service.logo || '',
      category: service.category,
      active: service.active
    });
    setIsEditing(true);
    setShowServiceModal(true);
  };

  // Gestisce l'eliminazione di un servizio (solo admin)
  const handleDeleteService = (serviceId) => {
    if (confirm('Sei sicuro di voler eliminare questo servizio?')) {
      deleteService(serviceId);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Intestazione del pannello */}
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#1d3a6b]">Portale Servizi</h2>
        {userRole === 'admin' && (
          <button
            onClick={openCreateServiceModal}
            className="bg-[#1d3a6b] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#16305b] transition flex items-center"
          >
            <span className="mr-2">+</span> Nuovo Servizio
          </button>
        )}
      </div>

      {/* Navigazione categorie */}
      <div className="bg-gray-50 p-4 overflow-x-auto">
        <div className="flex space-x-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center ${activeCategory === category.id ? 'bg-[#ebd00b] text-[#1d3a6b] font-medium' : 'bg-white border border-gray-200 hover:border-[#ebd00b]'}`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Stato di caricamento */}
      {isLoading && (
        <div className="p-6 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1d3a6b]"></div>
          <p className="mt-2 text-gray-500">Caricamento servizi in corso...</p>
        </div>
      )}

      {/* Messaggio di errore */}
      {error && (
        <div className="p-6 text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg inline-block">
            <p className="font-medium">Si è verificato un errore</p>
            <p className="text-sm mt-1">{error}</p>
            <button 
              onClick={() => fetchServices(activeCategory === 'all' ? null : activeCategory)}
              className="mt-3 bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition"
            >
              Riprova
            </button>
          </div>
        </div>
      )}

      {/* Griglia dei servizi */}
      {!isLoading && !error && (
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => (
              <div key={service.id} className={`border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${getCategoryStyle(service.category).bgColor}`}>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className={`${getCategoryStyle(service.category).iconBg} w-12 h-12 rounded-full flex items-center justify-center text-2xl mr-3 shadow-sm overflow-hidden`}>
                        {service.logo ? (
                          <img 
                            src={service.logo} 
                            alt={`Logo ${service.name}`} 
                            className="w-full h-full p-2 object-contain"
                          />
                        ) : (
                          getCategoryStyle(service.category).icon
                        )}
                      </div>
                      <h3 className="font-bold text-xl text-[#1d3a6b]">{service.name}</h3>
                    </div>
                    {userRole === 'affiliate' && (
                      <button 
                        onClick={() => toggleFavorite(service.id)}
                        className={`text-2xl ${isFavorite(service.id) ? 'text-[#ebd00b]' : 'text-gray-300'} hover:text-[#ebd00b] transition-colors`}
                        aria-label={isFavorite(service.id) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
                      >
                        ★
                      </button>
                    )}
                    {userRole === 'admin' && (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditService(service)}
                          className="text-gray-500 hover:text-[#1d3a6b] transition-colors"
                          aria-label="Modifica servizio"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteService(service.id)}
                          className="text-gray-500 hover:text-red-500 transition-colors"
                          aria-label="Elimina servizio"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  
                  <div className="flex flex-col space-y-4">
                    <a 
                      href={service.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-[#1d3a6b] text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-[#16305b] transition text-center block shadow-sm hover:shadow flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Apri Portale
                    </a>
                    
                    {userRole === 'affiliate' && (
                      <button 
                        onClick={() => handleNoteClick(service)}
                        className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg text-base font-medium hover:border-[#ebd00b] hover:text-[#1d3a6b] transition text-center flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        {hasNote(service.id) ? 'Modifica Note' : 'Aggiungi Note'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {filteredServices.length === 0 && !isLoading && (
        <div className="text-center py-12 text-gray-500">
          Nessun servizio disponibile in questa categoria.
        </div>
      )}

      {/* Sezione preferiti */}
      {userRole === 'affiliate' && favoriteServices.length > 0 && (
        <div className="border-t border-gray-200 p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center text-[#1d3a6b]">
            <span className="text-[#ebd00b] text-2xl mr-2">★</span> I tuoi servizi preferiti
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteServices.map(service => {
              const categoryStyle = getCategoryStyle(service.category);
              
              return (
                <div key={`fav-${service.id}`} className={`border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${categoryStyle.bgColor}`}>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div className={`${categoryStyle.iconBg} w-12 h-12 rounded-full flex items-center justify-center text-2xl mr-3 shadow-sm overflow-hidden`}>
                          {service.logo ? (
                            <img 
                              src={service.logo} 
                              alt={`Logo ${service.name}`} 
                              className="w-full h-full p-2 object-contain"
                            />
                          ) : (
                            categoryStyle.icon
                          )}
                        </div>
                        <h3 className="font-bold text-xl text-[#1d3a6b]">{service.name}</h3>
                      </div>
                      <button 
                        onClick={() => toggleFavorite(service.id)}
                        className="text-2xl text-[#ebd00b] hover:text-gray-400 transition-colors"
                        aria-label="Rimuovi dai preferiti"
                      >
                        ★
                      </button>
                    </div>
                    <div className="mt-6">
                      <a 
                        href={service.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-[#1d3a6b] text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-[#16305b] transition text-center block shadow-sm hover:shadow flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Apri Portale
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal per le note */}
      {showNoteModal && currentService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Note per {currentService.name}</h3>
              <button 
                onClick={() => setShowNoteModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ebd00b] h-32"
              placeholder="Inserisci le tue note per questo servizio..."
            ></textarea>
            <div className="mt-4 flex justify-end space-x-3">
              {noteText && (
                <button 
                  onClick={deleteNote}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition"
                >
                  Elimina
                </button>
              )}
              <button 
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Annulla
              </button>
              <button 
                onClick={saveNote}
                className="px-4 py-2 bg-[#ebd00b] text-[#1d3a6b] rounded-lg font-medium hover:bg-yellow-400 transition"
              >
                Salva Nota
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal per la creazione/modifica dei servizi (solo admin) */}
      {showServiceModal && userRole === 'admin' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">{isEditing ? 'Modifica' : 'Nuovo'} Servizio</h3>
              <button 
                onClick={() => setShowServiceModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={saveService}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input
                    type="text"
                    name="name"
                    value={serviceFormData.name}
                    onChange={handleServiceFormChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
                  <textarea
                    name="description"
                    value={serviceFormData.description}
                    onChange={handleServiceFormChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ebd00b] h-20"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                  <input
                    type="url"
                    name="url"
                    value={serviceFormData.url}
                    onChange={handleServiceFormChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                  <input
                    type="text"
                    name="logo"
                    value={serviceFormData.logo}
                    onChange={handleServiceFormChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
                    placeholder="/logo.svg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select
                    name="category"
                    value={serviceFormData.category}
                    onChange={handleServiceFormChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
                    required
                  >
                    <option value="energy">Energia</option>
                    <option value="telecom">Telefonia</option>
                    <option value="spid">SPID</option>
                    <option value="postal">Servizi Postali</option>
                    <option value="shipping">Spedizioni</option>
                    <option value="caf">CAF/Patronato</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={serviceFormData.active}
                    onChange={handleServiceFormChange}
                    className="h-4 w-4 text-[#ebd00b] focus:ring-[#ebd00b] border-gray-300 rounded"
                  />
                  <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                    Servizio attivo
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Annulla
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#1d3a6b] text-white rounded-lg font-medium hover:bg-[#16305b] transition"
                >
                  {isEditing ? 'Aggiorna' : 'Crea'} Servizio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}