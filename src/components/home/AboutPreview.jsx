import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Award, Users, Clock, Utensils } from 'lucide-react';
import Button from '../common/Button.jsx';

const AboutPreview = () => {
  const stats = [
    { icon: Award, value: '25+', label: 'Years Experience' },
    { icon: Users, value: '50K+', label: 'Happy Customers' },
    { icon: Utensils, value: '100+', label: 'Signature Dishes' },
    { icon: Clock, value: '30', label: 'Min Avg Delivery' }
  ];

  return (
    <section className="py-16 md:py-24 bg-dark-light relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1974"
                alt="Chef preparing biryani"
                className="rounded-2xl shadow-2xl w-full max-w-md mx-auto lg:mx-0"
              />
              
              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-8 -right-4 md:right-0 lg:-right-12 bg-dark-card p-4 md:p-6 rounded-2xl shadow-2xl border border-dark-lighter"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">25+</p>
                    <p className="text-text-secondary text-sm">Years of Excellence</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative Element */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary/20 rounded-full blur-2xl" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:pl-8"
          >
            <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary text-sm font-medium rounded-full mb-4">
              About Us
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-white mb-6">
              A Legacy of <span className="text-gradient">Authentic</span> Flavors
            </h2>
            <p className="text-text-secondary text-lg mb-6">
              Since 1998, Shan Biryani has been serving the finest Pakistani cuisine 
              in Karachi. Our recipes have been passed down through generations, 
              preserving the authentic taste that makes our dishes unforgettable.
            </p>
            <p className="text-text-secondary mb-8">
              We source the finest ingredients, from premium basmati rice to 
              hand-selected spices, ensuring every bite tells a story of tradition 
              and quality. Our master chefs bring decades of experience to create 
              dishes that celebrate Pakistan's rich culinary heritage.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-4 bg-dark-card rounded-xl border border-dark-lighter"
                >
                  <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-text-muted">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <Link to="/about">
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Learn More About Us
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;