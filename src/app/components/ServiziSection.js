"use client";

export default function ServiziSection({ setCurrentService, setShowServiceModal }) {
  return (
    <section id="servizi" className="py-24 px-6 sm:px-10 lg:px-12 w-full max-w-[1600px] mx-auto text-[#1d3a6b]">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-4">
          I nostri <span className="text-[#ebd00b]">Servizi</span>
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 font-poppins max-w-2xl mx-auto">
          Tutto ciò che serve per offrire qualità e professionalità in un unico punto.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-10 text-center">
        {[
          { name: "Servizi Postali", icon: "✉️" },
          { name: "Spedizioni", icon: "📦" },
          { name: "Energia", icon: "⚡" },
          { name: "Telefonia", icon: "📱" },
          { name: "CAF/Patronato", icon: "📄" },
          { name: "SPID", icon: "🔐" },
          { name: "Firme Digitali", icon: "✍️" },
          { name: "PEC", icon: "📧" },
          { name: "Pratiche", icon: "📋" },
          { name: "Altri Servizi", icon: "🔍" }
        ].map((s, i) => (
          <div 
            key={i} 
            className="bg-white p-6 rounded-3xl shadow-md hover:shadow-lg transition-all cursor-pointer"
            onClick={() => {
              setCurrentService(s);
              setShowServiceModal(true);
            }}
          >
            <div className="text-3xl sm:text-4xl mb-3">{s.icon}</div>
            <p className="font-poppins text-sm sm:text-base text-[#1d3a6b] font-medium">{s.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}