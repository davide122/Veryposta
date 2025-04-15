import { query, getById } from '@/app/utils/dbConfig';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * API per l'autenticazione degli affiliati
 * Gestisce login e verifica token
 */

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    // Validazione dei dati di input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email e password sono obbligatorie' },
        { status: 400 }
      );
    }
    
    // Cerca l'affiliato nel database
    const { rows } = await query('SELECT * FROM affiliates WHERE email = $1', [email]);
    const affiliate = rows[0];
    
    // Verifica se l'affiliato esiste
    if (!affiliate) {
      return NextResponse.json(
        { success: false, message: 'Credenziali non valide' },
        { status: 401 }
      );
    }
    
    // Verifica se l'account è attivo
    if (affiliate.status !== 'active') {
      return NextResponse.json(
        { success: false, message: 'Account non attivo. Contatta l\'amministratore.' },
        { status: 403 }
      );
    }
    
    // Verifica la password
    const passwordMatch = await bcrypt.compare(password, affiliate.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: 'Credenziali non valide' },
        { status: 401 }
      );
    }
    
    // Genera il token JWT
    const token = jwt.sign(
      { 
        id: affiliate.id,
        email: affiliate.email,
        role: 'affiliate'
      },
      process.env.JWT_SECRET || 'veryposta-secret-key',
      { expiresIn: '24h' }
    );
    
    // Prepara i dati dell'utente da restituire (escludendo dati sensibili)
    const userData = {
      id: affiliate.id,
      name: affiliate.name,
      email: affiliate.email,
      role: 'affiliate',
      status: affiliate.status,
      commission_rate: affiliate.commission_rate
    };
    
    return NextResponse.json({
      success: true,
      message: 'Login effettuato con successo',
      token,
      user: userData
    });
    
  } catch (error) {
    console.error('Errore durante il login:', error);
    return NextResponse.json(
      { success: false, message: 'Errore durante il login. Riprova più tardi.' },
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
    
    // Ottieni i dati aggiornati dell'affiliato
    const { rows } = await query('SELECT * FROM affiliates WHERE id = $1', [decoded.id]);
    const affiliate = rows[0];
    
    if (!affiliate) {
      return NextResponse.json(
        { success: false, message: 'Utente non trovato' },
        { status: 404 }
      );
    }
    
    // Prepara i dati dell'utente da restituire
    const userData = {
      id: affiliate.id,
      name: affiliate.name,
      email: affiliate.email,
      role: 'affiliate',
      status: affiliate.status,
      commission_rate: affiliate.commission_rate
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