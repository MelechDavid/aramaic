import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('token');
    // Basic token validation - check if it looks like a JWT
    if (storedToken && storedToken.split('.').length === 3) {
      return storedToken;
    } else if (storedToken) {
      // Remove invalid token
      localStorage.removeItem('token');
      console.log('🧹 Removed invalid token from localStorage');
    }
    return null;
  });

  // Set up axios interceptors
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);  // Verify token on app load
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {        try {
          // Verify the token is valid by making a request to the backend
          console.log('🔐 Verifying stored token...');
          const response = await axios.post(API_ENDPOINTS.AUTH.VERIFY, {}, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.data && response.data.user) {
            setUser(response.data.user);
            console.log('✅ Token verified, user set:', response.data.user);
          } else {
            // Invalid token response
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            console.log('❌ Token verification failed - invalid response');
          }
        } catch (error) {
          console.log('❌ Token verification failed:', error.response?.status, error.response?.data?.message);
          // Token is invalid, remove it
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);  const login = async (email, password) => {
    try {
      console.log('🔐 Starting login process...');
      console.log('📍 Login URL:', API_ENDPOINTS.AUTH.LOGIN);
      console.log('📧 Email:', email);
      
      const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      console.log('✅ Login response:', response.data);
      
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      
      console.log('✅ Login successful, user set:', user);
      return { success: true, user };
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      console.log('Attempting registration to:', API_ENDPOINTS.AUTH.REGISTER);
      const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER, {
        username,
        email,
        password,
      });

      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      
      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };
  const value = {
    user,
    token,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
