import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.js';
import { authApi } from '../services/api.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('animedrama_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('animedrama_token');
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Re-validate user token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('animedrama_token');
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          setUser(res.data.user);
          localStorage.setItem('animedrama_user', JSON.stringify(res.data.user));
        } catch (error) {
          // Token is invalid or expired
          logout();
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (data: any) => {
    const res = await authApi.login(data);
    const { token: receivedToken, user: receivedUser } = res.data;
    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('animedrama_token', receivedToken);
    localStorage.setItem('animedrama_user', JSON.stringify(receivedUser));
  };

  const register = async (data: any) => {
    const res = await authApi.register(data);
    const { token: receivedToken, user: receivedUser } = res.data;
    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('animedrama_token', receivedToken);
    localStorage.setItem('animedrama_user', JSON.stringify(receivedUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('animedrama_token');
    localStorage.removeItem('animedrama_user');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('animedrama_user', JSON.stringify(updatedUser));
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = !!user && user.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

