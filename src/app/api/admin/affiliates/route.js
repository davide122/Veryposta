import { NextResponse } from 'next/server';
import { query } from '../../../utils/dbConfig';
import { verifyAuth } from '../../../utils/authMiddleware';

/**
 * Gestisce le richieste per ottenere la lista degli affiliati
 * Accessibile solo agli amministratori
 */
export async function GET(request) {
  try {
    // Verifica l'autenticazione e il ruolo
    const auth = await verifyAuth(request, 'admin');
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status }
      );
    }

    // Ottieni il parametro status dalla query string
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Prepara la query in base al parametro status
    let queryText = 'SELECT * FROM affiliates';
    const queryParams = [];

    if (status) {
      queryText += ' WHERE status = $1';
      queryParams.push(status);
    }

    queryText += ' ORDER BY created_at DESC';

    // Esegui la query
    const { rows } = await query(queryText, queryParams);

    // Rimuovi i campi sensibili come la password
    const affiliates = rows.map(affiliate => {
      const { password, ...affiliateWithoutPassword } = affiliate;
      return affiliateWithoutPassword;
    });

    return NextResponse.json({
      success: true,
      affiliates
    });
  } catch (error) {
    console.error('Errore durante il recupero degli affiliati:', error);
    return NextResponse.json(
      { success: false, message: 'Errore durante il recupero degli affiliati' },
      { status: 500 }
    );
  }
}

/**
 * Aggiorna lo stato di un affiliato
 * Accessibile solo agli amministratori
 */
export async function PATCH(request) {
  try {
    // Verifica l'autenticazione e il ruolo
    const auth = await verifyAuth(request, 'admin');
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status }
      );
    }

    // Estrai i dati dalla richiesta
    const requestData = await request.json();
    const id = requestData.id;
    const status = requestData.status;
    
    console.log('Dati ricevuti:', requestData); // Log per debug

    // Validazione dei dati
    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: 'ID e stato sono obbligatori' },
        { status: 400 }
      );
    }

    // Verifica che lo stato sia valido
    const validStatuses = ['pending', 'active', 'rejected', 'suspended'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Stato non valido' },
        { status: 400 }
      );
    }

    // Verifica che l'affiliato esista
    const checkResult = await query('SELECT * FROM affiliates WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Affiliato non trovato' },
        { status: 404 }
      );
    }

    // Aggiorna lo stato dell'affiliato
    const updateResult = await query(
      'UPDATE affiliates SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );

    // Rimuovi la password dal risultato
    const { password, ...updatedAffiliate } = updateResult.rows[0];

    // Se lo stato è cambiato da pending a active, invia una notifica
    if (status === 'active' && checkResult.rows[0].status === 'pending') {
      await query(
        'INSERT INTO affiliate_notifications (affiliate_id, message, type, created_at) VALUES ($1, $2, $3, NOW())',
        [id, 'La tua richiesta di affiliazione è stata approvata!', 'approval']
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Stato affiliato aggiornato con successo',
      affiliate: updatedAffiliate
    });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento dello stato dell\'affiliato:', error);
    return NextResponse.json(
      { success: false, message: 'Errore durante l\'aggiornamento dello stato dell\'affiliato' },
      { status: 500 }
    );
  }
}