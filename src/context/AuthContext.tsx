import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, bio: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setAuthState({ user, isAuthenticated: true });
    }
  }, []);

  const register = async (name: string, email: string, password: string, bio: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (users.find((u: User) => u.email === email)) {
        return false; // User already exists
      }

      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        bio,
        joinedAt: new Date().toISOString(),
      };

      users.push({ ...newUser, password });
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      setAuthState({ user: newUser, isAuthenticated: true });
      return true;
    } catch (error) {
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        setAuthState({ user: userWithoutPassword, isAuthenticated: true });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setAuthState({ user: null, isAuthenticated: false });
  };

  const updateProfile = (updatedUser: Partial<User>) => {
    if (authState.user) {
      const newUser = { ...authState.user, ...updatedUser };
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setAuthState({ user: newUser, isAuthenticated: true });
      
      // Update in users array
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((u: any) => 
        u.id === newUser.id ? { ...u, ...updatedUser } : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      register,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};