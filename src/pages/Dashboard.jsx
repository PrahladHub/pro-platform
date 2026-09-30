import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaGlobe, FaGear, FaChevronDown, FaDesktop } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { isPinSet } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200">
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">
              <FaGlobe /> Create Website
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">
              <FaGear /> Settings
            </button>
            {/* Desktop button - Sirf PIN set hone par */}
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

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <h1 className="text-2xl font-bold text-gray-800">Welcome to Dashboard</h1>
          <p className="text-gray-500 mt-2">
            {isPinSet
              ? 'Your desktop is ready. Click on Desktop to enter Workspace.'
              : 'Create your website or adjust settings to get started. Create a PIN to unlock Desktop.'}
          </p>

          {/* Agar PIN set nahi hai toh Create PIN ka prompt */}
          {!isPinSet && (
            <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
              <h3 className="font-semibold text-yellow-800">🔒 Desktop Locked</h3>
              <p className="text-yellow-700 text-sm mt-1">
                Set a 4-digit PIN to unlock your Desktop Workspace.
              </p>
              <button
                onClick={() => navigate('/create-pin')}
                className="mt-3 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark"
              >
                Create PIN Now
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;