"use client";

export default function WhySection() {
  return (
    <section id="perche" className="py-24 px-6 sm:px-10 lg:px-12 w-full max-w-[1400px] mx-auto text-[#1d3a6b]">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-4">
          Perché scegliere <span className="text-[#ebd00b]">VeryPosta</span>
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 font-poppins max-w-2xl mx-auto">
          Un franchising multiservizi con vantaggi reali e supporto concreto.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
        {[
          {
            icon: "🎓",
            title: "Formazione Continua",
            desc: "Corsi sempre aggiornati su aspetti legali, operativi e digitali."
          },
          {
            icon: "🤝",
            title: "Supporto Dedicato",
            desc: "Assistenza personalizzata in fase di avvio e gestione."
          },
          {
            icon: "💻",
            title: "Tecnologia Inclusa",
            desc: "Dashboard gestionali e strumenti digitali pronti all'uso."
          }
        ].map((item, index) => (
          <div key={index} className="bg-[#f6f7fb] rounded-3xl p-8 sm:p-10 shadow-md hover:shadow-lg transition-all text-center">
            <div className="text-5xl mb-4">{item.icon}</div>
            <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
            <p className="text-base sm:text-lg text-gray-600 font-poppins">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}