import { NextResponse } from 'next/server';
import { query } from '../../../utils/dbConfig';
import bcrypt from 'bcryptjs';

/**
 * Gestisce la registrazione di nuovi affiliati
 * @param {Request} request - Oggetto richiesta
 * @returns {Response} - Risposta con esito registrazione
 */
export async function POST(request) {
  try {
    // Estrai i dati dalla richiesta
    const data = await request.json();

    // Validazione dei dati
    const requiredFields = ['name', 'email', 'password', 'phone'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, message: `Il campo ${field} è obbligatorio` },
          { status: 400 }
        );
      }
    }

    // Verifica se l'email è già registrata
    const checkEmail = await query('SELECT * FROM affiliates WHERE email = $1', [data.email]);
    if (checkEmail.rows.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Email già registrata' },
        { status: 409 }
      );
    }

    // Hash della password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Prepara i dati per l'inserimento
    const insertData = {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      address: data.address || null,
      city: data.city || null,
      postal_code: data.postal_code || null,
      tax_id: data.tax_id || null,
      status: 'pending', // Gli affiliati iniziano con stato 'pending'
      commission_rate: 0.1, // Commissione predefinita del 10%
      created_at: new Date(),
      updated_at: new Date()
    };

    // Inserisci il nuovo affiliato nel database
    const result = await query(
      `INSERT INTO affiliates (name, email, password, phone, address, city, postal_code, tax_id, status, commission_rate, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
      [
        insertData.name,
        insertData.email,
        insertData.password,
        insertData.phone,
        insertData.address,
        insertData.city,
        insertData.postal_code,
        insertData.tax_id,
        insertData.status,
        insertData.commission_rate,
        insertData.created_at,
        insertData.updated_at
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Registrazione completata con successo. La tua richiesta è in attesa di approvazione.',
      affiliateId: result.rows[0].id
    });
  } catch (error) {
    console.error('Errore durante la registrazione:', error);
    return NextResponse.json(
      { success: false, message: 'Errore durante la registrazione' },
      { status: 500 }
    );
  }
}