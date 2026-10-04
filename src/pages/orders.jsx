import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
  FaGlobe,
  FaGear,
  FaChevronDown,
  FaDesktop,
  FaMagnifyingGlass,
} from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';

const Orders = () => {
  const navigate = useNavigate();
  const { isPinSet } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const statuses = [
    'All',
    'pending',
    'confirmed',
    'shipped',
    'delivered',
    'cancelled',
  ];

  // =====================================================
  // LOAD ORDERS
  // =====================================================

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await orderAPI.getOrders();

      setOrders(data.orders || []);
    } catch (err) {
      console.error('Fetch orders error:', err);

      setError(
        err.message || 'Failed to fetch orders'
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const updateStatus = async (id, status) => {
    try {
      setUpdatingOrder(id);
      setError('');

      await orderAPI.updateOrderStatus(id, status);

      setOrders((previous) =>
        previous.map((order) =>
          order._id === id
            ? {
                ...order,
                status,
              }
            : order
        )
      );
    } catch (err) {
      console.error('Update order status error:', err);

      setError(
        err.message || 'Failed to update order status'
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  // =====================================================
  // STATUS COLOR
  // =====================================================

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };

    return (
      colors[status] ||
      'bg-gray-100 text-gray-700'
    );
  };

  // =====================================================
  // FILTER ORDERS
  // =====================================================

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      filter === 'All' ||
      order.status === filter;

    const search =
      searchTerm.toLowerCase();

    const matchesSearch =
      !searchTerm ||
      order.orderNumber
        ?.toLowerCase()
        .includes(search) ||
      order.customer?.name
        ?.toLowerCase()
        .includes(search) ||
      order.customer?.phone?.includes(searchTerm);

    return (
      matchesFilter &&
      matchesSearch
    );
  });

  return (
    <div className="flex h-screen">

      <Sidebar />

      <main className="flex-1 flex flex-col">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200">

          <div className="flex gap-3">

            <button
              onClick={() =>
                navigate('/create-website')
              }
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200"
            >
              <FaGlobe />
              Create Website
            </button>

            <button
              onClick={() =>
                navigate('/settings')
              }
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200"
            >
              <FaGear />
              Settings
            </button>

            {isPinSet && (
              <button
                onClick={() =>
                  navigate('/workspace')
                }
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
              >
                <FaDesktop />
                Desktop
              </button>
            )}

          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700">
            User
            <FaChevronDown />
          </div>

        </header>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="p-6 flex-1 overflow-y-auto">

          <div className="mb-6">

            <h1 className="text-2xl font-bold text-gray-800">
              Orders
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              {orders.length} total orders
            </p>

          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-5 flex items-center justify-between">

              <span>{error}</span>

              <button
                onClick={fetchOrders}
                className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600"
              >
                Retry
              </button>

            </div>
          )}

          {/* =================================================
              FILTERS
          ================================================= */}

          <div className="bg-white p-4 rounded-xl shadow-sm mb-5 flex flex-col md:flex-row gap-3">

            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 flex-1">

              <FaMagnifyingGlass className="text-gray-400 mr-3" />

              <input
                type="text"
                placeholder="Search by order ID, customer, phone..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="bg-transparent outline-none w-full text-sm"
              />

            </div>

            <div className="flex gap-2 flex-wrap">

              {statuses.map((status) => (

                <button
                  key={status}
                  onClick={() =>
                    setFilter(status)
                  }
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition capitalize ${
                    filter === status
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>

              ))}

            </div>

          </div>

          {/* =================================================
              ORDERS TABLE
          ================================================= */}

          {loading ? (

            <div className="bg-white p-10 rounded-xl text-center text-gray-500">

              <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>

              Loading orders...

            </div>

          ) : filteredOrders.length === 0 ? (

            <div className="bg-white p-10 rounded-xl text-center text-gray-500">
              No orders found
            </div>

          ) : (

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">

              <div className="overflow-x-auto">

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

                      <tr
                        key={order._id}
                        className="border-t border-gray-100 hover:bg-gray-50"
                      >

                        {/* ORDER ID */}

                        <td className="px-5 py-3 text-sm font-medium text-gray-800">

                          #
                          {order.orderNumber ||
                            order._id?.slice(-6)}

                        </td>

                        {/* CUSTOMER */}

                        <td className="px-5 py-3 text-sm text-gray-700">

                          <div>
                            {order.customer?.name ||
                              'Unknown Customer'}
                          </div>

                          <div className="text-xs text-gray-500">
                            {order.customer?.phone ||
                              'No phone'}
                          </div>

                        </td>

                        {/* ITEMS */}

                        <td className="px-5 py-3 text-sm text-gray-600">
                          {order.items?.length || 0}{' '}
                          items
                        </td>

                        {/* TOTAL */}

                        <td className="px-5 py-3 text-sm font-semibold text-gray-800">
                          ₹{order.total || 0}
                        </td>

                        {/* PAYMENT */}

                        <td className="px-5 py-3 text-xs">

                          <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 uppercase">
                            {order.paymentMethod ||
                              'COD'}
                          </span>

                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-3">

                          <select
                            value={
                              order.status ||
                              'pending'
                            }
                            disabled={
                              updatingOrder ===
                              order._id
                            }
                            onChange={(e) =>
                              updateStatus(
                                order._id,
                                e.target.value
                              )
                            }
                            className={`px-3 py-1 rounded-full text-xs font-semibold border-0 outline-none cursor-pointer disabled:opacity-50 ${getStatusColor(
                              order.status
                            )}`}
                          >

                            <option value="pending">
                              Pending
                            </option>

                            <option value="confirmed">
                              Confirmed
                            </option>

                            <option value="shipped">
                              Shipped
                            </option>

                            <option value="delivered">
                              Delivered
                            </option>

                            <option value="cancelled">
                              Cancelled
                            </option>

                          </select>

                          {updatingOrder ===
                            order._id && (
                            <span className="ml-2 text-xs text-gray-400">
                              Updating...
                            </span>
                          )}

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          )}

        </div>

      </main>

    </div>
  );
};

export default Orders;