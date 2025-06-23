import { getAll, getById, insert, update, remove, query } from '@/app/utils/dbConfig';
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/app/utils/auth';

/**
 * Verifica se l'utente è un amministratore
 * @param {Object} auth - Oggetto di autenticazione
 * @returns {boolean} - true se l'utente è un amministratore
 */
async function isAdmin(auth) {
  if (!auth.authenticated || !auth.userId) return false;
  
  try {
    // Verifica se l'utente è un admin (in una implementazione reale, questo potrebbe essere un campo nel database)
    // Per ora, assumiamo che gli admin abbiano un ruolo specifico o un flag nel database
    const { rows } = await query('SELECT role FROM users WHERE id = $1', [auth.userId]);
    return rows.length > 0 && rows[0].role === 'admin';
  } catch (error) {
    console.error('Errore durante la verifica del ruolo admin:', error);
    return false;
  }
}

/**
 * Gestisce le richieste GET per ottenere tutti i servizi o un servizio specifico
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    
    // Verifica autenticazione
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }
    
    let data;
    if (id) {
      // Ottieni un servizio specifico per ID
      data = await getById('services', id);
      
      if (!data) {
        return NextResponse.json({ success: false, message: 'Servizio non trovato' }, { status: 404 });
      }
      
      // Se l'utente è un affiliato, ottieni anche le informazioni sui preferiti e le note
      if (auth.userType === 'affiliate') {
        // Verifica se il servizio è tra i preferiti dell'affiliato
        const { rows: favoriteRows } = await query(
          'SELECT * FROM affiliate_favorite_services WHERE affiliate_id = $1 AND service_id = $2',
          [auth.userId, id]
        );
        data.isFavorite = favoriteRows.length > 0;
        
        // Ottieni le note dell'affiliato per questo servizio
        const { rows: noteRows } = await query(
          'SELECT note FROM affiliate_service_notes WHERE affiliate_id = $1 AND service_id = $2',
          [auth.userId, id]
        );
        data.note = noteRows.length > 0 ? noteRows[0].note : '';
      }
    } else if (category) {
      // Ottieni servizi per categoria
      const { rows } = await query('SELECT * FROM services WHERE category = $1 AND active = true ORDER BY name', [category]);
      data = rows;
      
      // Se l'utente è un affiliato, ottieni anche le informazioni sui preferiti e le note
      if (auth.userType === 'affiliate' && data.length > 0) {
        // Ottieni tutti i servizi preferiti dell'affiliato
        const { rows: favoriteRows } = await query(
          'SELECT service_id FROM affiliate_favorite_services WHERE affiliate_id = $1',
          [auth.userId]
        );
        const favoriteIds = favoriteRows.map(row => row.service_id);
        
        // Ottieni tutte le note dell'affiliato
        const { rows: noteRows } = await query(
          'SELECT service_id, note FROM affiliate_service_notes WHERE affiliate_id = $1',
          [auth.userId]
        );
        const notes = noteRows.reduce((acc, row) => {
          acc[row.service_id] = row.note;
          return acc;
        }, {});
        
        // Aggiungi le informazioni sui preferiti e le note a ciascun servizio
        data = data.map(service => ({
          ...service,
          isFavorite: favoriteIds.includes(service.id),
          note: notes[service.id] || ''
        }));
      }
    } else {
      // Ottieni tutti i servizi attivi
      const { rows } = await query('SELECT * FROM services WHERE active = true ORDER BY category, name');
      data = rows;
      
      // Se l'utente è un affiliato, ottieni anche le informazioni sui preferiti e le note
      if (auth.userType === 'affiliate' && data.length > 0) {
        // Ottieni tutti i servizi preferiti dell'affiliato
        const { rows: favoriteRows } = await query(
          'SELECT service_id FROM affiliate_favorite_services WHERE affiliate_id = $1',
          [auth.userId]
        );
        const favoriteIds = favoriteRows.map(row => row.service_id);
        
        // Ottieni tutte le note dell'affiliato
        const { rows: noteRows } = await query(
          'SELECT service_id, note FROM affiliate_service_notes WHERE affiliate_id = $1',
          [auth.userId]
        );
        const notes = noteRows.reduce((acc, row) => {
          acc[row.service_id] = row.note;
          return acc;
        }, {});
        
        // Aggiungi le informazioni sui preferiti e le note a ciascun servizio
        data = data.map(service => ({
          ...service,
          isFavorite: favoriteIds.includes(service.id),
          note: notes[service.id] || ''
        }));
      }
      
      // Se l'utente è un admin, includi anche i servizi inattivi
      if (await isAdmin(auth)) {
        const { rows: inactiveRows } = await query('SELECT * FROM services WHERE active = false ORDER BY category, name');
        if (inactiveRows.length > 0) {
          data = [...data, ...inactiveRows];
        }
      }
    }
    
    return NextResponse.json({ success: true, data });
    
  } catch (error) {
    console.error('Errore durante il recupero dei servizi:', error);
    return NextResponse.json(
      { success: false, message: 'Si è verificato un errore durante il recupero dei dati.' },
      { status: 500 }
    );
  }
}

/**
 * Gestisce le richieste POST per creare un nuovo servizio
 * Solo gli amministratori possono creare servizi
 */
export async function POST(request) {
  try {
    // Verifica autenticazione
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }
    
    // Verifica se l'utente è un amministratore
    if (!(await isAdmin(auth))) {
      return NextResponse.json(
        { success: false, message: 'Non hai i permessi per creare servizi' },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    
    // Validazione dei dati
    if (!data.name || !data.url || !data.category) {
      return NextResponse.json(
        { success: false, message: 'Nome, URL e categoria sono obbligatori' },
        { status: 400 }
      );
    }
    
    // Inserisci il nuovo servizio
    const newService = await insert('services', {
      name: data.name,
      description: data.description || '',
      url: data.url,
      logo: data.logo || '',
      category: data.category,
      active: data.active !== undefined ? data.active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    return NextResponse.json(
      { success: true, message: 'Servizio creato con successo', data: newService },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Errore durante la creazione del servizio:', error);
    return NextResponse.json(
      { success: false, message: 'Si è verificato un errore durante la creazione del servizio.' },
      { status: 500 }
    );
  }
}

/**
 * Gestisce le richieste PUT per aggiornare un servizio esistente
 * Solo gli amministratori possono aggiornare i servizi
 */
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID del servizio non specificato' },
        { status: 400 }
      );
    }
    
    // Verifica autenticazione
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }
    
    // Verifica se l'utente è un amministratore
    if (!(await isAdmin(auth))) {
      return NextResponse.json(
        { success: false, message: 'Non hai i permessi per aggiornare servizi' },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    
    // Verifica se il servizio esiste
    const existingService = await getById('services', id);
    if (!existingService) {
      return NextResponse.json(
        { success: false, message: 'Servizio non trovato' },
        { status: 404 }
      );
    }
    
    // Aggiorna il servizio
    const updatedService = await update('services', id, {
      name: data.name !== undefined ? data.name : existingService.name,
      description: data.description !== undefined ? data.description : existingService.description,
      url: data.url !== undefined ? data.url : existingService.url,
      logo: data.logo !== undefined ? data.logo : existingService.logo,
      category: data.category !== undefined ? data.category : existingService.category,
      active: data.active !== undefined ? data.active : existingService.active,
      updated_at: new Date().toISOString()
    });
    
    return NextResponse.json(
      { success: true, message: 'Servizio aggiornato con successo', data: updatedService }
    );
    
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del servizio:', error);
    return NextResponse.json(
      { success: false, message: 'Si è verificato un errore durante l\'aggiornamento del servizio.' },
      { status: 500 }
    );
  }
}

/**
 * Gestisce le richieste DELETE per eliminare un servizio
 * Solo gli amministratori possono eliminare servizi
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID del servizio non specificato' },
        { status: 400 }
      );
    }
    
    // Verifica autenticazione
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }
    
    // Verifica se l'utente è un amministratore
    if (!(await isAdmin(auth))) {
      return NextResponse.json(
        { success: false, message: 'Non hai i permessi per eliminare servizi' },
        { status: 403 }
      );
    }
    
    // Verifica se il servizio esiste
    const existingService = await getById('services', id);
    if (!existingService) {
      return NextResponse.json(
        { success: false, message: 'Servizio non trovato' },
        { status: 404 }
      );
    }
    
    // Elimina il servizio
    const deleted = await remove('services', id);
    
    if (deleted) {
      return NextResponse.json(
        { success: true, message: 'Servizio eliminato con successo' }
      );
    } else {
      return NextResponse.json(
        { success: false, message: 'Impossibile eliminare il servizio' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Errore durante l\'eliminazione del servizio:', error);
    return NextResponse.json(
      { success: false, message: 'Si è verificato un errore durante l\'eliminazione del servizio.' },
      { status: 500 }
    );
  }
}