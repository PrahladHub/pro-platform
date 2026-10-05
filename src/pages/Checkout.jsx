import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheck } from 'react-icons/fa6';

const Checkout = () => {
  const { storeSlug } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod',
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (savedCart.length === 0) {
      navigate(`/store/${storeSlug}`);
    }
    setCart(savedCart);
  }, [storeSlug, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.address ||
      !form.pincode
    ) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }

    try {
      const API_URL = 'http://localhost:5000/api';

      const orderData = {
        customer: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
        items: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
        })),
        subtotal,
        shippingCharge: 0,
        discount: 0,
        total: subtotal,
        paymentMethod: form.paymentMethod,
      };

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-store-slug': storeSlug,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Order failed');
      }

      // Success
      localStorage.removeItem('cart');
      setOrderId(data.order.orderNumber || data.order._id);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheck className="text-green-600 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Order Placed!
          </h2>
          <p className="text-gray-500 mb-2">
            Thank you for your order
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Order ID: {orderId}
          </p>
          <Link
            to={`/store/${storeSlug}`}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            to={`/store/${storeSlug}/cart`}
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600"
          >
            <FaArrowLeft /> Back to Cart
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">
          {/* Customer Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Delivery Information
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-indigo-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-indigo-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-indigo-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-indigo-600"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm text-gray-600 mb-1">
                  Full Address *
                </label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Payment Method
              </h3>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={form.paymentMethod === 'cod'}
                    onChange={handleChange}
                  />
                  <span className="font-medium">Cash on Delivery</span>
                </label>

                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 opacity-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    disabled
                  />
                  <span className="font-medium">Online Payment (Coming Soon)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Order Summary
              </h3>

              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-semibold">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
              </div>

              <div className="flex justify-between py-4 border-t border-gray-200">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-indigo-600">
                  ₹{subtotal}
                </span>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;