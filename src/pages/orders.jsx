import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaGlobe, FaGear, FaChevronDown, FaDesktop, FaSearch } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const navigate = useNavigate();
  const { isPinSet } = useAuth();
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const orders = [
    { id: 'ORD-101', customer: 'Rahul Kumar', product: 'Rice 1kg', amount: 120, status: 'Pending', date: '2026-09-28' },
    { id: 'ORD-102', customer: 'Priya Singh', product: 'Oil 1L', amount: 160, status: 'Confirmed', date: '2026-09-28' },
    { id: 'ORD-103', customer: 'Amit Das', product: 'Sugar 1kg', amount: 45, status: 'Pending', date: '2026-09-27' },
    { id: 'ORD-104', customer: 'Neha Patel', product: 'Atta 5kg', amount: 220, status: 'Delivered', date: '2026-09-27' },
    { id: 'ORD-105', customer: 'Vikram Singh', product: 'Rice 5kg', amount: 580, status: 'Delivered', date: '2026-09-26' },
    { id: 'ORD-106', customer: 'Sneha Verma', product: 'Oil 5L', amount: 750, status: 'Cancelled', date: '2026-09-26' },
  ];

  const statuses = ['All', 'Pending', 'Confirmed', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter(o => {
    const matchesFilter = filter === 'All' || o.status === filter;
    const matchesSearch = o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    if (status === 'Pending') return 'bg-yellow-100 text-yellow-700';
    if (status === 'Confirmed') return 'bg-blue-100 text-blue-700';
    if (status === 'Delivered') return 'bg-green-100 text-green-700';
    if (status === 'Cancelled') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

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
            <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
            <p className="text-sm text-gray-500 mt-1">{orders.length} total orders</p>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-5 flex flex-col md:flex-row gap-3">
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 flex-1">
              <FaSearch className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Search by customer or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none w-full text-sm"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition ${
                    filter === s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Order ID</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Customer</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Product</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Amount</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Date</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500">No orders found</td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-5 py-3 text-sm font-medium text-gray-800">{order.id}</td>
                      <td className="px-5 py-3 text-sm text-gray-700">{order.customer}</td>
                      <td className="px-5 py-3 text-sm text-gray-600">{order.product}</td>
                      <td className="px-5 py-3 text-sm font-semibold text-gray-800">₹{order.amount}</td>
                      <td className="px-5 py-3 text-sm text-gray-500">{order.date}</td>
                      <td className="px-5 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
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

export default Orders;