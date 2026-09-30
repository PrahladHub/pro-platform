import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPinSet, setIsPinSet] = useState(false);
  const [loading, setLoading] = useState(true);

  // App load hone par localStorage se state uthao
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const pinSet = localStorage.getItem('desktopPin') !== null;
    setIsLoggedIn(loggedIn);
    setIsPinSet(pinSet);
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
      // Professional: Base64 encoding (real world mein bcrypt use hota hai)
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
    setIsLoggedIn(false);
    setIsPinSet(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isPinSet, login, createPin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);