import React, { useEffect, useState } from 'react';
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

const testimonials = [
  {
    name: 'James Wilson',
    role: 'Crypto Enthusiast',
    message:
      'This platform has completely transformed my investment journey. Transparent, secure, and fast!',
    rating: 5,
  },
  {
    name: 'Sophia Turner',
    role: 'Investor',
    message:
      'The support team is excellent and the returns are very impressive. Highly recommended!',
    rating: 4,
  },
  {
    name: 'Liam Carter',
    role: 'Beginner Trader',
    message:
      'I love how easy it is to get started. The plans are beginner-friendly and the interface is clean.',
    rating: 5,
  },
  {
    name: 'Olivia Scott',
    role: 'Tech Entrepreneur',
    message:
      'Smart tools, real-time tracking, and great referral bonuses. A perfect blend for crypto users.',
    rating: 4,
  },
  {
    name: 'Ethan Brown',
    role: 'Finance Analyst',
    message:
      'The weekly analytics and payouts are unmatched. Solid platform with a long-term vision.',
    rating: 5,
  },
  {
    name: 'Ava Green',
    role: 'Crypto Consultant',
    message:
      'It feels good knowing my investments are being managed by professionals. Thumbs up!',
    rating: 5,
  },
];

const itemsPerSlide = 3;
const totalSlides = Math.ceil(testimonials.length / itemsPerSlide);

const variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, scale: 0.95, y: -20, transition: { duration: 0.4 } },
};

const Testimonials = () => {
  const [index, setIndex] = useState(0);

  const nextSlide = () => setIndex((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setIndex((prev) => (prev - 1 + totalSlides) % totalSlides);

  useEffect(() => {
    const timer = setInterval(nextSlide, 9000);
    return () => clearInterval(timer);
  }, []);

  const currentTestimonials = testimonials.slice(
    index * itemsPerSlide,
    index * itemsPerSlide + itemsPerSlide
  );

  return (
    <section className="bg-gradient-to-b from-white to-blue-50 py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto text-center relative">
        <h2 className="text-4xl font-extrabold text-blue-900 mb-4">What Our investors Say</h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Real stories from real investors. Learn how our platform is helping people grow their wealth.
        </p>

        <div className="relative">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {currentTestimonials.map((item, i) => (
                <div
                  key={item.name + i}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="relative">
                    <p className="text-gray-700 text-left italic mb-5 leading-relaxed">
                      <span className="text-3xl text-blue-300 font-serif">“</span>
                      {item.message}
                      <span className="text-3xl text-blue-300 font-serif">”</span>
                    </p>
                    <div className="text-left mt-4">
                      <h4 className="text-blue-800 font-bold text-lg">{item.name}</h4>
                      <p className="text-sm text-gray-500">{item.role}</p>
                      <div className="flex gap-1 text-yellow-400 mt-1">
                        {Array(item.rating)
                          .fill(0)
                          .map((_, idx) => (
                            <FaStar key={idx} />
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Improved Arrow Positioning */}
          <div className="absolute top-1/2 left-[-1.5rem] right-[-1.5rem] flex justify-between -translate-y-1/2 z-10 px-3 sm:px-4">
            <button
              onClick={prevSlide}
              className="bg-white border border-blue-200 p-2 sm:p-3 rounded-full shadow-md hover:bg-blue-100 transition"
              aria-label="Previous"
            >
              <FaChevronLeft className="text-blue-600" />
            </button>
            <button
              onClick={nextSlide}
              className="bg-white border border-blue-200 p-2 sm:p-3 rounded-full shadow-md hover:bg-blue-100 transition"
              aria-label="Next"
            >
              <FaChevronRight className="text-blue-600" />
            </button>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="mt-10 flex justify-center gap-3">
          {Array(totalSlides)
            .fill(0)
            .map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === i ? 'bg-blue-600 scale-110' : 'bg-blue-300'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
