import jwt from 'jsonwebtoken';
import { query } from './dbConfig';

/**
 * Verifica l'autenticazione dell'utente dalla richiesta
 * @param {Request} request - Oggetto richiesta
 * @returns {Object} - Oggetto con stato di autenticazione e informazioni utente
 */
export async function verifyAuth(request) {
  try {
    // Ottieni il token dall'header Authorization
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { authenticated: false, message: 'Token di autenticazione mancante', status: 401 };
    }
    
    const token = authHeader.split(' ')[1];
    if (!token) {
      return { authenticated: false, message: 'Token di autenticazione mancante', status: 401 };
    }
    
    // Verifica il token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'veryposta-secret-key');
    
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
    
    // Utente autenticato con successo
    return {
      authenticated: true,
      userId: decoded.id,
      userType: decoded.role,
      user: rows[0]
    };
    
  } catch (error) {
    console.error('Errore durante la verifica dell\'autenticazione:', error);
    return { authenticated: false, message: 'Token di autenticazione non valido', status: 401 };
  }
}