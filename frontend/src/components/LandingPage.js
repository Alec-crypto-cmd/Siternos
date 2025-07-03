import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Globe, 
  Zap, 
  Shield, 
  Users,
  ChevronDown,
  X,
  User,
  Mail,
  Building,
  Phone,
  Hash,
  FileText,
  Moon,
  Sun,
  Settings
} from 'lucide-react';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const { user, login, register, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  
  const yTransform = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    companyName: '',
    phone: '',
    companySize: '',
    websiteName: '',
    other: ''
  });

  const pricingPlans = [
    {
      name: 'Starter',
      price: '9',
      features: [
        'Responsive Design',
        'Basic SEO Setup',
        'Contact Form',
        '3 Pages',
        'Mobile Optimized',
        '1 Month Support'
      ],
      popular: false,
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      name: 'Advanced',
      price: '19',
      features: [
        'Everything in Starter',
        'Custom Animations',
        'Advanced SEO',
        'Up to 7 Pages',
        'E-commerce Ready',
        '3 Months Support',
        'Analytics Setup'
      ],
      popular: true,
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      name: 'Advanced 2',
      price: '29',
      features: [
        'Everything in Advanced',
        'Custom Functionality',
        'API Integrations',
        'Unlimited Pages',
        'Performance Optimization',
        '6 Months Support',
        'Priority Updates',
        'Consultation Calls'
      ],
      popular: false,
      gradient: 'from-indigo-500 to-purple-600'
    }
  ];

  const faqs = [
    {
      question: 'What is included in the website development?',
      answer: 'All our packages include responsive design, SEO optimization, mobile compatibility, and ongoing support based on your selected plan.'
    },
    {
      question: 'How long does it take to build a website?',
      answer: 'Typically 1-2 weeks for Starter, 2-3 weeks for Advanced, and 3-4 weeks for Advanced 2, depending on complexity and requirements.'
    },
    {
      question: 'Do you provide ongoing support?',
      answer: 'Yes! Each plan includes different levels of support ranging from 1 month to 6 months, with priority support for higher-tier plans.'
    },
    {
      question: 'Can I upgrade my plan later?',
      answer: 'Absolutely! You can upgrade your plan at any time, and we\'ll apply the difference in cost to add more features to your website.'
    }
  ];

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    if (user) {
      if (user.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setShowModal(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let userData;
      if (isLogin) {
        userData = login(loginData);
        if (!userData) {
          alert('Invalid credentials. Please try again.');
          return;
        }
      } else {
        userData = register(formData);
      }

      setShowModal(false);
      
      // Redirect based on user type
      if (userData.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    if (isLogin) {
      setLoginData({
        ...loginData,
        [e.target.name]: e.target.value
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  useEffect(() => {
    // Check if user is logged in and redirect appropriately
    if (user) {
      if (user.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50'
    }`}>
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-md border-b transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-black/20 border-white/10' 
          : 'bg-white/20 border-gray-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-2xl font-bold bg-gradient-to-r ${
                theme === 'dark' 
                  ? 'from-blue-400 to-cyan-400' 
                  : 'from-blue-600 to-cyan-600'
              } bg-clip-text text-transparent`}
            >
              SITERNOS
            </motion.div>
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'text-gray-400 hover:text-white hover:bg-white/10' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>
              {user ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(user.isAdmin ? '/admin' : '/dashboard')}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg' 
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg'
                  }`}
                >
                  {user.isAdmin ? 'Admin Panel' : 'Dashboard'}
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(true)}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg' 
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg'
                  }`}
                >
                  Get Started
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ y: yTransform, opacity: opacityTransform }}
          className="absolute inset-0 z-0"
        >
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(${
                theme === 'dark' 
                  ? 'rgba(0,0,0,0.4), rgba(0,0,0,0.6)' 
                  : 'rgba(255,255,255,0.2), rgba(255,255,255,0.4)'
              }), url('https://images.unsplash.com/photo-1498050108023-c5249f4df085')`
            }}
          />
        </motion.div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`text-5xl md:text-7xl font-bold mb-6 leading-tight ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            Premium Websites for
            <span className={`bg-gradient-to-r ${
              theme === 'dark' 
                ? 'from-blue-400 via-cyan-400 to-blue-400' 
                : 'from-blue-600 via-cyan-600 to-blue-600'
            } bg-clip-text text-transparent block`}>
              Modern Businesses
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Creating stunning, high-performance websites for Otter Company, Perplex, and forward-thinking businesses worldwide.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
              className={`px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center gap-2 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-2xl' 
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-2xl'
              }`}
            >
              View Pricing <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-4 border-2 rounded-full font-semibold text-lg transition-all duration-300 ${
                theme === 'dark' 
                  ? 'border-white/30 text-white hover:bg-white/10' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              See Our Work
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 backdrop-blur-sm ${
        theme === 'dark' ? 'bg-black/20' : 'bg-white/20'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Why Choose SITERNOS?
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              We combine cutting-edge technology with premium design to deliver websites that convert visitors into customers.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Globe className="w-8 h-8" />,
                title: 'Modern Design',
                description: 'Beautiful, responsive designs that work perfectly on all devices and browsers.',
                image: 'https://images.unsplash.com/photo-1678690832311-bb6e361989ca'
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Lightning Fast',
                description: 'Optimized for speed and performance with advanced caching and compression.',
                image: 'https://images.pexels.com/photos/1181335/pexels-photo-1181335.jpeg'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Secure & Reliable',
                description: 'Built with security best practices and reliable hosting infrastructure.',
                image: 'https://images.unsplash.com/photo-1519558260268-cde7e03a0152'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className={`group relative backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10 hover:border-blue-500/50' 
                    : 'bg-white/30 border-gray-200/50 hover:border-blue-300/50'
                }`}
              >
                <div 
                  className="absolute inset-0 rounded-2xl opacity-20 bg-cover bg-center"
                  style={{ backgroundImage: `url('${feature.image}')` }}
                />
                <div className="relative z-10">
                  <div className={`mb-4 group-hover:scale-110 transition-transform duration-300 ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    {feature.icon}
                  </div>
                  <h3 className={`text-2xl font-semibold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Choose Your Perfect Plan
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Transparent pricing with no hidden fees. Start building your dream website today.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: plan.popular ? 1.05 : 1.02 }}
                className={`relative backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300 ${
                  plan.popular 
                    ? theme === 'dark'
                      ? 'border-blue-500 shadow-2xl shadow-blue-500/20 bg-white/10'
                      : 'border-blue-400 shadow-2xl shadow-blue-400/20 bg-white/40'
                    : theme === 'dark'
                      ? 'border-white/10 hover:border-blue-500/50 bg-white/5'
                      : 'border-gray-200/50 hover:border-blue-300/50 bg-white/30'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      theme === 'dark' 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' 
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                    }`}>
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${plan.gradient} flex items-center justify-center mb-6`}>
                  <Users className="w-8 h-8 text-white" />
                </div>
                
                <h3 className={`text-2xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    €{plan.price}
                  </span>
                  <span className={`${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    /project
                  </span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className={`flex items-center ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? theme === 'dark'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg'
                      : theme === 'dark'
                        ? 'bg-white/10 text-white hover:bg-white/20'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={`py-20 backdrop-blur-sm ${
        theme === 'dark' ? 'bg-black/20' : 'bg-white/20'
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`backdrop-blur-sm rounded-xl border ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10' 
                    : 'bg-white/30 border-gray-200/50'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className={`w-full text-left p-6 flex justify-between items-center transition-colors duration-200 ${
                    theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-white/20'
                  }`}
                >
                  <span className={`text-lg font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${
                    openFaq === index ? 'rotate-180' : ''
                  } ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6"
                    >
                      <p className={`${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 border-t ${
        theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className={`text-3xl font-bold mb-4 bg-gradient-to-r ${
              theme === 'dark' 
                ? 'from-blue-400 to-cyan-400' 
                : 'from-blue-600 to-cyan-600'
            } bg-clip-text text-transparent`}>
              SITERNOS
            </div>
            <p className={`mb-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Creating exceptional websites for modern businesses.
            </p>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            }`}>
              © 2025 Siternos. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`rounded-2xl p-8 max-w-md w-full border ${
                theme === 'dark' 
                  ? 'bg-slate-900 border-white/10' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className={`transition-colors ${
                    theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={isLogin ? loginData.email : formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 border rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                      theme === 'dark' 
                        ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500' 
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                    }`}
                    placeholder="your@email.com"
                  />
                </div>

                {isLogin ? (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={loginData.password}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                        theme === 'dark' 
                          ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500' 
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                      }`}
                      placeholder="Password"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 border rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                          theme === 'dark' 
                            ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500' 
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                        }`}
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <Building className="w-4 h-4 inline mr-2" />
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 border rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                          theme === 'dark' 
                            ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500' 
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                        }`}
                        placeholder="Your Company"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 border rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                          theme === 'dark' 
                            ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500' 
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                        }`}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <Hash className="w-4 h-4 inline mr-2" />
                        Company Size
                      </label>
                      <select
                        name="companySize"
                        value={formData.companySize}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 border rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                          theme === 'dark' 
                            ? 'bg-white/5 border-white/10 text-white focus:border-blue-500' 
                            : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                        }`}
                      >
                        <option value="" className={theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}>
                          Select company size
                        </option>
                        <option value="1-10" className={theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}>
                          1-10 employees
                        </option>
                        <option value="11-50" className={theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}>
                          11-50 employees
                        </option>
                        <option value="51-200" className={theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}>
                          51-200 employees
                        </option>
                        <option value="200+" className={theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}>
                          200+ employees
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <Globe className="w-4 h-4 inline mr-2" />
                        Website Name
                      </label>
                      <input
                        type="text"
                        name="websiteName"
                        value={formData.websiteName}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 border rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                          theme === 'dark' 
                            ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500' 
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                        }`}
                        placeholder="mycompany.com"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <FileText className="w-4 h-4 inline mr-2" />
                        Additional Details
                      </label>
                      <textarea
                        name="other"
                        value={formData.other}
                        onChange={handleInputChange}
                        rows={3}
                        className={`w-full px-4 py-3 border rounded-xl transition-colors resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                          theme === 'dark' 
                            ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500' 
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                        }`}
                        placeholder="Any specific requirements or features..."
                      />
                    </div>
                  </>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg' 
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg'
                  }`}
                >
                  {isLogin ? 'Sign In' : 'Create Account & Continue'}
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className={`transition-colors ${
                    theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                  }`}
                >
                  {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;