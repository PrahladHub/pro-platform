import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
  FaGlobe,
  FaGear,
  FaChevronDown,
  FaDesktop,
  FaCheck,
} from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';
import { websiteAPI } from '../services/api';

const CreateWebsite = () => {
  const navigate = useNavigate();
  const { isPinSet } = useAuth();

  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    description: '',
    category: 'E-commerce',
  });

  const categories = [
    'E-commerce',
    'Blog',
    'Portfolio',
    'Business',
    'Restaurant',
    'Other',
  ];

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  // =====================================================
  // NEXT STEP
  // =====================================================

  const nextStep = () => {
    setError('');

    if (step === 1 && !formData.name.trim()) {
      setError('Website name is required.');
      return;
    }

    if (step < 3) {
      setStep((previous) => previous + 1);
    }
  };

  // =====================================================
  // PREVIOUS STEP
  // =====================================================

  const previousStep = () => {
    setError('');

    if (step > 1) {
      setStep((previous) => previous - 1);
    }
  };

  // =====================================================
  // CREATE WEBSITE
  // =====================================================

  const handleSubmit = async () => {
    setError('');

    if (!formData.name.trim()) {
      setError('Website name is required.');
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      setError('Login session expired. Please login again.');
      return;
    }

    try {
      setSaving(true);

      await websiteAPI.create({
        name: formData.name.trim(),
        domain: formData.domain.trim(),
        description: formData.description.trim(),
        category: formData.category,
      });

      setSuccess(true);

      setTimeout(() => {
        navigate('/websites');
      }, 1200);
    } catch (error) {
      console.error('Create website error:', error);

      setError(
        error.message || 'Failed to create website.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      <Sidebar />

      <main className="flex-1 ml-64 p-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-900">
            Create Website
          </h1>

          <p className="text-gray-500 mt-1">
            Create your new website in a few simple steps.
          </p>

        </div>

        {/* =================================================
            SUCCESS
        ================================================= */}

        {success ? (

          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center">

            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <FaCheck className="text-green-600 text-4xl" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-6">
              Website Created Successfully!
            </h2>

            <p className="text-gray-500 mt-2">
              Your website has been saved successfully.
            </p>

            <p className="text-sm text-gray-400 mt-4">
              Redirecting to Websites...
            </p>

          </div>

        ) : (

          <>

            {/* =================================================
                PROGRESS
            ================================================= */}

            <div className="max-w-4xl mx-auto mb-8">

              <div className="flex items-center justify-between">

                {/* STEP 1 */}

                <div className="flex items-center">

                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step >= 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    1
                  </div>

                  <span
                    className={`ml-3 font-medium ${
                      step >= 1
                        ? 'text-blue-600'
                        : 'text-gray-400'
                    }`}
                  >
                    Basic Info
                  </span>

                </div>

                <div className="flex-1 h-1 bg-gray-200 mx-4">

                  <div
                    className="h-full bg-blue-600 transition-all"
                    style={{
                      width: step >= 2 ? '100%' : '0%',
                    }}
                  />

                </div>

                {/* STEP 2 */}

                <div className="flex items-center">

                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step >= 2
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    2
                  </div>

                  <span
                    className={`ml-3 font-medium ${
                      step >= 2
                        ? 'text-blue-600'
                        : 'text-gray-400'
                    }`}
                  >
                    Settings
                  </span>

                </div>

                <div className="flex-1 h-1 bg-gray-200 mx-4">

                  <div
                    className="h-full bg-blue-600 transition-all"
                    style={{
                      width: step >= 3 ? '100%' : '0%',
                    }}
                  />

                </div>

                {/* STEP 3 */}

                <div className="flex items-center">

                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step >= 3
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    3
                  </div>

                  <span
                    className={`ml-3 font-medium ${
                      step >= 3
                        ? 'text-blue-600'
                        : 'text-gray-400'
                    }`}
                  >
                    Preview
                  </span>

                </div>

              </div>

            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

              <div className="max-w-4xl mx-auto mb-6">

                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  {error}
                </div>

              </div>

            )}

            {/* =================================================
                MAIN CARD
            ================================================= */}

            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200">

              {/* =================================================
                  STEP 1
              ================================================= */}

              {step === 1 && (

                <div className="p-8">

                  <div className="flex items-center gap-3 mb-8">

                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <FaGlobe className="text-blue-600 text-xl" />
                    </div>

                    <div>

                      <h2 className="text-xl font-bold text-gray-900">
                        Basic Information
                      </h2>

                      <p className="text-gray-500 text-sm">
                        Tell us about your website.
                      </p>

                    </div>

                  </div>

                  <div className="space-y-6">

                    {/* WEBSITE NAME */}

                    <div>

                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Website Name *
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Priya Store"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />

                    </div>

                    {/* DOMAIN */}

                    <div>

                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Domain
                      </label>

                      <input
                        type="text"
                        name="domain"
                        value={formData.domain}
                        onChange={handleChange}
                        placeholder="e.g. priyastore.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />

                      <p className="text-xs text-gray-400 mt-2">
                        You can leave this empty and configure it later.
                      </p>

                    </div>

                    {/* DESCRIPTION */}

                    <div>

                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description
                      </label>

                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Describe your website..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />

                    </div>

                  </div>

                </div>

              )}

              {/* =================================================
                  STEP 2
              ================================================= */}

              {step === 2 && (

                <div className="p-8">

                  <div className="flex items-center gap-3 mb-8">

                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                      <FaGear className="text-purple-600 text-xl" />
                    </div>

                    <div>

                      <h2 className="text-xl font-bold text-gray-900">
                        Website Settings
                      </h2>

                      <p className="text-gray-500 text-sm">
                        Configure your website category.
                      </p>

                    </div>

                  </div>

                  <div className="space-y-6">

                    {/* CATEGORY */}

                    <div>

                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Website Category
                      </label>

                      <div className="relative">

                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full appearance-none px-4 py-3 border border-gray-300 rounded-xl outline-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >

                          {categories.map((category) => (
                            <option
                              key={category}
                              value={category}
                            >
                              {category}
                            </option>
                          ))}

                        </select>

                        <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />

                      </div>

                    </div>

                    {/* SECURITY */}

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">

                      <div className="flex items-center justify-between">

                        <div>

                          <h3 className="font-semibold text-gray-900">
                            Workspace Security
                          </h3>

                          <p className="text-sm text-gray-500 mt-1">
                            Desktop workspace PIN status
                          </p>

                        </div>

                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            isPinSet
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {isPinSet
                            ? 'PIN Set'
                            : 'Not Set'}
                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              )}

              {/* =================================================
                  STEP 3
              ================================================= */}

              {step === 3 && (

                <div className="p-8">

                  <div className="flex items-center gap-3 mb-8">

                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <FaDesktop className="text-green-600 text-xl" />
                    </div>

                    <div>

                      <h2 className="text-xl font-bold text-gray-900">
                        Preview
                      </h2>

                      <p className="text-gray-500 text-sm">
                        Check your website details before creating it.
                      </p>

                    </div>

                  </div>

                  <div className="border border-gray-200 rounded-2xl overflow-hidden">

                    <div className="bg-gray-900 px-5 py-3 flex items-center gap-2">

                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />

                      <div className="ml-4 bg-gray-800 rounded-lg px-4 py-2 text-gray-300 text-sm flex-1">
                        {formData.domain ||
                          'your-website.com'}
                      </div>

                    </div>

                    <div className="p-8 bg-white">

                      <h3 className="text-3xl font-bold text-gray-900">
                        {formData.name ||
                          'Your Website'}
                      </h3>

                      <p className="text-gray-500 mt-3">
                        {formData.description ||
                          'Your website description will appear here.'}
                      </p>

                      <div className="mt-6 inline-flex px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                        {formData.category}
                      </div>

                    </div>

                  </div>

                  <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">

                    <p className="text-sm text-blue-700">
                      Your website will be created as a{' '}
                      <strong>Draft</strong>.
                      You can publish it from the Websites page.
                    </p>

                  </div>

                </div>

              )}

              {/* =================================================
                  FOOTER BUTTONS
              ================================================= */}

              <div className="border-t border-gray-200 px-8 py-5 flex items-center justify-between">

                <button
                  onClick={() =>
                    navigate('/websites')
                  }
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-3">

                  {step > 1 && (

                    <button
                      onClick={previousStep}
                      disabled={saving}
                      className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50"
                    >
                      Back
                    </button>

                  )}

                  {step < 3 ? (

                    <button
                      onClick={nextStep}
                      disabled={saving}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      Continue
                    </button>

                  ) : (

                    <button
                      onClick={handleSubmit}
                      disabled={saving}
                      className="px-6 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving
                        ? 'Creating...'
                        : 'Create Website'}
                    </button>

                  )}

                </div>

              </div>

            </div>

          </>

        )}

      </main>

    </div>
  );
};

export default CreateWebsite;