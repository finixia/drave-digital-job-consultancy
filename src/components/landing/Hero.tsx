import React from 'react';
import { ArrowRight, Play, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface HeroContent {
  title: string;
  subtitle: string;
  primaryButtonText: string;
  secondaryButtonText: string;
}

interface HeroStats {
  label: string;
  value: string;
  color: string;
}

const Hero = () => {
  const navigate = useNavigate();
  const [heroContent, setHeroContent] = React.useState<HeroContent>({
    title: 'Your Professional Success Partner',
    subtitle: 'From landing your dream job to protecting against cyber fraud, we provide comprehensive career solutions and digital security services that empower your professional journey.',
    primaryButtonText: 'Get Started Today',
    secondaryButtonText: 'Explore Services'
  });
  const [heroStats, setHeroStats] = React.useState<HeroStats[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/website-content');
        const data = await response.json();
        
        if (data.hero) {
          setHeroContent(data.hero);
        }
        if (data.stats) {
          setHeroStats(data.stats);
        }
      } catch (error) {
        console.error('Failed to fetch hero content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const scrollToServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGetStarted = () => {
    navigate('/register');
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-red-50">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(239, 68, 68, 0.05) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(220, 38, 38, 0.05) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 80%, rgba(239, 68, 68, 0.05) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(220, 38, 38, 0.05) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        />
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-red-400/30 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeInOut"
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
          />
        ))}
      </div>

      {/* Floating Review Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute top-32 right-8 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-4 text-center hidden lg:block shadow-lg"
      >
        <div className="flex items-center justify-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} className="text-red-400 fill-current" />
          ))}
        </div>
        <div className="text-gray-900 font-semibold text-lg">4.9</div>
        <div className="text-gray-600 text-sm">Client Rating</div>
        <div className="text-gray-500 text-xs">5000+ reviews</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="absolute top-48 left-8 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-4 text-center hidden lg:block shadow-lg"
      >
        <div className="flex items-center justify-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} className="text-red-400 fill-current" />
          ))}
        </div>
        <div className="text-gray-900 font-semibold text-lg">98%</div>
        <div className="text-gray-600 text-sm">Success Rate</div>
        <div className="text-gray-500 text-xs">Job Placements</div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6 pt-20">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight"
        >
          <motion.span
            animate={{ 
              textShadow: [
                "0 0 0px rgba(239, 68, 68, 0)",
                "0 0 20px rgba(239, 68, 68, 0.3)",
                "0 0 0px rgba(239, 68, 68, 0)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {heroContent.title.split(' ').slice(0, 2).join(' ')}
          </motion.span>{' '}
          <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
            <motion.span
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{ backgroundSize: "200% 200%" }}
              className="bg-gradient-to-r from-red-400 via-red-600 to-red-400 bg-clip-text text-transparent"
            >
              {heroContent.title.split(' ')[2]}
            </motion.span>
          </span>
          <br />
          <span className="text-4xl md:text-5xl font-light">
            {heroContent.title.split(' ').slice(3).join(' ')}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto font-light leading-relaxed"
        >
          {heroContent.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(239, 68, 68, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all inline-flex items-center space-x-2 relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
            <Sparkles size={20} className="animate-pulse" />
            <span>{heroContent.primaryButtonText}</span>
            <ArrowRight size={20} />
          </motion.button>
          
          <motion.button
            whileHover={{ 
              scale: 1.05,
              borderColor: "rgba(239, 68, 68, 0.6)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToServices} 
            className="border-2 border-gray-300 text-gray-700 px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 hover:border-red-400 transition-all inline-flex items-center space-x-2"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Play size={20} />
            </motion.div>
            <span>{heroContent.secondaryButtonText}</span>
          </motion.button>
        </motion.div>

        {/* Stats */}
        {!loading && heroStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {heroStats.map((stat, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1 + index * 0.2, duration: 0.6 }}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                }}
                className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-lg"
              >
                <motion.div 
                  className="text-3xl font-bold text-red-400 mb-2"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    color: ["#f87171", "#dc2626", "#f87171"]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    delay: index * 0.5
                  }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        onClick={scrollToServices}
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center cursor-pointer hover:border-red-400 transition-colors">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;