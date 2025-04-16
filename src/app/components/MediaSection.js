"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function MediaSection() {
  return (
    <section id="media" className="py-24 px-6 sm:px-10 lg:px-12 w-full max-w-[1400px] mx-auto text-[#1d3a6b]">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-4">
          Dentro un <span className="text-[#ebd00b]">VeryPosta Point</span>
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 font-poppins max-w-2xl mx-auto">
          Un piccolo mondo di servizi, design e tecnologia: scopri i nostri spazi.
        </p>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="grid grid-cols-2 gap-6 col-span-2">
          {[
            { src: '/arag3.jpg', alt: 'Interno di un punto VeryPosta con servizi multimediali e postali' },
            { src: '/arag2.jpg', alt: 'Sportello clienti VeryPosta con operatore che fornisce assistenza' },
            { src: '/arag4.jpg', alt: 'Area servizi digitali di un punto VeryPosta con postazioni moderne' },
            { src: '/port1.jpg', alt: 'Vetrina esterna di un punto VeryPosta con insegna e grafica ufficiale' }
          ].map((item, i) => (
            <img
              key={i}
              src={item.src}
              alt={item.alt}
              className="w-full rounded-3xl object-cover aspect-[4/3] hover:scale-[1.03] transition-transform shadow-md"
            />
          ))}
        </div>
        <div>
          <video
            src="/videofranch.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full rounded-3xl object-cover aspect-[10/16] hover:scale-[1.01] transition-transform shadow-xl"
          />
        </div>
      </div>

      {/* Mobile Carousel */}
      <div className="lg:hidden">
        <Swiper
          modules={[Pagination]}
          spaceBetween={16}
          slidesPerView={1.1}
          pagination={{ clickable: true }}
          className="pb-10"
        >
          {[
            { src: '/arag3.jpg', alt: 'Interno di un punto VeryPosta con servizi multimediali e postali' },
            { src: '/arag2.jpg', alt: 'Sportello clienti VeryPosta con operatore che fornisce assistenza' },
            { src: '/arag4.jpg', alt: 'Area servizi digitali di un punto VeryPosta con postazioni moderne' },
            { src: '/port1.jpg', alt: 'Vetrina esterna di un punto VeryPosta con insegna e grafica ufficiale' }
          ].map((item, i) => (
            <SwiperSlide key={i}>
              <img
                src={item.src}
                alt={item.alt}
                className="w-full rounded-3xl object-cover aspect-[2/3] shadow-md"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}