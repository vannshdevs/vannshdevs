import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { RoboticArm } from './RoboticArm';

export const Hero = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center px-6">
      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <p className="text-primary font-medium mb-4 tracking-wide uppercase text-sm">
            Computer Science Student
          </p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Hi, I'm Vansh
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
            I'm a student developer who enjoys building clean, useful things
            for the web. Here you'll find my projects, skills and a way to
            reach me.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button size="lg" onClick={() => scrollTo('portfolio')}>
              View My Work <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => scrollTo('contact')}>
              Get In Touch
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <RoboticArm />
        </motion.div>
      </div>

      <motion.button
        onClick={() => scrollTo('about')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        aria-label="Scroll to about section"
      >
        <ChevronDown className="w-6 h-6 text-muted-foreground" />
      </motion.button>
    </section>
  );
};
