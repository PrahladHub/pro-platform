import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaGlobe, FaGear, FaChevronDown, FaPlus, FaBox, FaPenToSquare, FaTrash, FaDesktop, FaSearch } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const navigate = useNavigate();
  const { isPinSet } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([
    { id: 1, name: 'Basmati Rice 1kg', price: 120, stock: 50, category: 'Grains', status: 'In Stock' },
    { id: 2, name: 'Sunflower Oil 1L', price: 160, stock: 30, category: 'Oils', status: 'In Stock' },
    { id: 3, name: 'Sugar 1kg', price: 45, stock: 0, category: 'Grains', status: 'Out of Stock' },
    { id: 4, name: 'Wheat Atta 5kg', price: 220, stock: 20, category: 'Grains', status: 'In Stock' },
  ]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200">
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Products</h1>
              <p className="text-sm text-gray-500 mt-1">{products.length} products in your store</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark">
              <FaPlus /> Add Product
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-5">
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-gray-50">
              <FaSearch className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Search products by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none w-full text-sm"
              />
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Product</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Category</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Price</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Stock</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Status</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-5 py-3 text-sm text-gray-800 font-medium">{product.name}</td>
                      <td className="px-5 py-3 text-sm text-gray-600">{product.category}</td>
                      <td className="px-5 py-3 text-sm text-gray-800 font-semibold">₹{product.price}</td>
                      <td className="px-5 py-3 text-sm text-gray-600">{product.stock} units</td>
                      <td className="px-5 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.status === 'In Stock' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100" title="Edit">
                            <FaPenToSquare className="text-xs" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                            title="Delete"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Products;