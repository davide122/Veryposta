import { query } from '@/app/utils/dbConfig';
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/app/utils/auth';

/**
 * Gestisce le richieste GET per ottenere i servizi preferiti di un affiliato
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
        { success: false, message: 'Solo gli affiliati possono accedere ai servizi preferiti' },
        { status: 403 }
      );
    }
    
    // Ottieni i servizi preferiti dell'affiliato
    const { rows } = await query(`
      SELECT s.*, true as isFavorite, 
        COALESCE((SELECT note FROM affiliate_service_notes WHERE affiliate_id = $1 AND service_id = s.id), '') as note
      FROM services s
      JOIN affiliate_favorite_services afs ON s.id = afs.service_id
      WHERE afs.affiliate_id = $1 AND s.active = true
      ORDER BY s.category, s.name
    `, [auth.userId]);
    
    return NextResponse.json({ success: true, data: rows });
    
  } catch (error) {
    console.error('Errore durante il recupero dei servizi preferiti:', error);
    return NextResponse.json(
      { success: false, message: 'Si è verificato un errore durante il recupero dei servizi preferiti.' },
      { status: 500 }
    );
  }
}

/**
 * Gestisce le richieste POST per aggiungere un servizio ai preferiti
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
        { success: false, message: 'Solo gli affiliati possono aggiungere servizi ai preferiti' },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    
    // Validazione dei dati
    if (!data.serviceId) {
      return NextResponse.json(
        { success: false, message: 'ID del servizio non specificato' },
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
    
    // Verifica se il servizio è già nei preferiti
    const { rows: favoriteRows } = await query(
      'SELECT * FROM affiliate_favorite_services WHERE affiliate_id = $1 AND service_id = $2',
      [auth.userId, data.serviceId]
    );
    
    if (favoriteRows.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Il servizio è già nei preferiti' },
        { status: 400 }
      );
    }
    
    // Aggiungi il servizio ai preferiti
    await query(
      'INSERT INTO affiliate_favorite_services (affiliate_id, service_id) VALUES ($1, $2)',
      [auth.userId, data.serviceId]
    );
    
    return NextResponse.json(
      { success: true, message: 'Servizio aggiunto ai preferiti con successo' },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Errore durante l\'aggiunta del servizio ai preferiti:', error);
    return NextResponse.json(
      { success: false, message: 'Si è verificato un errore durante l\'aggiunta del servizio ai preferiti.' },
      { status: 500 }
    );
  }
}

/**
 * Gestisce le richieste DELETE per rimuovere un servizio dai preferiti
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
        { success: false, message: 'Solo gli affiliati possono rimuovere servizi dai preferiti' },
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
    
    // Rimuovi il servizio dai preferiti
    const result = await query(
      'DELETE FROM affiliate_favorite_services WHERE affiliate_id = $1 AND service_id = $2',
      [auth.userId, serviceId]
    );
    
    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Il servizio non è nei preferiti o non esiste' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Servizio rimosso dai preferiti con successo' }
    );
    
  } catch (error) {
    console.error('Errore durante la rimozione del servizio dai preferiti:', error);
    return NextResponse.json(
      { success: false, message: 'Si è verificato un errore durante la rimozione del servizio dai preferiti.' },
      { status: 500 }
    );
  }
}