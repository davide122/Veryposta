import Link from 'next/link';

export const metadata = {
  title: 'Dashboard - VeryPosta',
  description: 'Pannello di controllo per la gestione di VeryPosta',
};

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header comune per tutte le pagine dashboard */}
      <header className="bg-white shadow-sm">
       
      </header>

      {/* Contenuto principale */}
      <main>
        {children}
      </main>
    </div>
  );
}