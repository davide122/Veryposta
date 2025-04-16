"use client";
import Link from 'next/link';

export default function NavbarSection({ scrollToSection, setShowAffiliateModal }) {
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
            onClick={() => setShowAffiliateModal(true)}
            className="bg-[#ebd00b] text-[#1d3a6b] px-7 py-3 text-lg rounded-full font-bold hover:bg-yellow-400 transition"
          >
            Diventa Affiliato
          </button>
        </div>
      </div>
    </nav>
  );
}