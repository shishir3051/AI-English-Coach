import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// Helper: set or remove the Authorization header globally
const setAxiosToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore token from localStorage and set header immediately
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setLoading(false);
      return;
    }

    // Attach token to all future Axios requests right away
    setAxiosToken(storedToken);

    // Verify it's still valid by fetching user profile
    axios.get('/api/auth/me')
      .then(res => setUser(res.data))
      .catch(() => {
        // Token expired or invalid — clear it
        localStorage.removeItem('token');
        setAxiosToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Auto-logout on 401 responses from any API call
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Only auto-logout if we actually had a user session
          const storedToken = localStorage.getItem('token');
          if (storedToken) {
            logout();
          }
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    const { token, _id, name, role } = res.data;

    // Set header BEFORE updating state so any immediate re-renders get the token
    localStorage.setItem('token', token);
    setAxiosToken(token);

    setUser({ _id, name, email, role });
  };

  const signup = async (name, email, password) => {
    await axios.post('/api/auth/signup', { name, email, password });
  };

  const verifyEmail = async (verificationToken) => {
    await axios.post('/api/auth/verify', { token: verificationToken });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAxiosToken(null);
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    verifyEmail,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
