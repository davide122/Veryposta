"use client";
import { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

export default function LocationMap({ isOpen, onClose }) {
  const [locations, setLocations] = useState([
    { id: 1, city: "Milano", address: "Via Roma 123", phone: "02 1234567", email: "milano@veryposta.it", lat: 45.4642, lng: 9.1900 },
    { id: 2, city: "Roma", address: "Via Milano 456", phone: "06 7654321", email: "roma@veryposta.it", lat: 41.9028, lng: 12.4964 },
    { id: 3, city: "Napoli", address: "Corso Umberto 78", phone: "081 9876543", email: "napoli@veryposta.it", lat: 40.8518, lng: 14.2681 },
    { id: 4, city: "Torino", address: "Corso Francia 22", phone: "011 2233445", email: "torino@veryposta.it", lat: 45.0703, lng: 7.6869 },
    { id: 5, city: "Bologna", address: "Via Indipendenza 15", phone: "051 3344556", email: "bologna@veryposta.it", lat: 44.4949, lng: 11.3426 },
    { id: 6, city: "Firenze", address: "Via dei Calzaiuoli 33", phone: "055 6677889", email: "firenze@veryposta.it", lat: 43.7696, lng: 11.2558 },
    { id: 7, city: "Bari", address: "Corso Cavour 44", phone: "080 9988776", email: "bari@veryposta.it", lat: 41.1171, lng: 16.8719 },
    { id: 8, city: "Palermo", address: "Via Maqueda 100", phone: "091 8877665", email: "palermo@veryposta.it", lat: 38.1157, lng: 13.3615 },
    { id: 9, city: "Catania", address: "Via Etnea 200", phone: "095 7766554", email: "catania@veryposta.it", lat: 37.5079, lng: 15.0830 },
    { id: 10, city: "Verona", address: "Via Mazzini 50", phone: "045 6655443", email: "verona@veryposta.it", lat: 45.4384, lng: 10.9916 }
  ]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [availableRegions, setAvailableRegions] = useState([
    "Lombardia", "Piemonte", "Veneto", "Emilia-Romagna", "Toscana", "Lazio", "Campania", "Puglia", "Sicilia"
  ]);

  // Animazione per il modal
  const modalAnimation = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateY(0)' : 'translateY(-50px)',
    config: { tension: 280, friction: 20 }
  });

  // Inizializzazione della mappa
  useEffect(() => {
    if (!isOpen) return;

    // Carica lo script di Google Maps
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    };

    // Inizializza la mappa
    const initializeMap = () => {
      if (!document.getElementById('veryposta-map')) return;

      const map = new window.google.maps.Map(document.getElementById('veryposta-map'), {
        center: { lat: 41.9028, lng: 12.4964 }, // Centro Italia (Roma)
        zoom: 6,
        styles: [
          {
            featureType: "all",
            elementType: "all",
            stylers: [
              { saturation: -100 } // Mappa in bianco e nero
            ]
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [
              { color: "#ffffff" } // Strade bianche
            ]
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [
              { color: "#e9e9e9" } // Acqua grigio chiaro
            ]
          }
        ]
      });

      setMapInstance(map);
      setMapLoaded(true);
    };

    // Se la mappa non è ancora caricata, carica lo script
    if (!window.google || !window.google.maps) {
      loadGoogleMapsScript();
    } else {
      initializeMap();
    }
  }, [isOpen]);

  // Aggiunge i marker alla mappa
  useEffect(() => {
    if (!mapLoaded || !mapInstance) return;

    // Rimuovi i marker esistenti
    markers.forEach(marker => marker.setMap(null));
    const newMarkers = [];

    // Filtra le location in base alla ricerca
    const filteredLocations = locations.filter(location =>
      location.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Aggiungi i nuovi marker
    filteredLocations.forEach(location => {
      const marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: mapInstance,
        title: location.city,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1d3a6b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3" fill="#ebd00b"></circle>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(36, 36),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(18, 36)
        },
        animation: window.google.maps.Animation.DROP
      });

      marker.addListener('click', () => {
        setSelectedLocation(location);
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
  }, [mapLoaded, mapInstance, locations, searchTerm]);

  // Gestisce la chiusura del modal
  const handleClose = () => {
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <animated.div 
        style={modalAnimation} 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#1d3a6b]">
            Punti <span className="text-[#ebd00b]">VeryPosta</span> in Italia
          </h2>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl focus:outline-none"
            aria-label="Chiudi"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-[600px]">
          {/* Sidebar */}
          <div className="w-full md:w-1/3 p-6 overflow-y-auto border-r border-gray-200">
            <div className="mb-6">
              <input
                type="text"
                placeholder="Cerca per città..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
              />
            </div>

            <div className="space-y-4">
              {selectedLocation ? (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-[#1d3a6b]">{selectedLocation.city}</h3>
                    <button 
                      onClick={() => setSelectedLocation(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-gray-700 mt-2">{selectedLocation.address}</p>
                  <p className="text-gray-700 mt-1">
                    <span className="font-semibold">Tel:</span> {selectedLocation.phone}
                  </p>
                  <p className="text-gray-700 mt-1">
                    <span className="font-semibold">Email:</span> {selectedLocation.email}
                  </p>
                  <button className="mt-4 bg-[#ebd00b] text-[#1d3a6b] px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition">
                    Ottieni indicazioni
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">Seleziona un punto sulla mappa per visualizzare i dettagli</p>
                </div>
              )}

              <div className="mt-8">
                <h3 className="text-lg font-bold text-[#1d3a6b] mb-4">Regioni disponibili per nuove aperture</h3>
                <div className="grid grid-cols-2 gap-2">
                  {availableRegions.map((region, index) => (
                    <div key={index} className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm font-medium">
                      {region}
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <button 
                    onClick={() => onClose()}
                    className="w-full bg-[#1d3a6b] text-white px-4 py-3 rounded-xl font-bold hover:bg-[#16305b] transition"
                  >
                    Richiedi informazioni
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mappa */}
          <div className="w-full md:w-2/3 h-full">
            <div id="veryposta-map" className="w-full h-full">
              {!mapLoaded && (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#ebd00b] border-t-[#1d3a6b] rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[#1d3a6b] font-semibold">Caricamento mappa...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-500 text-center">
            Nota: Per utilizzare la mappa interattiva completa è necessario inserire una valida API key di Google Maps.<br />
            Questa è una versione dimostrativa con dati di esempio.
          </p>
        </div>
      </animated.div>
    </div>
  );
}