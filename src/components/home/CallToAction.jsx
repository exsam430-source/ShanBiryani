import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, ArrowRight } from 'lucide-react';
import Button from '../common/Button.jsx';

const CallToAction = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=2070"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary-dark/90" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-white mb-6"
          >
            Ready to Experience the <br />
            Best Biryani in Town?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/80 mb-8"
          >
            Order now and enjoy authentic Pakistani cuisine delivered 
            right to your doorstep. Free delivery on orders over Rs. 1000!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/menu">
              <Button
                variant="gold"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Order Now
              </Button>
            </Link>
            <a href="tel:+923001234567">
              <Button
                variant="outline"
                size="lg"
                leftIcon={<Phone className="w-5 h-5" />}
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                Call Us
              </Button>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;