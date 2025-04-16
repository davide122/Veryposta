"use client";

export default function BenefitsSection() {
  return (
    <section id="vantaggi" className="py-24 px-6 sm:px-10 lg:px-12 w-full max-w-[1400px] mx-auto text-[#1d3a6b]">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Lista vantaggi */}
        <div>
          <h2 className="text-2xl sm:text-4xl lg:text-6xl font-black leading-tight tracking-tight mb-8">
            Vantaggi dell'<span className="text-[#ebd00b]">Affiliazione</span>
          </h2>
          <ul className="space-y-6 text-lg sm:text-xl font-poppins text-gray-700">
            {[
              "Investimento iniziale contenuto (€400 + IVA)",
              "Contratto triennale con rinnovo automatico",
              "Formazione completa per l'avviamento",
              "Accesso a convenzioni nazionali vantaggiose",
              "Grafica e materiali espositivi pronti all'uso",
              "Supporto costante e operativo in ogni fase"
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-[#ebd00b] text-2xl">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Testimonianza */}
        <div className="rounded-3xl p-8 sm:p-10">
          <div className="text-6xl text-[#ebd00b] font-serif mb-4">"</div>
          <p className="text-lg sm:text-xl text-gray-700 font-poppins italic mb-6">
            Con VeryPosta ho potuto ampliare i miei servizi, fidelizzare i clienti e aumentare il mio fatturato. Supporto reale e formazione continua: davvero un punto di svolta.
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#ebd00b] text-[#1d3a6b] flex items-center justify-center text-xl font-bold">M</div>
            <div>
              <div className="font-bold">Mario Rossi</div>
              <div className="text-sm text-gray-500">Affiliato dal 2023</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}