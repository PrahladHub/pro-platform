import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  FaCheck, FaCrown, FaRocket, FaGem, FaStar,
  FaUpload, FaQrcode, FaHistory, FaArrowUp
} from 'react-icons/fa6';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    icon: FaStar,
    color: 'gray',
    features: ['5 Products', 'Basic Store', 'Email Support', '1GB Storage']
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 299,
    icon: FaRocket,
    color: 'blue',
    popular: true,
    features: ['50 Products', 'Custom Domain', 'Priority Support', '5GB Storage', 'Analytics']
  },
  {
    id: 'scale',
    name: 'Scale',
    price: 599,
    icon: FaCrown,
    color: 'purple',
    features: ['500 Products', 'Custom Domain', '24/7 Support', '20GB Storage', 'Advanced Analytics', 'API Access']
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999,
    icon: FaGem,
    color: 'yellow',
    features: ['Unlimited Products', 'Custom Domain', 'Dedicated Support', '100GB Storage', 'Full Analytics', 'API Access', 'White Label']
  }
];

export default function Billing() {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current subscription + history
  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const [current, mySubs] = await Promise.all([
        api.get('/subscriptions/current').catch(() => ({ data: null })),
        api.get('/subscriptions/my').catch(() => ({ data: [] }))
      ]);
      setCurrentPlan(current.data);
      setHistory(mySubs.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handleSubmitPayment = async () => {
    if (!screenshot) {
      alert('Please upload payment screenshot first!');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', screenshot);

      // Upload screenshot to Cloudinary
      const uploadRes = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Submit subscription with proof
      await api.post('/subscriptions/submit', {
        plan: selectedPlan.id,
        amount: selectedPlan.price,
        paymentProof: uploadRes.data.url
      });

      alert('✅ Payment submitted! Admin will verify soon.');
      setShowPayment(false);
      setSelectedPlan(null);
      setScreenshot(null);
      fetchSubscriptionData();
    } catch (err) {
      alert('❌ Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploading(false);
    }
  };

  const getPlanColor = (color) => {
    const colors = {
      gray: 'from-gray-500 to-gray-700',
      blue: 'from-blue-500 to-blue-700',
      purple: 'from-purple-500 to-purple-700',
      yellow: 'from-yellow-500 to-orange-600'
    };
    return colors[color] || colors.gray;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* ===== HEADER ===== */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaGem className="text-purple-600" />
            Subscription & Billing
          </h1>
          <p className="text-gray-600 mt-2">
            Upgrade your plan to unlock more products and features
          </p>
        </div>

        {/* ===== CURRENT PLAN ===== */}
        {currentPlan && (
          <div className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <p className="text-sm opacity-90">YOUR CURRENT PLAN</p>
                <h2 className="text-2xl font-bold mt-1">
                  {currentPlan.plan?.toUpperCase() || 'STARTER'} PLAN
                </h2>
                <p className="text-sm opacity-90 mt-1">
                  {currentPlan.status === 'approved' ? '✅ Active' : '⏳ Pending Approval'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">
                  ₹{currentPlan.amount || 0}
                </p>
                <p className="text-sm opacity-90">per month</p>
              </div>
            </div>
          </div>
        )}

        {/* ===== ALL PLANS ===== */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrent = currentPlan?.plan === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 ${
                  plan.popular ? 'border-blue-500 scale-105' : 'border-transparent'
                } ${isCurrent ? 'ring-4 ring-green-400' : ''}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold">
                    ⭐ MOST POPULAR
                  </div>
                )}

                {/* Current Badge */}
                {isCurrent && (
                  <div className="absolute -top-3 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    ✓ CURRENT
                  </div>
                )}

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getPlanColor(plan.color)} flex items-center justify-center mb-4`}>
                  <Icon className="text-white text-2xl" />
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>

                {/* Price */}
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-bold text-gray-900">₹{plan.price}</span>
                  <span className="text-gray-500 text-sm">/month</span>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCheck className="text-green-500 text-xs" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isCurrent}
                  className={`w-full py-3 rounded-xl font-bold transition-all ${
                    isCurrent
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 shadow-md'
                  }`}
                >
                  {isCurrent ? 'Current Plan' : 'Upgrade Now'}
                </button>
              </div>
            );
          })}
        </div>

        {/* ===== PAYMENT MODAL ===== */}
        {showPayment && selectedPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-2xl font-bold mb-4">
                Pay ₹{selectedPlan.price} for {selectedPlan.name}
              </h3>

              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-600 mb-2">UPI ID:</p>
                <p className="font-mono font-bold text-lg">9263611337@ybl</p>
              </div>

              <div className="flex justify-center mb-4">
                <img
                  src="https://res.cloudinary.com/lewv3bhj/image/upload/v1791002708/phonepe-qr.png"
                  alt="UPI QR"
                  className="w-48 h-48 border-2 border-gray-200 rounded-xl"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Upload Payment Screenshot
                </label>
                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setScreenshot(e.target.files[0])}
                    className="hidden"
                  />
                  {screenshot ? (
                    <div className="text-center">
                      <FaCheck className="text-green-500 text-2xl mx-auto" />
                      <p className="text-sm text-green-600 mt-1">{screenshot.name}</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FaUpload className="text-gray-400 text-2xl mx-auto" />
                      <p className="text-sm text-gray-500 mt-1">Click to upload</p>
                    </div>
                  )}
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowPayment(false); setScreenshot(null); }}
                  className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitPayment}
                  disabled={uploading}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? 'Submitting...' : 'Submit Payment'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== BILLING HISTORY ===== */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FaHistory /> Payment History
          </h2>

          {history.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No payment history yet
            </p>
          ) : (
            <div className="space-y-3">
              {history.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-bold text-gray-900">₹{item.amount}</p>
                    <p className="text-sm text-gray-500">{item.plan}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${
                      item.status === 'approved' ? 'text-green-600' :
                      item.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {item.status === 'approved' ? '✅ Approved' :
                       item.status === 'rejected' ? '❌ Rejected' : '⏳ Pending'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}