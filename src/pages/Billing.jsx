import { useEffect, useMemo, useState } from 'react';
import { FaCheck, FaCopy, FaImage, FaIndianRupeeSign, FaSpinner } from 'react-icons/fa6';
import Sidebar from '../components/Sidebar';
import { subscriptionAPI, uploadAPI } from '../services/api';

const fallbackPlans = {
  starter: {
    name: 'Starter',
    price: 0,
    productLimit: 5,
    duration: 30,
  },
  growth: {
    name: 'Growth',
    price: 299,
    productLimit: 50,
    duration: 30,
  },
  scale: {
    name: 'Scale',
    price: 599,
    productLimit: 500,
    duration: 30,
  },
  enterprise: {
    name: 'Enterprise',
    price: 999,
    productLimit: 999999,
    duration: 30,
  },
};

function Billing() {
  const [plans, setPlans] = useState(fallbackPlans);
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);
  const [payment, setPayment] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadBilling();
  }, []);

  const loadBilling = async () => {
    try {
      setLoading(true);
      setError('');

      const [plansRes, currentRes, historyRes, paymentRes] = await Promise.all([
        subscriptionAPI.getPlans(),
        subscriptionAPI.getCurrent(),
        subscriptionAPI.getMy(),
        subscriptionAPI.getPaymentInfo(),
      ]);

      setPlans(plansRes.plans || fallbackPlans);
      setCurrent(currentRes);
      setHistory(historyRes.subscriptions || []);
      setPayment(paymentRes.payment || null);
    } catch (err) {
      setError(err.message || 'Unable to load billing information');
    } finally {
      setLoading(false);
    }
  };

  const planEntries = useMemo(() => Object.entries(plans), [plans]);

  const handleCopy = async () => {
    if (!payment?.upiId) return;
    try {
      await navigator.clipboard.writeText(payment.upiId);
      setMessage('UPI ID copied.');
    } catch {
      setMessage('UPI ID: ' + payment.upiId);
    }
  };

  const handleScreenshot = async (file) => {
    if (!file) return;

    try {
      setUploading(true);
      setError('');
      const result = await uploadAPI.uploadImage(file);
      setScreenshot(result.image?.url || '');
      setMessage('Payment screenshot uploaded.');
    } catch (err) {
      setError(err.message || 'Screenshot upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPlan) {
      setError('Please select a paid plan first.');
      return;
    }

    if (!transactionId.trim() && !screenshot) {
      setError('Enter the UPI transaction ID or upload the payment screenshot.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setMessage('');

      await subscriptionAPI.submit({
        planId: selectedPlan,
        transactionId: transactionId.trim(),
        screenshot,
      });

      setMessage('Payment proof submitted. Your plan is waiting for admin approval.');
      setTransactionId('');
      setScreenshot('');
      setSelectedPlan(null);
      await loadBilling();
    } catch (err) {
      setError(err.message || 'Payment submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <main className="flex-1 grid place-items-center">
          <div className="flex items-center gap-3 text-slate-600">
            <FaSpinner className="animate-spin" /> Loading billing...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Billing</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">Plans & Billing</h1>
            <p className="mt-2 text-slate-500">
              Upgrade your store and pay securely using your PhonePe/UPI account.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              {message}
            </div>
          )}

          <section className="mb-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-500">Current plan</p>
                <h2 className="mt-1 text-2xl font-bold capitalize text-slate-900">
                  {current?.currentPlan || 'starter'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Product limit: {current?.productLimit ?? 5}
                </p>
              </div>

              <div className={`rounded-xl px-4 py-3 text-sm font-semibold ${current?.isExpired ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {current?.isExpired ? 'Plan expired' : 'Plan active'}
                {current?.planExpiresAt && (
                  <div className="mt-1 text-xs font-normal">
                    Expires: {new Date(current.planExpiresAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {planEntries.map(([id, plan]) => {
              const isCurrent = current?.currentPlan === id;
              const isSelected = selectedPlan === id;
              const paid = Number(plan.price) > 0;

              return (
                <div
                  key={id}
                  className={`flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ${isSelected ? 'ring-2 ring-indigo-500' : 'ring-slate-200'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{plan.name}</h2>
                      <p className="mt-1 text-sm text-slate-500">{plan.duration} days</p>
                    </div>
                    {isCurrent && (
                      <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">Current</span>
                    )}
                  </div>

                  <div className="mt-6 flex items-baseline gap-1">
                    <FaIndianRupeeSign className="text-slate-700" />
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    <span className="text-sm text-slate-500">/month</span>
                  </div>

                  <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-600">
                    <li className="flex gap-2"><FaCheck className="mt-0.5 text-green-600" /> {plan.productLimit >= 999999 ? 'Unlimited' : plan.productLimit} products</li>
                    <li className="flex gap-2"><FaCheck className="mt-0.5 text-green-600" /> Storefront & orders</li>
                    <li className="flex gap-2"><FaCheck className="mt-0.5 text-green-600" /> Website builder</li>
                  </ul>

                  <button
                    disabled={!paid || isCurrent}
                    onClick={() => setSelectedPlan(id)}
                    className={`mt-7 w-full rounded-xl px-4 py-3 font-semibold ${!paid || isCurrent ? 'cursor-not-allowed bg-slate-100 text-slate-400' : isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                  >
                    {isCurrent ? 'Current Plan' : isSelected ? 'Selected' : 'Upgrade'}
                  </button>
                </div>
              );
            })}
          </section>

          {selectedPlan && plans[selectedPlan] && (
            <section className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-xl font-bold text-slate-900">Pay with PhonePe / UPI</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Pay ₹{plans[selectedPlan].price} to the platform UPI and then submit the transaction details.
                </p>

                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">UPI ID</p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="break-all text-lg font-bold text-slate-900">{payment?.upiId || 'UPI ID not configured'}</p>
                    <button onClick={handleCopy} className="shrink-0 rounded-lg bg-white p-2 text-slate-700 shadow-sm ring-1 ring-slate-200" title="Copy UPI ID">
                      <FaCopy />
                    </button>
                  </div>
                  {payment?.name && <p className="mt-1 text-sm text-slate-500">Payee: {payment.name}</p>}
                </div>

                {payment?.qrCode && (
                  <div className="mt-5">
                    <p className="mb-2 text-sm font-semibold text-slate-700">Scan QR</p>
                    <img src={payment.qrCode} alt="Platform UPI QR" className="h-48 w-48 rounded-xl border object-contain" />
                  </div>
                )}
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-xl font-bold text-slate-900">Submit payment proof</h2>
                <p className="mt-2 text-sm text-slate-500">Admin will verify your payment before activating the plan.</p>

                <label className="mt-6 block text-sm font-semibold text-slate-700">UPI Transaction ID</label>
                <input
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter PhonePe/UPI transaction ID"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                />

                <label className="mt-5 block text-sm font-semibold text-slate-700">Payment screenshot</label>
                <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 p-4 hover:bg-slate-50">
                  <FaImage className="text-slate-500" />
                  <span className="text-sm text-slate-600">{uploading ? 'Uploading...' : screenshot ? 'Screenshot uploaded ✓' : 'Choose screenshot'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleScreenshot(e.target.files?.[0])} disabled={uploading} />
                </label>

                <button
                  onClick={handleSubmit}
                  disabled={submitting || uploading}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting && <FaSpinner className="animate-spin" />}
                  {submitting ? 'Submitting...' : 'Submit Payment Proof'}
                </button>
              </div>
            </section>
          )}

          <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Payment history</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="border-b bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Plan</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Transaction</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 ? (
                    <tr><td colSpan="5" className="px-4 py-8 text-center text-slate-500">No payment submissions yet.</td></tr>
                  ) : history.map((item) => (
                    <tr key={item._id} className="border-b last:border-0">
                      <td className="px-4 py-3 font-semibold capitalize">{item.plan}</td>
                      <td className="px-4 py-3">₹{item.amount}</td>
                      <td className="px-4 py-3 font-mono text-xs">{item.transactionId || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === 'approved' ? 'bg-green-100 text-green-700' : item.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Billing;
