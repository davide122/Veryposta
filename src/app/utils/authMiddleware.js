import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

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
    
    return { 
      authenticated: true, 
      userId: decoded.id,
      userRole: decoded.role,
      userEmail: decoded.email
    };
  } catch (error) {
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