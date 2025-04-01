"use client";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { useState, useRef, useId, useEffect } from "react";
import Link from "next/link"; // Import Next.js Link component

interface SlideData {
  title: string;
  button: string;
  src: string;
  link: string; // Ensure this exists in your SlideData interface
}

interface SlideProps {
  slide: SlideData;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
}

const Slide = ({ slide, index, current, handleSlideClick }: SlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null);
  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;
      const x = xRef.current;
      const y = yRef.current;
      slideRef.current.style.setProperty("--x", `${x}px`);
      slideRef.current.style.setProperty("--y", `${y}px`);
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  const imageLoaded = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.opacity = "1";
  };

  const { src, button, title, link } = slide;

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        className="flex flex-1 flex-col flex-wrap overflow-hidden items-center justify-center relative text-center text-white opacity-100 duration-300 ease-in-out w-[70vmin] h-[70vmin] mx-[4vmin] z-10"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform:
            current !== index
              ? "scale(0.98) rotateX(8deg)"
              : "scale(1) rotateX(0deg)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "bottom",
        }}
      >
        {/* Wrap the content in a Link component */}
    
          <a className="absolute inset-0 w-full h-full flex flex-col items-center justify-center">
            <div
              className="absolute top-0 left-0 w-full h-full bg-[#1D1F2F] rounded-[1%] flew-wrap overflow-hidden transition-all duration-150 ease-out"
              style={{
                transform:
                  current === index
                    ? "translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)"
                    : "none",
              }}
            >
              <img
                className="absolute inset-0 w-[100%] h-[100%] object-fill opacity-1 duration-600 ease-in-out"
                style={{ opacity: current === index ? 1 : 1 }}
                alt={title}
                src={src}
                onLoad={imageLoaded}
                loading="eager"
                decoding="sync"
              />
              {current === index && (
                <div className="absolute inset-0 transition-all duration-1000" />
              )}
            </div>

            <article className={`relative p-[4vmin] duration-1000 ease-in-out`}>
              <h2 className="text-lg md:text-2xl lg:text-4xl font-semibold relative">
                {title}
              </h2>
              <div className="flex justify-center">
              <Link href={link} passHref legacyBehavior>
                <button 
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default button behavior
                    handleSlideClick(index); // Handle slide click
                    window.location.href = link; // Navigate to the link
                  }}
                  className="mt-110 bg-[#FDFDFD] px-4 py-2 w-fit text-md sm:text-sm text-black bg-white h-12 border border-transparent lato-font text-xs flex justify-center items-center rounded-2xl hover:shadow-lg transition duration-200 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                >
                  {button}
                </button>
                </Link>
              </div>
            </article>
          </a>
      
      </li>
    </div>
  );
};

interface CarouselProps {
  slides: SlideData[];
}

export default function Carousel({ slides }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const next = current + 1;
      setCurrent(next === slides.length ? 0 : next);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [current, slides.length]);

  const handleSlideClick = (index: number) => {
    if (current !== index) {
      setCurrent(index);
    }
  };

  const id = useId();

  return (
    <div className="w-full overflow-hidden">
      <div
        className="relative w-[70vmin] h-[70vmin] mx-auto"
        aria-labelledby={`carousel-heading-${id}`}
        ref={containerRef}
      >
        <ul
          className="absolute flex mx-[-4vmin] transition-transform duration-1000 ease-in-out"
          style={{
            width: `${slides.length * 100}%`,
            transform: `translateX(-${current * (100 / slides.length)}%)`,
          }}
        >
          {slides.map((slide, index) => (
            <Slide
              key={index}
              slide={slide}
              index={index}
              current={current}
              handleSlideClick={handleSlideClick}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}