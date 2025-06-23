import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from './dbConfig';

/**
 * Middleware per verificare l'autenticazione degli utenti
 * Utilizzato per proteggere le API riservate
 */

export async function verifyAuth(request, requiredRole = null) {
  // Estrai il token dall'header Authorization
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { 
      authenticated: false, 
      message: 'Token non fornito',
      status: 401
    };
  }
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'veryposta-secret-key');
    
    // Verifica il ruolo se richiesto
    if (requiredRole && decoded.role !== requiredRole) {
      return { 
        authenticated: false, 
        message: 'Accesso non autorizzato',
        status: 403
      };
    }
    
    // Verifica se l'utente esiste nel database
    let userTable, userQuery;
    
    if (decoded.role === 'affiliate') {
      userTable = 'affiliates';
      userQuery = 'SELECT * FROM affiliates WHERE id = $1';
    } else if (decoded.role === 'admin' || decoded.role === 'staff') {
      userTable = 'users';
      userQuery = 'SELECT * FROM users WHERE id = $1 AND role = $2';
    } else {
      return { authenticated: false, message: 'Tipo di utente non valido', status: 401 };
    }
    
    let rows;
    if (decoded.role === 'admin' || decoded.role === 'staff') {
      const result = await query(userQuery, [decoded.id, decoded.role]);
      rows = result.rows;
    } else {
      const result = await query(userQuery, [decoded.id]);
      rows = result.rows;
    }
    
    if (rows.length === 0) {
      return { authenticated: false, message: 'Utente non trovato', status: 401 };
    }
    
    return { 
      authenticated: true, 
      userId: decoded.id,
      userType: decoded.role,
      userRole: decoded.role,
      userEmail: decoded.email,
      user: rows[0]
    };
  } catch (error) {
    console.error('Errore di autenticazione:', error);
    return { 
      authenticated: false, 
      message: 'Token non valido o scaduto',
      status: 401
    };
  }
}

/**
 * Funzione di utilità per restituire una risposta di errore di autenticazione
 */
export function authErrorResponse(authResult) {
  return NextResponse.json(
    { success: false, message: authResult.message },
    { status: authResult.status }
  );
}