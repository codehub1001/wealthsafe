import React, { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import carouselData from '../data/carouselData';
import { Link, useNavigate } from 'react-router-dom';

const Carousel = () => {
  const [current, setCurrent] = useState(0);
  const total = carouselData.length;
   const navigate = useNavigate();

  const nextSlide = () => setCurrent((prev) => (prev === total - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? total - 1 : prev - 1));

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [current]);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {carouselData.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <img
            src={slide.image}
            alt={slide.title}
            loading="lazy"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.currentTarget.src = '/fallback.jpg'; // Optional fallback
              console.warn('Failed to load image:', slide.image);
            }}
          />

          {/* Overlay content */}
          <div className="absolute inset-0 bg-black/40 z-10" />

          <div className="absolute z-20 left-6 md:left-16 top-1/2 -translate-y-1/2 text-white max-w-2xl space-y-6">
            <h2 className="text-4xl md:text-6xl font-bold drop-shadow-lg">{slide.title}</h2>
            <p className="text-lg md:text-xl text-white/90">{slide.subtitle}</p>
            <button  onClick={() => navigate('/login')} className="mt-4 px-6 py-3 bg-white text-blue-700 text-lg font-semibold rounded-md shadow hover:bg-blue-100 hover:cursor-pointer transition">
              Get Started
            </button>
          </div>
        </div>
      ))}

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 z-30 bg-white/70 text-blue-900 p-3 rounded-full shadow hover:bg-white"
      >
        <FiChevronLeft size={28} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 z-30 bg-white/70 text-blue-900 p-3 rounded-full shadow hover:bg-white"
      >
        <FiChevronRight size={28} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
        {carouselData.map((_, i) => (
          <span
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition ${
              i === current ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Carousel;
