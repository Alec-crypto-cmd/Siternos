import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('siternos_user');
    const storedTheme = localStorage.getItem('siternos_theme');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (storedTheme) {
      setTheme(storedTheme);
    }
    
    // Initialize admin user if not exists
    initializeAdminUser();
    
    setLoading(false);
  }, []);

  const initializeAdminUser = () => {
    const adminUser = {
      id: 'admin-siternos',
      email: 'siternos@outlook.com',
      password: 'USBPort10duino',
      name: 'Siternos DE - EN',
      companyName: 'Siternos',
      phone: '+49 123 456 789',
      companySize: '1-10',
      isAdmin: true,
      createdAt: new Date().toISOString(),
    };
    
    // Check if admin already exists
    const existingAdmin = localStorage.getItem('admin_siternos@outlook.com');
    if (!existingAdmin) {
      localStorage.setItem('admin_siternos@outlook.com', JSON.stringify(adminUser));
    }
  };

  const login = (credentials) => {
    // Check admin credentials
    if (credentials.email === 'siternos@outlook.com' && credentials.password === 'USBPort10duino') {
      const adminUser = JSON.parse(localStorage.getItem('admin_siternos@outlook.com'));
      setUser(adminUser);
      localStorage.setItem('siternos_user', JSON.stringify(adminUser));
      return adminUser;
    }
    
    // Check regular user credentials
    const storedUser = localStorage.getItem(`user_${credentials.email}`);
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      localStorage.setItem('siternos_user', JSON.stringify(userData));
      return userData;
    }
    
    return null;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('siternos_user');
  };

  const register = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isAdmin: false,
    };
    
    setUser(newUser);
    localStorage.setItem('siternos_user', JSON.stringify(newUser));
    localStorage.setItem(`user_${userData.email}`, JSON.stringify(newUser));
    return newUser;
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('siternos_user', JSON.stringify(updatedUser));
    localStorage.setItem(`user_${updatedUser.email}`, JSON.stringify(updatedUser));
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('siternos_theme', newTheme);
  };

  const getAllUsers = () => {
    const users = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('user_') || key.startsWith('admin_')) {
        const userData = JSON.parse(localStorage.getItem(key));
        users.push(userData);
      }
    }
    return users;
  };

  const getAllProjects = () => {
    const projects = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('projects_')) {
        const userProjects = JSON.parse(localStorage.getItem(key));
        projects.push(...userProjects);
      }
    }
    return projects;
  };

  const updateProjectStatus = (projectId, status, notes) => {
    // Find and update project across all users
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('projects_')) {
        const userProjects = JSON.parse(localStorage.getItem(key));
        const projectIndex = userProjects.findIndex(p => p.id === projectId);
        if (projectIndex !== -1) {
          userProjects[projectIndex] = {
            ...userProjects[projectIndex],
            status,
            adminNotes: notes,
            lastUpdated: new Date().toISOString()
          };
          localStorage.setItem(key, JSON.stringify(userProjects));
          return true;
        }
      }
    }
    return false;
  };

  const value = {
    user,
    login,
    logout,
    register,
    updateProfile,
    loading,
    theme,
    toggleTheme,
    getAllUsers,
    getAllProjects,
    updateProjectStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;