import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Award, TrendingUp, Shield, Heart } from 'lucide-react';

interface AboutContent {
  title: string;
  subtitle: string;
  description: string;
  values: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  commitments: string[];
}

interface StatItem {
  icon: string;
  label: string;
  value: string;
  color: string;
}

const iconMap: { [key: string]: React.ComponentType<any> } = {
  Target,
  Users,
  Award,
  TrendingUp,
  Shield,
  Heart
};

const stats = [
  { icon: Users, label: 'Happy Clients', value: '5000+', color: 'text-blue-400' },
  { icon: Award, label: 'Success Rate', value: '98%', color: 'text-green-400' },
  { icon: Shield, label: 'Fraud Cases Resolved', value: '1200+', color: 'text-red-400' },
  { icon: TrendingUp, label: 'Growth Rate', value: '150%', color: 'text-purple-400' }
];

const About = () => {
  const [aboutContent, setAboutContent] = React.useState<AboutContent>({
    title: 'Your Trusted Career Partner',
    subtitle: 'About Us',
    description: 'Drave Digitals is more than just a consultancy. We\'re your comprehensive career protection and growth partner, combining job placement expertise with cybersecurity awareness and cutting-edge technology solutions.',
    values: [],
    commitments: []
  });
  const [statsData, setStatsData] = React.useState<StatItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/website-content');
        const data = await response.json();
        
        if (data.about) {
          setAboutContent(data.about);
        }
        if (data.stats) {
          setStatsData(data.stats);
        }
      } catch (error) {
        console.error('Failed to fetch about content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  return (
    <section id="about" className="py-32 bg-white">
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
            <Target size={16} />
            <span>{aboutContent.subtitle}</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
           <span className="text-gray-900">{aboutContent.title.split(' ').slice(0, 2).join(' ')}</span>{' '}
            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              {aboutContent.title.split(' ').slice(2).join(' ')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {aboutContent.description}
          </p>
        </motion.div>

        {/* Stats Section */}
        {!loading && statsData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          >
            {statsData.map((stat, index) => {
              const IconComponent = iconMap[stat.icon] || Users;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -2, 2, 0],
                    boxShadow: "0 15px 30px rgba(0,0,0,0.1)"
                  }}
                  className="text-center bg-gray-50 backdrop-blur-xl border border-gray-200 rounded-2xl p-6"
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      delay: index * 0.5
                    }}
                  >
                    <IconComponent className={stat.color} size={32} />
                  </motion.div>
                  <motion.div 
                    className="text-3xl font-bold text-gray-900 mb-2"
                    animate={{ 
                      scale: [1, 1.05, 1],
                      color: ["#f87171", "#dc2626", "#f87171"]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      delay: index * 0.3
                    }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Values Section */}
        {!loading && aboutContent.values.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-4xl font-bold text-gray-900 mb-8">
                Why Choose CareerGuard?
              </h3>
              <div className="space-y-8">
                {aboutContent.values.map((value, index) => {
                  const IconComponent = iconMap[value.icon] || Target;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      whileHover={{ x: 10, scale: 1.02 }}
                      className="flex items-start space-x-4"
                    >
                      <motion.div
                        whileHover={{ 
                          scale: 1.2, 
                          rotate: [0, -10, 10, 0],
                          boxShadow: "0 8px 25px rgba(239, 68, 68, 0.3)"
                        }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center"
                      >
                        <motion.div
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 4, repeat: Infinity }}
                        >
                          <IconComponent className="text-white" size={20} />
                        </motion.div>
                      </motion.div>
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">
                          {value.title}
                        </h4>
                        <p className="text-gray-600 leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-8 border border-red-200">
                <motion.div
                  animate={{ 
                    background: [
                      "linear-gradient(45deg, rgba(239, 68, 68, 0.05), rgba(220, 38, 38, 0.05))",
                      "linear-gradient(45deg, rgba(220, 38, 38, 0.05), rgba(239, 68, 68, 0.05))"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-3xl"
                />
                <div className="relative z-10">
                  <h4 className="text-2xl font-bold text-gray-900 mb-6">
                    Our Commitment
                  </h4>
                  <div className="space-y-4">
                    {aboutContent.commitments.map((commitment, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ x: 10, scale: 1.02 }}
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
                            delay: index * 0.2
                          }}
                        />
                        <span className="text-gray-700">{commitment}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-20"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(239, 68, 68, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const contactSection = document.getElementById('contact');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-12 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
            />
            Start Your Journey Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

              >
                <stat.icon className={`${stat.color} mx-auto mb-4`} size={32} />
              </motion.div>
              <motion.div 
                className="text-3xl font-bold text-gray-900 mb-2"
                animate={{ 
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  delay: index * 0.3
                }}
              >
                {stat.value}
              </motion.div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Values Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-4xl font-bold text-gray-900 mb-8">
              Why Choose CareerGuard?
            </h3>
            <div className="space-y-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ x: 10, scale: 1.02 }}
                  className="flex items-start space-x-4"
                >
                  <motion.div
                    whileHover={{ 
                      scale: 1.2, 
                      rotate: [0, -10, 10, 0],
                      boxShadow: "0 8px 25px rgba(239, 68, 68, 0.3)"
                    }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <value.icon className="text-white" size={20} />
                    </motion.div>
                  </motion.div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      {value.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-8 border border-red-200">
              <motion.div
                animate={{ 
                  background: [
                    "linear-gradient(45deg, rgba(239, 68, 68, 0.05), rgba(220, 38, 38, 0.05))",
                    "linear-gradient(45deg, rgba(220, 38, 38, 0.05), rgba(239, 68, 68, 0.05))"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-3xl"
              />
              <div className="relative z-10">
                <h4 className="text-2xl font-bold text-gray-900 mb-6">
                  Our Commitment
                </h4>
                <div className="space-y-4">
                  {[
                    'Personalized career guidance for every individual',
                    'Comprehensive fraud protection and awareness',
                    'Cutting-edge technology solutions',
                    '24/7 support and consultation',
                    'Transparent pricing with no hidden costs',
                    'Continuous skill development programs'
                  ].map((commitment, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ x: 10, scale: 1.02 }}
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
                          delay: index * 0.2
                        }}
                      />
                      <span className="text-gray-700">{commitment}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-20"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(239, 68, 68, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const contactSection = document.getElementById('contact');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-12 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
            />
            Start Your Journey Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default About;