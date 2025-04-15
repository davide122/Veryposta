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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-black tracking-tight">
              <span className="text-[#1d3a6b]">Very</span>
              <span className="text-[#ebd00b]">Posta</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Contenuto principale */}
      <main>
        {children}
      </main>
    </div>
  );
}