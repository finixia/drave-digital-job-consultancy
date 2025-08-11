const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow specific file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'https://dravedigitals.in'],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log("MONGODB_URI:", process.env.MONGODB_URI);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/careerguard')
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// MongoDB connection event handlers
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  
  // Personal Details
  phone: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other', 'prefer-not-to-say'] },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  
  // Professional Details
  currentPosition: { type: String },
  experience: { type: String },
  skills: { type: String },
  education: { type: String },
  expectedSalary: { type: String },
  preferredLocation: { type: String },
  
  // Preferences
  jobType: { type: String },
  workMode: { type: String },
  interestedServices: [{ type: String }],
  
  // Documents
  resume: { type: String }, // File path
  
  // Profile completion
  profileCompleted: { type: Boolean, default: false },
  
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Create default admin user if it doesn't exist
const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@careerguard.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new User({
        name: 'Admin',
        email: 'admin@careerguard.com',
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('Default admin user created');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, required: true },
  message: { type: String, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['pending', 'contacted', 'resolved'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Job Application Schema
const jobApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  position: { type: String, required: true },
  experience: { type: String, required: true },
  skills: { type: String, required: true },
  expectedSalary: { type: String },
  location: { type: String },
  resume: { type: String }, // File path
  status: { type: String, enum: ['applied', 'screening', 'interview', 'placed', 'rejected'], default: 'applied' },
  createdAt: { type: Date, default: Date.now }
});

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

// Fraud Case Schema
const fraudCaseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  fraudType: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number },
  dateOfIncident: { type: Date },
  policeComplaint: { type: Boolean, default: false },
  evidence: [{ type: String }], // File paths
  status: { type: String, enum: ['reported', 'investigating', 'resolved', 'closed'], default: 'reported' },
  createdAt: { type: Date, default: Date.now }
});

const FraudCase = mongoose.model('FraudCase', fraudCaseSchema);

// Newsletter Schema
const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribed: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

// Website Content Schema
const websiteContentSchema = new mongoose.Schema({
  section: { type: String, required: true, unique: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  lastUpdated: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const WebsiteContent = mongoose.model('WebsiteContent', websiteContentSchema);

// Testimonial Schema
const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  avatar: { type: String, default: '👤' },
  service: { type: String, required: true },
  featured: { type: Boolean, default: false },
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

// Create default testimonials
const createDefaultTestimonials = async () => {
  try {
    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      const defaultTestimonials = [
        {
          name: 'Priya Sharma',
          role: 'Software Engineer',
          company: 'Tech Solutions Inc.',
          rating: 5,
          text: 'CareerGuard helped me land my dream job in just 2 weeks! Their resume building and interview preparation services are exceptional.',
          avatar: '👩‍💻',
          service: 'Job Consultancy',
          featured: true,
          approved: true
        },
        {
          name: 'Rajesh Kumar',
          role: 'Business Owner',
          company: 'Kumar Enterprises',
          rating: 5,
          text: 'When I faced cyber fraud, CareerGuard guided me through the entire process. They helped me file the FIR and recover my money.',
          avatar: '👨‍💼',
          service: 'Fraud Assistance',
          featured: true,
          approved: true
        },
        {
          name: 'Anita Patel',
          role: 'Digital Marketer',
          company: 'Creative Agency',
          rating: 5,
          text: 'The digital marketing training program transformed my career. Now I run successful campaigns for multiple clients.',
          avatar: '👩‍🎨',
          service: 'Training',
          featured: true,
          approved: true
        },
        {
          name: 'Vikram Singh',
          role: 'Startup Founder',
          company: 'InnovateTech',
          rating: 5,
          text: 'Their web development team created an amazing e-commerce platform for my business. Professional and timely delivery!',
          avatar: '👨‍💻',
          service: 'Development',
          featured: true,
          approved: true
        },
        {
          name: 'Meera Joshi',
          role: 'HR Manager',
          company: 'Global Corp',
          rating: 5,
          text: 'CareerGuard provided excellent candidates for our IT positions. Their screening process is thorough and reliable.',
          avatar: '👩‍💼',
          service: 'Recruitment',
          featured: true,
          approved: true
        },
        {
          name: 'Arjun Reddy',
          role: 'Freelancer',
          company: 'Independent',
          rating: 5,
          text: 'The freelancing skills program helped me build a successful remote career. Earning 6 figures now working from home!',
          avatar: '👨‍🎯',
          service: 'Training',
          featured: true,
          approved: true
        }
      ];
      
      await Testimonial.insertMany(defaultTestimonials);
      console.log('Default testimonials created');
    }
  } catch (error) {
    console.error('Error creating default testimonials:', error);
  }
};

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Middleware for admin authentication
const authenticateAdmin = (req, res, next) => {
  authenticateToken(req, res, (err) => {
    if (err) return next(err);
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  });
};

// Routes

// File serving route
app.get('/api/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }
  
  // Set appropriate headers
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif'
  };
  
  const mimeType = mimeTypes[ext] || 'application/octet-stream';
  res.setHeader('Content-Type', mimeType);
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
  
  // Send file
  res.sendFile(filePath);
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/register-detailed', upload.single('resume'), async (req, res) => {
  try {
    const {
      name, email, password, phone, dateOfBirth, gender, address, city, state, pincode,
      currentPosition, experience, skills, education, expectedSalary, preferredLocation,
      jobType, workMode, interestedServices
    } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Parse interested services if it's a string
    let parsedServices = [];
    if (interestedServices) {
      try {
        parsedServices = typeof interestedServices === 'string' 
          ? JSON.parse(interestedServices) 
          : interestedServices;
      } catch (error) {
        parsedServices = [];
      }
    }

    // Create user with detailed information
    const userData = {
      name,
      email,
      password: hashedPassword,
      phone,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      gender,
      address,
      city,
      state,
      pincode,
      currentPosition,
      experience,
      skills,
      education,
      expectedSalary,
      preferredLocation,
      jobType,
      workMode,
      interestedServices: parsedServices,
      profileCompleted: true
    };

    // Add resume path if uploaded
    if (req.file) {
      userData.resume = req.file.path;
    }

    const user = new User(userData);
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileCompleted: user.profileCompleted
      }
    });
  } catch (error) {
    console.error('Detailed registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Contact Routes
app.post('/api/contact', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    
    // Send email notification (configure nodemailer)
    // ... email sending logic
    
    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/contacts', authenticateAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Job Application Routes
app.post('/api/job-applications', upload.single('resume'), async (req, res) => {
  try {
    const applicationData = { ...req.body };
    if (req.file) {
      applicationData.resume = req.file.path;
    }
    const application = new JobApplication(applicationData);
    await application.save();
    res.status(201).json({ message: 'Job application submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/job-applications', authenticateAdmin, async (req, res) => {
  try {
    const applications = await JobApplication.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Fraud Case Routes
app.post('/api/fraud-cases', upload.array('evidence', 5), async (req, res) => {
  try {
    const fraudData = { ...req.body };
    if (req.files && req.files.length > 0) {
      fraudData.evidence = req.files.map(file => file.path);
    }
    const fraudCase = new FraudCase(fraudData);
    await fraudCase.save();
    res.status(201).json({ message: 'Fraud case reported successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/fraud-cases', authenticateAdmin, async (req, res) => {
  try {
    const cases = await FraudCase.find().sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Newsletter Routes
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    const existingSubscription = await Newsletter.findOne({ email });
    
    if (existingSubscription) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }
    
    const newsletter = new Newsletter({ email });
    await newsletter.save();
    res.status(201).json({ message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Testimonial Routes
app.get('/api/testimonials', async (req, res) => {
  try {
    console.log('Fetching testimonials from database...');
    // Get all approved testimonials from the database
    const testimonials = await Testimonial.find({ approved: true }).sort({ createdAt: -1 });
    console.log('Found testimonials:', testimonials.length);
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/testimonials/admin', authenticateAdmin, async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching admin testimonials:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/testimonials', authenticateAdmin, async (req, res) => {
  try {
    const testimonial = new Testimonial({
      ...req.body,
      approved: true // Admin-created testimonials are automatically approved
    });
    await testimonial.save();
    res.status(201).json({ message: 'Testimonial created successfully' });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/testimonials/:id/approve', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { approved, featured } = req.body;
    
    const updateData = {};
    if (typeof approved === 'boolean') updateData.approved = approved;
    if (typeof featured === 'boolean') updateData.featured = featured;
    
    await Testimonial.findByIdAndUpdate(id, updateData);
    res.json({ message: 'Testimonial updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/testimonials/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await Testimonial.findByIdAndDelete(id);
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Dashboard Stats
app.get('/api/dashboard/stats', authenticateAdmin, async (req, res) => {
  try {
    const totalContacts = await Contact.countDocuments();
    const totalApplications = await JobApplication.countDocuments();
    const totalFraudCases = await FraudCase.countDocuments();
    const placedJobs = await JobApplication.countDocuments({ status: 'placed' });
    const resolvedFraudCases = await FraudCase.countDocuments({ status: 'resolved' });
    const totalUsers = await User.countDocuments();
    const newsletterSubscribers = await Newsletter.countDocuments();
    const totalTestimonials = await Testimonial.countDocuments({ approved: true });

    res.json({
      totalContacts,
      totalApplications,
      totalFraudCases,
      placedJobs,
      resolvedFraudCases,
      totalUsers,
      newsletterSubscribers,
      totalTestimonials,
      successRate: totalApplications > 0 ? Math.round((placedJobs / totalApplications) * 100) : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Website Content Management Routes
app.get('/api/website-content', async (req, res) => {
  try {
    console.log('Fetching website content...');
    const content = await WebsiteContent.find();
    console.log('Found website content documents:', content.length);
    const contentObj = {};
    content.forEach(item => {
      console.log('Processing section:', item.section);
      contentObj[item.section] = item.content;
    });
    console.log('Returning content object:', Object.keys(contentObj));
    res.json(contentObj);
  } catch (error) {
    console.error('Error fetching website content:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/website-content/:section', authenticateAdmin, async (req, res) => {
  try {
    const { section } = req.params;
    const content = req.body;
    
    await WebsiteContent.findOneAndUpdate(
      { section },
      { 
        content, 
        lastUpdated: new Date(),
        updatedBy: req.user.userId 
      },
      { upsert: true, new: true }
    );
    
    res.json({ message: 'Content updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/website-content/:section/:itemId', authenticateAdmin, async (req, res) => {
  try {
    const { section, itemId } = req.params;
    
    const websiteContent = await WebsiteContent.findOne({ section });
    if (!websiteContent) {
      return res.status(404).json({ message: 'Content section not found' });
    }
    
    if (Array.isArray(websiteContent.content)) {
      websiteContent.content = websiteContent.content.filter(
        item => item.id.toString() !== itemId
      );
      await websiteContent.save();
    }
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Status update routes
app.put('/api/contacts/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await Contact.findByIdAndUpdate(id, { status });
    res.json({ message: 'Contact status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/job-applications/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await JobApplication.findByIdAndUpdate(id, { status });
    res.json({ message: 'Job application status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/fraud-cases/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await FraudCase.findByIdAndUpdate(id, { status });
    res.json({ message: 'Fraud case status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// User management routes
app.get('/api/users', authenticateAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/users/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MongoDB URI: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/careerguard'}`);
  
  // Wait for MongoDB connection before creating default data
  mongoose.connection.once('open', async () => {
    console.log('MongoDB connection established');
    await createDefaultAdmin();
    await createDefaultTestimonials();
    // await createDefaultContent();
    console.log('Server initialization complete');
  });
  
  // Handle connection errors gracefully
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });
});