import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaStore,
  FaUsers,
  FaBox,
  FaCartShopping,
  FaMoneyBill,
  FaCircleCheck,
  FaXmark,
  FaArrowRightFromBracket,
} from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const [statsRes, storesRes, usersRes, ordersRes, subsRes] = await Promise.all([
        adminAPI.getStats().catch(() => ({ stats: null })),
        adminAPI.getStores().catch(() => ({ stores: [] })),
        adminAPI.getUsers().catch(() => ({ users: [] })),
        adminAPI.getOrders().catch(() => ({ orders: [] })),
        adminAPI.getSubscriptions().catch(() => ({ subscriptions: [] })),
      ]);

      setStats(statsRes.stats);
      setStores(storesRes.stores || []);
      setUsers(usersRes.users || []);
      setOrders(ordersRes.orders || []);
      setSubscriptions(subsRes.subscriptions || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this subscription?')) return;
    try {
      await adminAPI.approveSubscription(id);
      fetchData();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject this subscription?')) return;
    try {
      await adminAPI.rejectSubscription(id);
      fetchData();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <FaCartShopping /> },
    { id: 'stores', name: 'Stores', icon: <FaStore /> },
    { id: 'users', name: 'Users', icon: <FaUsers /> },
    { id: 'orders', name: 'Orders', icon: <FaBox /> },
    { id: 'subscriptions', name: 'Payments', icon: <FaMoneyBill /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-indigo-700 to-purple-800 text-white flex flex-col">
        <div className="p-5 border-b border-white/10">
          <h1 className="text-lg font-bold flex items-center gap-2">
            <FaStore /> StoreForge
          </h1>
          <p className="text-xs text-indigo-200 mt-1">Platform Admin</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'text-indigo-100 hover:bg-white/10'
              }`}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 text-xs">
          <p className="font-medium truncate">{user?.name || 'Admin'}</p>
          <p className="text-indigo-200 truncate">{user?.email || ''}</p>
          <button
            onClick={handleLogout}
            className="mt-3 flex items-center justify-center gap-2 w-full text-xs bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition"
          >
            <FaArrowRightFromBracket /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 capitalize">
            {activeTab}
          </h2>
          <button
            onClick={fetchData}
            className="text-sm text-indigo-600 hover:underline"
          >
            Refresh
          </button>
        </header>

        <div className="p-6 flex-1 overflow-y-auto">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {error}
            </div>
          ) : (
            <>
              {/* OVERVIEW */}
              {activeTab === 'overview' && stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  <div className="bg-white rounded-xl p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Total Users</p>
                    <p className="text-3xl font-bold text-indigo-600">
                      {stats.totalUsers}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Total Stores</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {stats.totalStores}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Total Products</p>
                    <p className="text-3xl font-bold text-green-600">
                      {stats.totalProducts}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {stats.totalOrders}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm col-span-2 md:col-span-4">
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-4xl font-bold text-green-600 mt-1">
                      ₹{stats.totalRevenue}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Orders: ₹{stats.orderRevenue} | Subscriptions: ₹
                      {stats.subscriptionRevenue}
                    </p>
                  </div>
                </div>
              )}

              {/* STORES */}
              {activeTab === 'stores' && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Store</th>
                        <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Slug</th>
                        <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Owner</th>
                        <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Plan</th>
                        <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stores.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-10 text-gray-500">
                            No stores yet
                          </td>
                        </tr>
                      ) : (
                        stores.map((store) => (
                          <tr key={store._id} className="border-t hover:bg-gray-50">
                            <td className="px-5 py-3 text-sm font-medium">{store.name}</td>
                            <td className="px-5 py-3 text-sm text-gray-600 font-mono text-xs">{store.slug}</td>
                            <td className="px-5 py-3 text-sm text-gray-600">
                              <div>{store.owner?.name}</div>
                              <div className="text-xs text-gray-400">{store.owner?.email}</div>
                            </td>
                            <td className="px-5 py-3">
                              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold capitalize">
                                {store.plan}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-sm text-gray-500">
                              {new Date(store.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* USERS */}
              {activeTab === 'users' && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Name</th>
                        <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Email</th>
                        <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Role</th>
                        <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Store</th>
                        <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-10 text-gray-500">
                            No users yet
                          </td>
                        </tr>
                      ) : (
                        users.map((u) => (
                          <tr key={u._id} className="border-t hover:bg-gray-50">
                            <td className="px-5 py-3 text-sm font-medium">{u.name}</td>
                            <td className="px-5 py-3 text-sm text-gray-600">{u.email}</td>
                            <td className="px-5 py-3">
                              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold capitalize">
                                {u.role}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-sm text-gray-600">
                              {u.storeId?.name || '-'}
                            </td>
                            <td className="px-5 py-3 text-sm text-gray-500">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ORDERS */}
              {activeTab === 'orders' && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Order ID</th>
                        <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Store</th>
                        <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Customer</th>
                        <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Total</th>
                        <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-10 text-gray-500">
                            No orders yet
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr key={order._id} className="border-t hover:bg-gray-50">
                            <td className="px-5 py-3 text-sm font-medium">
                              #{order.orderNumber || order._id.slice(-6)}
                            </td>
                            <td className="px-5 py-3 text-sm text-gray-600">
                              {order.storeId?.name || '-'}
                            </td>
                            <td className="px-5 py-3 text-sm text-gray-600">
                              {order.customer?.name}
                            </td>
                            <td className="px-5 py-3 text-sm font-semibold">₹{order.total}</td>
                            <td className="px-5 py-3">
                              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold capitalize">
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* SUBSCRIPTIONS */}
              {activeTab === 'subscriptions' && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Store</th>
                        <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Plan</th>
                        <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Amount</th>
                        <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Txn ID</th>
                        <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Status</th>
                        <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptions.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-10 text-gray-500">
                            No subscriptions yet
                          </td>
                        </tr>
                      ) : (
                        subscriptions.map((sub) => (
                          <tr key={sub._id} className="border-t hover:bg-gray-50">
                            <td className="px-5 py-3 text-sm font-medium">
                              {sub.storeId?.name || '-'}
                            </td>
                            <td className="px-5 py-3 text-sm capitalize">{sub.plan}</td>
                            <td className="px-5 py-3 text-sm font-semibold">₹{sub.amount}</td>
                            <td className="px-5 py-3 text-sm text-gray-600 font-mono text-xs">
                              {sub.transactionId || '-'}
                            </td>
                            <td className="px-5 py-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                  sub.status === 'approved'
                                    ? 'bg-green-100 text-green-700'
                                    : sub.status === 'rejected'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}
                              >
                                {sub.status}
                              </span>
                            </td>
                            <td className="px-5 py-3">
                              {sub.status === 'pending' && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleApprove(sub._id)}
                                    className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                                    title="Approve"
                                  >
                                    <FaCircleCheck />
                                  </button>
                                  <button
                                    onClick={() => handleReject(sub._id)}
                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                                    title="Reject"
                                  >
                                    <FaXmark />
                                  </button>
                                </div>
                              )}
                              {sub.status !== 'pending' && (
                                <span className="text-xs text-gray-400">-</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;