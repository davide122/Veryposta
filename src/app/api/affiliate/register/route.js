import { query, insert } from '@/app/utils/dbConfig';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

/**
 * API per la registrazione di nuovi affiliati
 */
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validazione dei dati
    if (!data.name || !data.email || !data.phone || !data.password) {
      return NextResponse.json(
        { success: false, message: 'Tutti i campi obbligatori devono essere compilati' },
        { status: 400 }
      );
    }
    
    // Verifica se l'email è già in uso
    const { rows } = await query('SELECT * FROM affiliates WHERE email = $1', [data.email]);
    if (rows.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Email già registrata. Utilizza un altro indirizzo email.' },
        { status: 409 }
      );
    }
    
    // Hash della password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    
    // Prepara i dati per l'inserimento
    const affiliateData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      address: data.address || null,
      city: data.city || null,
      postal_code: data.postal_code || null,
      tax_id: data.tax_id || null,
      status: 'pending', // Gli affiliati iniziano con stato 'pending' fino all'approvazione
      commission_rate: 10.00 // Commissione predefinita
    };
    
    // Inserisci il nuovo affiliato nel database
    const newAffiliate = await insert('affiliates', affiliateData);
    
    // Rimuovi la password dai dati restituiti
    delete newAffiliate.password;
    
    return NextResponse.json({
      success: true,
      message: 'Registrazione completata con successo! Il tuo account è in attesa di approvazione.',
      data: newAffiliate
    });
    
  } catch (error) {
    console.error('Errore durante la registrazione dell\'affiliato:', error);
    return NextResponse.json(
      { success: false, message: 'Errore durante la registrazione. Riprova più tardi.' },
      { status: 500 }
    );
  }
}