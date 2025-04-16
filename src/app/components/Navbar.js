"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar({ scrollToSection }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-5 flex justify-between items-center">

        {/* Logo */}
        <div className="text-3xl font-black tracking-tight">
          <span className="text-[#1d3a6b]">Very</span>
          <span className="text-[#ebd00b]">Posta</span>
        </div>

        {/* Menu Desktop */}
        <div className="hidden lg:flex gap-10 font-poppins text-lg font-semibold items-center">
          <a onClick={() => scrollToSection("perche")} className="hover:text-[#ebd00b] cursor-pointer transition">Perché</a>
          <a onClick={() => scrollToSection("servizi")} className="hover:text-[#ebd00b] cursor-pointer transition">Servizi</a>
          <a onClick={() => scrollToSection("vantaggi")} className="hover:text-[#ebd00b] cursor-pointer transition">Vantaggi</a>
          <a onClick={() => scrollToSection("media")} className="hover:text-[#ebd00b] cursor-pointer transition">Gallery</a>
          <a onClick={() => scrollToSection("contatti")} className="hover:text-[#ebd00b] cursor-pointer transition">Contatti</a>
        </div>

        {/* CTA Desktop */}
        <div className="hidden lg:flex gap-4 items-center">
          <Link href="/accesso" className="text-[#1d3a6b] hover:text-[#ebd00b] transition font-semibold">
            Area Riservata
          </Link>
          <button
            onClick={() => scrollToSection('affiliate-modal')}
            className="bg-[#ebd00b] text-[#1d3a6b] px-7 py-3 text-lg rounded-full font-bold hover:bg-yellow-400 transition"
          >
            Diventa Affiliato
          </button>
        </div>

        {/* Menu toggle Mobile */}
        <button
          className="lg:hidden text-3xl text-[#1d3a6b] font-bold"
          onClick={() => setIsOpen(true)}
          aria-label="Apri menu mobile"
        >
          ☰
        </button>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
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
                scrollToSection('affiliate-modal');
              }}
              className="bg-[#ebd00b] text-[#1d3a6b] px-7 py-3 rounded-full font-bold text-lg hover:bg-yellow-400 transition w-full max-w-xs"
            >
              Diventa Affiliato
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}