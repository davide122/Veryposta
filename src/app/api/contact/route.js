import { getAll, getById, insert, update, remove } from '@/app/utils/dbConfig';

/**
 * Gestisce le richieste POST per salvare un nuovo messaggio di contatto
 */
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validazione dei dati
    if (!data.name || !data.email || !data.phone || !data.message) {
      return new Response(JSON.stringify({ success: false, message: 'Tutti i campi sono obbligatori' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Salva il messaggio nel database
    const newMessage = await insert('contact_messages', {
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      status: 'new',
      created_at: new Date().toISOString()
    });
    
    // Risposta di successo
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Messaggio inviato con successo! Ti contatteremo presto.',
      data: newMessage
    }), {
      status: 201,
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

/**
 * Gestisce le richieste GET per ottenere tutti i messaggi o un messaggio specifico
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    let data;
    if (id) {
      // Ottieni un messaggio specifico per ID
      data = await getById('contact_messages', id);
      
      if (!data) {
        return new Response(JSON.stringify({ success: false, message: 'Messaggio non trovato' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } else {
      // Ottieni tutti i messaggi
      data = await getAll('contact_messages');
    }
    
    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Errore durante il recupero dei messaggi:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Si è verificato un errore durante il recupero dei dati.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Gestisce le richieste PUT per aggiornare un messaggio esistente (ad es. per rispondere o cambiare stato)
 */
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return new Response(JSON.stringify({ success: false, message: 'ID messaggio mancante' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const data = await request.json();
    data.updated_at = new Date().toISOString();
    
    // Se c'è una risposta, aggiorna anche la data di risposta
    if (data.reply_message) {
      data.reply_date = new Date().toISOString();
      // Se lo stato non è specificato ma c'è una risposta, imposta lo stato a 'replied'
      if (!data.status) {
        data.status = 'replied';
      }
    }
    
    const updatedMessage = await update('contact_messages', id, data);
    
    if (!updatedMessage) {
      return new Response(JSON.stringify({ success: false, message: 'Messaggio non trovato' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Messaggio aggiornato con successo',
      data: updatedMessage
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del messaggio:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Si è verificato un errore durante l\'aggiornamento del messaggio.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Gestisce le richieste DELETE per eliminare un messaggio
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return new Response(JSON.stringify({ success: false, message: 'ID messaggio mancante' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const success = await remove('contact_messages', id);
    
    if (!success) {
      return new Response(JSON.stringify({ success: false, message: 'Messaggio non trovato' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Messaggio eliminato con successo'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Errore durante l\'eliminazione del messaggio:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Si è verificato un errore durante l\'eliminazione del messaggio.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}