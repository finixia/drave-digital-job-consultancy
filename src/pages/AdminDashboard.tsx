import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  Briefcase, 
  Shield, 
  TrendingUp,
  Star,
  Plus,
  Edit,
  Trash2,
  LogOut,
  Settings,
  Globe,
  FileText,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../utils/api';

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

interface HeroContent {
  _id: string;
  title: string;
  subtitle: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  active: boolean;
}

interface StatItem {
  _id: string;
  label: string;
  value: string;
  color: string;
  icon: string;
  order: number;
  active: boolean;
}

interface DashboardStats {
  totalContacts: number;
  totalApplications: number;
  totalFraudCases: number;
  placedJobs: number;
  resolvedFraudCases: number;
  totalUsers: number;
  newsletterSubscribers: number;
  totalTestimonials: number;
  successRate: number;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  rating: number;
  text: string;
  service: string;
}

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [heroContent, setHeroContent] = useState<HeroContent[]>([]);
  const [statsData, setStatsData] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddTestimonial, setShowAddTestimonial] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [showAddHero, setShowAddHero] = useState(false);
  const [showAddStat, setShowAddStat] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingHero, setEditingHero] = useState<HeroContent | null>(null);
  const [editingStat, setEditingStat] = useState<StatItem | null>(null);

  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    role: '',
    company: '',
    rating: 5,
    text: '',
    service: 'Job Consultancy'
  });

  const [newService, setNewService] = useState({
    title: '',
    description: '',
    icon: 'Shield',
    color: 'from-red-500 to-pink-600',
    features: [''],
    order: 1
  });

  const [newHero, setNewHero] = useState({
    title: '',
    subtitle: '',
    primaryButtonText: 'Get Started Today',
    secondaryButtonText: 'Explore Services'
  });

  const [newStat, setNewStat] = useState({
    label: '',
    value: '',
    color: 'text-blue-400',
    icon: 'Users',
    order: 1
  });

  useEffect(() => {
    fetchDashboardData();
    fetchAllContent();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await apiService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  const fetchAllContent = async () => {
    try {
      setLoading(true);
      const [contentResponse, servicesResponse, heroResponse, statsResponse] = await Promise.all([
        fetch('http://localhost:5000/api/website-content'),
        fetch('http://localhost:5000/api/services'),
        fetch('http://localhost:5000/api/hero-content'),
        fetch('http://localhost:5000/api/stats')
      ]);
      
      const [contentData, servicesData, heroData, statsData] = await Promise.all([
        contentResponse.json(),
        servicesResponse.json(),
        heroResponse.json(),
        statsResponse.json()
      ]);
      
      setTestimonials(contentData.testimonials || []);
      setServices(servicesData);
      setHeroContent(heroData);
      setStatsData(statsData);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTestimonial = async () => {
    try {
      const currentTestimonials = testimonials || [];
      const newId = Math.max(...currentTestimonials.map(t => t.id), 0) + 1;
      const testimonialToAdd = { ...newTestimonial, id: newId };
      
      const updatedTestimonials = [...currentTestimonials, testimonialToAdd];
      
      await apiService.updateWebsiteContent('testimonials', updatedTestimonials);
      
      setTestimonials(updatedTestimonials);
      setNewTestimonial({
        name: '',
        role: '',
        company: '',
        rating: 5,
        text: '',
        service: 'Job Consultancy'
      });
      setShowAddTestimonial(false);
    } catch (error) {
      console.error('Failed to add testimonial:', error);
      alert('Failed to add testimonial');
    }
  };

  const handleAddService = async () => {
    try {
      await fetch('http://localhost:5000/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newService)
      });
      
      fetchAllContent();
      setNewService({
        title: '',
        description: '',
        icon: 'Shield',
        color: 'from-red-500 to-pink-600',
        features: [''],
        order: 1
      });
      setShowAddService(false);
    } catch (error) {
      console.error('Failed to add service:', error);
      alert('Failed to add service');
    }
  };

  const handleAddHero = async () => {
    try {
      await fetch('http://localhost:5000/api/hero-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newHero)
      });
      
      fetchAllContent();
      setNewHero({
        title: '',
        subtitle: '',
        primaryButtonText: 'Get Started Today',
        secondaryButtonText: 'Explore Services'
      });
      setShowAddHero(false);
    } catch (error) {
      console.error('Failed to add hero content:', error);
      alert('Failed to add hero content');
    }
  };

  const handleAddStat = async () => {
    try {
      await fetch('http://localhost:5000/api/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newStat)
      });
      
      fetchAllContent();
      setNewStat({
        label: '',
        value: '',
        color: 'text-blue-400',
        icon: 'Users',
        order: 1
      });
      setShowAddStat(false);
    } catch (error) {
      console.error('Failed to add stat:', error);
      alert('Failed to add stat');
    }
  };

  const handleEditTestimonial = async () => {
    if (!editingTestimonial) return;
    
    try {
      const updatedTestimonials = testimonials.map(t => 
        t.id === editingTestimonial.id ? editingTestimonial : t
      );
      
      await apiService.updateWebsiteContent('testimonials', updatedTestimonials);
      
      setTestimonials(updatedTestimonials);
      setEditingTestimonial(null);
    } catch (error) {
      console.error('Failed to update testimonial:', error);
      alert('Failed to update testimonial');
    }
  };

  const handleDeleteTestimonial = async (id: number) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
      const updatedTestimonials = testimonials.filter(t => t.id !== id);
      await apiService.updateWebsiteContent('testimonials', updatedTestimonials);
      setTestimonials(updatedTestimonials);
    } catch (error) {
      console.error('Failed to delete testimonial:', error);
      alert('Failed to delete testimonial');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
      await fetch(`http://localhost:5000/api/services/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchAllContent();
    } catch (error) {
      console.error('Failed to delete service:', error);
      alert('Failed to delete service');
    }
  };

  const handleDeleteHero = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero content?')) return;
    
    try {
      await fetch(`http://localhost:5000/api/hero-content/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchAllContent();
    } catch (error) {
      console.error('Failed to delete hero content:', error);
      alert('Failed to delete hero content');
    }
  };

  const handleDeleteStat = async (id: string) => {
    if (!confirm('Are you sure you want to delete this stat?')) return;
    
    try {
      await fetch(`http://localhost:5000/api/stats/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchAllContent();
    } catch (error) {
      console.error('Failed to delete stat:', error);
      alert('Failed to delete stat');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats && [
          { icon: Users, label: 'Total Users', value: stats.totalUsers, color: 'bg-blue-500' },
          { icon: MessageSquare, label: 'Contacts', value: stats.totalContacts, color: 'bg-green-500' },
          { icon: Briefcase, label: 'Job Applications', value: stats.totalApplications, color: 'bg-purple-500' },
          { icon: Shield, label: 'Fraud Cases', value: stats.totalFraudCases, color: 'bg-red-500' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-xl`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Manage Services</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddService(true)}
          className="bg-red-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600 transition-colors inline-flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Service</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <motion.div
            key={service._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center`}>
                <span className="text-white text-xl">{service.icon}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingService(service)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteService(service._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-2">{service.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{service.description}</p>
            
            <div className="space-y-1">
              {service.features.slice(0, 3).map((feature, index) => (
                <div key={index} className="text-xs text-gray-500">• {feature}</div>
              ))}
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs ${service.active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {service.active ? 'Active' : 'Inactive'}
              </span>
              <span className="text-xs text-gray-500">Order: {service.order}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderHeroContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Manage Hero Content</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddHero(true)}
          className="bg-red-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600 transition-colors inline-flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Hero Content</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {heroContent.map((hero) => (
          <motion.div
            key={hero._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{hero.title}</h3>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs ${hero.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                  {hero.active ? 'Active' : 'Inactive'}
                </span>
                <button
                  onClick={() => setEditingHero(hero)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteHero(hero._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">{hero.subtitle}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Primary Button:</span>
                <p className="font-medium">{hero.primaryButtonText}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Secondary Button:</span>
                <p className="font-medium">{hero.secondaryButtonText}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Manage Statistics</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddStat(true)}
          className="bg-red-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600 transition-colors inline-flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Statistic</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => (
          <motion.div
            key={stat._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color.replace('text-', 'bg-').replace('-400', '-100')}`}>
                <span className={`${stat.color} text-lg`}>{stat.icon}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingStat(stat)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteStat(stat._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-gray-600 text-sm mb-2">{stat.label}</div>
            
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs ${stat.active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {stat.active ? 'Active' : 'Inactive'}
              </span>
              <span className="text-xs text-gray-500">Order: {stat.order}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderTestimonials = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Manage Testimonials</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddTestimonial(true)}
          className="bg-red-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600 transition-colors inline-flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Testimonial</span>
        </motion.button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-red-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading testimonials...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingTestimonial(testimonial)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteTestimonial(testimonial.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">"{testimonial.text}"</p>
              
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-gray-600 text-sm">{testimonial.role}</p>
                <p className="text-gray-500 text-xs">{testimonial.company}</p>
                <span className="inline-block mt-2 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
                  {testimonial.service}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Testimonial Modal */}
      {showAddTestimonial && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New Testimonial</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newTestimonial.name}
                  onChange={(e) => setNewTestimonial({...newTestimonial, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:border-red-400 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Role/Position"
                  value={newTestimonial.role}
                  onChange={(e) => setNewTestimonial({...newTestimonial, role: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:border-red-400 focus:outline-none"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Company"
                  value={newTestimonial.company}
                  onChange={(e) => setNewTestimonial({...newTestimonial, company: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:border-red-400 focus:outline-none"
                />
                <select
                  value={newTestimonial.service}
                  onChange={(e) => setNewTestimonial({...newTestimonial, service: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:border-red-400 focus:outline-none"
                >
                  <option value="Job Consultancy">Job Consultancy</option>
                  <option value="Fraud Assistance">Fraud Assistance</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Training">Training</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-600 text-sm mb-2">Rating</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setNewTestimonial({...newTestimonial, rating})}
                      className="focus:outline-none"
                    >
                      <Star
                        size={24}
                        className={`${
                          rating <= newTestimonial.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        } hover:text-yellow-400 transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <textarea
                placeholder="Testimonial text..."
                value={newTestimonial.text}
                onChange={(e) => setNewTestimonial({...newTestimonial, text: e.target.value})}
                rows={4}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:border-red-400 focus:outline-none resize-none"
              />
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setShowAddTestimonial(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTestimonial}
                className="bg-red-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                Add Testimonial
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Testimonial Modal */}
      {editingTestimonial && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Testimonial</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={editingTestimonial.name}
                  onChange={(e) => setEditingTestimonial({...editingTestimonial, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:border-red-400 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Role/Position"
                  value={editingTestimonial.role}
                  onChange={(e) => setEditingTestimonial({...editingTestimonial, role: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:border-red-400 focus:outline-none"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Company"
                  value={editingTestimonial.company}
                  onChange={(e) => setEditingTestimonial({...editingTestimonial, company: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:border-red-400 focus:outline-none"
                />
                <select
                  value={editingTestimonial.service}
                  onChange={(e) => setEditingTestimonial({...editingTestimonial, service: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:border-red-400 focus:outline-none"
                >
                  <option value="Job Consultancy">Job Consultancy</option>
                  <option value="Fraud Assistance">Fraud Assistance</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Training">Training</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-600 text-sm mb-2">Rating</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setEditingTestimonial({...editingTestimonial, rating})}
                      className="focus:outline-none"
                    >
                      <Star
                        size={24}
                        className={`${
                          rating <= editingTestimonial.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        } hover:text-yellow-400 transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <textarea
                placeholder="Testimonial text..."
                value={editingTestimonial.text}
                onChange={(e) => setEditingTestimonial({...editingTestimonial, text: e.target.value})}
                rows={4}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:border-red-400 focus:outline-none resize-none"
              />
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setEditingTestimonial(null)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditTestimonial}
                className="bg-red-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                Update Testimonial
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/company logo.png" 
              alt="Drave Capitals Logo" 
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                activeTab === 'services' 
                  ? 'bg-red-50 text-red-600 border border-red-200' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Settings size={20} />
              <span>Services</span>
            </button>
            <button
              onClick={() => setActiveTab('hero')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                activeTab === 'hero' 
                  ? 'bg-red-50 text-red-600 border border-red-200' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Globe size={20} />
              <span>Hero Content</span>
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                activeTab === 'stats' 
                  ? 'bg-red-50 text-red-600 border border-red-200' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BarChart3 size={20} />
              <span>Statistics</span>
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-6">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeTab === 'dashboard' 
                    ? 'bg-red-50 text-red-600 border border-red-200' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <TrendingUp size={20} />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('testimonials')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeTab === 'testimonials' 
                    ? 'bg-red-50 text-red-600 border border-red-200' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Star size={20} />
                <span>Testimonials</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'testimonials' && renderTestimonials()}
          {activeTab === 'services' && renderServices()}
          {activeTab === 'hero' && renderHeroContent()}
          {activeTab === 'stats' && renderStats()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;