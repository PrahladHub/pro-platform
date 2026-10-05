import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaGlobe, FaGear, FaChevronDown, FaDesktop, FaUserLarge, FaStore, FaBell, FaLock, FaCreditCard } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const navigate = useNavigate();
  const { isPinSet } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: 'Prahlad',
    email: 'prahlad@example.com',
    phone: '+91 98765 43210',
    company: 'My Company',
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: <FaUserLarge /> },
    { id: 'store', name: 'Store', icon: <FaStore /> },
    { id: 'notifications', name: 'Notifications', icon: <FaBell /> },
    { id: 'security', name: 'Security', icon: <FaLock /> },
    { id: 'billing', name: 'Billing', icon: <FaCreditCard /> },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200">
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">
              <FaGlobe /> Create Website
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">
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
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Tabs */}
            <div className="lg:col-span-1 bg-white rounded-xl p-3 shadow-sm h-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition mb-1 ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon} {tab.name}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="lg:col-span-3 bg-white rounded-xl p-6 shadow-sm">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-5">Profile Information</h2>

                  <div className="flex items-center gap-5 mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      {profile.name.charAt(0)}
                    </div>
                    <div>
                      <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">
                        Change Photo
                      </button>
                      <p className="text-xs text-gray-500 mt-1">JPG or PNG. Max 2MB.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-primary text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-primary text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="text"
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-primary text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                      <input
                        type="text"
                        value={profile.company}
                        onChange={(e) => setProfile({...profile, company: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-primary text-sm"
                      />
                    </div>
                  </div>

                  <button className="mt-6 px-6 py-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark">
                    Save Changes
                  </button>
                </div>
              )}

              {activeTab === 'store' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-5">Store Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                      <input type="text" defaultValue="My Awesome Store" className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-primary text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-primary text-sm">
                        <option>INR (₹)</option>
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                      </select>
                    </div>
                    <button className="px-6 py-3 bg-primary text-white rounded-lg text-sm font-medium">Save Changes</button>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-5">Notification Preferences</h2>
                  <div className="space-y-4">
                    {['Order Updates', 'New Customers', 'Payment Received', 'Weekly Reports'].map((item) => (
                      <div key={item} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">{item}</span>
                        <label className="relative inline-block w-12 h-6">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-primary transition"></div>
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-6"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-5">Security</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <input type="password" className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-primary text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input type="password" className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-primary text-sm" />
                    </div>
                    <button className="px-6 py-3 bg-primary text-white rounded-lg text-sm font-medium">Update Password</button>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-5">Billing</h2>
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-xl">
                    <p className="text-sm opacity-90">Current Plan</p>
                    <h3 className="text-2xl font-bold mt-1">Free Plan</h3>
                    <p className="text-sm opacity-90 mt-2">Upgrade to unlock more features</p>
                    <button className="mt-4 bg-white text-primary px-5 py-2 rounded-lg text-sm font-semibold">Upgrade to Pro</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;