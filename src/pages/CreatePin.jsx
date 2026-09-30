import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaLock } from 'react-icons/fa6';

const CreatePin = () => {
  const [pin, setPin] = useState(['', '', '', '']);
  const { createPin } = useAuth();
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Sirf digits allow
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace par previous input par jao
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = () => {
    const pinString = pin.join('');
    if (createPin(pinString)) {
      navigate('/workspace');
    } else {
      alert('Please enter a 4-digit PIN');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md text-center">
        <div className="text-primary text-5xl mb-4 flex justify-center">
          <FaLock />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Create Desktop PIN</h2>
        <p className="text-gray-500 text-sm mt-2">
          Set a 4-digit PIN to access your Desktop (Workspace)
        </p>

        <div className="flex justify-center gap-3 my-8">
          {pin.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="password"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-14 h-14 text-center text-2xl border-2 border-gray-300 rounded-xl focus:border-primary outline-none"
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition"
        >
          Create PIN
        </button>
      </div>
    </div>
  );
};

export default CreatePin;