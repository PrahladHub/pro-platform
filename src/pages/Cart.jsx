import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaStore, FaPlus, FaMinus, FaArrowLeft } from 'react-icons/fa6';

const Cart = () => {
  const { storeSlug } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  };

  const saveCart = (newCart) => {
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCart(newCart);
  };

  const updateQuantity = (id, change) => {
    const newCart = cart.map((item) => {
      if (item._id === id) {
        const newQty = item.quantity + change;
        if (newQty < 1) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    });
    saveCart(newCart);
  };

  const removeItem = (id) => {
    if (window.confirm('Remove this item from cart?')) {
      const newCart = cart.filter((item) => item._id !== id);
      saveCart(newCart);
    }
  };

  const clearCart = () => {
    if (window.confirm('Clear entire cart?')) {
      saveCart([]);
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-6">
            Add some products to get started
          </p>
          <Link
            to={`/store/${storeSlug}`}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg inline-block hover:bg-indigo-700"
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
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to={`/store/${storeSlug}`}
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600"
          >
            <FaArrowLeft /> Back to Store
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {totalItems} items
            </span>
            <button
              onClick={clearCart}
              className="text-red-500 text-sm hover:underline"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </header>

      {/* Cart Items */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Shopping Cart
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Items List */}
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl p-4 shadow-sm flex gap-4"
              >
                {/* Image */}
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {item.images?.[0] ? (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <FaStore className="text-3xl text-gray-300" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {item.category}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <div className="flex justify-between items-end mt-3">
                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item._id, -1)}
                        className="px-3 py-1 hover:bg-gray-100 rounded-l-lg"
                      >
                        <FaMinus className="text-xs" />
                      </button>
                      <span className="px-3 py-1 font-semibold min-w-[40px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, 1)}
                        className="px-3 py-1 hover:bg-gray-100 rounded-r-lg"
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        ₹{item.price} × {item.quantity}
                      </p>
                      <p className="text-lg font-bold text-indigo-600">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
              </div>

              <div className="flex justify-between py-4">
                <span className="text-lg font-bold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-indigo-600">
                  ₹{subtotal}
                </span>
              </div>

              <button
                onClick={() => navigate(`/store/${storeSlug}/checkout`)}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700"
              >
                Proceed to Checkout
              </button>

              <Link
                to={`/store/${storeSlug}`}
                className="block text-center text-indigo-600 text-sm mt-3 hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;