
import React, { useState, useEffect, useCallback } from 'react';

const slides = [
  {
    image: 'https://picsum.photos/1920/600?image=1059',
    caption: '科技赋能，助力农业现代化',
  },
  {
    image: 'https://picsum.photos/1920/600?image=292',
    caption: '产销对接，打通农产品上行通道',
  },
  {
    image: 'https://picsum.photos/1920/600?image=311',
    caption: '普惠金融，解决农户融资难题',
  },
];

const HeroCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  }

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [nextSlide]);

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={slide.image} alt={slide.caption} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h2 className="text-white text-4xl md:text-5xl font-bold text-center drop-shadow-lg">
              {slide.caption}
            </h2>
          </div>
        </div>
      ))}

      <button onClick={prevSlide} className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition">
        &#10094;
      </button>
      <button onClick={nextSlide} className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition">
        &#10095;
      </button>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
              <button 
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${currentIndex === index ? 'bg-white' : 'bg-gray-400'}`}
              ></button>
          ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
