"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function ServicePanel() {
  // Stato per tenere traccia dei servizi preferiti
  const [favorites, setFavorites] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState({});

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

  // Elenco dei servizi per categoria
  const services = {
    energy: [
      { id: 'eni', name: 'ENI', url: 'https://www.eni.com/it-IT/eni-plenitude.html', logo: '/eni.svg', description: 'Portale per contratti luce e gas' },
      { id: 'enel', name: 'ENEL', url: 'https://www.enel.it', logo: '/enel.svg', description: 'Gestione contratti energia elettrica e gas' },
      { id: 'edison', name: 'Edison', url: 'https://www.edison.it', logo: '/edison.svg', description: 'Offerte luce, gas e servizi energetici' },
      { id: 'sorgenia', name: 'Sorgenia', url: 'https://www.sorgenia.it', logo: '/sorgenia.svg', description: 'Fornitore di energia elettrica e gas naturale' },
    ],
    telecom: [
      { id: 'tim', name: 'TIM', url: 'https://www.tim.it', logo: '/tim.svg', description: 'Servizi di telefonia fissa e mobile' },
      { id: 'vodafone', name: 'Vodafone', url: 'https://www.vodafone.it', logo: '/vodafone.svg', description: 'Offerte mobile, fisso e internet' },
      { id: 'wind3', name: 'WindTre', url: 'https://www.windtre.it', logo: '/windtre.svg', description: 'Gestione contratti telefonia e internet' },
      { id: 'fastweb', name: 'Fastweb', url: 'https://www.fastweb.it', logo: '/fastweb.svg', description: 'Servizi di connettività e telefonia' },
    ],
    spid: [
      { id: 'namirial', name: 'Namirial SPID', url: 'https://portal.namirialtsp.com/public', logo: '/namirial.svg', description: 'Gestione identità digitale SPID' },
      { id: 'poste', name: 'Poste ID', url: 'https://posteid.poste.it', logo: '/poste.svg', description: 'SPID di Poste Italiane' },
      { id: 'aruba', name: 'Aruba ID', url: 'https://id.aruba.it', logo: '/aruba.svg', description: 'Servizio SPID di Aruba' },
      { id: 'infocert', name: 'InfoCert ID', url: 'https://identity.infocert.it', logo: '/infocert.svg', description: 'Identità digitale InfoCert' },
    ],
    postal: [
      { id: 'poste_servizi', name: 'Poste Italiane', url: 'https://www.poste.it/prodotti.html', logo: '/poste.svg', description: 'Servizi postali e finanziari' },
      { id: 'nexive', name: 'Nexive', url: 'https://www.nexive.it', logo: '/nexive.svg', description: 'Servizi di corrispondenza e pacchi' },
      { id: 'mailboxes', name: 'Mail Boxes Etc', url: 'https://www.mbe.it', logo: '/mbe.svg', description: 'Servizi di spedizione e imballaggio' },
    ],
    shipping: [
      { id: 'dhl', name: 'DHL', url: 'https://www.dhl.it', logo: '/dhl.svg', description: 'Spedizioni nazionali e internazionali' },
      { id: 'brt', name: 'BRT', url: 'https://www.brt.it', logo: '/brt.svg', description: 'Corriere espresso per spedizioni' },
      { id: 'gls', name: 'GLS', url: 'https://www.gls-italy.com', logo: '/gls.svg', description: 'Servizi di corriere espresso' },
      { id: 'ups', name: 'UPS', url: 'https://www.ups.com/it', logo: '/ups.svg', description: 'Spedizioni e logistica internazionale' },
    ],
    caf: [
      { id: 'caf_acli', name: 'CAF ACLI', url: 'https://www.cafacli.it', logo: '/acli.svg', description: 'Servizi fiscali e previdenziali' },
      { id: 'caf_cisl', name: 'CAF CISL', url: 'https://www.cafcisl.it', logo: '/cisl.svg', description: 'Assistenza fiscale e servizi alla persona' },
      { id: 'patronato_inapa', name: 'Patronato INAPA', url: 'https://www.inapa.it', logo: '/inapa.svg', description: 'Servizi di patronato e assistenza' },
    ],
  };

  // Funzione per ottenere tutti i servizi
  const getAllServices = () => {
    let allServices = [];
    Object.keys(services).forEach(category => {
      allServices = [...allServices, ...services[category]];
    });
    return allServices;
  };

  // Funzione per filtrare i servizi in base alla categoria attiva
  const filteredServices = activeCategory === 'all' ? getAllServices() : services[activeCategory] || [];

  // Funzione per aggiungere/rimuovere un servizio dai preferiti
  const toggleFavorite = (serviceId) => {
    if (favorites.includes(serviceId)) {
      setFavorites(favorites.filter(id => id !== serviceId));
    } else {
      setFavorites([...favorites, serviceId]);
    }
  };

  // Funzione per aprire il modal delle note
  const openNoteModal = (service) => {
    setCurrentService(service);
    setNoteText(notes[service.id] || '');
    setShowNoteModal(true);
  };

  // Funzione per salvare una nota
  const saveNote = () => {
    if (currentService) {
      setNotes({
        ...notes,
        [currentService.id]: noteText
      });
      setShowNoteModal(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Intestazione del pannello */}
      <div className="bg-[#1d3a6b] text-white p-6">
        <h2 className="text-2xl font-bold flex items-center">
          <span className="mr-3">🔗</span>
          Pannello Servizi VeryPosta
        </h2>
        <p className="text-gray-300 mt-2">
          Accedi rapidamente a tutti i portali e servizi necessari per il tuo lavoro quotidiano
        </p>
      </div>

      {/* Navigazione categorie */}
      <div className="bg-gray-50 p-4 overflow-x-auto">
        <div className="flex space-x-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center ${activeCategory === category.id ? 'bg-[#ebd00b] text-[#1d3a6b] font-medium' : 'bg-white border border-gray-200 hover:border-[#ebd00b]'}`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Griglia dei servizi */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredServices.map(service => (
            <div key={service.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg">{service.name}</h3>
                  <button 
                    onClick={() => toggleFavorite(service.id)}
                    className="text-gray-400 hover:text-[#ebd00b] transition-colors"
                    aria-label={favorites.includes(service.id) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
                  >
                    {favorites.includes(service.id) ? "★" : "☆"}
                  </button>
                </div>
                <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <a 
                    href={service.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-[#ebd00b] text-[#1d3a6b] px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-400 transition flex-grow text-center mr-2"
                  >
                    Apri Portale
                  </a>
                  <button 
                    onClick={() => openNoteModal(service)}
                    className="p-2 text-gray-500 hover:text-[#1d3a6b] border border-gray-200 rounded-lg hover:border-[#1d3a6b] transition-colors"
                    aria-label="Aggiungi nota"
                  >
                    {notes[service.id] ? "📝" : "✏️"}
                  </button>
                </div>
                {notes[service.id] && (
                  <div className="mt-3 p-2 bg-yellow-50 rounded-lg text-sm text-gray-700 border-l-2 border-[#ebd00b]">
                    {notes[service.id]}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Nessun servizio disponibile in questa categoria.
          </div>
        )}
      </div>

      {/* Sezione preferiti */}
      {favorites.length > 0 && (
        <div className="border-t border-gray-200 p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center">
            <span className="mr-2">★</span> I tuoi servizi preferiti
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {getAllServices()
              .filter(service => favorites.includes(service.id))
              .map(service => (
                <div key={`fav-${service.id}`} className="border border-gray-200 rounded-xl overflow-hidden bg-[#f8f9ff] hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold">{service.name}</h3>
                      <button 
                        onClick={() => toggleFavorite(service.id)}
                        className="text-[#ebd00b] hover:text-gray-400 transition-colors"
                        aria-label="Rimuovi dai preferiti"
                      >
                        ★
                      </button>
                    </div>
                    <a 
                      href={service.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block bg-[#1d3a6b] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#16305b] transition text-center mt-2"
                    >
                      Apri Portale
                    </a>
                  </div>
                </div>
              ))}
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
    </div>
  );
}