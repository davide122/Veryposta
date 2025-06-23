import { query } from '@/app/utils/dbConfig';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validazione dei dati
    if (!data.email || !data.password || !data.userType) {
      return NextResponse.json(
        { success: false, message: 'Tutti i campi sono obbligatori' },
        { status: 400 }
      );
    }
    
    let user = null;
    
    // Autenticazione per diversi tipi di utenti
    if (data.userType === 'affiliate') {
      // Reindirizza all'API specifica per gli affiliati
      return NextResponse.json(
        { success: false, message: 'Per gli affiliati, utilizzare l\'endpoint /api/auth/affiliate' },
        { status: 400 }
      );
    } else if (data.userType === 'staff' || data.userType === 'admin') {
      // Cerca l'utente nel database
      const { rows } = await query('SELECT * FROM users WHERE email = $1 AND role = $2', [data.email, data.userType]);
      user = rows[0];
      
      // Verifica se l'utente esiste
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'Credenziali non valide' },
          { status: 401 }
        );
      }
      
      // Verifica la password
      const passwordMatch = await bcrypt.compare(data.password, user.password);
      if (!passwordMatch) {
        return NextResponse.json(
          { success: false, message: 'Credenziali non valide' },
          { status: 401 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, message: 'Tipo di utente non valido' },
        { status: 400 }
      );
    }
    
    // Genera il token JWT
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'veryposta-secret-key',
      { expiresIn: '24h' }
    );
    
    // Prepara i dati dell'utente da restituire (escludendo dati sensibili)
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions
    };
    
    return NextResponse.json({
      success: true,
      message: 'Accesso effettuato con successo',
      token,
      user: userData
    });
    
    
  } catch (error) {
    console.error('Errore durante l\'autenticazione:', error);
    
    return NextResponse.json(
      { success: false, message: 'Si è verificato un errore durante l\'autenticazione. Riprova più tardi.' },
      { status: 500 }
    );
  }
}

// Endpoint per verificare il token e ottenere i dati dell'utente
export async function GET(request) {
  try {
    // Estrai il token dall'header Authorization
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Token non fornito' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verifica il token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'veryposta-secret-key');
    
    // Ottieni i dati aggiornati dell'utente
    const { rows } = await query('SELECT * FROM users WHERE id = $1 AND role = $2', [decoded.id, decoded.role]);
    const user = rows[0];
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Utente non trovato' },
        { status: 404 }
      );
    }
    
    // Prepara i dati dell'utente da restituire
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions
    };
    
    return NextResponse.json({
      success: true,
      user: userData
    });
    
  } catch (error) {
    console.error('Errore durante la verifica del token:', error);
    return NextResponse.json(
      { success: false, message: 'Token non valido o scaduto' },
      { status: 401 }
    );
  }
}