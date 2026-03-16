import { motion } from 'framer-motion';
import { Award, Users, UtensilsCrossed, Clock } from 'lucide-react';

const Stats = () => {
  const stats = [
    { 
      icon: Award, 
      value: '25+', 
      label: 'Years Experience',
      color: 'text-primary'
    },
    { 
      icon: Users, 
      value: '50K+', 
      label: 'Happy Customers',
      color: 'text-secondary'
    },
    { 
      icon: UtensilsCrossed, 
      value: '100+', 
      label: 'Menu Items',
      color: 'text-accent'
    },
    { 
      icon: Clock, 
      value: '30', 
      label: 'Min Avg Delivery',
      color: 'text-green-500'
    }
  ];

  return (
    <section className="py-16 bg-dark-light">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-dark-card border border-dark-lighter flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-text-secondary text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;