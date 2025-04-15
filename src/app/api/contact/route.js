export async function POST(request) {
  try {
    const data = await request.json();
    
    // Qui in un'applicazione reale si invierebbe l'email o si salverebbe nel database
    // Per ora simuliamo un'operazione di successo
    
    // Validazione dei dati
    if (!data.name || !data.email || !data.phone || !data.message) {
      return new Response(JSON.stringify({ success: false, message: 'Tutti i campi sono obbligatori' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Simulazione di un'operazione di successo
    console.log('Dati del form ricevuti:', data);
    
    // Risposta di successo
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Messaggio inviato con successo! Ti contatteremo presto.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Errore durante l\'elaborazione del form:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Si è verificato un errore durante l\'invio del messaggio. Riprova più tardi.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}