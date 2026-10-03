import { useState, useEffect } from 'react';
import { FaCheck, FaMoneyBill, FaQrcode, FaXmark, FaSpinner } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';

// ⚠️ AAPKI UPI DETAILS
const UPI_ID = '9263611337@ybl'; // ← Aapki PhonePe UPI ID
const UPI_QR = 'https://res.cloudinary.com/lewv3bhj/image/upload/v1791002708/phonepe-qr.png';     // ← public/upi-qr.png mein QR daalein

const Billing = () => {
  const { user } = useAuth();

  const [plans, setPlans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', txnId: '' });
  const [submitting, setSubmitting] = useState(false);

  // ✅ Plans backend se fetch karo
  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      setError('');
      try {
       
        const res = await fetch('https://pro-platform-backend.onrender.com/api/subscriptions/plans');
        const data = await res.json();

        if (!data.success || !data.plans) {
          throw new Error('Invalid response from server');
        }

        // Object → Array convert
        const plansArray = Object.entries(data.plans).map(([key, plan]) => ({
          id: key,
          name: plan.name,
          price: plan.price,
          productLimit: plan.productLimit,
          duration: plan.duration,
        }));

        setPlans(plansArray);
      } catch (err) {
        console.error('Failed to load plans:', err);
        setError('Plans load nahi ho paaye. Backend chal raha hai?');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // ✅ Payments localStorage se (safe parse)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('payments');
      if (stored) {
        const parsed = JSON.parse(stored);
        setPayments(Array.isArray(parsed) ? parsed : []);
      }
    } catch (err) {
      console.error('Payments parse failed:', err);
      localStorage.removeItem('payments');
      setPayments([]);
    }

    if (user) {
      setForm((f) => ({ ...f, name: user.name || '', email: user.email || '' }));
    }
  }, [user]);

  const openPaymentModal = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const newPayment = {
      id: Date.now(),
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      amount: selectedPlan.price,
      ...form,
      status: 'pending',
      date: new Date().toISOString(),
    };

    const updated = [...payments, newPayment];
    setPayments(updated);
    try {
      localStorage.setItem('payments', JSON.stringify(updated));
    } catch (err) {
      console.error('Save failed:', err);
    }

    setSubmitting(false);
    setShowModal(false);
    setForm({ name: user?.name || '', email: user?.email || '', phone: '', txnId: '' });
    alert('Payment submit ho gaya! Admin verify karega, phir plan activate hoga.');
  };

  // Helper — plan features
  const getPlanFeatures = (plan) => {
    const features = [
      `${plan.productLimit === 999999 ? 'Unlimited' : plan.productLimit} Products`,
      `${plan.duration} days validity`,
    ];
    if (plan.price === 0) features.push('Free forever');
    if (plan.price > 500) features.push('Priority Support');
    if (plan.price >= 999) features.push('Custom Domain');
    return features;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Billing & Plans</h1>
        <p className="text-gray-500 mt-1">
          Upgrade your plan to add more products and unlock features
        </p>
      </div>

      <h2 className="text-xl font-semibold text-gray-700 mb-4">Available Plans</h2>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12 text-gray-400">
          <FaSpinner className="animate-spin text-3xl mx-auto mb-3" />
          <p>Plans load ho rahe hain...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Plans Grid */}
      {!loading && !error && plans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {plans.map((plan, idx) => (
            <div
              key={plan.id}
              className={`relative border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition ${
                idx === 1 ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200'
              }`}
            >
              {idx === 1 && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-3 py-1 rounded-full">
                  Popular
                </span>
              )}
              <h3 className="text-lg font-bold text-gray-800">{plan.name}</h3>
              <p className="text-2xl font-bold text-primary mt-2">
                {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                {plan.price > 0 && (
                  <span className="text-sm text-gray-500 font-normal">/month</span>
                )}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                {getPlanFeatures(plan).map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <FaCheck className="text-green-500 mt-1 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => openPaymentModal(plan)}
                disabled={plan.price === 0}
                className="mt-5 w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {plan.price === 0 ? 'Current Plan' : `Choose ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Payment History */}
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Payment History</h2>
      {payments.length === 0 ? (
        <div className="text-center py-10 text-gray-400 bg-white rounded-lg border border-gray-200">
          <FaMoneyBill className="text-4xl mx-auto mb-3 opacity-40" />
          <p>No payments yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3">Plan</th>
                <th className="text-left px-4 py-3">Amount</th>
                <th className="text-left px-4 py-3">Txn ID</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium">{p.planName}</td>
                  <td className="px-4 py-3">₹{p.amount}</td>
                  <td className="px-4 py-3 text-gray-500">{p.txnId || '-'}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(p.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        p.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : p.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payment Modal */}
      {showModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-lg">
                Pay ₹{selectedPlan.price} — {selectedPlan.name}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <FaXmark />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Scan & Pay with any UPI app</p>
                {UPI_QR ? (
                  <img
                    src={UPI_QR}
                    alt="UPI QR"
                    className="w-48 h-48 mx-auto border rounded-lg object-contain"
                  />
                ) : (
                  <div className="w-48 h-48 mx-auto border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400">
                    <FaQrcode className="text-5xl mb-2" />
                    <p className="text-xs px-4 text-center">
                      Add QR in public/upi-qr.png
                    </p>
                  </div>
                )}
                <p className="text-sm mt-2">
                  UPI ID: <span className="font-mono font-medium">{UPI_ID}</span>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <input
                  type="text"
                  placeholder="UPI Transaction ID"
                  required
                  value={form.txnId}
                  onChange={(e) => setForm({ ...form, txnId: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-white py-2.5 rounded-lg hover:bg-primary/90 disabled:opacity-60 font-medium"
                >
                  {submitting ? 'Submitting...' : 'Submit Payment Proof'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;