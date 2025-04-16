export const dynamic = 'force-dynamic';

import { getAll } from '@/app/utils/dbConfig';

/**
 * Pagina che mostra tutti i post recuperati dal database
 */
export default async function PostsPage() {
  // Recupera tutti i post dal database
  const posts = await getAll('posts');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">I Nostri Post</h1>
      
      {posts.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <p className="text-yellow-700">
            Non ci sono ancora post disponibili. Verranno visualizzati qui quando saranno aggiunti al database.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <div key={post.id || index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Autore: {post.author || 'Anonimo'}</span>
                  <span>{new Date(post.created_at).toLocaleDateString('it-IT')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}