import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import GlobalWorld from '@/components/GlobalWorld';
import About from '@/components/About';
import Services from '@/components/Services';
import WhyUs from '@/components/WhyUs';
import OurPromise from '@/components/OurPromise';
import Portfolio from '@/components/Portfolio';
import StartProject from '@/components/StartProject';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import IntroScreen from '@/components/IntroScreen';

export default function Home() {
  return (
    <>
      <IntroScreen />
      <Navigation />
      <main>
        <Hero />
        <GlobalWorld />
        <About />
        <Services />
        <WhyUs />
        <OurPromise />
        <Portfolio />
        <StartProject />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
