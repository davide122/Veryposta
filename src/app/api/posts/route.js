"use client"
import { getAll, getById, insert, update, remove } from '@/app/utils/dbConfig';

/**
 * Gestisce le richieste GET per ottenere tutti i post o un post specifico
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    let data;
    if (id) {
      // Ottieni un post specifico per ID
      data = await getById('posts', id);
      
      if (!data) {
        return new Response(JSON.stringify({ success: false, message: 'Post non trovato' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } else {
      // Ottieni tutti i post
      data = await getAll('posts');
    }
    
    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Errore durante il recupero dei post:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Si è verificato un errore durante il recupero dei dati.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Gestisce le richieste POST per creare un nuovo post
 */
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validazione dei dati
    if (!data.title || !data.content) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Titolo e contenuto sono obbligatori'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Inserisci il nuovo post
    const newPost = await insert('posts', {
      title: data.title,
      content: data.content,
      author: data.author || 'Anonimo',
      created_at: new Date().toISOString()
    });
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Post creato con successo',
      data: newPost
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Errore durante la creazione del post:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Si è verificato un errore durante la creazione del post.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Gestisce le richieste PUT per aggiornare un post esistente
 */
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'ID del post non specificato'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const data = await request.json();
    
    // Verifica se il post esiste
    const existingPost = await getById('posts', id);
    if (!existingPost) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Post non trovato'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Aggiorna il post
    const updatedPost = await update('posts', id, {
      title: data.title || existingPost.title,
      content: data.content || existingPost.content,
      updated_at: new Date().toISOString()
    });
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Post aggiornato con successo',
      data: updatedPost
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del post:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Si è verificato un errore durante l\'aggiornamento del post.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Gestisce le richieste DELETE per eliminare un post
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'ID del post non specificato'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Verifica se il post esiste
    const existingPost = await getById('posts', id);
    if (!existingPost) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Post non trovato'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Elimina il post
    const deleted = await remove('posts', id);
    
    if (deleted) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Post eliminato con successo'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Impossibile eliminare il post'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
  } catch (error) {
    console.error('Errore durante l\'eliminazione del post:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Si è verificato un errore durante l\'eliminazione del post.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}