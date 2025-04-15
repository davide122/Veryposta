export async function POST(request) {
  try {
    const data = await request.json();
    
    // In un'applicazione reale, qui si gestirebbe la richiesta di affiliazione
    // salvandola nel database o inviando una notifica
    
    // Validazione dei dati
    if (!data.name || !data.email || !data.phone) {
      return new Response(JSON.stringify({ success: false, message: 'Tutti i campi sono obbligatori' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Simulazione di un'operazione di successo
    console.log('Richiesta di affiliazione ricevuta:', data);
    
    // Risposta di successo
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Richiesta di affiliazione inviata con successo! Ti contatteremo presto per i dettagli.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Errore durante l\'elaborazione della richiesta:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Si è verificato un errore durante l\'invio della richiesta. Riprova più tardi.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}