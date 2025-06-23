import { query, insert } from '@/app/utils/dbConfig';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

/**
 * API per la gestione delle comunicazioni agli affiliati
 * Permette all'admin di inviare comunicazioni a tutti gli affiliati o a specifici affiliati
 */

// Middleware per verificare l'autenticazione dell'admin
async function verifyAdminAuth(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authenticated: false, message: 'Token non fornito' };
  }
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'veryposta-secret-key');
    
    // Verifica che l'utente sia un admin
    if (decoded.role !== 'admin') {
      return { authenticated: false, message: 'Accesso non autorizzato' };
    }
    
    return { authenticated: true, userId: decoded.id };
  } catch (error) {
    return { authenticated: false, message: 'Token non valido o scaduto' };
  }
}

// POST: Invia una nuova comunicazione agli affiliati
export async function POST(request) {
  // Verifica autenticazione admin
  const auth = await verifyAdminAuth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
  }
  
  try {
    const data = await request.json();
    
    // Validazione dei dati
    if (!data.title || !data.message) {
      return NextResponse.json(
        { success: false, message: 'Dati incompleti. Titolo e messaggio sono obbligatori.' },
        { status: 400 }
      );
    }
    
    // Verifica se la comunicazione è per tutti gli affiliati o per specifici affiliati
    const targetAffiliates = data.affiliate_ids || [];
    let affiliateIds = [];
    
    if (targetAffiliates.length === 0) {
      // Se non sono specificati affiliati, invia a tutti
      const { rows } = await query('SELECT id FROM affiliates WHERE status = $1', ['active']);
      affiliateIds = rows.map(row => row.id);
    } else {
      // Altrimenti, invia solo agli affiliati specificati
      affiliateIds = targetAffiliates;
    }
    
    // Crea una notifica per ogni affiliato
    const createdNotifications = [];
    
    for (const affiliateId of affiliateIds) {
      const notificationData = {
        affiliate_id: affiliateId,
        title: data.title,
        message: data.message,
        is_read: false
      };
      
      const result = await insert('affiliate_notifications', notificationData);
      createdNotifications.push(result);
    }
    
    return NextResponse.json({
      success: true,
      message: `Comunicazione inviata con successo a ${affiliateIds.length} affiliati`,
      data: { notifications: createdNotifications }
    });
    
  } catch (error) {
    console.error('Errore durante l\'invio della comunicazione:', error);
    return NextResponse.json(
      { success: false, message: 'Errore durante l\'invio della comunicazione. Riprova più tardi.' },
      { status: 500 }
    );
  }
}

// GET: Ottiene tutte le comunicazioni inviate
export async function GET(request) {
  // Verifica autenticazione admin
  const auth = await verifyAdminAuth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
  }
  
  try {
    // Ottieni tutte le comunicazioni inviate, raggruppate per titolo e messaggio
    const { rows } = await query(`
      SELECT 
        title, 
        message, 
        MIN(created_at) as first_sent, 
        COUNT(*) as recipient_count,
        SUM(CASE WHEN is_read THEN 1 ELSE 0 END) as read_count
      FROM affiliate_notifications 
      GROUP BY title, message 
      ORDER BY first_sent DESC
    `);
    
    return NextResponse.json({
      success: true,
      data: { communications: rows }
    });
    
  } catch (error) {
    console.error('Errore durante il recupero delle comunicazioni:', error);
    return NextResponse.json(
      { success: false, message: 'Errore durante il recupero delle comunicazioni. Riprova più tardi.' },
      { status: 500 }
    );
  }
}