import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Building, 
  Phone, 
  Plus, 
  Globe, 
  Calendar, 
  CheckCircle,
  Clock,
  ArrowLeft,
  Edit,
  Trash2,
  FileText,
  Moon,
  Sun,
  AlertCircle
} from 'lucide-react';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout, updateProfile, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showNewProject, setShowNewProject] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    companyName: '',
    phone: ''
  });
  const [newProject, setNewProject] = useState({
    websiteName: '',
    description: '',
    plan: 'starter'
  });

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    // Load user projects from localStorage
    const savedProjects = localStorage.getItem(`projects_${user.id}`);
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }

    // Initialize profile data
    setProfileData({
      name: user.name || '',
      email: user.email || '',
      companyName: user.companyName || '',
      phone: user.phone || ''
    });
  }, [user, navigate]);

  const saveProjects = (updatedProjects) => {
    setProjects(updatedProjects);
    localStorage.setItem(`projects_${user.id}`, JSON.stringify(updatedProjects));
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    
    const project = {
      id: Date.now().toString(),
      ...newProject,
      createdAt: new Date().toISOString(),
      status: 'pending',
      userId: user.id,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        companyName: user.companyName,
        phone: user.phone,
        companySize: user.companySize
      }
    };

    const updatedProjects = [...projects, project];
    saveProjects(updatedProjects);

    // In a real app, this would send an email via backend
    console.log('Email notification would be sent to siternos@outlook.com:', project);

    setNewProject({ websiteName: '', description: '', plan: 'starter' });
    setShowNewProject(false);
  };

  const handleDeleteProject = (projectId) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    saveProjects(updatedProjects);
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    updateProfile(profileData);
    setEditingProfile(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'in-progress': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in-progress': return <Globe className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50'
    }`}>
      {/* Navigation */}
      <nav className={`backdrop-blur-md border-b transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-black/20 border-white/10' 
          : 'bg-white/20 border-gray-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className={`transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className={`text-2xl font-bold bg-gradient-to-r ${
                theme === 'dark' 
                  ? 'from-blue-400 to-cyan-400' 
                  : 'from-blue-600 to-cyan-600'
              } bg-clip-text text-transparent`}>
                SITERNOS
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'text-gray-400 hover:text-white hover:bg-white/10' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Welcome, {user.name}
              </span>
              <button
                onClick={logout}
                className={`px-4 py-2 transition-colors ${
                  theme === 'dark' 
                    ? 'text-gray-300 hover:text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`backdrop-blur-sm rounded-2xl p-6 border transition-colors ${
                theme === 'dark' 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-white/30 border-gray-200/50'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Profile
                </h2>
                <button
                  onClick={() => setEditingProfile(!editingProfile)}
                  className={`transition-colors ${
                    theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                  }`}
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>

              {editingProfile ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <User className="w-4 h-4 inline mr-2" />
                      Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                        theme === 'dark' 
                          ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500' 
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                        theme === 'dark' 
                          ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500' 
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <Building className="w-4 h-4 inline mr-2" />
                      Company
                    </label>
                    <input
                      type="text"
                      value={profileData.companyName}
                      onChange={(e) => setProfileData({...profileData, companyName: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                        theme === 'dark' 
                          ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500' 
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                        theme === 'dark' 
                          ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500' 
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className={`flex-1 py-2 rounded-lg font-medium transition-all duration-300 ${
                        theme === 'dark' 
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg' 
                          : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg'
                      }`}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProfile(false)}
                      className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                        theme === 'dark' 
                          ? 'bg-gray-700 text-white hover:bg-gray-600' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className={`flex items-center ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <User className={`w-5 h-5 mr-3 ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    <span>{user.name}</span>
                  </div>
                  <div className={`flex items-center ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <Mail className={`w-5 h-5 mr-3 ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    <span className="break-all">{user.email}</span>
                  </div>
                  <div className={`flex items-center ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <Building className={`w-5 h-5 mr-3 ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    <span>{user.companyName}</span>
                  </div>
                  <div className={`flex items-center ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <Phone className={`w-5 h-5 mr-3 ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    <span>{user.phone}</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Projects Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`backdrop-blur-sm rounded-2xl p-6 border transition-colors ${
                theme === 'dark' 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-white/30 border-gray-200/50'
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  My Projects
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNewProject(true)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg' 
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  New Project
                </motion.button>
              </div>

              <AnimatePresence>
                {showNewProject && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`mb-6 p-4 rounded-xl border ${
                      theme === 'dark' 
                        ? 'bg-white/5 border-white/10' 
                        : 'bg-white/20 border-gray-200/50'
                    }`}
                  >
                    <h3 className={`text-lg font-semibold mb-4 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Create New Project
                    </h3>
                    <form onSubmit={handleCreateProject} className="space-y-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Website Name
                        </label>
                        <input
                          type="text"
                          value={newProject.websiteName}
                          onChange={(e) => setNewProject({...newProject, websiteName: e.target.value})}
                          required
                          className={`w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
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
                          Plan
                        </label>
                        <select
                          value={newProject.plan}
                          onChange={(e) => setNewProject({...newProject, plan: e.target.value})}
                          className={`w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                            theme === 'dark' 
                              ? 'bg-white/5 border-white/10 text-white focus:border-blue-500' 
                              : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                          }`}
                        >
                          <option value="starter" className={theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}>
                            Starter - €9
                          </option>
                          <option value="advanced" className={theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}>
                            Advanced - €19
                          </option>
                          <option value="advanced2" className={theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}>
                            Advanced 2 - €29
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Description
                        </label>
                        <textarea
                          value={newProject.description}
                          onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                          rows={3}
                          className={`w-full px-3 py-2 border rounded-lg transition-colors resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                            theme === 'dark' 
                              ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500' 
                              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                          }`}
                          placeholder="Describe your project requirements..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className={`flex-1 py-2 rounded-lg font-medium transition-all duration-300 ${
                            theme === 'dark' 
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg' 
                              : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg'
                          }`}
                        >
                          Create Project
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowNewProject(false)}
                          className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                            theme === 'dark' 
                              ? 'bg-gray-700 text-white hover:bg-gray-600' 
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {projects.length === 0 ? (
                <div className="text-center py-8">
                  <Globe className={`w-12 h-12 mx-auto mb-4 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <p className={`${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    No projects yet. Create your first project to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl border transition-colors ${
                        theme === 'dark' 
                          ? 'bg-white/5 border-white/10 hover:border-blue-500/30' 
                          : 'bg-white/20 border-gray-200/50 hover:border-blue-300/50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className={`text-lg font-semibold ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {project.websiteName}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(project.status)}`}>
                              {getStatusIcon(project.status)}
                              {project.status || 'pending'}
                            </span>
                          </div>
                          <p className={`mb-2 capitalize ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Plan: {project.plan?.replace('advanced2', 'Advanced 2') || 'N/A'}
                          </p>
                          {project.description && (
                            <p className={`text-sm mb-2 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {project.description}
                            </p>
                          )}
                          {project.adminNotes && (
                            <div className={`p-3 rounded-lg mb-3 border ${
                              theme === 'dark' 
                                ? 'bg-blue-500/10 border-blue-500/20' 
                                : 'bg-blue-50 border-blue-200'
                            }`}>
                              <p className={`text-sm ${
                                theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                              }`}>
                                <strong>Admin Notes:</strong> {project.adminNotes}
                              </p>
                            </div>
                          )}
                          <div className={`flex items-center text-xs ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                            <Calendar className="w-3 h-3 mr-1" />
                            Created {new Date(project.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className={`transition-colors p-2 ${
                            theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;