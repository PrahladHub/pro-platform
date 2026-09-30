import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaGlobe, FaGear, FaChevronDown, FaPlus, FaEye, FaPenToSquare, FaTrash, FaDesktop } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';

const Websites = () => {
  const navigate = useNavigate();
  const { isPinSet } = useAuth();
  const [websites, setWebsites] = useState([
    { id: 1, name: 'My Shop', domain: 'myshop.com', status: 'Published', orders: 45, products: 12 },
    { id: 2, name: 'Food Blog', domain: 'foodblog.com', status: 'Draft', orders: 0, products: 8 },
  ]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure?')) {
      setWebsites(websites.filter(w => w.id !== id));
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200">
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/create-website')}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
            >
              <FaPlus /> Create Website
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
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Websites</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {websites.map((site) => (
              <div key={site.id} className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 text-xl">
                    <FaGlobe />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    site.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {site.status}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 text-lg">{site.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{site.domain}</p>

                <div className="flex justify-between text-sm text-gray-600 mb-4 border-t border-b py-2">
                  <span>📦 {site.products} Products</span>
                  <span>🛒 {site.orders} Orders</span>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium">
                    <FaEye className="inline mr-1" /> View
                  </button>
                  <button className="flex-1 py-2 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium">
                     <FaPenToSquare className="inline mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(site.id)}
                    className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-medium"
                  >
                    <FaTrash className="inline mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Websites;