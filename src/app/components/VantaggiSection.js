"use client";
import { useSpring, animated } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';

export default function VantaggiSection() {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  const animation = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(50px)',
    config: { tension: 280, friction: 20 }
  });

  return (
    <section id="vantaggi" className="py-24 px-6 sm:px-10 lg:px-12 w-full max-w-[1600px] mx-auto text-[#1d3a6b]">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-4">
          I <span className="text-[#ebd00b]">Vantaggi</span> del Franchising
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 font-poppins max-w-2xl mx-auto">
          Un'opportunità di business completa con supporto a 360 gradi.
        </p>
      </div>

      <animated.div 
        ref={ref}
        style={animation}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {[
          {
            icon: "💰",
            title: "Investimento Contenuto",
            desc: "Avvia la tua attività con un investimento iniziale accessibile e rateizzabile."
          },
          {
            icon: "📈",
            title: "Margini Interessanti",
            desc: "Beneficia di commissioni competitive e opportunità di guadagno diversificate."
          },
          {
            icon: "🎯",
            title: "Marketing Territoriale",
            desc: "Supporto nella promozione locale e strategie di marketing personalizzate."
          },
          {
            icon: "🔄",
            title: "Gestione Semplificata",
            desc: "Piattaforme intuitive e processi automatizzati per una gestione efficiente."
          },
          {
            icon: "📱",
            title: "App Dedicata",
            desc: "Gestisci il tuo business ovunque con la nostra app mobile intuitiva."
          },
          {
            icon: "🤝",
            title: "Network Consolidato",
            desc: "Entra in una rete di professionisti e beneficia di partnership strategiche."
          }
        ].map((item, index) => (
          <div 
            key={index} 
            className="bg-white p-8 rounded-3xl shadow-md hover:shadow-lg transition-all text-center"
          >
            <div className="text-5xl mb-4">{item.icon}</div>
            <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
            <p className="text-base sm:text-lg text-gray-600 font-poppins">{item.desc}</p>
          </div>
        ))}
      </animated.div>
    </section>
  );
}