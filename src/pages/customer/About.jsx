import { motion } from 'framer-motion';
import { Award, Users, Clock, Heart, Star, ChefHat } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Passion',
      description: 'Every dish is prepared with love and dedication to authentic flavors.'
    },
    {
      icon: Award,
      title: 'Quality',
      description: 'We use only the finest ingredients sourced from trusted suppliers.'
    },
    {
      icon: Users,
      title: 'Family',
      description: 'Our recipes have been passed down through generations of master chefs.'
    },
    {
      icon: Clock,
      title: 'Tradition',
      description: 'We honor traditional cooking methods while embracing modern techniques.'
    }
  ];

  const team = [
    {
      name: 'Chef Ahmad Khan',
      role: 'Head Chef',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400',
      description: '25+ years of culinary excellence'
    },
    {
      name: 'Fatima Hussain',
      role: 'Restaurant Manager',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      description: 'Ensuring perfect dining experience'
    },
    {
      name: 'Ali Raza',
      role: 'Sous Chef',
      image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=400',
      description: 'Master of traditional recipes'
    }
  ];

  return (
    <div className="min-h-screen bg-dark">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2074"
            alt="Restaurant interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/90 to-dark/70" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary text-sm font-medium rounded-full mb-4">
              Our Story
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white mb-6">
              A Legacy of <span className="text-gradient">Authentic</span> Flavors
            </h1>
            <p className="text-lg text-text-secondary">
              Since 1998, Shan Biryani has been serving the finest Pakistani cuisine in Karachi. 
              Our journey began with a simple passion: to share the authentic taste of homemade 
              biryani with everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800"
                alt="Our kitchen"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-6">
                From Humble Beginnings to <span className="text-primary">Culinary Excellence</span>
              </h2>
              <div className="space-y-4 text-text-secondary">
                <p>
                  What started as a small family kitchen has grown into one of Karachi's most 
                  beloved restaurants. Our founder, Shan Ahmed, learned the art of biryani-making 
                  from his grandmother, who had perfected her recipe over decades.
                </p>
                <p>
                  Today, we continue that tradition with the same dedication and love. Every grain 
                  of rice is carefully selected, every spice is hand-ground, and every dish is 
                  prepared with the same care as if we were cooking for our own family.
                </p>
                <p>
                  Our commitment to quality has earned us numerous awards and, more importantly, 
                  the loyalty of thousands of customers who have made Shan Biryani a part of their 
                  celebrations and everyday meals.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-dark-light">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
              Our <span className="text-gradient">Values</span>
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-dark-card rounded-xl p-6 border border-dark-lighter text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-text-secondary text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
              Meet Our <span className="text-gradient">Team</span>
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              The talented people behind your favorite dishes
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-dark-card rounded-xl overflow-hidden border border-dark-lighter group"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                  <p className="text-primary text-sm font-medium">{member.role}</p>
                  <p className="text-text-muted text-sm mt-2">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '25+', label: 'Years of Excellence' },
              { value: '50K+', label: 'Happy Customers' },
              { value: '100+', label: 'Menu Items' },
              { value: '4.9', label: 'Average Rating' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <p className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-white/80">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;