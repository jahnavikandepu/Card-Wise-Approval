import React, { createContext, useState, useEffect } from 'react';
import { mockUser } from '../data/mockData';
import { loginUser as apiLogin, registerUser as apiRegister } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if session exists in localStorage
    const savedUser = localStorage.getItem('cardwise_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed?.name === 'Jahnavi K' || parsed?.email?.includes('jahnavi')) {
          localStorage.removeItem('cardwise_user');
          setUser(null);
        } else {
          setUser(parsed);
        }
      } catch (e) {
        console.error('Failed to parse user session', e);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await apiLogin(credentials);
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await apiRegister(userData);
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      return { success: false, error: error.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('cardwise_user');
    localStorage.removeItem('cardwise_auth_token');
    setUser(null);
  };

  const updateProfile = (updatedData) => {
    const newUser = {
      ...user,
      ...updatedData,
      profile: {
        ...(user?.profile || {}),
        ...(updatedData.profile || {})
      }
    };
    setUser(newUser);
    localStorage.setItem('cardwise_user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
