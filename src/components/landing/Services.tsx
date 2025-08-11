import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Briefcase, 
  Code, 
  TrendingUp, 
  GraduationCap,
  Award
} from 'lucide-react';

interface Service {
  _id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
  order: number;
  active: boolean;
}

const iconMap: { [key: string]: React.ComponentType<any> } = {
  Shield,
  Briefcase,
  Code,
  TrendingUp,
  GraduationCap,
  Award
};

const Services = () => {
  const [services, setServices] = React.useState<Service[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/website-content');
        const data = await response.json();
        
        if (data.services) {
          setServices(data.services);
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleLearnMore = (serviceId: string) => {
    // Scroll to contact form and pre-select the service
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      
      // Pre-select service in contact form
      setTimeout(() => {
        const serviceSelect = document.querySelector('select[name="service"]') as HTMLSelectElement;
        if (serviceSelect) {
          const serviceMap: { [key: string]: string } = {
            'Cyber Crime Fraud Assistance': 'fraud-assistance',
            'Job Consultancy Services': 'job-consultancy',
            'Web & App Development': 'web-development',
            'Digital Marketing': 'digital-marketing',
            'Training & Certification': 'training'
          };
          const service = services.find(s => s._id === serviceId);
          if (service) {
            serviceSelect.value = serviceMap[service.title] || '';
          }
          serviceSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, 500);
    }
  };

  const handleGetConsultation = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-full px-4 py-2 text-red-400 text-sm font-medium mb-6"
          >
            <Award size={16} />
            <span>Our Services</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
           <span className="text-gray-900">Comprehensive</span>{' '}
            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Career Solutions
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From protecting you against cyber fraud to landing your dream job, 
            we provide end-to-end career and technology solutions.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-red-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Shield;
              
              return (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    y: -15, 
                    scale: 1.03,
                    rotateY: 5,
                    boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
                  }}
                  className="group bg-white backdrop-blur-xl border border-gray-200 rounded-3xl p-8 hover:shadow-xl transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ 
                      scale: 1.2, 
                      rotate: [0, -10, 10, 0],
                      boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
                    }}
                    transition={{ duration: 0.3 }}
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl mb-6 group-hover:shadow-2xl transition-all duration-300`}
                  >
                    <motion.div
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        delay: index * 0.5
                      }}
                    >
                      <IconComponent className="text-white" size={28} />
                    </motion.div>
                  </motion.div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + featureIndex * 0.1 }}
                        whileHover={{ x: 10, scale: 1.05 }}
                        className="flex items-center space-x-3"
                      >
                        <motion.div 
                          className="w-2 h-2 bg-red-400 rounded-full"
                          animate={{ 
                            scale: [1, 1.5, 1],
                            opacity: [0.7, 1, 0.7]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            delay: featureIndex * 0.3
                          }}
                        />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ 
                      scale: 1.05,
                      backgroundImage: "linear-gradient(to right, #ef4444, #dc2626)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLearnMore(service._id)}
                    className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:from-red-500 hover:to-red-600 hover:text-white transition-all duration-300 relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    Learn More
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetConsultation}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-12 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all inline-flex items-center space-x-2 relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />
            <span>Get Free Consultation</span>
            <motion.div
              animate={{ 
                x: [0, 8, 0],
                rotate: [0, 15, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    delay: index * 0.5
                  }}
                >
                  <service.icon className="text-white" size={28} />
                </motion.div>
              </motion.div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors">
                {service.title}
              </h3>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>

              <ul className="space-y-3 mb-8">
                {service.features.map((feature, featureIndex) => (
                  <motion.li
                    key={featureIndex}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + featureIndex * 0.1 }}
                    whileHover={{ x: 10, scale: 1.05 }}
                    className="flex items-center space-x-3"
                  >
                    <motion.div 
                      className="w-2 h-2 bg-red-400 rounded-full"
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        delay: featureIndex * 0.3
                      }}
                    />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  backgroundImage: "linear-gradient(to right, #ef4444, #dc2626)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleLearnMore(service.id)}
                className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:from-red-500 hover:to-red-600 hover:text-white transition-all duration-300 relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                Learn More
              </motion.button>
            </motion.div>
          ))}
        </div>