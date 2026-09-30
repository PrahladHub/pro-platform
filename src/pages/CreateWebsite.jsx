import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaGlobe, FaGear, FaChevronDown, FaDesktop, FaCheck } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';

const CreateWebsite = () => {
  const navigate = useNavigate();
  const { isPinSet, addWebsite } = useAuth();
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    description: '',
    category: 'E-commerce',
  });

  const categories = ['E-commerce', 'Blog', 'Portfolio', 'Business', 'Restaurant', 'Other'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    addWebsite(formData);
    setSuccess(true);
    setTimeout(() => {
      navigate('/websites');
    }, 1500);
  };

  if (success) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheck className="text-green-600 text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Website Created!</h2>
            <p className="text-gray-500">Redirecting to your websites...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200">
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">
              <FaGlobe /> Create Website
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">
              <FaGear /> Settings
            </button>
            {isPinSet && (
              <button
                onClick={() => navigate('/workspace')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium"
              >
                <FaDesktop /> Desktop
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            User <FaChevronDown />
          </div>
        </header>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => navigate('/websites')}
              className="text-sm text-gray-500 hover:text-gray-700 mb-4"
            >
              ← Back to Websites
            </button>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">Create New Website</h1>
            <p className="text-gray-500 text-sm mb-6">Fill in the details below</p>

            {/* Progress Steps */}
            <div className="flex items-center mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                    s <= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {s}
                  </div>
                  {s < 3 && <div className={`flex-1 h-1 ${s < step ? 'bg-primary' : 'bg-gray-200'}`}></div>}
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., My Awesome Shop"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Domain Name *</label>
                    <input
                      type="text"
                      name="domain"
                      value={formData.domain}
                      onChange={handleChange}
                      placeholder="e.g., myshop.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-primary"
                    >
                      {categories.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Description</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="6"
                      placeholder="Tell us about your website..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Review & Confirm</h2>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Name:</span><span className="font-medium">{formData.name || '—'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Domain:</span><span className="font-medium">{formData.domain || '—'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Category:</span><span className="font-medium">{formData.category}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Description:</span><span className="font-medium">{formData.description || '—'}</span></div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                {step > 1 ? (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                  >
                    ← Back
                  </button>
                ) : <div></div>}

                {step < 3 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    disabled={step === 1 && (!formData.name || !formData.domain)}
                    className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-primary-dark"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600"
                  >
                    ✓ Create Website
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateWebsite;