import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaGlobe, FaGear, FaChevronDown, FaPlus, FaEye, FaPenToSquare, FaTrash, FaDesktop } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';

const Websites = () => {
  const navigate = useNavigate();
  const { isPinSet, websites, deleteWebsite } = useAuth();

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this website?')) {
      deleteWebsite(id);
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
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark"
            >
              <FaPlus /> Create Website
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
              <h1 className="text-2xl font-bold text-gray-800">My Websites</h1>
              <p className="text-sm text-gray-500 mt-1">{websites.length} websites</p>
            </div>
            <button
              onClick={() => navigate('/create-website')}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark"
            >
              <FaPlus /> New Website
            </button>
          </div>

          {websites.length === 0 ? (
            <div className="bg-white p-10 rounded-xl text-center shadow-sm">
              <FaGlobe className="text-5xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">No websites yet</h3>
              <p className="text-gray-500 text-sm mt-1">Create your first website to get started</p>
              <button
                onClick={() => navigate('/create-website')}
                className="mt-4 bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark"
              >
                Create Website
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {websites.map((site) => (
                <div key={site.id} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition">
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
                    <button className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100">
                      <FaEye className="inline mr-1" /> View
                    </button>
                    <button className="flex-1 py-2 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100">
                      <FaPenToSquare className="inline mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(site.id)}
                      className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100"
                    >
                      <FaTrash className="inline mr-1" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Websites;