import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FaMagnifyingGlass,
  FaCartShopping,
  FaStore,
  FaBox,
  FaBars,
  FaXmark,
} from 'react-icons/fa6';

import apiCall, { productAPI } from '../services/api';

const Storefront = () => {
  const { storeSlug } = useParams();

  const [products, setProducts] = useState([]);
  const [website, setWebsite] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ----------------------------------------
  // Default design
  // ----------------------------------------
  const defaultDesign = {
    primaryColor: '#4f46e5',
    backgroundColor: '#ffffff',
    textColor: '#111827',
    font: 'Inter',
  };

  // ----------------------------------------
  // Load website + products
  // ----------------------------------------
  useEffect(() => {
    if (!storeSlug) return;

    fetchStore();
    loadCartCount();
  }, [storeSlug]);

  // ----------------------------------------
  // Fetch website design
  // ----------------------------------------
  const fetchWebsite = async () => {
    const data = await apiCall(
      `/websites/public/${storeSlug}`,
      'GET'
    );

    return data.website;
  };

  // ----------------------------------------
  // Fetch complete store
  // ----------------------------------------
  const fetchStore = async () => {
    try {
      setLoading(true);
      setError('');

      const [websiteData, productData] = await Promise.all([
        fetchWebsite(),
        productAPI.getStoreProducts(storeSlug),
      ]);

      setWebsite(websiteData);
      setProducts(productData.products || []);
    } catch (err) {
      console.error('Storefront error:', err);

      setError(
        err.message ||
          'Store not found'
      );

      setWebsite(null);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------
  // Cart count
  // ----------------------------------------
  const loadCartCount = () => {
    try {
      const cart = JSON.parse(
        localStorage.getItem('cart') || '[]'
      );

      setCartCount(cart.length);
    } catch {
      setCartCount(0);
    }
  };

  // ----------------------------------------
  // Add to cart
  // ----------------------------------------
  const addToCart = (product) => {
    try {
      const cart = JSON.parse(
        localStorage.getItem('cart') || '[]'
      );

      const exists = cart.find(
        (item) => item._id === product._id
      );

      if (exists) {
        exists.quantity += 1;
      } else {
        cart.push({
          ...product,
          quantity: 1,
        });
      }

      localStorage.setItem(
        'cart',
        JSON.stringify(cart)
      );

      loadCartCount();

      alert(
        `${product.name} added to cart!`
      );
    } catch (err) {
      console.error('Add to cart error:', err);
    }
  };

  // ----------------------------------------
  // Search
  // ----------------------------------------
  const filteredProducts = products.filter((product) =>
    product.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  // ----------------------------------------
  // Design
  // ----------------------------------------
  const design = {
    ...defaultDesign,
    ...(website?.design || {}),
  };

  const primaryColor =
    design.primaryColor || defaultDesign.primaryColor;

  const backgroundColor =
    design.backgroundColor ||
    defaultDesign.backgroundColor;

  const textColor =
    design.textColor ||
    defaultDesign.textColor;

  const font =
    design.font ||
    defaultDesign.font;

  // ----------------------------------------
  // Store name
  // ----------------------------------------
  const storeName =
    website?.name ||
    storeSlug
      ?.replace(/-/g, ' ')
      .replace(/\d+/g, '')
      .trim() ||
    'Store';

  // ----------------------------------------
  // Loading
  // ----------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{
              borderColor: primaryColor,
            }}
          ></div>

          <p className="mt-4 text-gray-500">
            Loading store...
          </p>
        </div>
      </div>
    );
  }

  // ----------------------------------------
  // Error
  // ----------------------------------------
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <FaStore className="text-6xl text-gray-300 mx-auto mb-4" />

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Store Not Found
          </h2>

          <p className="text-gray-500 mb-6">
            {error}
          </p>

          <Link
            to="/"
            className="text-white px-6 py-3 rounded-lg inline-block"
            style={{
              backgroundColor: primaryColor,
            }}
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // ----------------------------------------
  // Storefront
  // ----------------------------------------
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor,
        color: textColor,
        fontFamily: font,
      }}
    >
      {/* ========================================
          HEADER
      ======================================== */}
      <header
        className="bg-white shadow sticky top-0 z-50"
        style={{
          color: textColor,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo + Store Name */}
            <Link
              to={`/store/${storeSlug}`}
              className="flex items-center gap-3 min-w-0"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0"
                style={{
                  backgroundColor: primaryColor,
                }}
              >
                <FaStore />
              </div>

              <div className="min-w-0">
                <h1
                  className="text-lg font-bold truncate"
                  style={{
                    color: textColor,
                  }}
                >
                  {storeName}
                </h1>

                <p className="text-xs text-gray-500">
                  Powered by StoreForge
                </p>
              </div>
            </Link>

            {/* Desktop Cart */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to={`/store/${storeSlug}/cart`}
                className="flex items-center gap-2 text-white px-4 py-2 rounded-lg relative"
                style={{
                  backgroundColor: primaryColor,
                }}
              >
                <FaCartShopping />

                <span>Cart</span>

                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(
                  !mobileMenuOpen
                )
              }
              className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center text-white"
              style={{
                backgroundColor: primaryColor,
              }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <FaXmark />
              ) : (
                <FaBars />
              )}
            </button>
          </div>

          {/* ========================================
              MOBILE MENU
          ======================================== */}
          {mobileMenuOpen && (
            <div className="md:hidden pt-4">
              <div className="border-t border-gray-200 pt-4">
                <Link
                  to={`/store/${storeSlug}/cart`}
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className="flex items-center justify-between w-full text-white px-4 py-3 rounded-lg"
                  style={{
                    backgroundColor: primaryColor,
                  }}
                >
                  <span className="flex items-center gap-2">
                    <FaCartShopping />
                    Cart
                  </span>

                  {cartCount > 0 && (
                    <span className="bg-white text-gray-800 text-xs rounded-full min-w-6 h-6 px-2 flex items-center justify-center font-semibold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ========================================
          STORE INTRO
      ======================================== */}
      <section className="max-w-7xl mx-auto px-4 pt-8 pb-2">
        <div>
          <h2
            className="text-2xl md:text-3xl font-bold"
            style={{
              color: textColor,
            }}
          >
            Welcome to {storeName}
          </h2>

          {website?.description && (
            <p className="mt-2 text-gray-500 max-w-2xl">
              {website.description}
            </p>
          )}
        </div>
      </section>

      {/* ========================================
          SEARCH
      ======================================== */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div
          className="flex items-center border rounded-lg px-4 py-3 bg-white shadow-sm"
          style={{
            borderColor: `${primaryColor}40`,
          }}
        >
          <FaMagnifyingGlass
            className="mr-3 flex-shrink-0"
            style={{
              color: primaryColor,
            }}
          />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="bg-transparent outline-none w-full text-sm"
            style={{
              color: textColor,
            }}
          />
        </div>
      </div>

      {/* ========================================
          PRODUCTS
      ======================================== */}
      <div className="max-w-7xl mx-auto px-4 pb-10">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl p-10 md:p-16 text-center shadow-sm">
            <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />

            <h3
              className="text-xl font-semibold mb-2"
              style={{
                color: textColor,
              }}
            >
              No products available
            </h3>

            <p className="text-gray-500">
              {search
                ? 'No products match your search.'
                : "This store hasn't added any products yet."}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {filteredProducts.length}{' '}
              {filteredProducts.length === 1
                ? 'product'
                : 'products'}{' '}
              found
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {filteredProducts.map(
                (product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition group"
                  >
                    {/* Product Image */}
                    <div className="h-40 sm:h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <FaBox className="text-6xl text-gray-300" />
                      )}

                      {/* Discount */}
                      {product.mrp >
                        product.price && (
                        <span
                          className="absolute top-2 left-2 text-white text-xs px-2 py-1 rounded"
                          style={{
                            backgroundColor:
                              primaryColor,
                          }}
                        >
                          {Math.round(
                            ((product.mrp -
                              product.price) /
                              product.mrp) *
                              100
                          )}
                          % OFF
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-3 md:p-4">
                      <h3
                        className="font-semibold truncate"
                        style={{
                          color: textColor,
                        }}
                        title={product.name}
                      >
                        {product.name}
                      </h3>

                      <p className="text-xs text-gray-500 mb-2 truncate">
                        {product.category}
                      </p>

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mb-3 flex-wrap">
                        <span
                          className="text-lg font-bold"
                          style={{
                            color: primaryColor,
                          }}
                        >
                          ₹{product.price}
                        </span>

                        {product.mrp >
                          product.price && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹{product.mrp}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart */}
                      <button
                        type="button"
                        onClick={() =>
                          addToCart(product)
                        }
                        className="w-full text-white py-2 rounded-lg text-sm font-medium transition hover:opacity-90 active:scale-[0.98]"
                        style={{
                          backgroundColor:
                            primaryColor,
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </>
        )}
      </div>

      {/* ========================================
          FOOTER
      ======================================== */}
      <footer
        className="border-t py-6 text-center text-sm"
        style={{
          backgroundColor: backgroundColor,
          color: textColor,
        }}
      >
        <p>
          Powered by{' '}
          <strong
            style={{
              color: primaryColor,
            }}
          >
            StoreForge
          </strong>{' '}
          🚀
        </p>
      </footer>
    </div>
  );
};

export default Storefront;