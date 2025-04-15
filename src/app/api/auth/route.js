export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validazione dei dati
    if (!data.email || !data.password || !data.userType) {
      return new Response(JSON.stringify({ success: false, message: 'Tutti i campi sono obbligatori' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // In un'implementazione reale, qui si verificherebbero le credenziali nel database
    // e si genererebbe un token JWT per l'autenticazione
    
    // Per ora, simuliamo l'autenticazione con credenziali di esempio
    let isAuthenticated = false;
    let userData = {};
    
    // Simulazione di autenticazione per diversi tipi di utenti
    if (data.userType === 'affiliate') {
      // Credenziali di esempio per affiliato
      if (data.email === 'affiliate@example.com' && data.password === 'password') {
        isAuthenticated = true;
        userData = {
          id: 'aff123',
          name: 'Point Affiliato',
          email: data.email,
          role: 'affiliate',
          pointId: 'P001',
          location: 'Roma'
        };
      }
    } else if (data.userType === 'staff') {
      // Credenziali di esempio per staff
      if (data.email === 'staff@example.com' && data.password === 'password') {
        isAuthenticated = true;
        userData = {
          id: 'staff456',
          name: 'Staff Member',
          email: data.email,
          role: 'staff',
          department: 'Support'
        };
      }
    } else if (data.userType === 'admin') {
      // Credenziali di esempio per amministratore
      if (data.email === 'admin@example.com' && data.password === 'password') {
        isAuthenticated = true;
        userData = {
          id: 'admin789',
          name: 'Admin User',
          email: data.email,
          role: 'admin',
          permissions: ['full_access']
        };
      }
    }
    
    if (isAuthenticated) {
      // In un'implementazione reale, qui si genererebbe un JWT token
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Accesso effettuato con successo',
        token: mockToken,
        user: userData
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Credenziali non valide'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
  } catch (error) {
    console.error('Errore durante l\'autenticazione:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Si è verificato un errore durante l\'autenticazione. Riprova più tardi.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}