"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {


  const navColumns = [
    {
      title: "Servizi",
      links: [
        { label: "Servizi Postali", href: "#servizi" },
        { label: "Spedizioni", href: "#servizi" },
        { label: "Energia & Telefonia", href: "#servizi" },
        { label: "CAF & SPID", href: "#servizi" }
      ]
    },
    {
      title: "Azienda",
      links: [
        { label: "Chi Siamo", href: "/#perche" },
        { label: "Diventa Affiliato", href: "/#diventa-point" },
        { label: "FAQ", href: "/#faq" }
      ]
    },
    {
      title: "Supporto",
      links: [
        { label: "Contatti", href: "#contatti" },
        { label: "Area Riservata", href: "/accesso" }
      ]
    }
  ];

  return (
    <footer className="bg-[#1d3a6b] text-white py-12 font-poppins">
      <div className="max-w-[1600px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo + Description */}
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center space-x-1">
            <span className="text-2xl font-extrabold">Very</span>
            <span className="text-2xl font-extrabold text-[#ebd00b]">Posta</span>
          </Link>
          <p className="text-gray-300">
            Franchising multiservizi innovativo con supporto reale, formazione continua e tecnologia inclusa.
          </p>
          <div className="text-xs text-gray-400 mt-4 leading-relaxed">
            <strong>VERY POSTA MULTISERVICE</strong><br />
            di Veronica Stagno<br />
            Via Milano, 42 - 92014 Porto Empedocle (AG)<br />
            C.F. STG VNC 89T70 A089N<br />
            P. IVA 03011530841
          </div>
          <div className="text-xs text-gray-400 mt-2 flex flex-wrap gap-4">
            <Link href="/privacy" className="underline hover:text-white">Privacy Policy</Link>
            <Link href="/cookie" className="underline hover:text-white">Cookie Policy</Link>
            <Link href="/termini" className="underline hover:text-white">Termini e Condizioni</Link>
          </div>
        </div>

        {/* Navigation Columns */}
        {navColumns.map(({ title, links }) => (
          <div key={title}>
            <h3 className="text-lg font-bold mb-4">{title}</h3>
            <ul className="space-y-2">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-gray-300 hover:text-white transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} VeryPosta. Tutti i diritti riservati.
      </div>
    </footer>
  );
}
