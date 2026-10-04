import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaGlobe, FaGear, FaChevronDown, FaDesktop, FaMagnifyingGlass } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const navigate = useNavigate();
  const { isPinSet } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const statuses = ['All', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const API_URL = 'http://localhost:5000/api';

      const res = await fetch(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch orders');
      }

      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = 'http://localhost:5000/api';

      const res = await fetch(`${API_URL}/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = filter === 'All' || o.status === filter;
    const matchesSearch =
      !searchTerm ||
      o.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer?.phone?.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

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
            <p className="text-sm text-gray-500 mt-1">
              {orders.length} total orders
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-5 flex flex-col md:flex-row gap-3">
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 flex-1">
            <FaMagnifyingGlass className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Search by order ID, customer, phone..."
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
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition capitalize ${
                    filter === s
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          {loading ? (
            <div className="bg-white p-10 rounded-xl text-center text-gray-500">
              Loading orders...
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
              {error}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white p-10 rounded-xl text-center text-gray-500">
              No orders found
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">
                      Order ID
                    </th>
                    <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">
                      Customer
                    </th>
                    <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">
                      Items
                    </th>
                    <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">
                      Total
                    </th>
                    <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">
                      Payment
                    </th>
                    <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-5 py-3 text-sm font-medium text-gray-800">
                        #{order.orderNumber || order._id.slice(-6)}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-700">
                        <div>{order.customer?.name}</div>
                        <div className="text-xs text-gray-500">
                          {order.customer?.phone}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600">
                        {order.items?.length || 0} items
                      </td>
                      <td className="px-5 py-3 text-sm font-semibold text-gray-800">
                        ₹{order.total}
                      </td>
                      <td className="px-5 py-3 text-xs">
                        <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 uppercase">
                          {order.paymentMethod || 'COD'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border-0 outline-none cursor-pointer ${getStatusColor(order.status)}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Orders;