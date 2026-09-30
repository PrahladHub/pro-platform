import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaCube } from 'react-icons/fa6';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/dashboard');
    } else {
      alert('Please fill all fields');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl">
            <FaCube />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800">Your Platform</h2>
        <p className="text-center text-gray-500 text-sm mb-6">Login to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 focus-within:border-primary">
            <FaEnvelope className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Email or Phone"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 focus-within:border-primary">
            <FaLock className="text-gray-400 mr-3" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition"
          >
            Login
          </button>
        </form>

        <div className="flex justify-between mt-4 text-sm">
          <a href="#" className="text-primary hover:underline">Forgot Password?</a>
          <a href="#" className="text-primary hover:underline">Create Account</a>
        </div>
      </div>
    </div>
  );
};

export default Login;