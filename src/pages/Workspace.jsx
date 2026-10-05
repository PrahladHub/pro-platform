import Sidebar from '../components/Sidebar';
import { FaGlobe, FaGear, FaChevronDown, FaDesktop, FaCartShopping, FaUsers } from 'react-icons/fa6';

const Workspace = () => {
  const stats = [
    { title: 'Total Orders', value: '125', icon: <FaCartShopping />, color: 'green' },
    { title: 'Total Customers', value: '480', icon: <FaUsers />, color: 'blue' },
  ];

  const recentOrders = [
    { id: 101, customer: 'Rahul Kumar', product: 'Rice 1kg', amount: '₹120', status: 'Pending' },
    { id: 102, customer: 'Priya Singh', product: 'Oil 1L', amount: '₹160', status: 'Confirmed' },
    { id: 103, customer: 'Amit Das', product: 'Sugar 1kg', amount: '₹45', status: 'Pending' },
    { id: 104, customer: 'Neha Patel', product: 'Atta 5kg', amount: '₹220', status: 'Delivered' },
  ];

  const getStatusColor = (status) => {
    if (status === 'Pending') return 'bg-yellow-100 text-yellow-700';
    if (status === 'Confirmed') return 'bg-green-100 text-green-700';
    if (status === 'Delivered') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200">
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">
              <FaGlobe /> Create Website
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">
              <FaGear /> Settings
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">
              <FaDesktop /> Desktop
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            User <FaChevronDown />
          </div>
        </header>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Desktop / Workspace</h1>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${
                  stat.color === 'green' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders Table */}
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">#</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Customer</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Product</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Amount</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-3 text-sm text-gray-700">{order.id}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">{order.customer}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">{order.product}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">{order.amount}</td>
                    <td className="px-5 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Workspace;