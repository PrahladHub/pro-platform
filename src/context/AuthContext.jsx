import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPinSet, setIsPinSet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [websites, setWebsites] = useState([]);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const pinSet = localStorage.getItem('desktopPin') !== null;
    const savedWebsites = JSON.parse(localStorage.getItem('websites') || '[]');

    setIsLoggedIn(loggedIn);
    setIsPinSet(pinSet);
    setWebsites(savedWebsites);
    setLoading(false);
  }, []);

  const login = (email, password) => {
    if (email && password) {
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
      return true;
    }
    return false;
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
    localStorage.removeItem('websites');
    setIsLoggedIn(false);
    setIsPinSet(false);
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
      isLoggedIn, isPinSet, loading,
      login, createPin, logout,
      websites, addWebsite, deleteWebsite, updateWebsite
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);