import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slidesData = [
  {
    title: "Find a Scholarship That Sounds Like",
    highlight: " You",
    desc: "Scholar AI helps you find scholarships that match your unique profile.",
    button: "Get Started →",
  },
  {
    title: "AI Powered Matching",
    highlight: " 🎯",
    desc: "Smart recommendations based on your skills and goals.",
    button: "Explore →",
  },
  {
    title: "Track & Apply Easily",
    highlight: " 🚀",
    desc: "Manage all your scholarships in one dashboard.",
    button: "Dashboard →",
  },
];

export default function HeroCarousel({ onGetStarted }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slidesData.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [paused]);

  return (
    <div
      className="relative w-full flex-1 flex items-center justify-center -mt-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      
      {/* Slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -80 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 text-center w-full px-4 flex flex-col items-center"
        >
          <h1 className="max-w-4xl mx-auto text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight drop-shadow-[0_0_30px_rgba(250,204,21,0.15)]">
            {slidesData[index].title}
            <span className="text-yellow-400">
              {slidesData[index].highlight}
            </span>
          </h1>

          <p className="mt-6 text-base md:text-lg text-white/70">
            {slidesData[index].desc}
          </p>

          <motion.button
            onClick={onGetStarted}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 px-6 py-3 rounded-2xl bg-yellow-400 text-slate-900 font-medium hover:bg-yellow-500 transition"
          >
            {slidesData[index].button}
          </motion.button>
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      <button
        onClick={() => setIndex((prev) => (prev - 1 + slidesData.length) % slidesData.length)}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-3 rounded-lg text-white z-20"
      >
        ❮
      </button>

      <button
        onClick={() => setIndex((prev) => (prev + 1) % slidesData.length)}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-3 rounded-lg text-white z-20"
      >
        ❯
      </button>

      {/* Dots */}
      <div className="absolute bottom-20 flex gap-2 z-20">
        {slidesData.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2.5 h-2.5 rounded-full cursor-pointer ${
              i === index ? "bg-yellow-400" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}