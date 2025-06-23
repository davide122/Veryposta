import { NextResponse } from 'next/server';
import { query } from '../../../utils/dbConfig';
import { verifyAuth } from '../../../utils/authMiddleware';
import bcrypt from 'bcryptjs';

/**
 * Gestisce le richieste per ottenere la lista degli utenti (admin e staff)
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

    // Ottieni il parametro role dalla query string
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    // Prepara la query in base al parametro role
    let queryText = 'SELECT * FROM users';
    const queryParams = [];

    if (role) {
      queryText += ' WHERE role = $1';
      queryParams.push(role);
    }

    queryText += ' ORDER BY created_at DESC';

    // Esegui la query
    const { rows } = await query(queryText, queryParams);

    // Rimuovi i campi sensibili come la password
    const users = rows.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return NextResponse.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Errore durante il recupero degli utenti:', error);
    return NextResponse.json(
      { success: false, message: 'Errore durante il recupero degli utenti' },
      { status: 500 }
    );
  }
}

/**
 * Gestisce la creazione di nuovi utenti (admin e staff)
 * Accessibile solo agli amministratori
 */
export async function POST(request) {
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
    const data = await request.json();

    // Validazione dei dati
    const requiredFields = ['name', 'email', 'password', 'role'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, message: `Il campo ${field} è obbligatorio` },
          { status: 400 }
        );
      }
    }

    // Verifica che il ruolo sia valido
    const validRoles = ['admin', 'staff'];
    if (!validRoles.includes(data.role)) {
      return NextResponse.json(
        { success: false, message: 'Ruolo non valido. I ruoli consentiti sono: admin, staff' },
        { status: 400 }
      );
    }

    // Verifica se l'email è già registrata
    const checkEmail = await query('SELECT * FROM users WHERE email = $1', [data.email]);
    if (checkEmail.rows.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Email già registrata' },
        { status: 409 }
      );
    }

    // Hash della password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Prepara i dati per l'inserimento
    const now = new Date();
    const insertData = {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      department: data.department || null,
      permissions: data.permissions || null,
      created_at: now,
      updated_at: now
    };

    // Inserisci il nuovo utente nel database
    const result = await query(
      `INSERT INTO users (name, email, password, role, department, permissions, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [
        insertData.name,
        insertData.email,
        insertData.password,
        insertData.role,
        insertData.department,
        insertData.permissions,
        insertData.created_at,
        insertData.updated_at
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Utente creato con successo',
      userId: result.rows[0].id
    });
  } catch (error) {
    console.error('Errore durante la creazione dell\'utente:', error);
    return NextResponse.json(
      { success: false, message: 'Errore durante la creazione dell\'utente' },
      { status: 500 }
    );
  }
}

/**
 * Aggiorna un utente esistente
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
    const data = await request.json();

    // Validazione dei dati
    if (!data.id) {
      return NextResponse.json(
        { success: false, message: 'ID utente obbligatorio' },
        { status: 400 }
      );
    }

    // Verifica che l'utente esista
    const checkResult = await query('SELECT * FROM users WHERE id = $1', [data.id]);
    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Utente non trovato' },
        { status: 404 }
      );
    }

    // Prepara i dati per l'aggiornamento
    const updateFields = [];
    const updateValues = [];
    let paramCounter = 1;

    // Aggiungi solo i campi che sono stati forniti
    const allowedFields = ['name', 'email', 'role', 'department', 'permissions'];
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateFields.push(`${field} = $${paramCounter}`);
        updateValues.push(data[field]);
        paramCounter++;
      }
    }

    // Gestisci la password separatamente se fornita
    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      updateFields.push(`password = $${paramCounter}`);
      updateValues.push(hashedPassword);
      paramCounter++;
    }

    // Aggiungi il timestamp di aggiornamento
    updateFields.push(`updated_at = $${paramCounter}`);
    updateValues.push(new Date());
    paramCounter++;

    // Aggiungi l'ID utente come ultimo parametro
    updateValues.push(data.id);

    // Se non ci sono campi da aggiornare
    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Nessun campo da aggiornare' },
        { status: 400 }
      );
    }

    // Esegui l'aggiornamento
    const updateResult = await query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${paramCounter} RETURNING *`,
      updateValues
    );

    // Rimuovi la password dal risultato
    const { password, ...updatedUser } = updateResult.rows[0];

    return NextResponse.json({
      success: true,
      message: 'Utente aggiornato con successo',
      user: updatedUser
    });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento dell\'utente:', error);
    return NextResponse.json(
      { success: false, message: 'Errore durante l\'aggiornamento dell\'utente' },
      { status: 500 }
    );
  }
}

/**
 * Elimina un utente
 * Accessibile solo agli amministratori
 */
export async function DELETE(request) {
  try {
    // Verifica l'autenticazione e il ruolo
    const auth = await verifyAuth(request, 'admin');
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status }
      );
    }

    // Ottieni l'ID utente dalla query string
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID utente obbligatorio' },
        { status: 400 }
      );
    }

    // Verifica che l'utente esista
    const checkResult = await query('SELECT * FROM users WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Utente non trovato' },
        { status: 404 }
      );
    }

    // Elimina l'utente
    await query('DELETE FROM users WHERE id = $1', [id]);

    return NextResponse.json({
      success: true,
      message: 'Utente eliminato con successo'
    });
  } catch (error) {
    console.error('Errore durante l\'eliminazione dell\'utente:', error);
    return NextResponse.json(
      { success: false, message: 'Errore durante l\'eliminazione dell\'utente' },
      { status: 500 }
    );
  }
}