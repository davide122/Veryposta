import { NextResponse } from 'next/server';
import { query } from '../../../utils/dbConfig';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Gestisce l'autenticazione degli affiliati
 * @param {Request} request - Oggetto richiesta
 * @returns {Response} - Risposta con token JWT o errore
 */
export async function POST(request) {
  try {
    // Estrai i dati dalla richiesta
    const { email, password } = await request.json();

    // Validazione dei dati
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email e password sono obbligatori' },
        { status: 400 }
      );
    }

    // Cerca l'affiliato nel database
    const { rows } = await query('SELECT * FROM affiliates WHERE email = $1', [email]);

    // Verifica se l'affiliato esiste
    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Credenziali non valide' },
        { status: 401 }
      );
    }

    const affiliate = rows[0];

    // Verifica lo stato dell'affiliato
    if (affiliate.status !== 'active') {
      let statusMessage = 'Il tuo account non è attivo';
      if (affiliate.status === 'pending') {
        statusMessage = 'Il tuo account è in attesa di approvazione';
      } else if (affiliate.status === 'rejected') {
        statusMessage = 'La tua richiesta di affiliazione è stata respinta';
      } else if (affiliate.status === 'suspended') {
        statusMessage = 'Il tuo account è stato sospeso';
      }

      return NextResponse.json(
        { success: false, message: statusMessage },
        { status: 403 }
      );
    }

    // Confronta la password
    const isPasswordValid = await bcrypt.compare(password, affiliate.password);

    if (!isPasswordValid) {
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
        name: affiliate.name,
        role: 'affiliate',
      },
      process.env.JWT_SECRET || 'veryposta-secret-key',
      { expiresIn: '24h' }
    );

    // Prepara i dati dell'utente da restituire (escludi dati sensibili)
    const userData = {
      id: affiliate.id,
      name: affiliate.name,
      email: affiliate.email,
      status: affiliate.status,
      commission_rate: affiliate.commission_rate,
      role: 'affiliate',
    };

    // Restituisci il token e i dati dell'utente
    return NextResponse.json({
      success: true,
      message: 'Autenticazione riuscita',
      token,
      user: userData,
    });
  } catch (error) {
    console.error('Errore durante l\'autenticazione:', error);
    return NextResponse.json(
      { success: false, message: 'Errore durante l\'autenticazione' },
      { status: 500 }
    );
  }
}

/**
 * Verifica il token JWT dell'affiliato
 * @param {Request} request - Oggetto richiesta
 * @returns {Response} - Risposta con dati utente o errore
 */
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

    // Verifica che sia un token di affiliato
    if (decoded.role !== 'affiliate') {
      return NextResponse.json(
        { success: false, message: 'Token non valido per affiliati' },
        { status: 403 }
      );
    }

    // Ottieni i dati aggiornati dell'affiliato dal database
    const { rows } = await query('SELECT * FROM affiliates WHERE id = $1', [decoded.id]);

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Affiliato non trovato' },
        { status: 404 }
      );
    }

    const affiliate = rows[0];

    // Prepara i dati dell'utente da restituire (escludi dati sensibili)
    const userData = {
      id: affiliate.id,
      name: affiliate.name,
      email: affiliate.email,
      status: affiliate.status,
      commission_rate: affiliate.commission_rate,
      role: 'affiliate',
    };

    return NextResponse.json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error('Errore durante la verifica del token:', error);
    return NextResponse.json(
      { success: false, message: 'Token non valido o scaduto' },
      { status: 401 }
    );
  }
}