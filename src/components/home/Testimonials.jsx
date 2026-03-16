import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Ahmed Khan',
      role: 'Food Blogger',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      rating: 5,
      text: "The best biryani I've ever had in Karachi! The flavors are authentic and the meat is incredibly tender. Shan Biryani has become my go-to place for special occasions."
    },
    {
      id: 2,
      name: 'Fatima Zahra',
      role: 'Regular Customer',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      rating: 5,
      text: "I've been ordering from Shan Biryani for years. The consistency in quality is remarkable. Their chicken karahi is absolutely divine!"
    },
    {
      id: 3,
      name: 'Imran Ali',
      role: 'Food Critic',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      rating: 5,
      text: "As a food critic, I'm very particular about flavors. Shan Biryani exceeds expectations every single time. True representation of Pakistani cuisine."
    },
    {
      id: 4,
      name: 'Ayesha Malik',
      role: 'Corporate Client',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      rating: 5,
      text: "We order from Shan Biryani for all our office events. The catering service is excellent, and everyone loves the food. Highly recommended!"
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 md:py-24 bg-dark relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-primary/20 text-primary text-sm font-medium rounded-full mb-4"
          >
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-white mb-4"
          >
            What Our <span className="text-gradient">Customers</span> Say
          </motion.h2>
        </div>

        {/* Testimonials Slider */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="glass rounded-3xl p-8 md:p-12"
              >
                {/* Quote Icon */}
                <Quote className="w-12 h-12 text-primary/30 mb-6" />

                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-lg md:text-xl text-text-secondary mb-8 leading-relaxed">
                  "{testimonials[currentIndex].text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <img
                    src={testimonials[currentIndex].avatar}
                    alt={testimonials[currentIndex].name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-primary"
                  />
                  <div>
                    <h4 className="text-white font-semibold">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-text-muted text-sm">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full bg-dark-card border border-dark-lighter flex items-center justify-center text-text-secondary hover:text-white hover:border-primary transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full bg-dark-card border border-dark-lighter flex items-center justify-center text-text-secondary hover:text-white hover:border-primary transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-primary'
                      : 'bg-dark-lighter hover:bg-text-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;