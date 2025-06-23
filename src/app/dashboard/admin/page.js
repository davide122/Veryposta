"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import ServicePanel from '../../components/ServicePanel';

export default function AdminDashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [affiliates, setAffiliates] = useState([]);
  const [isLoadingAffiliates, setIsLoadingAffiliates] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Stato per la gestione delle comunicazioni
  const [communicationForm, setCommunicationForm] = useState({
    title: '',
    message: '',
    sendToAll: true,
    selectedAffiliates: []
  });
  const [communications, setCommunications] = useState([]);
  const [isLoadingCommunications, setIsLoadingCommunications] = useState(false);
  
  // Stato per i dati della dashboard dell'amministratore
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalAffiliates: 0,
      totalRevenue: '€0',
      pendingRequests: 0,
      conversionRate: '0%'
    },
    recentAffiliateRequests: [],
    performanceData: [],
    systemUpdates: [
      { id: 1, title: 'Aggiornamento piattaforma', description: 'Nuove funzionalità per la gestione dei servizi', date: '2023-11-20', status: 'Pianificato' },
      { id: 2, title: 'Nuovi servizi', description: 'Integrazione servizi assicurativi', date: '2023-12-01', status: 'In sviluppo' },
      { id: 3, title: 'Manutenzione database', description: 'Ottimizzazione performance', date: '2023-11-18', status: 'Pianificato' },
    ],
    popularServices: []
  });
  
  // Funzione per caricare i dati della dashboard
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      // Carica tutti gli affiliati
      const affiliatesResponse = await axios.get('/api/admin/affiliates', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (affiliatesResponse.data.success) {
        const allAffiliates = affiliatesResponse.data.affiliates;
        const pendingAffiliates = allAffiliates.filter(a => a.status === 'pending');
        
        // Calcola il fatturato totale (in una implementazione reale, questo verrebbe dal backend)
        let totalRevenue = 0;
        allAffiliates.forEach(affiliate => {
          if (affiliate.revenue) {
            totalRevenue += parseFloat(affiliate.revenue);
          }
        });
        
        // Calcola il tasso di conversione (affiliati attivi / totale affiliati)
        const activeAffiliates = allAffiliates.filter(a => a.status === 'active');
        const conversionRate = allAffiliates.length > 0 
          ? Math.round((activeAffiliates.length / allAffiliates.length) * 100) 
          : 0;
        
        // Ottieni le richieste di affiliazione recenti (pending)
        const recentRequests = pendingAffiliates
          .map(affiliate => ({
            id: affiliate.id,
            name: affiliate.name,
            location: affiliate.city || 'N/A',
            date: new Date(affiliate.created_at).toLocaleDateString('it-IT'),
            status: 'In attesa'
          }))
          .slice(0, 5); // Prendi solo le prime 5
        
        // Ottieni i dati di performance degli affiliati attivi
        const performanceData = activeAffiliates
          .map(affiliate => ({
            id: affiliate.id,
            name: affiliate.business_name || affiliate.name,
            revenue: `€${affiliate.revenue || '0'}`,
            services: affiliate.services_count || 0,
            growth: affiliate.growth || '+0%'
          }))
          .slice(0, 5); // Prendi solo i primi 5
        
        // Aggiorna lo stato della dashboard
        setDashboardData(prev => ({
          ...prev,
          stats: {
            totalAffiliates: allAffiliates.length,
            totalRevenue: `€${totalRevenue.toFixed(2)}`,
            pendingRequests: pendingAffiliates.length,
            conversionRate: `${conversionRate}%`
          },
          recentAffiliateRequests: recentRequests,
          performanceData: performanceData
        }));
      }
      
      // Carica i servizi più popolari (in una implementazione reale, questo verrebbe da un endpoint dedicato)
      const servicesResponse = await axios.get('/api/services', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (servicesResponse.data.success) {
        // Simula i servizi più popolari ordinandoli per un criterio (in questo caso, alfabetico)
        // In un'implementazione reale, si ordinerebbe per numero di utilizzi o altro criterio di popolarità
        const popularServices = servicesResponse.data.data
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, 5) // Prendi solo i primi 5
          .map(service => ({
            id: service.id,
            name: service.name,
            category: service.category,
            usageCount: Math.floor(Math.random() * 100) + 1 // Simulazione del conteggio utilizzi
          }));
        
        setDashboardData(prev => ({
          ...prev,
          popularServices
        }));
      }
      
    } catch (error) {
      console.error('Errore durante il caricamento dei dati della dashboard:', error);
    }
  };

  // Funzione per caricare gli affiliati dal backend
  const fetchAffiliates = async (status = 'all') => {
    setIsLoadingAffiliates(true);
    try {
      const token = localStorage.getItem('authToken');
      const url = status === 'all' 
        ? '/api/admin/affiliates' 
        : `/api/admin/affiliates?status=${status}`;
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setAffiliates(response.data.affiliates);
        // Aggiorna anche il conteggio delle richieste in attesa nel dashboard
        const pendingCount = response.data.affiliates.filter(a => a.status === 'pending').length;
        setDashboardData(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            pendingRequests: pendingCount
          }
        }));
      }
    } catch (error) {
      console.error('Errore durante il caricamento degli affiliati:', error);
      setErrorMessage('Errore durante il caricamento degli affiliati. Riprova più tardi.');
    } finally {
      setIsLoadingAffiliates(false);
    }
  };

  // Funzione per caricare le comunicazioni inviate
  const fetchCommunications = async () => {
    setIsLoadingCommunications(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('/api/admin/communications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCommunications(response.data.data.communications);
      }
    } catch (error) {
      console.error('Errore durante il caricamento delle comunicazioni:', error);
      setErrorMessage('Errore durante il caricamento delle comunicazioni. Riprova più tardi.');
    } finally {
      setIsLoadingCommunications(false);
    }
  };

  // Funzione per inviare una nuova comunicazione
  const sendCommunication = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      
      const payload = {
        title: communicationForm.title,
        message: communicationForm.message,
        affiliate_ids: communicationForm.sendToAll ? [] : communicationForm.selectedAffiliates
      };
      
      const response = await axios.post('/api/admin/communications', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setSuccessMessage('Comunicazione inviata con successo!');
        // Reset del form
        setCommunicationForm({
          title: '',
          message: '',
          sendToAll: true,
          selectedAffiliates: []
        });
        // Ricarica le comunicazioni
        fetchCommunications();
      }
    } catch (error) {
      console.error('Errore durante l\'invio della comunicazione:', error);
      setErrorMessage('Errore durante l\'invio della comunicazione. Riprova più tardi.');
    }
  };

  // Funzione per aggiornare lo stato di un affiliato
  const updateAffiliateStatus = async (affiliateId, newStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.patch('/api/admin/affiliates', 
        { id: affiliateId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      if (response.data.success) {
        // Aggiorna la lista degli affiliati
        setAffiliates(prevAffiliates => 
          prevAffiliates.map(affiliate => 
            affiliate.id === affiliateId 
              ? { ...affiliate, status: newStatus } 
              : affiliate
          )
        );
        
        setSuccessMessage(`Stato dell'affiliato aggiornato con successo a "${newStatus}".`);
        
        // Nascondi il messaggio dopo 3 secondi
        setTimeout(() => setSuccessMessage(''), 3000);
        
        // Aggiorna anche il conteggio delle richieste in attesa
        fetchAffiliates(statusFilter);
      } else {
        setErrorMessage(response.data.message || 'Errore durante l\'aggiornamento dello stato');
      }
    } catch (error) {
      console.error('Errore durante l\'aggiornamento dello stato:', error);
      setErrorMessage('Errore durante l\'aggiornamento dello stato dell\'affiliato');
    }
  };

  useEffect(() => {
    // Verifica se l'utente è autenticato
    const token = localStorage.getItem('authToken');
    const storedUserData = localStorage.getItem('userData');
    
    if (!token || !storedUserData) {
      router.push('/accesso');
      return;
    }
    
    try {
      const parsedUserData = JSON.parse(storedUserData);
      // Verifica se l'utente è un admin
      if (parsedUserData.role !== 'admin') {
        router.push(`/dashboard/${parsedUserData.role}`);
        return;
      }
      
      // Carica i dati dell'utente
      const fetchUserData = async () => {
        try {
          const response = await axios.get('/api/auth', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data.success) {
            setUserData(response.data.user);
          } else {
            router.push('/accesso');
          }
        } catch (error) {
          console.error('Errore durante il recupero dei dati utente:', error);
          router.push('/accesso');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchUserData();
      fetchDashboardData();
      fetchAffiliates();
      fetchCommunications();
    } catch (error) {
      console.error('Errore nel parsing dei dati utente:', error);
      router.push('/accesso');
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
                <button 
                  onClick={() => setActiveTab('overview')} 
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeTab === 'overview' ? 'bg-[#ebd00b] text-[#1d3a6b] font-medium' : 'hover:bg-gray-50'}`}
                >
                  <span className="mr-3">📊</span>
                  Panoramica
                </button>
                <button 
                  onClick={() => setActiveTab('affiliates')} 
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeTab === 'affiliates' ? 'bg-[#ebd00b] text-[#1d3a6b] font-medium' : 'hover:bg-gray-50'}`}
                >
                  <span className="mr-3">👥</span>
                  Affiliati
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
                  onClick={() => setActiveTab('contacts')} 
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeTab === 'contacts' ? 'bg-[#ebd00b] text-[#1d3a6b] font-medium' : 'hover:bg-gray-50'}`}
                >
                  <span className="mr-3">📞</span>
                  Gestione Contatti
                </button>
                <button 
                  onClick={() => setActiveTab('system')} 
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeTab === 'system' ? 'bg-[#ebd00b] text-[#1d3a6b] font-medium' : 'hover:bg-gray-50'}`}
                >
                  <span className="mr-3">⚙️</span>
                  Sistema
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-4 space-y-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="text-gray-500 text-sm mb-1">Affiliati Totali</div>
                    <div className="text-3xl font-bold">{dashboardData.stats.totalAffiliates}</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="text-gray-500 text-sm mb-1">Fatturato Totale</div>
                    <div className="text-3xl font-bold">{dashboardData.stats.totalRevenue}</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="text-gray-500 text-sm mb-1">Richieste in Attesa</div>
                    <div className="text-3xl font-bold">{dashboardData.stats.pendingRequests}</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="text-gray-500 text-sm mb-1">Tasso di Conversione</div>
                    <div className="text-3xl font-bold">{dashboardData.stats.conversionRate}</div>
                  </div>
                </div>

                {/* Recent Affiliate Requests */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-4">Richieste di Affiliazione Recenti</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Località</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stato</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {dashboardData.recentAffiliateRequests.map((request, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{request.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{request.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{request.location}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{request.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.status === 'Approvato' ? 'bg-green-100 text-green-800' : request.status === 'Contattato' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {request.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">Dettagli</button>
                              <button className="text-green-600 hover:text-green-800">Approva</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 text-right">
                    <button onClick={() => setActiveTab('franchising')} className="text-[#1d3a6b] hover:text-[#ebd00b] text-sm font-medium">Vedi tutte le richieste →</button>
                  </div>
                </div>

                {/* Performance Data */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-4">Performance Affiliati</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Point</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fatturato</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servizi</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crescita</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {dashboardData.performanceData.map((point, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{point.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{point.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{point.revenue}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{point.services}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{point.growth}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button className="text-blue-600 hover:text-blue-800">Dettagli</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 text-right">
                    <button onClick={() => setActiveTab('affiliates')} className="text-[#1d3a6b] hover:text-[#ebd00b] text-sm font-medium">Vedi tutti gli affiliati →</button>
                  </div>
                </div>

                {/* Popular Services */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-4">Servizi Più Utilizzati</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilizzi</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {dashboardData.popularServices && dashboardData.popularServices.length > 0 ? (
                          dashboardData.popularServices.map((service, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{service.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">{service.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  service.category === 'energy' ? 'bg-yellow-100 text-yellow-800' :
                                  service.category === 'telecom' ? 'bg-blue-100 text-blue-800' :
                                  service.category === 'spid' ? 'bg-purple-100 text-purple-800' :
                                  service.category === 'postal' ? 'bg-green-100 text-green-800' :
                                  service.category === 'shipping' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {service.category}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">{service.usageCount}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">Nessun servizio disponibile</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 text-right">
                    <button onClick={() => setActiveTab('services')} className="text-[#1d3a6b] hover:text-[#ebd00b] text-sm font-medium">Gestisci servizi →</button>
                  </div>
                </div>

                {/* System Updates */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-4">Aggiornamenti di Sistema</h2>
                  <div className="space-y-4">
                    {dashboardData.systemUpdates.map((update) => (
                      <div key={update.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{update.title}</h3>
                            <span className="text-xs text-gray-500 block mt-1">Previsto: {update.date}</span>
                          </div>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${update.status === 'Completato' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {update.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{update.description}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-right">
                    <button onClick={() => setActiveTab('system')} className="text-[#1d3a6b] hover:text-[#ebd00b] text-sm font-medium">Gestisci sistema →</button>
                  </div>
                </div>
              </>
            )}

            {/* Franchising Tab */}
            {activeTab === 'franchising' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Gestione Franchising</h2>
                  <div className="flex space-x-3">
                    <button className="bg-[#ebd00b] text-[#1d3a6b] px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-400 transition">
                      Nuova Campagna
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-lg mb-4">Richiesta di Affiliazione</h3>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="text-3xl font-bold">{dashboardData.stats.pendingRequests}</div>
                        <div className="text-sm text-gray-500">Richiesta in attesa</div>
                      </div>
                      <button className="text-[#1d3a6b] hover:text-[#ebd00b] text-sm font-medium">
                        Gestisci →
                      </button>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#ebd00b]" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-lg mb-4">Conversione Lead</h3>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="text-3xl font-bold">{dashboardData.stats.conversionRate}</div>
                        <div className="text-sm text-gray-500">Tasso di conversione</div>
                      </div>
                      <button className="text-[#1d3a6b] hover:text-[#ebd00b] text-sm font-medium">
                        Analisi →
                      </button>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-4">Richiesta Recenti</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Località</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stato</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dashboardData.recentAffiliateRequests.map((request, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{request.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{request.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{request.location}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{request.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.status === 'Approvato' ? 'bg-green-100 text-green-800' : request.status === 'Contattato' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {request.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                            <button className="text-blue-600 hover:text-blue-800">Dettagli</button>
                            <button className="text-green-600 hover:text-green-800">Approva</button>
                            <button className="text-red-600 hover:text-red-800">Rifiuta</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-semibold text-lg mb-4">Contratti e Documentazione</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4 flex items-center">
                      <div className="text-2xl mr-3">📄</div>
                      <div>
                        <h4 className="font-medium">Contratto Standard</h4>
                        <p className="text-xs text-gray-500">Ultimo aggiornamento: 10/10/2023</p>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 flex items-center">
                      <div className="text-2xl mr-3">📋</div>
                      <div>
                        <h4 className="font-medium">Manuale Operativo</h4>
                        <p className="text-xs text-gray-500">Ultimo aggiornamento: 15/09/2023</p>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 flex items-center">
                      <div className="text-2xl mr-3">📊</div>
                      <div>
                        <h4 className="font-medium">Piano Commissioni</h4>
                        <p className="text-xs text-gray-500">Ultimo aggiornamento: 01/11/2023</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Gestione Servizi</h2>
                </div>
                
                {/* Integrazione del ServicePanel */}
                <ServicePanel userRole="admin" />
              </div>
            )}

            {activeTab === 'affiliates' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Gestione Affiliati</h2>
                  <div className="flex space-x-3">
                    <select 
                      value={statusFilter} 
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
                    >
                      <option value="all">Tutti gli stati</option>
                      <option value="pending">In attesa</option>
                      <option value="active">Attivi</option>
                      <option value="suspended">Sospesi</option>
                    </select>
                    <button 
                      onClick={() => fetchAffiliates(statusFilter)}
                      className="bg-[#1d3a6b] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition"
                    >
                      Aggiorna
                    </button>
                  </div>
                </div>
                
                {/* Messaggi di successo o errore */}
                {successMessage && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {successMessage}
                  </div>
                )}
                
                {errorMessage && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {errorMessage}
                  </div>
                )}
                
                {isLoadingAffiliates ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 border-4 border-[#ebd00b] border-t-[#1d3a6b] rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Caricamento affiliati...</p>
                  </div>
                ) : affiliates.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Nessun affiliato trovato con i filtri selezionati.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Città</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Registrazione</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stato</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {affiliates.map((affiliate) => (
                          <tr key={affiliate.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{affiliate.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{affiliate.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{affiliate.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{affiliate.city}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {new Date(affiliate.created_at).toLocaleDateString('it-IT')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${affiliate.status === 'active' ? 'bg-green-100 text-green-800' : affiliate.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                {affiliate.status === 'active' ? 'Attivo' : affiliate.status === 'pending' ? 'In attesa' : 'Sospeso'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                              {affiliate.status === 'pending' && (
                                <button 
                                  onClick={() => updateAffiliateStatus(affiliate.id, 'active')}
                                  className="text-green-600 hover:text-green-800 font-medium"
                                >
                                  Approva
                                </button>
                              )}
                              {affiliate.status === 'active' && (
                                <button 
                                  onClick={() => updateAffiliateStatus(affiliate.id, 'suspended')}
                                  className="text-red-600 hover:text-red-800 font-medium"
                                >
                                  Sospendi
                                </button>
                              )}
                              {affiliate.status === 'suspended' && (
                                <button 
                                  onClick={() => updateAffiliateStatus(affiliate.id, 'active')}
                                  className="text-green-600 hover:text-green-800 font-medium"
                                >
                                  Riattiva
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            
            {/* Communications Tab */}
            {activeTab === 'communications' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Comunicazioni agli Affiliati</h2>
                </div>
                
                {/* Form per inviare una nuova comunicazione */}
                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                  <h3 className="font-semibold mb-4">Invia Nuova Comunicazione</h3>
                  
                  {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                      {successMessage}
                    </div>
                  )}
                  
                  {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      {errorMessage}
                    </div>
                  )}
                  
                  <form onSubmit={sendCommunication}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Titolo</label>
                      <input 
                        type="text" 
                        value={communicationForm.title}
                        onChange={(e) => setCommunicationForm({...communicationForm, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ebd00b] focus:border-[#ebd00b]"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Messaggio</label>
                      <textarea 
                        value={communicationForm.message}
                        onChange={(e) => setCommunicationForm({...communicationForm, message: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ebd00b] focus:border-[#ebd00b] h-32"
                        required
                      ></textarea>
                    </div>
                    
                    <div className="mb-4">
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={communicationForm.sendToAll}
                          onChange={(e) => setCommunicationForm({...communicationForm, sendToAll: e.target.checked})}
                          className="h-4 w-4 text-[#ebd00b] focus:ring-[#ebd00b] border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Invia a tutti gli affiliati attivi</span>
                      </label>
                    </div>
                    
                    {!communicationForm.sendToAll && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Seleziona Affiliati</label>
                        <select 
                          multiple
                          value={communicationForm.selectedAffiliates}
                          onChange={(e) => {
                            const options = [...e.target.selectedOptions];
                            const values = options.map(option => option.value);
                            setCommunicationForm({...communicationForm, selectedAffiliates: values});
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#ebd00b] focus:border-[#ebd00b] h-32"
                        >
                          {affiliates
                            .filter(affiliate => affiliate.status === 'active')
                            .map(affiliate => (
                              <option key={affiliate.id} value={affiliate.id}>
                                {affiliate.business_name || affiliate.name} ({affiliate.email})
                              </option>
                            ))
                          }
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Tieni premuto Ctrl (o Cmd su Mac) per selezionare più affiliati</p>
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <button 
                        type="submit" 
                        className="bg-[#1d3a6b] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition"
                      >
                        Invia Comunicazione
                      </button>
                    </div>
                  </form>
                </div>
                
                {/* Lista delle comunicazioni inviate */}
                <h3 className="font-semibold mb-4">Comunicazioni Inviate</h3>
                
                {isLoadingCommunications ? (
                  <div className="text-center py-4">
                    <p>Caricamento comunicazioni...</p>
                  </div>
                ) : communications.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titolo</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Invio</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destinatari</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lette</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {communications.map((comm, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-[#1d3a6b]">{comm.title}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">{comm.message}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(comm.first_sent).toLocaleDateString('it-IT')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {comm.recipient_count}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {comm.read_count}/{comm.recipient_count} ({Math.round((comm.read_count / comm.recipient_count) * 100)}%)
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-gray-500">Nessuna comunicazione inviata</p>
                  </div>
                )}
              </div>
            )}

            {/* System Tab */}
            {activeTab === 'system' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Gestione Sistema</h2>
                  <button className="bg-[#ebd00b] text-[#1d3a6b] px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-400 transition">
                    Nuovo Aggiornamento
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-2">⚙️</div>
                    <h3 className="font-semibold">Versione Sistema</h3>
                    <p className="text-2xl font-bold mt-2">v2.4.1</p>
                    <p className="text-xs text-gray-500 mt-1">Rilasciata il 01/11/2023</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-2">🔄</div>
                    <h3 className="font-semibold">Stato Sistema</h3>
                    <p className="text-2xl font-bold mt-2 text-green-600">Operativo</p>
                    <p className="text-xs text-gray-500 mt-1">Uptime: 99.8%</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-2">📅</div>
                    <h3 className="font-semibold">Prossimo Aggiornamento</h3>
                    <p className="text-2xl font-bold mt-2">20/11/2023</p>
                    <p className="text-xs text-gray-500 mt-1">Manutenzione pianificata</p>
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-4">Aggiornamenti Pianificati</h3>
                <div className="space-y-4">
                  {dashboardData.systemUpdates.map((update) => (
                    <div key={update.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{update.title}</h4>
                          <span className="text-xs text-gray-500 block mt-1">Previsto: {update.date}</span>
                        </div>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${update.status === 'Completato' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {update.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{update.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div> {/* Fine Main Content Area */}
        </div> {/* Fine Grid */}
      </div> {/* Fine max-w container */}
    </div> 
  );
}