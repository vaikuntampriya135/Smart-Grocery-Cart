import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(userData.role === 'admin');
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      if (email === 'admin@example.com' && password === 'admin123') {
        const adminUser: User = {
          id: 'admin-1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          profilePicture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
        };
        setUser(adminUser);
        setIsAuthenticated(true);
        setIsAdmin(true);
        localStorage.setItem('user', JSON.stringify(adminUser));
        return true;
      } else if (email === 'user@example.com' && password === 'password') {
        const regularUser: User = {
          id: '1',
          name: 'John Doe',
          email: 'user@example.com',
          role: 'user',
          profilePicture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
        };
        setUser(regularUser);
        setIsAuthenticated(true);
        setIsAdmin(false);
        localStorage.setItem('user', JSON.stringify(regularUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const userData: User = {
        id: Date.now().toString(),
        name,
        email,
        role: 'user'
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(false);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('user');
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false;
      
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated,
      isAdmin, 
      login, 
      register, 
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}