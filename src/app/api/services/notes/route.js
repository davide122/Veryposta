import { query } from '@/app/utils/dbConfig';
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/app/utils/auth';

/**
 * Gestisce le richieste GET per ottenere le note di un affiliato su un servizio
 */
export async function GET(request) {
  try {
    // Verifica autenticazione
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }
    
    // Verifica che l'utente sia un affiliato
    if (auth.userType !== 'affiliate') {
      return NextResponse.json(
        { success: false, message: 'Solo gli affiliati possono accedere alle note sui servizi' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('serviceId');
    
    if (!serviceId) {
      return NextResponse.json(
        { success: false, message: 'ID del servizio non specificato' },
        { status: 400 }
      );
    }
    
    // Ottieni la nota dell'affiliato per il servizio specificato
    const { rows } = await query(
      'SELECT note FROM affiliate_service_notes WHERE affiliate_id = $1 AND service_id = $2',
      [auth.userId, serviceId]
    );
    
    const note = rows.length > 0 ? rows[0].note : '';
    
    return NextResponse.json({ success: true, data: { note } });
    
  } catch (error) {
    console.error('Errore durante il recupero della nota:', error);
    return NextResponse.json(
      { success: false, message: 'Si è verificato un errore durante il recupero della nota.' },
      { status: 500 }
    );
  }
}

/**
 * Gestisce le richieste POST per aggiungere o aggiornare una nota su un servizio
 */
export async function POST(request) {
  try {
    // Verifica autenticazione
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }
    
    // Verifica che l'utente sia un affiliato
    if (auth.userType !== 'affiliate') {
      return NextResponse.json(
        { success: false, message: 'Solo gli affiliati possono aggiungere note ai servizi' },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    
    // Validazione dei dati
    if (!data.serviceId || data.note === undefined) {
      return NextResponse.json(
        { success: false, message: 'ID del servizio e nota sono obbligatori' },
        { status: 400 }
      );
    }
    
    // Verifica se il servizio esiste e è attivo
    const { rows: serviceRows } = await query(
      'SELECT * FROM services WHERE id = $1 AND active = true',
      [data.serviceId]
    );
    
    if (serviceRows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Servizio non trovato o non attivo' },
        { status: 404 }
      );
    }
    
    // Verifica se esiste già una nota per questo servizio
    const { rows: noteRows } = await query(
      'SELECT * FROM affiliate_service_notes WHERE affiliate_id = $1 AND service_id = $2',
      [auth.userId, data.serviceId]
    );
    
    if (noteRows.length > 0) {
      // Aggiorna la nota esistente
      await query(
        'UPDATE affiliate_service_notes SET note = $1, updated_at = $2 WHERE affiliate_id = $3 AND service_id = $4',
        [data.note, new Date().toISOString(), auth.userId, data.serviceId]
      );
      
      return NextResponse.json(
        { success: true, message: 'Nota aggiornata con successo' }
      );
    } else {
      // Inserisci una nuova nota
      await query(
        'INSERT INTO affiliate_service_notes (affiliate_id, service_id, note) VALUES ($1, $2, $3)',
        [auth.userId, data.serviceId, data.note]
      );
      
      return NextResponse.json(
        { success: true, message: 'Nota aggiunta con successo' },
        { status: 201 }
      );
    }
    
  } catch (error) {
    console.error('Errore durante l\'aggiunta/aggiornamento della nota:', error);
    return NextResponse.json(
      { success: false, message: 'Si è verificato un errore durante l\'aggiunta/aggiornamento della nota.' },
      { status: 500 }
    );
  }
}

/**
 * Gestisce le richieste DELETE per rimuovere una nota da un servizio
 */
export async function DELETE(request) {
  try {
    // Verifica autenticazione
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }
    
    // Verifica che l'utente sia un affiliato
    if (auth.userType !== 'affiliate') {
      return NextResponse.json(
        { success: false, message: 'Solo gli affiliati possono rimuovere note dai servizi' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('serviceId');
    
    if (!serviceId) {
      return NextResponse.json(
        { success: false, message: 'ID del servizio non specificato' },
        { status: 400 }
      );
    }
    
    // Rimuovi la nota
    const result = await query(
      'DELETE FROM affiliate_service_notes WHERE affiliate_id = $1 AND service_id = $2',
      [auth.userId, serviceId]
    );
    
    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Nota non trovata per questo servizio' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Nota rimossa con successo' }
    );
    
  } catch (error) {
    console.error('Errore durante la rimozione della nota:', error);
    return NextResponse.json(
      { success: false, message: 'Si è verificato un errore durante la rimozione della nota.' },
      { status: 500 }
    );
  }
}