"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Dati di esempio per la dashboard dell'amministratore
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalAffiliates: 24,
      totalRevenue: '€58,450',
      pendingRequests: 5,
      conversionRate: '68%'
    },
    recentAffiliateRequests: [
      { id: 'REQ001', name: 'Mario Bianchi', location: 'Firenze', date: '2023-11-15', status: 'In attesa' },
      { id: 'REQ002', name: 'Giulia Verdi', location: 'Bologna', date: '2023-11-14', status: 'Contattato' },
      { id: 'REQ003', name: 'Paolo Rossi', location: 'Palermo', date: '2023-11-13', status: 'In attesa' },
      { id: 'REQ004', name: 'Laura Neri', location: 'Bari', date: '2023-11-12', status: 'Approvato' },
    ],
    performanceData: [
      { id: 'P001', name: 'Point Roma', revenue: '€4,250', services: 156, growth: '+12%' },
      { id: 'P002', name: 'Point Milano', revenue: '€3,850', services: 142, growth: '+8%' },
      { id: 'P003', name: 'Point Napoli', revenue: '€3,120', services: 118, growth: '+5%' },
      { id: 'P004', name: 'Point Torino', revenue: '€2,980', services: 105, growth: '+3%' },
    ],
    systemUpdates: [
      { id: 1, title: 'Aggiornamento piattaforma', description: 'Nuove funzionalità per la gestione dei servizi', date: '2023-11-20', status: 'Pianificato' },
      { id: 2, title: 'Nuovi servizi', description: 'Integrazione servizi assicurativi', date: '2023-12-01', status: 'In sviluppo' },
      { id: 3, title: 'Manutenzione database', description: 'Ottimizzazione performance', date: '2023-11-18', status: 'Pianificato' },
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
      // Verifica se l'utente è un amministratore
      if (parsedUserData.role !== 'admin') {
        router.push(`/dashboard/${parsedUserData.role}`);
        return;
      }
      
      setUserData(parsedUserData);
    } catch (error) {
      console.error('Errore nel parsing dei dati utente:', error);
      router.push('/');
    }
    
    setIsLoading(false);
    
    // In un'implementazione reale, qui si caricherebbero i dati dal backend
    // fetchDashboardData(token);
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
                  onClick={() => setActiveTab('franchising')} 
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeTab === 'franchising' ? 'bg-[#ebd00b] text-[#1d3a6b] font-medium' : 'hover:bg-gray-50'}`}
                >
                  <span className="mr-3">🏢</span>
                  Franchising
                </button>
                <button 
                  onClick={() => setActiveTab('affiliates')} 
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeTab === 'affiliates' ? 'bg-[#ebd00b] text-[#1d3a6b] font-medium' : 'hover:bg-gray-50'}`}
                >
                  <span className="mr-3">🏪</span>
                  Affiliati
                </button>
                <button 
                  onClick={() => setActiveTab('services')} 
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeTab === 'services' ? 'bg-[#ebd00b] text-[#1d3a6b] font-medium' : 'hover:bg-gray-50'}`}
                >
                  <span className="mr-3">🛠️</span>
                  Servizi
                </button>
                <Link 
                  href="/dashboard/contatti"
                  className="w-full text-left px-4 py-2 rounded-lg flex items-center hover:bg-gray-50"
                >
                  <span className="mr-3">✉️</span>
                  Gestione Contatti
                </Link>
                <button 
                  onClick={() => setActiveTab('finance')} 
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeTab === 'finance' ? 'bg-[#ebd00b] text-[#1d3a6b] font-medium' : 'hover:bg-gray-50'}`}
                >
                  <span className="mr-3">💰</span>
                  Finanza
                </button>
                <button 
                  onClick={() => setActiveTab('marketing')} 
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeTab === 'marketing' ? 'bg-[#ebd00b] text-[#1d3a6b] font-medium' : 'hover:bg-gray-50'}`}
                >
                  <span className="mr-3">📢</span>
                  Marketing
                </button>
                <button 
                  onClick={() => setActiveTab('system')} 
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeTab === 'system' ? 'bg-[#ebd00b] text-[#1d3a6b] font-medium' : 'hover:bg-gray-50'}`}
                >
                  <span className="mr-3">⚙️</span>
                  Sistema
                </button>
                <button 
                  onClick={() => setActiveTab('users')} 
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeTab === 'users' ? 'bg-[#ebd00b] text-[#1d3a6b] font-medium' : 'hover:bg-gray-50'}`}
                >
                  <span className="mr-3">👥</span>
                  Utenti
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
                    <h3 className="font-semibold text-lg mb-4">Richieste di Affiliazione</h3>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="text-3xl font-bold">{dashboardData.stats.pendingRequests}</div>
                        <div className="text-sm text-gray-500">Richieste in attesa</div>
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
                
                <h3 className="font-semibold text-lg mb-4">Richieste Recenti</h3>
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