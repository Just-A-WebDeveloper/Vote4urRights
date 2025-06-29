
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'voter';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('vote4urRights_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Admin login check
    if (email === 'memanand97@gmail.com' && password === 'ikah') {
      const adminUser: User = {
        id: 'admin-1',
        email,
        name: 'Admin',
        role: 'admin'
      };
      setUser(adminUser);
      localStorage.setItem('vote4urRights_user', JSON.stringify(adminUser));
      setIsLoading(false);
      return true;
    }
    
    // Mock voter login - in real app, this would be Supabase auth
    const mockUsers = JSON.parse(localStorage.getItem('vote4urRights_voters') || '[]');
    const foundUser = mockUsers.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const voterUser: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: 'voter'
      };
      setUser(voterUser);
      localStorage.setItem('vote4urRights_user', JSON.stringify(voterUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock registration - in real app, this would be Supabase auth
    const mockUsers = JSON.parse(localStorage.getItem('vote4urRights_voters') || '[]');
    
    // Check if user already exists
    if (mockUsers.find((u: any) => u.email === email)) {
      setIsLoading(false);
      return false;
    }
    
    const newUser = {
      id: `voter-${Date.now()}`,
      email,
      password,
      name
    };
    
    mockUsers.push(newUser);
    localStorage.setItem('vote4urRights_voters', JSON.stringify(mockUsers));
    
    const voterUser: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: 'voter'
    };
    
    setUser(voterUser);
    localStorage.setItem('vote4urRights_user', JSON.stringify(voterUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vote4urRights_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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
