import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaGlobe, FaGear, FaChevronDown, FaDesktop, FaMagnifyingGlass, FaUserLarge, FaEnvelope, FaPhone } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';

const Customers = () => {
  const navigate = useNavigate();
  const { isPinSet } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const customers = [
    { id: 1, name: 'Rahul Kumar', email: 'rahul@example.com', phone: '+91 98765 43210', orders: 5, spent: 1250, joined: '2026-01-15' },
    { id: 2, name: 'Priya Singh', email: 'priya@example.com', phone: '+91 98765 43211', orders: 3, spent: 890, joined: '2026-03-22' },
    { id: 3, name: 'Amit Das', email: 'amit@example.com', phone: '+91 98765 43212', orders: 8, spent: 2340, joined: '2025-11-10' },
    { id: 4, name: 'Neha Patel', email: 'neha@example.com', phone: '+91 98765 43213', orders: 2, spent: 450, joined: '2026-06-05' },
    { id: 5, name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 98765 43214', orders: 12, spent: 4580, joined: '2025-08-20' },
  ];

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
            <p className="text-sm text-gray-500 mt-1">{customers.length} total customers</p>
          </div>

          {/* Search */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-5">
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-gray-50">
            <FaMagnifyingGlass className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Search customers by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none w-full text-sm"
              />
            </div>
          </div>

          {/* Customer Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCustomers.length === 0 ? (
              <div className="col-span-3 bg-white p-10 rounded-xl text-center text-gray-500">
                No customers found
              </div>
            ) : (
              filteredCustomers.map((customer) => (
                <div key={customer.id} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{customer.name}</h3>
                      <p className="text-xs text-gray-500">Joined {customer.joined}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaEnvelope className="text-gray-400 text-xs" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaPhone className="text-gray-400 text-xs" />
                      <span>{customer.phone}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Orders</p>
                      <p className="text-lg font-bold text-gray-800">{customer.orders}</p>
                    </div>
                    <div className="text-center border-l border-gray-100">
                      <p className="text-xs text-gray-500">Spent</p>
                      <p className="text-lg font-bold text-green-600">₹{customer.spent}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Customers;