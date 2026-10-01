import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPinSet, setIsPinSet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [websites, setWebsites] = useState([]);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const pinSet = localStorage.getItem('desktopPin') !== null;
    const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
    const savedWebsites = JSON.parse(localStorage.getItem('websites') || '[]');

    setIsLoggedIn(loggedIn);
    setIsPinSet(pinSet);
    setUser(savedUser);
    setWebsites(savedWebsites);
    setLoading(false);
  }, []);

  // REAL LOGIN - Backend se connect
  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      setIsLoggedIn(true);
      setUser(response.user);

      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // REAL SIGNUP - Backend se connect
  const signup = async (name, email, password) => {
    try {
      const response = await authAPI.signup({ name, email, password });

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      setIsLoggedIn(true);
      setUser(response.user);

      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const createPin = (pin) => {
    if (pin.length === 4) {
      const hashedPin = btoa(pin);
      localStorage.setItem('desktopPin', hashedPin);
      setIsPinSet(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('desktopPin');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('websites');
    setIsLoggedIn(false);
    setIsPinSet(false);
    setUser(null);
    setWebsites([]);
  };

  // Websites functions
  const addWebsite = (website) => {
    const newWebsite = {
      ...website,
      id: Date.now(),
      status: 'Draft',
      orders: 0,
      products: 0,
      createdAt: new Date().toISOString(),
    };
    const updated = [...websites, newWebsite];
    setWebsites(updated);
    localStorage.setItem('websites', JSON.stringify(updated));
    return newWebsite;
  };

  const deleteWebsite = (id) => {
    const updated = websites.filter(w => w.id !== id);
    setWebsites(updated);
    localStorage.setItem('websites', JSON.stringify(updated));
  };

  const updateWebsite = (id, updates) => {
    const updated = websites.map(w => w.id === id ? { ...w, ...updates } : w);
    setWebsites(updated);
    localStorage.setItem('websites', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn, isPinSet, loading, user,
      login, signup, createPin, logout,
      websites, addWebsite, deleteWebsite, updateWebsite
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);