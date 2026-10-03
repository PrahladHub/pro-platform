import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaMagnifyingGlass, FaCartShopping, FaStore, FaBox } from 'react-icons/fa6';
import { productAPI } from '../services/api';

const Storefront = () => {
  const { storeSlug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchProducts();
    loadCartCount();
  }, [storeSlug]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productAPI.getStoreProducts(storeSlug);
      setProducts(data.products || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Store not found');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.length);
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const exists = cart.find((item) => item._id === product._id);

    if (exists) {
      exists.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartCount();
    alert(`${product.name} added to cart!`);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading store...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <FaStore className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Store Not Found</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link
            to="/"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg inline-block"
          >
            Go to Homepage
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
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xl">
              <FaStore />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">
                {storeSlug.replace(/-/g, ' ').replace(/\d+/g, '').trim()}
              </h1>
              <p className="text-xs text-gray-500">Powered by StoreForge</p>
            </div>
          </Link>

          <Link
            to={`/store/${storeSlug}/cart`}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg relative"
          >
            <FaCartShopping />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 bg-white shadow-sm">
          <FaMagnifyingGlass className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 pb-10">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl p-16 text-center shadow-sm">
            <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No products available
            </h3>
            <p className="text-gray-500">This store hasn't added any products yet.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {filteredProducts.length} products found
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition group"
                >
                  <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <FaBox className="text-6xl text-gray-300" />
                    )}
                    {product.mrp > product.price && (
                      <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        {Math.round(
                          ((product.mrp - product.price) / product.mrp) * 100
                        )}
                        % OFF
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {product.category}
                    </p>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-lg font-bold text-indigo-600">
                        ₹{product.price}
                      </span>
                      {product.mrp > product.price && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{product.mrp}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t py-6 text-center text-sm text-gray-500">
        <p>
          Powered by <strong>StoreForge</strong> 🚀
        </p>
      </footer>
    </div>
  );
};

export default Storefront;