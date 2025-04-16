"use client";
import Link from 'next/link';

export default function MobileMenuSection({ isOpen, setIsOpen, scrollToSection, setShowAffiliateModal }) {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-[9999] bg-white text-[#1d3a6b] flex flex-col justify-between px-6 py-10 overflow-y-auto shadow-2xl animate-fade-in">
      {/* Pulsante chiudi */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsOpen(false)}
          className="text-5xl font-bold hover:text-[#ebd00b] transition"
          aria-label="Chiudi menu"
        >
          ×
        </button>
      </div>

      {/* Link sezione */}
      <nav className="flex flex-col items-center gap-6 mt-10 text-2xl font-semibold font-poppins">
        {[
          { label: "Perché", id: "perche" },
          { label: "Servizi", id: "servizi" },
          { label: "Vantaggi", id: "vantaggi" },
          { label: "Gallery", id: "media" },
          { label: "Contatti", id: "contatti" }
        ].map(({ label, id }) => (
          <a
            key={id}
            onClick={() => {
              scrollToSection(id);
              setIsOpen(false);
            }}
            className="cursor-pointer hover:text-[#ebd00b] transition"
          >
            {label}
          </a>
        ))}
      </nav>

      {/* CTA finali */}
      <div className="mt-10 flex flex-col items-center gap-4">
        <Link
          href="/accesso"
          onClick={() => setIsOpen(false)}
          className="text-lg font-semibold hover:text-[#ebd00b] transition"
        >
          Area Riservata
        </Link>
        <button
          onClick={() => {
            setIsOpen(false);
            setShowAffiliateModal(true);
          }}
          className="bg-[#ebd00b] text-[#1d3a6b] px-7 py-3 rounded-full font-bold text-lg hover:bg-yellow-400 transition w-full max-w-xs"
        >
          Diventa Affiliato
        </button>
      </div>
    </div>
  );
}