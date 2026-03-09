import { useEffect, useState } from "react";
import { getAllSlides } from "../../services/carouselService";
import { ICarousel } from "../../interfaces/Carousel";

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<ICarousel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await getAllSlides();
        setSlides(response.slides);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  const prev = () => setCurrentSlide((p) => (p - 1 + slides.length) % slides.length);
  const next = () => setCurrentSlide((p) => (p + 1) % slides.length);

  if (loading) {
    return (
      <div className="w-full h-[300px] md:h-[400px] bg-gray-200 animate-pulse mb-8" />
    );
  }

  if (slides.length === 0) return null;

  return (
    <div className="w-full h-[300px] md:h-[400px] overflow-hidden relative mb-8">
      {slides.map((slide, index) => (
        <div
          key={slide._id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={slide.image}
            className="w-full h-full object-cover"
            alt={slide.title}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
            <div className="text-white px-8 md:px-16 max-w-2xl">
              <h2 className="text-2xl md:text-4xl font-bold">{slide.title}</h2>
              <p className="text-lg md:text-2xl">{slide.subtitle}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Flechas */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center transition"
        aria-label="Slide anterior"
      >
        &#8249;
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center transition"
        aria-label="Siguiente slide"
      >
        &#8250;
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 rounded-full transition-all ${index === currentSlide ? "bg-white w-8" : "bg-white/50 w-3"}`}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
