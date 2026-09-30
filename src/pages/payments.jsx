import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaGlobe, FaGear, FaChevronDown, FaDesktop, FaMagnifyingGlass, FaIndianRupeeSign } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';

const Payments = () => {
  const navigate = useNavigate();
  const { isPinSet } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const payments = [
    { id: 'PAY-001', customer: 'Rahul Kumar', amount: 120, method: 'UPI', status: 'Completed', date: '2026-09-28' },
    { id: 'PAY-002', customer: 'Priya Singh', amount: 160, method: 'Card', status: 'Completed', date: '2026-09-28' },
    { id: 'PAY-003', customer: 'Amit Das', amount: 45, method: 'Cash', status: 'Pending', date: '2026-09-27' },
    { id: 'PAY-004', customer: 'Neha Patel', amount: 220, method: 'UPI', status: 'Completed', date: '2026-09-27' },
    { id: 'PAY-005', customer: 'Vikram Singh', amount: 580, method: 'NetBanking', status: 'Failed', date: '2026-09-26' },
  ];

  const getStatusColor = (status) => {
    if (status === 'Completed') return 'bg-green-100 text-green-700';
    if (status === 'Pending') return 'bg-yellow-100 text-yellow-700';
    if (status === 'Failed') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  const filteredPayments = payments.filter(p =>
    p.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalReceived = payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0);

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
            <h1 className="text-2xl font-bold text-gray-800">Payments</h1>
            <p className="text-sm text-gray-500 mt-1">Total received: ₹{totalReceived}</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <p className="text-sm text-gray-500">Total Received</p>
              <h3 className="text-2xl font-bold text-green-600 mt-1">₹{totalReceived}</h3>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <p className="text-sm text-gray-500">Pending</p>
              <h3 className="text-2xl font-bold text-yellow-600 mt-1">
                ₹{payments.filter(p => p.status === 'Pending').reduce((s, p) => s + p.amount, 0)}
              </h3>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <p className="text-sm text-gray-500">Transactions</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{payments.length}</h3>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-5">
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-gray-50">
              <FaMagnifyingGlass className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Search by customer or payment ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none w-full text-sm"
              />
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Payment ID</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Customer</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Amount</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Method</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Date</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((pay) => (
                  <tr key={pay.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-3 text-sm font-medium text-gray-800">{pay.id}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">{pay.customer}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-gray-800">₹{pay.amount}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{pay.method}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{pay.date}</td>
                    <td className="px-5 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(pay.status)}`}>
                        {pay.status}
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

export default Payments;