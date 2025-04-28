'use client';

import Link from 'next/link';

export default function VerificaNewsletter() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
        <svg xmlns="http://www.w3.org/2000/svg"
             className="h-16 w-16 text-green-500 mx-auto mb-4"
             fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-2xl font-bold text-[#1d3a6b] mb-2">
          Verifica completata!
        </h1>
        <p className="text-gray-700 mb-6">
          La tua email è stata confermata con successo.
        </p>
        <Link href="/" className="inline-block bg-[#1d3a6b] text-white px-6 py-3 rounded-lg hover:bg-[#16305b] transition-colors">
          Torna alla home
        </Link>
      </div>
    </div>
  );
}
