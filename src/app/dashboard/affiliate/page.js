"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ServicePanel from '../../components/ServicePanel';
import { toast } from 'react-hot-toast';

export default function AffiliateDashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newService, setNewService] = useState({
    service_type: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    amount: '',
    notes: ''
  });
  
  // Funzione per caricare i dati della dashboard
  const fetchDashboardData = async (token) => {
    try {
      const response = await fetch('/api/affiliate/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Errore nel caricamento dei dati');
      }
      
      setDashboardData(data.data);
    } catch (error) {
      console.error('Errore nel caricamento della dashboard:', error);
      setError(error.message);
    }
  };
  
  // Funzione per registrare un nuovo servizio
  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('/api/affiliate/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newService)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Errore nella registrazione del servizio');
      }
      
      // Reset del form
      setNewService({
        service_type: '',
        client_name: '',
        client_email: '',
        client_phone: '',
        amount: '',
        notes: ''
      });
      
      // Aggiorna i dati della dashboard
      fetchDashboardData(token);
      
      toast.success('Servizio registrato con successo!');
    } catch (error) {
      console.error('Errore nella registrazione del servizio:', error);
      toast.error(error.message || 'Errore nella registrazione del servizio');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Funzione per segnare una notifica come letta
  const markNotificationAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('/api/affiliate/dashboard', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notification_id: notificationId })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Errore nell\'aggiornamento della notifica');
      }
      
      // Aggiorna i dati della dashboard
      fetchDashboardData(token);
    } catch (error) {
      console.error('Errore nell\'aggiornamento della notifica:', error);
      toast.error(error.message || 'Errore nell\'aggiornamento della notifica');
    }
  };
  
  // Dati di esempio per la dashboard (fallback se il caricamento fallisce)
  const [dashboardData, setDashboardData]
   = useState({
    stats: {
      totalServices: 156,
      pendingRequests: 8,
      completedToday: 12,
      monthlyRevenue: '€2,450'
    },
    recentServices: [
      { id: 'SRV001', type: 'Spedizione', client: 'Mario Rossi', date: '2023-11-15', status: 'Completato' },
      { id: 'SRV002', type: 'Energia', client: 'Giulia Bianchi', date: '2023-11-14', status: 'In elaborazione' },
      { id: 'SRV003', type: 'SPID', client: 'Luca Verdi', date: '2023-11-14', status: 'Completato' },
      { id: 'SRV004', type: 'PEC', client: 'Anna Neri', date: '2023-11-13', status: 'Completato' },
    ],
    notifications: [
      { id: 1, title: 'Nuova promozione', message: 'Nuova offerta energia disponibile', date: '2023-11-15', read: false },
      { id: 2, title: 'Aggiornamento sistema', message: 'Manutenzione programmata il 20/11', date: '2023-11-13', read: true },
      { id: 3, title: 'Materiale marketing', message: 'Nuovi volantini disponibili', date: '2023-11-10', read: true },
    ],
    supplies: [
      { id: 1, name: 'Carta A4', status: 'In stock', quantity: 5 },
      { id: 2, name: 'Toner stampante', status: 'Basso', quantity: 1 },
      { id: 3, name: 'Buste imbottite', status: 'In stock', quantity: 30 },
      { id: 4, name: 'Volantini promo', status: 'Esaurito', quantity: 0 },
    ]
  });

  useEffect(() => {
    // Verifica se l'utente è autenticato
    const token = localStorage.getItem('authToken');
    const storedUserData = localStorage.getItem('userData');
    
    if (!token || !storedUserData) {
      // Reindirizza alla home se non autenticato
      router.push('/');
      return;
    }
    
    try {
      const parsedUserData = JSON.parse(storedUserData);
      // Verifica se l'utente è un affiliato
      if (parsedUserData.role !== 'affiliate') {
        router.push(`/dashboard/${parsedUserData.role}`);
        return;
      }
      
      setUserData(parsedUserData);
      
      // Carica i dati della dashboard dal backend
      fetchDashboardData(token);
    } catch (error) {
      console.error('Errore nel parsing dei dati utente:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ebd00b] border-t-[#1d3a6b] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1d3a6b] font-semibold">Caricamento dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-[#1d3a6b] flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-2xl font-black tracking-tight">
              <span className="text-[#1d3a6b]">Very</span>
              <span className="text-[#ebd00b]">Posta</span>
              <span className="text-[#1d3a6b] ml-2 text-lg">| Dashboard Point</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-semibold">{userData?.name || 'Point Affiliato'}</p>
              <p className="text-sm text-gray-500">{userData?.location || 'Sede'}</p>
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
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm h-screen sticky top-16 overflow-y-auto hidden md:block">
          <div className="p-4">
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveTab('overview')} 
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeTab === 'overview' ? 'bg-[#ebd00b] text-[#1d3a6b] font-medium' : 'hover:bg-gray-50'}`}
              >
                <span className="mr-3">📊</span>
                Panoramica
              </button>
              <button 
                onClick={() => setActiveTab('services')} 
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeTab === 'services' ? 'bg-[#ebd00b] text-[#1d3a6b] font-medium' : 'hover:bg-gray-50'}`}
              >
                <span className="mr-3">🛠️</span>
                Servizi
              </button>
              <button 
                onClick={() => setActiveTab('communications')} 
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeTab === 'communications' ? 'bg-[#ebd00b] text-[#1d3a6b] font-medium' : 'hover:bg-gray-50'}`}
              >
                <span className="mr-3">📨</span>
                Comunicazioni
              </button>
              <button 
                onClick={() => setActiveTab('supplies')} 
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeTab === 'supplies' ? 'bg-[#ebd00b] text-[#1d3a6b] font-medium' : 'hover:bg-gray-50'}`}
              >
                <span className="mr-3">📦</span>
                Forniture
              </button>
              <button 
                onClick={() => setActiveTab('support')} 
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeTab === 'support' ? 'bg-[#ebd00b] text-[#1d3a6b] font-medium' : 'hover:bg-gray-50'}`}
              >
                <span className="mr-3">🔧</span>
                Supporto
              </button>
              <button 
                onClick={() => setActiveTab('billing')} 
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeTab === 'billing' ? 'bg-[#ebd00b] text-[#1d3a6b] font-medium' : 'hover:bg-gray-50'}`}
              >
                <span className="mr-3">💰</span>
                Fatturazione
              </button>
              <button 
                onClick={() => setActiveTab('portals')} 
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeTab === 'portals' ? 'bg-[#ebd00b] text-[#1d3a6b] font-medium' : 'hover:bg-gray-50'}`}
              >
                <span className="mr-3">🔗</span>
                Portali Servizi
              </button>
              <button 
                onClick={() => setActiveTab('stats')} 
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeTab === 'stats' ? 'bg-[#ebd00b] text-[#1d3a6b] font-medium' : 'hover:bg-gray-50'}`}
              >
                <span className="mr-3">📈</span>
                Statistiche
              </button>
            </nav>
          </div>
        </div>
  
        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Stats Cards */}
              {error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  <p>{error}</p>
                </div>
              ) : dashboardData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="text-gray-500 text-sm mb-1">Servizi Totali</div>
                    <div className="text-3xl font-bold">{dashboardData.stats.totalServices}</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="text-gray-500 text-sm mb-1">Richieste in Attesa</div>
                    <div className="text-3xl font-bold">{dashboardData.stats.pendingRequests}</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="text-gray-500 text-sm mb-1">Completati Oggi</div>
                    <div className="text-3xl font-bold">{dashboardData.stats.completedToday}</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="text-gray-500 text-sm mb-1">Fatturato Mensile</div>
                    <div className="text-3xl font-bold">{dashboardData.stats.monthlyRevenue}</div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                      <div className="h-2 bg-gray-200 rounded w-1/3 mb-3"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              )}
  
              {/* Recent Services */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Servizi Recenti</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Importo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commissione</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stato</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dashboardData && dashboardData.recentServices && dashboardData.recentServices.length > 0 ? (
                        dashboardData.recentServices.map((service) => (
                          <tr key={service.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1d3a6b]">{service.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.client}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.commission}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                service.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                service.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {service.status === 'completed' ? 'Completato' : 
                                 service.status === 'cancelled' ? 'Annullato' : 'In attesa'}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                            {error ? 'Errore nel caricamento dei servizi' : 'Nessun servizio recente'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
  
              {/* Notifications */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Notifiche</h2>
                <div className="space-y-4">
                  {dashboardData && dashboardData.notifications && dashboardData.notifications.length > 0 ? (
                    dashboardData.notifications.map((notification) => (
                      <div key={notification.id} className={`p-4 rounded-lg border-l-4 ${
                        notification.read ? 'border-gray-300 bg-gray-50' : 'border-[#ebd00b] bg-yellow-50'
                      }`}>
                        <div className="flex justify-between">
                          <h3 className="font-semibold">{notification.title}</h3>
                          <span className="text-sm text-gray-500">{notification.date}</span>
                        </div>
                        <p className="text-gray-600 mt-1">{notification.message}</p>
                        {!notification.read && (
                          <button 
                            onClick={() => markNotificationAsRead(notification.id)}
                            className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                          >
                            Segna come letta
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">
                      {error ? 'Errore nel caricamento delle notifiche' : 'Nessuna notifica'}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
  
          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Gestione Servizi</h2>
              
              {/* Form per registrare un nuovo servizio */}
              <div className="mb-8 border-b pb-8">
                <h3 className="text-lg font-medium mb-4">Registra Nuovo Servizio</h3>
                <form onSubmit={handleServiceSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo di Servizio *</label>
                      <select 
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d3a6b] focus:ring focus:ring-[#1d3a6b] focus:ring-opacity-50"
                        value={newService.service_type}
                        onChange={(e) => setNewService({...newService, service_type: e.target.value})}
                        required
                      >
                        <option value="">Seleziona un servizio</option>
                        <option value="Spedizione">Spedizione</option>
                        <option value="Energia">Energia</option>
                        <option value="SPID">SPID</option>
                        <option value="PEC">PEC</option>
                        <option value="Firma Digitale">Firma Digitale</option>
                        <option value="Consulenza">Consulenza</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Importo (€) *</label>
                      <input 
                        type="number" 
                        step="0.01"
                        min="0"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d3a6b] focus:ring focus:ring-[#1d3a6b] focus:ring-opacity-50"
                        value={newService.amount}
                        onChange={(e) => setNewService({...newService, amount: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome Cliente *</label>
                      <input 
                        type="text" 
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d3a6b] focus:ring focus:ring-[#1d3a6b] focus:ring-opacity-50"
                        value={newService.client_name}
                        onChange={(e) => setNewService({...newService, client_name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Cliente</label>
                      <input 
                        type="email" 
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d3a6b] focus:ring focus:ring-[#1d3a6b] focus:ring-opacity-50"
                        value={newService.client_email}
                        onChange={(e) => setNewService({...newService, client_email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefono Cliente</label>
                      <input 
                        type="tel" 
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d3a6b] focus:ring focus:ring-[#1d3a6b] focus:ring-opacity-50"
                        value={newService.client_phone}
                        onChange={(e) => setNewService({...newService, client_phone: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                      <textarea 
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d3a6b] focus:ring focus:ring-[#1d3a6b] focus:ring-opacity-50"
                        rows="3"
                        value={newService.notes}
                        onChange={(e) => setNewService({...newService, notes: e.target.value})}
                      ></textarea>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button 
                      type="submit" 
                      className="bg-[#1d3a6b] text-white px-4 py-2 rounded-md hover:bg-[#152c52] focus:outline-none focus:ring-2 focus:ring-[#1d3a6b] focus:ring-opacity-50 flex items-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Registrazione...
                        </>
                      ) : 'Registra Servizio'}
                    </button>
                  </div>
                </form>
              </div>
              
              <p className="text-gray-600 mb-8">Questa sezione ti permette di gestire tutti i servizi offerti dal tuo punto VeryPosta.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition">
                  <div className="text-3xl mb-4">📦</div>
                  <h3 className="font-bold text-lg mb-2">Spedizioni</h3>
                  <p className="text-gray-600 mb-4">Gestisci spedizioni nazionali e internazionali</p>
                  <button className="text-[#1d3a6b] font-medium hover:underline">Accedi →</button>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition">
                  <div className="text-3xl mb-4">⚡</div>
                  <h3 className="font-bold text-lg mb-2">Energia</h3>
                  <p className="text-gray-600 mb-4">Gestisci contratti luce e gas</p>
                  <button className="text-[#1d3a6b] font-medium hover:underline">Accedi →</button>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition">
                  <div className="text-3xl mb-4">📱</div>
                  <h3 className="font-bold text-lg mb-2">Telefonia</h3>
                  <p className="text-gray-600 mb-4">Gestisci contratti telefonia e internet</p>
                  <button className="text-[#1d3a6b] font-medium hover:underline">Accedi →</button>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition">
                  <div className="text-3xl mb-4">🔐</div>
                  <h3 className="font-bold text-lg mb-2">SPID</h3>
                  <p className="text-gray-600 mb-4">Gestisci richieste SPID</p>
                  <button className="text-[#1d3a6b] font-medium hover:underline">Accedi →</button>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition">
                  <div className="text-3xl mb-4">✉️</div>
                  <h3 className="font-bold text-lg mb-2">PEC</h3>
                  <p className="text-gray-600 mb-4">Gestisci caselle PEC</p>
                  <button className="text-[#1d3a6b] font-medium hover:underline">Accedi →</button>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition">
                  <div className="text-3xl mb-4">📝</div>
                  <h3 className="font-bold text-lg mb-2">Pratiche</h3>
                  <p className="text-gray-600 mb-4">Gestisci pratiche amministrative</p>
                  <button className="text-[#1d3a6b] font-medium hover:underline">Accedi →</button>
                </div>
              </div>
            </div>
          )}
  
          {/* Communications Tab */}
          {activeTab === 'communications' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Comunicazioni</h2>
              <p className="text-gray-600 mb-8">Tutte le comunicazioni ufficiali da parte di VeryPosta.</p>
              <div className="space-y-6">
                <div className="border-b pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">Nuova promozione energia</h3>
                    <span className="text-sm text-gray-500">15/11/2023</span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Cari affiliati, siamo lieti di annunciare il lancio di una nuova promozione per i contratti di energia elettrica e gas. La promozione offre condizioni vantaggiose per i clienti e commissioni maggiorate per voi.
                  </p>
                  <button className="text-[#1d3a6b] font-medium hover:underline">Leggi tutto →</button>
                </div>
                <div className="border-b pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">Aggiornamento sistema</h3>
                    <span className="text-sm text-gray-500">13/11/2023</span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Vi informiamo che il giorno 20/11/2023, dalle ore 22:00 alle ore 02:00, il sistema sarà sottoposto a manutenzione programmata per l'implementazione di nuove funzionalità. Durante questo periodo, alcuni servizi potrebbero non essere disponibili.
                  </p>
                  <button className="text-[#1d3a6b] font-medium hover:underline">Leggi tutto →</button>
                </div>
                <div className="border-b pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">Nuovi materiali marketing</h3>
                    <span className="text-sm text-gray-500">10/11/2023</span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Sono disponibili nuovi materiali marketing per la promozione dei servizi VeryPosta. I materiali includono volantini, locandine e banner per i social media. Potete scaricarli dalla sezione "Materiali Marketing" o richiederli in formato cartaceo.
                  </p>
                  <button className="text-[#1d3a6b] font-medium hover:underline">Leggi tutto →</button>
                </div>
              </div>
            </div>
          )}
  
          {/* Supplies Tab */}
          {activeTab === 'supplies' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Gestione Forniture</h2>
              <p className="text-gray-600 mb-8">Monitora e richiedi le forniture necessarie per il tuo punto VeryPosta.</p>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Articolo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stato</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantità</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.supplies.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1d3a6b]">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === 'In stock'
                              ? 'bg-green-100 text-green-800'
                              : item.status === 'Basso'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-[#1d3a6b] font-medium hover:underline mr-4">Ordina</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-8">
                <button className="bg-[#1d3a6b] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition">
                  Richiedi Nuova Fornitura
                </button>
              </div>
            </div>
          )}
  
          {/* Support Tab */}
          {activeTab === 'support' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Supporto Tecnico</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="border border-gray-200 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-4">🎫</div>
                  <h3 className="font-semibold text-lg mb-2">Apri un Ticket</h3>
                  <p className="text-gray-500 text-sm mb-4">Hai un problema tecnico? Apri un ticket e ti aiuteremo.</p>
                  <button className="bg-[#1d3a6b] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#16305b] transition w-full">
                    Nuovo Ticket
                  </button>
                </div>
                <div className="border border-gray-200 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-4">📚</div>
                  <h3 className="font-semibold text-lg mb-2">Guide e FAQ</h3>
                  <p className="text-gray-500 text-sm mb-4">Consulta le nostre guide e le domande frequenti.</p>
                  <button className="bg-[#ebd00b] text-[#1d3a6b] px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-400 transition w-full">
                    Vai alle Guide
                  </button>
                </div>
              </div>
              <h3 className="font-semibold mb-4">I tuoi Ticket</h3>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-500 mb-4">Non hai ticket attivi al momento</p>
                <button className="text-[#1d3a6b] hover:text-[#ebd00b] text-sm font-medium">
                  Visualizza ticket archiviati
                </button>
              </div>
            </div>
          )}
  
          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Fatturazione</h2>
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Riepilogo Mensile</h3>
                  <span className="text-sm text-gray-500">Novembre 2023</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-gray-500 text-sm">Fatturato</div>
                    <div className="text-2xl font-bold">€2,450</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-gray-500 text-sm">Commissioni</div>
                    <div className="text-2xl font-bold">€245</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-gray-500 text-sm">Netto</div>
                    <div className="text-2xl font-bold">€2,205</div>
                  </div>
                </div>
              </div>
            </div>
          )}
  
          {/* Portals Tab */}
          {activeTab === 'portals' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Portali e Servizi</h2>
                <p className="text-gray-600 mb-6">
                  Accedi rapidamente a tutti i portali e servizi necessari per il tuo lavoro quotidiano. Puoi aggiungere note personali e salvare i tuoi preferiti.
                </p>
              </div>
              <ServicePanel />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
