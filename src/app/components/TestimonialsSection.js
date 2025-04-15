"use client";
import { useState, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function TestimonialsSection() {
  const [activeVideo, setActiveVideo] = useState(null);
  const videoRef = useRef(null);

  // Dati delle testimonianze
  const testimonials = [
    {
      id: 1,
      name: "Marco Bianchi",
      location: "Milano",
      role: "Affiliato dal 2022",
      quote: "Con VeryPosta ho potuto ampliare la mia offerta di servizi e aumentare significativamente il fatturato del mio negozio.",
      videoUrl: "/videofranch.mp4", // Video di esempio
      thumbnailUrl: "/arag3.jpg"
    },
    {
      id: 2,
      name: "Laura Rossi",
      location: "Roma",
      role: "Affiliata dal 2021",
      quote: "La formazione e il supporto continuo sono stati fondamentali per avviare con successo il mio punto VeryPosta.",
      videoUrl: "/videofranch.mp4", // Video di esempio
      thumbnailUrl: "/arag2.jpg"
    },
    {
      id: 3,
      name: "Giuseppe Verdi",
      location: "Napoli",
      role: "Affiliato dal 2023",
      quote: "Grazie a VeryPosta ho potuto offrire servizi innovativi ai miei clienti, diventando un punto di riferimento nel quartiere.",
      videoUrl: "/videofranch.mp4", // Video di esempio
      thumbnailUrl: "/arag4.jpg"
    },
    {
      id: 4,
      name: "Francesca Neri",
      location: "Torino",
      role: "Affiliata dal 2022",
      quote: "La piattaforma tecnologica di VeryPosta è intuitiva e mi permette di gestire facilmente tutti i servizi offerti.",
      videoUrl: "/videofranch.mp4", // Video di esempio
      thumbnailUrl: "/port1.jpg"
    }
  ];

  // Gestisce l'apertura del video
  const openVideo = (testimonial) => {
    setActiveVideo(testimonial);
    // Timeout per dare tempo al DOM di renderizzare il video
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play();
      }
    }, 100);
  };

  // Gestisce la chiusura del video
  const closeVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setActiveVideo(null);
  };

  // Animazione per il modal del video
  const modalAnimation = useSpring({
    opacity: activeVideo ? 1 : 0,
    transform: activeVideo ? 'scale(1)' : 'scale(0.9)',
    config: { tension: 280, friction: 20 }
  });

  return (
    <section className="py-24 px-6 sm:px-10 lg:px-12 w-full max-w-[1600px] mx-auto text-[#1d3a6b]">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-4">
          Le <span className="text-[#ebd00b]">Testimonianze</span> dei nostri Affiliati
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 font-poppins max-w-2xl mx-auto">
          Scopri le storie di successo di chi ha scelto VeryPosta
        </p>
      </div>

      {/* Carosello testimonianze */}
      <div className="mt-12">
        <Swiper
          modules={[Pagination, Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          pagination={{ clickable: true }}
          navigation
          className="testimonials-swiper pb-12"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="bg-white rounded-3xl shadow-md overflow-hidden h-full flex flex-col">
                {/* Thumbnail con pulsante play */}
                <div 
                  className="relative cursor-pointer group"
                  onClick={() => openVideo(testimonial)}
                >
                  <img 
                    src={testimonial.thumbnailUrl} 
                    alt={`Testimonianza di ${testimonial.name}`} 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-40 transition-all">
                    <div className="w-16 h-16 bg-[#ebd00b] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#1d3a6b">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Contenuto testimonianza */}
                <div className="p-6 flex-1 flex flex-col">
                  <blockquote className="text-gray-700 italic mb-4 flex-1">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="mt-auto">
                    <p className="font-bold text-lg">{testimonial.name}</p>
                    <p className="text-gray-500">{testimonial.location} - {testimonial.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Modal per la riproduzione video */}
      {activeVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <animated.div style={modalAnimation} className="w-full max-w-4xl bg-black rounded-xl overflow-hidden relative">
            <button 
              onClick={closeVideo}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
              aria-label="Chiudi video"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <video 
              ref={videoRef}
              src={activeVideo.videoUrl} 
              controls 
              className="w-full aspect-video"
              poster={activeVideo.thumbnailUrl}
            ></video>
            <div className="p-4 bg-white">
              <p className="font-bold text-lg">{activeVideo.name}</p>
              <p className="text-gray-500">{activeVideo.location} - {activeVideo.role}</p>
            </div>
          </animated.div>
        </div>
      )}

      {/* CTA */}
      <div className="text-center mt-16">
        <p className="text-lg text-gray-700 mb-6">Vuoi unirti alla nostra rete di affiliati di successo?</p>
        <button 
          onClick={() => document.getElementById('contatti').scrollIntoView({ behavior: 'smooth' })}
          className="bg-[#ebd00b] text-[#1d3a6b] px-8 py-4 rounded-full text-lg font-bold hover:bg-yellow-400 transition shadow-md"
        >
          Diventa Affiliato
        </button>
      </div>
    </section>
  );
}