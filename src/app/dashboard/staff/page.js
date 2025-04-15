"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function StaffDashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Dati di esempio per la dashboard dello staff
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalAffiliates: 24,
      pendingRequests: 5,
      openTickets: 8,
      newAffiliates: 3
    },
    recentTickets: [
      { id: 'TKT001', point: 'Point Roma', subject: 'Problema con SPID', date: '2023-11-15', status: 'Aperto', priority: 'Alta' },
      { id: 'TKT002', point: 'Point Milano', subject: 'Richiesta materiali', date: '2023-11-14', status: 'In elaborazione', priority: 'Media' },
      { id: 'TKT003', point: 'Point Napoli', subject: 'Errore sistema', date: '2023-11-14', status: 'Aperto', priority: 'Bassa' },
      { id: 'TKT004', point: 'Point Torino', subject: 'Formazione', date: '2023-11-13', status: 'Chiuso', priority: 'Media' },
    ],
    affiliates: [
      { id: 'P001', name: 'Point Roma', location: 'Roma', status: 'Attivo', joinDate: '2023-01-15' },
      { id: 'P002', name: 'Point Milano', location: 'Milano', status: 'Attivo', joinDate: '2023-02-20' },
      { id: 'P003', name: 'Point Napoli', location: 'Napoli', status: 'Attivo', joinDate: '2023-03-10' },
      { id: 'P004', name: 'Point Torino', location: 'Torino', status: 'In sospeso', joinDate: '2023-11-05' },
    ],
    announcements: [
      { id: 1, title: 'Nuova promozione energia', content: 'Dettagli sulla nuova offerta energia da proporre ai clienti', date: '2023-11-15', published: true },
      { id: 2, title: 'Aggiornamento sistema', content: 'Manutenzione programmata il 20/11', date: '2023-11-13', published: true },
      { id: 3, title: 'Nuovi materiali marketing', content: 'Disponibili nuovi volantini e materiali promozionali', date: '2023-11-10', published: false },
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
      // Verifica se l'utente è uno staff
      if (parsedUserData.role !== 'staff') {
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
              <span className="text-[#1d3a6b] ml-2 text-lg">| Staff Portal</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-semibold">{userData?.name || 'Staff Member'}</p>
              <p className="text-sm text-gray-500">{userData?.department || 'Support'}</p>
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
                  <span className="mr-3">🏪</span>
                  Affiliati
                </button>
                <button 
                  onClick={() => setActiveTab('tickets')} 
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeTab === 'tickets' ? 'bg-[#ebd00b] text-[#1d3a6b] font-medium' : 'hover:bg-gray-50'}`}
                >
                  <span className="mr-3">🎫</span>
                  Supporto Tecnico
                </button>
                <button 
                  onClick={() => setActiveTab('communications')} 
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeTab === 'communications' ? 'bg-[#ebd00b] text-[#1d3a6b] font-medium' : 'hover:bg-gray-50'}`}
                >
                  <span className="mr-3">📢</span>
                  Comunicazioni
                </button>
                <button 
                  onClick={() => setActiveTab('training')} 
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeTab === 'training' ? 'bg-[#ebd00b] text-[#1d3a6b] font-medium' : 'hover:bg-gray-50'}`}
                >
                  <span className="mr-3">🎓</span>
                  Formazione
                </button>
                <button 
                  onClick={() => setActiveTab('supplies')} 
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeTab === 'supplies' ? 'bg-[#ebd00b] text-[#1d3a6b] font-medium' : 'hover:bg-gray-50'}`}
                >
                  <span className="mr-3">📦</span>
                  Forniture
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
                    <div className="text-gray-500 text-sm mb-1">Richieste in Attesa</div>
                    <div className="text-3xl font-bold">{dashboardData.stats.pendingRequests}</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="text-gray-500 text-sm mb-1">Ticket Aperti</div>
                    <div className="text-3xl font-bold">{dashboardData.stats.openTickets}</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="text-gray-500 text-sm mb-1">Nuovi Affiliati (mese)</div>
                    <div className="text-3xl font-bold">{dashboardData.stats.newAffiliates}</div>
                  </div>
                </div>

                {/* Recent Tickets */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-4">Ticket Recenti</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Point</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oggetto</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stato</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priorità</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {dashboardData.recentTickets.map((ticket, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{ticket.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{ticket.point}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{ticket.subject}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{ticket.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ticket.status === 'Chiuso' ? 'bg-green-100 text-green-800' : ticket.status === 'In elaborazione' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                {ticket.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ticket.priority === 'Alta' ? 'bg-red-100 text-red-800' : ticket.priority === 'Media' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                {ticket.priority}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 text-right">
                    <button onClick={() => setActiveTab('tickets')} className="text-[#1d3a6b] hover:text-[#ebd00b] text-sm font-medium">Vedi tutti i ticket →</button>
                  </div>
                </div>

                {/* Recent Affiliates */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-4">Affiliati Recenti</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Località</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stato</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Iscrizione</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {dashboardData.affiliates.map((affiliate, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{affiliate.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{affiliate.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{affiliate.location}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${affiliate.status === 'Attivo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {affiliate.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{affiliate.joinDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 text-right">
                    <button onClick={() => setActiveTab('affiliates')} className="text-[#1d3a6b] hover:text-[#ebd00b] text-sm font-medium">Vedi tutti gli affiliati →</button>
                  </div>
                </div>
              </>
            )}

            {/* Affiliates Tab */}
            {activeTab === 'affiliates' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Gestione Affiliati</h2>
                  <div className="flex space-x-3">
                    <input 
                      type="text" 
                      placeholder="Cerca affiliato..." 
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
                    />
                    <button className="bg-[#ebd00b] text-[#1d3a6b] px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-400 transition">
                      Nuovo Affiliato
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Località</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stato</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Iscrizione</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dashboardData.affiliates.map((affiliate, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{affiliate.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{affiliate.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{affiliate.location}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${affiliate.status === 'Attivo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {affiliate.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{affiliate.joinDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                            <button className="text-blue-600 hover:text-blue-800">Dettagli</button>
                            <button className="text-gray-600 hover:text-gray-800">Modifica</button>
                            <button className="text-red-600 hover:text-red-800">Disattiva</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Mostrando 4 di 24 affiliati
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">&lt;</button>
                    <button className="px-3 py-1 bg-[#ebd00b] text-[#1d3a6b] rounded-md text-sm">1</button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">2</button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">3</button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">&gt;</button>
                  </div>
                </div>
              </div>
            )}

            {/* Tickets Tab */}
            {activeTab === 'tickets' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Gestione Ticket</h2>
                  <div className="flex space-x-3">
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ebd00b]">
                      <option>Tutti gli stati</option>
                      <option>Aperti</option>
                      <option>In elaborazione</option>
                      <option>Chiusi</option>
                    </select>
                    <button className="bg-[#ebd00b] text-[#1d3a6b] px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-400 transition">
                      Nuovo Ticket
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Point</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oggetto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stato</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priorità</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dashboardData.recentTickets.map((ticket, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{ticket.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{ticket.point}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{ticket.subject}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{ticket.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ticket.status === 'Chiuso' ? 'bg-green-100 text-green-800' : ticket.status === 'In elaborazione' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                              {ticket.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ticket.priority === 'Alta' ? 'bg-red-100 text-red-800' : ticket.priority === 'Media' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                              {ticket.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                            <button className="text-blue-600 hover:text-blue-800">Rispondi</button>
                            <button className="text-gray-600 hover:text-gray-800">Assegna</button>
                            <button className="text-green-600 hover:text-green-800">Chiudi</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Communications Tab */}
            {activeTab === 'communications' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Gestione Comunicazioni</h2>
                  <button className="bg-[#ebd00b] text-[#1d3a6b] px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-400 transition">
                    Nuova Comunicazione
                  </button>
                </div>
                
                <div className="space-y-6">
                  {dashboardData.announcements.map((announcement) => (
                    <div key={announcement.id} className="border border-gray-200 rounded-lg p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{announcement.title}</h3>
                          <span className="text-xs text-gray-500 block mt-1">{announcement.date}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${announcement.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {announcement.published ? 'Pubblicato' : 'Bozza'}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-3">{announcement.content}</p>
                      <div className="mt-4 flex justify-end space-x-3">
                        <button className="text-gray-500 hover:text-gray-700 text-sm">Modifica</button>
                        {announcement.published ? (
                          <button className="text-red-600 hover:text-red-800 text-sm">Nascondi</button>
                        ) : (
                          <button className="text-green-600 hover:text-green-800 text-sm">Pubblica</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8">
                  <h3 className="font-semibold mb-4">Crea Nuova Comunicazione</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Titolo</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
                        placeholder="Inserisci il titolo                        placeholder="Inserisci il titolo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contenuto</label>
                      <textarea 
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
                        placeholder="Scrivi qui il contenuto della comunicazione..."
                      ></textarea>
                    </div>
                    <div className="flex justify-end">
                      <button className="bg-[#1d3a6b] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#16305a] transition">
                        Pubblica Comunicazione
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
