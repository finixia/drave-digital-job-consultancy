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
  Eye,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../utils/api';

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
  const [loading, setLoading] = useState(true);
  const [showAddTestimonial, setShowAddTestimonial] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    role: '',
    company: '',
    rating: 5,
    text: '',
    service: 'Job Consultancy'
  });

  useEffect(() => {
    fetchDashboardData();
    fetchTestimonials();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await apiService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/website-content');
      const data = await response.json();
      setTestimonials(data.testimonials || []);
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;