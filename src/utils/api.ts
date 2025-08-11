const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export interface JobApplicationData {
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  skills: string;
  resume?: File;
}

export interface FraudCaseData {
  name: string;
  email: string;
  phone: string;
  fraudType: string;
  description: string;
  amount?: number;
  evidence?: File[];
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface DetailedRegistrationData {
  // Basic Info
  name: string;
  email: string;
  password: string;
  phone: string;
  
  // Personal Details
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode?: string;
  
  // Professional Details
  currentPosition?: string;
  experience: string;
  skills: string;
  education: string;
  expectedSalary?: string;
  preferredLocation?: string;
  
  // Preferences
  jobType?: string;
  workMode?: string;
  interestedServices: string[];
  
  // Documents
  resume?: File;
}

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(data: LoginData) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return response;
  }

  async register(data: RegisterData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return response;
  }

  async registerWithDetails(formData: FormData) {
    const response = await fetch(`${API_BASE_URL}/auth/register-detailed`, {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData, let browser set it
        ...(localStorage.getItem('token') && {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        })
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    return data;
  }

  // Contact form
  async submitContact(data: ContactFormData) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Job applications
  async submitJobApplication(data: JobApplicationData) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    return this.request('/job-applications', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    });
  }

  // Fraud cases
  async submitFraudCase(data: FraudCaseData) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'evidence' && Array.isArray(value)) {
        value.forEach((file) => formData.append('evidence', file));
      } else if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    return this.request('/fraud-cases', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    });
  }

  async subscribeNewsletter(email: string) {
    return this.request('/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Admin endpoints
  async getContacts() {
    return this.request('/contacts');
  }

  async getJobApplications() {
    return this.request('/job-applications');
  }

  async getFraudCases() {
    return this.request('/fraud-cases');
  }

  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  // Website content management
  async updateWebsiteContent(section: string, data: any) {
    return this.request(`/website-content/${section}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteWebsiteContent(section: string, itemId: string | number) {
    return this.request(`/website-content/${section}/${itemId}`, {
      method: 'DELETE',
    });
  }

  async getWebsiteContent() {
    return this.request('/website-content');
  }

  // Services management
  async getServices() {
    return this.request('/services');
  }

  async createService(data: any) {
    return this.request('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateService(id: string, data: any) {
    return this.request(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteService(id: string) {
    return this.request(`/services/${id}`, {
      method: 'DELETE',
    });
  }

  // Hero content management
  async getHeroContent() {
    return this.request('/hero-content');
  }

  async createHeroContent(data: any) {
    return this.request('/hero-content', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateHeroContent(id: string, data: any) {
    return this.request(`/hero-content/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteHeroContent(id: string) {
    return this.request(`/hero-content/${id}`, {
      method: 'DELETE',
    });
  }

  // Stats management
  async getStats() {
    return this.request('/stats');
  }

  async createStat(data: any) {
    return this.request('/stats', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateStat(id: string, data: any) {
    return this.request(`/stats/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteStat(id: string) {
    return this.request(`/stats/${id}`, {
      method: 'DELETE',
    });
  }

  // About content management
  async getAboutContent() {
    return this.request('/about-content');
  }

  async createAboutContent(data: any) {
    return this.request('/about-content', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAboutContent(id: string, data: any) {
    return this.request(`/about-content/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAboutContent(id: string) {
    return this.request(`/about-content/${id}`, {
      method: 'DELETE',
    });
  }

  // User management
  async getUsers() {
    return this.request('/users');
  }

  async updateUserStatus(userId: string, status: string) {
    return this.request(`/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deleteUser(userId: string) {
    return this.request(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // Testimonial endpoints
  async getTestimonials() {
    try {
      return await this.request('/testimonials');
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
      // Return empty array as fallback
      return [];
    }
  }

  async getTestimonialsAdmin() {
    return this.request('/testimonials/admin');
  }

  async updateTestimonialStatus(testimonialId: string, approved: boolean, featured?: boolean) {
    return this.request(`/testimonials/${testimonialId}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ approved, featured }),
    });
  }

  async deleteTestimonial(testimonialId: string) {
    return this.request(`/testimonials/${testimonialId}`, {
      method: 'DELETE',
    });
  }

  // Contact status updates
  async updateContactStatus(contactId: string, status: string) {
    return this.request(`/contacts/${contactId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Job application status updates
  async updateJobApplicationStatus(applicationId: string, status: string) {
    return this.request(`/job-applications/${applicationId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Fraud case status updates
  async updateFraudCaseStatus(caseId: string, status: string) {
    return this.request(`/fraud-cases/${caseId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }
}

export const apiService = new ApiService();