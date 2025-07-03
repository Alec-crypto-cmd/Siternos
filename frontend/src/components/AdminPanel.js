import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Globe, 
  Calendar, 
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  Search,
  Filter,
  Eye,
  Edit,
  Save,
  X,
  Moon,
  Sun,
  Settings,
  FileText,
  Mail,
  Building,
  Phone,
  Hash
} from 'lucide-react';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { user, logout, getAllUsers, getAllProjects, updateProjectStatus, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingProject, setEditingProject] = useState(null);
  const [editData, setEditData] = useState({ status: '', notes: '' });

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = () => {
    setUsers(getAllUsers());
    setProjects(getAllProjects());
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
      case 'cancelled': return <X className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.websiteName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getUserProjects = (userId) => {
    return projects.filter(project => project.user?.id === userId || project.userId === userId);
  };

  const handleStatusUpdate = async (projectId, newStatus, notes) => {
    const success = updateProjectStatus(projectId, newStatus, notes);
    if (success) {
      loadData();
      setEditingProject(null);
      setEditData({ status: '', notes: '' });
    }
  };

  const startEditing = (project) => {
    setEditingProject(project.id);
    setEditData({
      status: project.status || 'pending',
      notes: project.adminNotes || ''
    });
  };

  if (!user || !user.isAdmin) {
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
                SITERNOS ADMIN
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
                Admin: {user.name}
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
        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Users', value: users.length, icon: Users, color: 'blue' },
            { label: 'Total Projects', value: projects.length, icon: Globe, color: 'green' },
            { label: 'Pending', value: projects.filter(p => p.status === 'pending').length, icon: Clock, color: 'yellow' },
            { label: 'Completed', value: projects.filter(p => p.status === 'completed').length, icon: CheckCircle, color: 'green' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-2xl border transition-colors ${
                theme === 'dark' 
                  ? 'bg-white/5 backdrop-blur-sm border-white/10' 
                  : 'bg-white/80 backdrop-blur-sm border-gray-200/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${
                  stat.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                  stat.color === 'green' ? 'bg-green-500/10 text-green-400' :
                  'bg-yellow-500/10 text-yellow-400'
                }`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {[
            { id: 'users', label: 'Users', icon: Users },
            { id: 'projects', label: 'Projects', icon: Globe },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-white/10'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search users or projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-colors ${
                theme === 'dark' 
                  ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500' 
                  : 'bg-white/80 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
          </div>
          
          {activeTab === 'projects' && (
            <div className="relative">
              <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`pl-10 pr-8 py-3 rounded-xl border transition-colors ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10 text-white focus:border-blue-500' 
                    : 'bg-white/80 border-gray-200 text-gray-900 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          )}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`rounded-2xl border transition-colors ${
                theme === 'dark' 
                  ? 'bg-white/5 backdrop-blur-sm border-white/10' 
                  : 'bg-white/80 backdrop-blur-sm border-gray-200/50'
              }`}
            >
              <div className="p-6">
                <h2 className={`text-2xl font-bold mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Users Management
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b ${
                        theme === 'dark' ? 'border-white/10' : 'border-gray-200'
                      }`}>
                        <th className={`text-left py-3 px-4 font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>User</th>
                        <th className={`text-left py-3 px-4 font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>Company</th>
                        <th className={`text-left py-3 px-4 font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>Projects</th>
                        <th className={`text-left py-3 px-4 font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>Joined</th>
                        <th className={`text-left py-3 px-4 font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user, index) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`border-b transition-colors ${
                            theme === 'dark' 
                              ? 'border-white/5 hover:bg-white/5' 
                              : 'border-gray-100 hover:bg-gray-50'
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                user.isAdmin 
                                  ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                                  : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                              }`}>
                                <span className="text-white font-medium">
                                  {user.name?.charAt(0) || '?'}
                                </span>
                              </div>
                              <div>
                                <p className={`font-medium ${
                                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {user.name} {user.isAdmin && '(Admin)'}
                                </p>
                                <p className={`text-sm ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className={`py-3 px-4 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {user.companyName}
                          </td>
                          <td className={`py-3 px-4 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {getUserProjects(user.id).length}
                          </td>
                          <td className={`py-3 px-4 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className={`p-2 rounded-lg transition-colors ${
                                theme === 'dark' 
                                  ? 'text-blue-400 hover:bg-blue-400/10' 
                                  : 'text-blue-600 hover:bg-blue-50'
                              }`}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`rounded-2xl border transition-colors ${
                theme === 'dark' 
                  ? 'bg-white/5 backdrop-blur-sm border-white/10' 
                  : 'bg-white/80 backdrop-blur-sm border-gray-200/50'
              }`}
            >
              <div className="p-6">
                <h2 className={`text-2xl font-bold mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Projects Management
                </h2>
                
                <div className="space-y-4">
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-xl border transition-colors ${
                        theme === 'dark' 
                          ? 'bg-white/5 border-white/10 hover:border-blue-500/30' 
                          : 'bg-white/80 border-gray-200 hover:border-blue-300'
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
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div className={`text-sm ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              <p><strong>Client:</strong> {project.user?.name}</p>
                              <p><strong>Email:</strong> {project.user?.email}</p>
                              <p><strong>Company:</strong> {project.user?.companyName}</p>
                            </div>
                            <div className={`text-sm ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              <p><strong>Plan:</strong> {project.plan?.replace('advanced2', 'Advanced 2') || 'N/A'}</p>
                              <p><strong>Created:</strong> {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}</p>
                              {project.lastUpdated && (
                                <p><strong>Updated:</strong> {new Date(project.lastUpdated).toLocaleDateString()}</p>
                              )}
                            </div>
                          </div>
                          
                          {project.description && (
                            <p className={`text-sm mb-3 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              <strong>Description:</strong> {project.description}
                            </p>
                          )}
                          
                          {project.adminNotes && (
                            <div className={`p-3 rounded-lg mb-3 ${
                              theme === 'dark' ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
                            }`}>
                              <p className={`text-sm ${
                                theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                              }`}>
                                <strong>Admin Notes:</strong> {project.adminNotes}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditing(project)}
                            className={`p-2 rounded-lg transition-colors ${
                              theme === 'dark' 
                                ? 'text-blue-400 hover:bg-blue-400/10' 
                                : 'text-blue-600 hover:bg-blue-50'
                            }`}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {editingProject === project.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-white/10"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className={`block text-sm font-medium mb-2 ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                Status
                              </label>
                              <select
                                value={editData.status}
                                onChange={(e) => setEditData({...editData, status: e.target.value})}
                                className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                                  theme === 'dark' 
                                    ? 'bg-white/5 border-white/10 text-white focus:border-blue-500' 
                                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                              >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                            <div>
                              <label className={`block text-sm font-medium mb-2 ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                Notes for Client
                              </label>
                              <textarea
                                value={editData.notes}
                                onChange={(e) => setEditData({...editData, notes: e.target.value})}
                                rows={3}
                                className={`w-full px-3 py-2 rounded-lg border transition-colors resize-none ${
                                  theme === 'dark' 
                                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500' 
                                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                                placeholder="Add notes that the client will see..."
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => handleStatusUpdate(project.id, editData.status, editData.notes)}
                              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                            >
                              <Save className="w-4 h-4" />
                              Save Changes
                            </button>
                            <button
                              onClick={() => setEditingProject(null)}
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                theme === 'dark' 
                                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              Cancel
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
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
              className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6 transition-colors ${
                theme === 'dark' 
                  ? 'bg-slate-900 border border-white/10' 
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  User Details
                </h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className={`transition-colors ${
                    theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`p-4 rounded-xl border ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Profile Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className={`w-4 h-4 ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                      }`} />
                      <span className={`${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {selectedUser.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className={`w-4 h-4 ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                      }`} />
                      <span className={`${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {selectedUser.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building className={`w-4 h-4 ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                      }`} />
                      <span className={`${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {selectedUser.companyName}
                      </span>
                    </div>
                    {selectedUser.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className={`w-4 h-4 ${
                          theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                        <span className={`${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {selectedUser.phone}
                        </span>
                      </div>
                    )}
                    {selectedUser.companySize && (
                      <div className="flex items-center gap-3">
                        <Hash className={`w-4 h-4 ${
                          theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                        <span className={`${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {selectedUser.companySize} employees
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Projects ({getUserProjects(selectedUser.id).length})
                  </h3>
                  <div className="space-y-3">
                    {getUserProjects(selectedUser.id).map((project) => (
                      <div
                        key={project.id}
                        className={`p-3 rounded-lg border ${
                          theme === 'dark' 
                            ? 'bg-white/5 border-white/10' 
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className={`font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {project.websiteName}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(project.status)}`}>
                            {getStatusIcon(project.status)}
                            {project.status || 'pending'}
                          </span>
                        </div>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Plan: {project.plan?.replace('advanced2', 'Advanced 2') || 'N/A'}
                        </p>
                        {project.adminNotes && (
                          <p className={`text-sm mt-2 ${
                            theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                          }`}>
                            <strong>Notes:</strong> {project.adminNotes}
                          </p>
                        )}
                      </div>
                    ))}
                    {getUserProjects(selectedUser.id).length === 0 && (
                      <p className={`text-center py-4 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        No projects yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;