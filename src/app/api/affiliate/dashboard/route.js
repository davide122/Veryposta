import { query, getById, getAll, insert, update } from '@/app/utils/dbConfig';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

/**
 * API per la dashboard degli affiliati
 * Fornisce dati per statistiche, vendite e notifiche
 */

// Middleware per verificare l'autenticazione
async function verifyAuth(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authenticated: false, message: 'Token non fornito' };
  }
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'veryposta-secret-key');
    
    // Verifica che l'utente sia un affiliato
    if (decoded.role !== 'affiliate') {
      return { authenticated: false, message: 'Accesso non autorizzato' };
    }
    
    return { authenticated: true, userId: decoded.id };
  } catch (error) {
    return { authenticated: false, message: 'Token non valido o scaduto' };
  }
}

// GET: Ottiene i dati della dashboard per l'affiliato
export async function GET(request) {
  // Verifica autenticazione
  const auth = await verifyAuth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
  }
  
  try {
    const affiliateId = auth.userId;
    
    // Ottieni dati dell'affiliato
    const { rows: affiliateRows } = await query('SELECT * FROM affiliates WHERE id = $1', [affiliateId]);
    const affiliate = affiliateRows[0];
    
    if (!affiliate) {
      return NextResponse.json({ success: false, message: 'Affiliato non trovato' }, { status: 404 });
    }
    
    // Ottieni statistiche vendite
    const { rows: statsRows } = await query(`
      SELECT 
        COUNT(*) as total_services,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_requests,
        COUNT(CASE WHEN status = 'completed' AND DATE(created_at) = CURRENT_DATE THEN 1 END) as completed_today,
        SUM(commission) as total_commission
      FROM affiliate_sales 
      WHERE affiliate_id = $1
    `, [affiliateId]);
    
    // Ottieni vendite recenti
    const { rows: recentSales } = await query(`
      SELECT * FROM affiliate_sales 
      WHERE affiliate_id = $1 
      ORDER BY created_at DESC 
      LIMIT 5
    `, [affiliateId]);
    
    // Ottieni notifiche
    const { rows: notifications } = await query(`
      SELECT * FROM affiliate_notifications 
      WHERE affiliate_id = $1 
      ORDER BY created_at DESC 
      LIMIT 10
    `, [affiliateId]);
    
    // Ottieni pagamenti recenti
    const { rows: recentPayments } = await query(`
      SELECT * FROM affiliate_payments 
      WHERE affiliate_id = $1 
      ORDER BY payment_date DESC 
      LIMIT 5
    `, [affiliateId]);
    
    // Formatta i dati per la dashboard
    const dashboardData = {
      stats: {
        totalServices: parseInt(statsRows[0]?.total_services || 0),
        pendingRequests: parseInt(statsRows[0]?.pending_requests || 0),
        completedToday: parseInt(statsRows[0]?.completed_today || 0),
        monthlyRevenue: `€${parseFloat(statsRows[0]?.total_commission || 0).toFixed(2)}`
      },
      recentServices: recentSales.map(sale => ({
        id: sale.id,
        type: sale.service_type,
        client: sale.client_name,
        date: new Date(sale.created_at).toISOString().split('T')[0],
        status: sale.status,
        amount: `€${parseFloat(sale.amount).toFixed(2)}`,
        commission: `€${parseFloat(sale.commission).toFixed(2)}`
      })),
      notifications: notifications.map(notification => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        date: new Date(notification.created_at).toISOString().split('T')[0],
        read: notification.is_read
      })),
      payments: recentPayments.map(payment => ({
        id: payment.id,
        amount: `€${parseFloat(payment.amount).toFixed(2)}`,
        date: new Date(payment.payment_date).toISOString().split('T')[0],
        method: payment.payment_method,
        reference: payment.reference_number
      }))
    };
    
    return NextResponse.json({
      success: true,
      data: dashboardData
    });
    
  } catch (error) {
    console.error('Errore durante il recupero dei dati della dashboard:', error);
    return NextResponse.json(
      { success: false, message: 'Errore durante il recupero dei dati. Riprova più tardi.' },
      { status: 500 }
    );
  }
}

// POST: Registra una nuova vendita/servizio
export async function POST(request) {
  // Verifica autenticazione
  const auth = await verifyAuth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
  }
  
  try {
    const affiliateId = auth.userId;
    const data = await request.json();
    
    // Validazione dei dati
    if (!data.service_type || !data.client_name || !data.amount) {
      return NextResponse.json(
        { success: false, message: 'Dati incompleti. Servizio, cliente e importo sono obbligatori.' },
        { status: 400 }
      );
    }
    
    // Ottieni la percentuale di commissione dell'affiliato
    const { rows } = await query('SELECT commission_rate FROM affiliates WHERE id = $1', [affiliateId]);
    const commissionRate = rows[0]?.commission_rate || 10.00;
    
    // Calcola la commissione
    const commission = (parseFloat(data.amount) * commissionRate) / 100;
    
    // Inserisci la vendita nel database
    const saleData = {
      affiliate_id: affiliateId,
      service_type: data.service_type,
      client_name: data.client_name,
      client_email: data.client_email || null,
      client_phone: data.client_phone || null,
      amount: data.amount,
      commission: commission.toFixed(2),
      status: data.status || 'pending',
      notes: data.notes || null
    };
    
    const newSale = await insert('affiliate_sales', saleData);
    
    // Crea una notifica per l'affiliato
    const notificationData = {
      affiliate_id: affiliateId,
      title: 'Nuovo servizio registrato',
      message: `Hai registrato un nuovo servizio di tipo ${data.service_type} per ${data.client_name}.`,
      is_read: false
    };
    
    await insert('affiliate_notifications', notificationData);
    
    return NextResponse.json({
      success: true,
      message: 'Servizio registrato con successo',
      data: newSale
    });
    
  } catch (error) {
    console.error('Errore durante la registrazione del servizio:', error);
    return NextResponse.json(
      { success: false, message: 'Errore durante la registrazione del servizio. Riprova più tardi.' },
      { status: 500 }
    );
  }
}

// PATCH: Aggiorna lo stato di lettura delle notifiche
export async function PATCH(request) {
  // Verifica autenticazione
  const auth = await verifyAuth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
  }
  
  try {
    const affiliateId = auth.userId;
    const data = await request.json();
    
    if (!data.notification_id) {
      return NextResponse.json(
        { success: false, message: 'ID notifica non fornito' },
        { status: 400 }
      );
    }
    
    // Aggiorna lo stato della notifica
    const { rows } = await query(
      'UPDATE affiliate_notifications SET is_read = $1 WHERE id = $2 AND affiliate_id = $3 RETURNING *',
      [true, data.notification_id, affiliateId]
    );
    
    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Notifica non trovata o non autorizzata' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Notifica aggiornata con successo',
      data: rows[0]
    });
    
  } catch (error) {
    console.error('Errore durante l\'aggiornamento della notifica:', error);
    return NextResponse.json(
      { success: false, message: 'Errore durante l\'aggiornamento. Riprova più tardi.' },
      { status: 500 }
    );
  }
}