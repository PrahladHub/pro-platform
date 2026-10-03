import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaGlobe, FaGear, FaChevronDown, FaPlus, FaBox, FaTrash, FaDesktop, FaMagnifyingGlass, FaXmark, FaImage } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';
import { uploadAPI } from '../services/api';

const Products = () => {
  const navigate = useNavigate();
  const { isPinSet } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', mrp: '', category: '', stock: '', images: [],
  });
  const [saving, setSaving] = useState(false);

  const API_URL = 'https://pro-platform-backend.onrender.com/api';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const storeSlug = localStorage.getItem('storeSlug');
      if (!storeSlug) {
        setError('Store not found. Please login again.');
        setLoading(false);
        return;
      }
      const res = await fetch(`${API_URL}/products`, {
        headers: { 'x-store-slug': storeSlug },
      });
      const data = await res.json();
      setProducts(data.products || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const result = await uploadAPI.uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, result.image.url],
      }));
      setImagePreview(result.image.url);
    } catch (err) {
      alert('Image upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          mrp: Number(formData.mrp) || Number(formData.price),
          stock: Number(formData.stock),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');

      setShowForm(false);
      setFormData({
        name: '', description: '', price: '', mrp: '', category: '', stock: '', images: [],
      });
      setImagePreview(null);
      fetchProducts();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase())
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
              <p className="text-sm text-gray-500 mt-1">
                {products.length} products in your store
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark"
            >
              <FaPlus /> Add Product
            </button>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm mb-5">
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-gray-50">
              <FaMagnifyingGlass className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none w-full text-sm"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-10 text-center text-gray-500">Loading...</div>
            ) : error ? (
              <div className="p-10 text-center text-red-500">{error}</div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                <FaBox className="text-5xl text-gray-300 mx-auto mb-4" />
                No products yet.
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Image</th>
                    <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Product</th>
                    <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Category</th>
                    <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Price</th>
                    <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Stock</th>
                    <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <FaImage className="text-gray-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm font-medium text-gray-800">{product.name}</td>
                      <td className="px-5 py-3 text-sm text-gray-600">{product.category}</td>
                      <td className="px-5 py-3 text-sm font-semibold text-gray-800">₹{product.price}</td>
                      <td className="px-5 py-3 text-sm text-gray-600">{product.stock}</td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">Add New Product</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <FaXmark />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                    <FaImage />
                    {uploading ? 'Uploading...' : 'Choose Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-primary" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-4 py-2 border rounded-lg outline-none focus:border-primary" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">MRP</label>
                  <input type="number" name="mrp" value={formData.mrp} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-primary" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-primary" required />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 bg-gray-100 rounded-lg">
                  Cancel
                </button>
                <button type="submit" disabled={saving || uploading} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;