import { NextResponse } from 'next/server';
import { query, getById, create, update, remove } from '@/app/utils/dbConfig';
import { verifyAuth } from '@/app/utils/authMiddleware';

/**
 * API per gestire i progressi degli utenti nei corsi
 */

// GET /api/corsi - Ottiene tutti i progressi dell'utente autenticato
// GET /api/corsi?corso_id=X - Ottiene il progresso di un corso specifico
export async function GET(request) {
  // Verifica l'autenticazione dell'utente
  const auth = await verifyAuth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }
  
  const { searchParams } = new URL(request.url);
  const corsoId = searchParams.get('corso_id');
  
  try {
    let result;
    if (corsoId) {
      // Ottieni il progresso di un corso specifico
      const sql = `
        SELECT * FROM corsi_progresso 
        WHERE user_id = $1 AND corso_id = $2
      `;
      result = await query(sql, [auth.userId, corsoId]);
    } else {
      // Ottieni tutti i progressi dell'utente
      const sql = `
        SELECT * FROM corsi_progresso 
        WHERE user_id = $1
      `;
      result = await query(sql, [auth.userId]);
    }
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Errore nel recupero dei progressi:', error);
    return NextResponse.json(
      { error: 'Errore nel recupero dei progressi' },
      { status: 500 }
    );
  }
}

// POST /api/corsi - Crea o aggiorna il progresso di un utente per un corso
export async function POST(request) {
  // Verifica l'autenticazione dell'utente
  const auth = await verifyAuth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }
  
  try {
    const body = await request.json();
    const { corso_id, modulo_id, completato, quiz_risultato } = body;
    
    if (!corso_id || !modulo_id) {
      return NextResponse.json(
        { error: 'corso_id e modulo_id sono richiesti' },
        { status: 400 }
      );
    }
    
    // Verifica se esiste già un record per questo utente e corso
    const checkSql = `
      SELECT * FROM corsi_progresso 
      WHERE user_id = $1 AND corso_id = $2
    `;
    const checkResult = await query(checkSql, [auth.userId, corso_id]);
    
    let result;
    if (checkResult.rows.length > 0) {
      // Aggiorna il record esistente
      const progresso = checkResult.rows[0];
      let moduli_completati = progresso.moduli_completati || {};
      
      // Aggiorna lo stato del modulo
      moduli_completati[modulo_id] = {
        completato: completato || false,
        quiz_risultato: quiz_risultato || null,
        data_completamento: completato ? new Date().toISOString() : null
      };
      
      // Calcola il progresso totale
      const updateSql = `
        UPDATE corsi_progresso 
        SET moduli_completati = $1, 
            ultimo_aggiornamento = NOW() 
        WHERE user_id = $2 AND corso_id = $3 
        RETURNING *
      `;
      result = await query(updateSql, [moduli_completati, auth.userId, corso_id]);
    } else {
      // Crea un nuovo record
      const moduli_completati = {};
      moduli_completati[modulo_id] = {
        completato: completato || false,
        quiz_risultato: quiz_risultato || null,
        data_completamento: completato ? new Date().toISOString() : null
      };
      
      const insertSql = `
        INSERT INTO corsi_progresso (user_id, corso_id, moduli_completati, data_inizio, ultimo_aggiornamento) 
        VALUES ($1, $2, $3, NOW(), NOW()) 
        RETURNING *
      `;
      result = await query(insertSql, [auth.userId, corso_id, moduli_completati]);
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Errore nell\'aggiornamento del progresso:', error);
    return NextResponse.json(
      { error: 'Errore nell\'aggiornamento del progresso' },
      { status: 500 }
    );
  }
}