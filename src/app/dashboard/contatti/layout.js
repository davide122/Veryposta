import { Suspense } from 'react';

export const metadata = {
  title: 'Gestione Contatti - VeryPosta',
  description: 'Gestisci i messaggi di contatto ricevuti tramite il sito VeryPosta',
};

export default function ContactLayout({ children }) {
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<div>Caricamento...</div>}>
        {children}
      </Suspense>
    </div>
  );
}