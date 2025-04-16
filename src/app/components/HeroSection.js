"use client";
import { useEffect } from 'react';
import Image from 'next/image';
import { useSpring, animated } from '@react-spring/web';
import { FadeIn, ScaleIn, HoverEffect } from './AnimationProvider';

export default function HeroSection({ scrollToSection, setShowAffiliateModal }) {
  // Animazione per lo scroll indicator
  const [scrollIndicator, scrollIndicatorApi] = useSpring(() => ({
    opacity: 1,
    y: 0,
    config: { tension: 150, friction: 12 }
  }));

  useEffect(() => {
    // Animazione dello scroll indicator
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 100) {
        scrollIndicatorApi.start({ opacity: 0, y: 20 });
      } else {
        scrollIndicatorApi.start({ opacity: 1, y: 0 });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollIndicatorApi]);

  return (
    <section className="min-h-screen flex flex-col-reverse lg:flex-row items-center justify-center pt-40 px-6 sm:px-10 lg:px-12 max-w-[1500px] mx-auto gap-16 lg:gap-20 relative">
      {/* Testi */}
      <FadeIn direction="left" delay={3}>
        <div className="text-center lg:text-left">
          <h1 className="text-4xl sm:text-8xl md:text-6xl lg:text-8xl font-black leading-tight tracking-tight mb-6">
            Il Futuro dei <span className="text-[#ebd00b]">Multiservizi</span> è Ora
          </h1>
          <p className="text-base sm:text-lg md:text-xl font-poppins text-gray-700 mb-8 max-w-xl mx-auto lg:mx-0">
            Unisciti a VeryPosta: franchising innovativo, servizi integrati, supporto reale.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <HoverEffect scale={1.05}>
              <button 
                onClick={() => setShowAffiliateModal(true)} 
                className="bg-[#ebd00b] text-[#1d3a6b] px-6 py-3 rounded-full text-base sm:text-lg font-bold hover:bg-yellow-400 transition shadow-md w-full"
              >
                Scopri il Franchising
              </button>
            </HoverEffect>
            <HoverEffect scale={1.05}>
              <button 
                onClick={() => scrollToSection('contatti')} 
                className="border-2 border-[#ebd00b] text-[#1d3a6b] px-6 py-3 rounded-full text-base sm:text-lg font-bold hover:bg-[#ebd00b] hover:text-white transition w-full"
              >
                Contattaci
              </button>
            </HoverEffect>
          </div>
        </div>
      </FadeIn>

      {/* Immagine */}
      <ScaleIn delay={5}>
        <Image
          src="/home.png"
          alt="VeryPosta - Franchising multiservizi innovativo con supporto reale e formazione continua"
          width={1000}
          height={1000}
          className="w-[700px] sm:w-[700px] lg:w-[700px] xl:w-[1200px] h-auto drop-shadow-2xl parallax-image hero-img"
          priority
        />
      </ScaleIn>
      
      {/* Scroll indicator */}
      <animated.div 
        style={scrollIndicator} 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer"
        onClick={() => scrollToSection('perche')}
      >
        <span className="text-sm text-gray-500 mb-2">Scopri di più</span>
        <div className="w-6 h-10 border-2 border-[#1d3a6b] rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-[#ebd00b] rounded-full animate-bounce"></div>
        </div>
      </animated.div>
    </section>
  );
}