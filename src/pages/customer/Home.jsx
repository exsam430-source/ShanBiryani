import Hero from '../../components/home/Hero.jsx';
import FeaturedDishes from '../../components/home/FeaturedDishes.jsx';
import AboutPreview from '../../components/home/AboutPreview.jsx';
import Testimonials from '../../components/home/Testimonials.jsx';
import CallToAction from '../../components/home/CallToAction.jsx';

const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedDishes />
      <AboutPreview />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default Home;