import { NavLink } from 'react-router-dom';
import {
  FaCube,
  FaHouse,
  FaGlobe,
  FaBox,
  FaCartShopping,
  FaUsers,
  FaCreditCard,
  FaFile,
  FaImage,
  FaGear,
  FaDesktop,
  FaMoneyBill,
  FaUser,
  FaShield,
} from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { isPinSet, user } = useAuth();

  const menuItems = [
    { name: 'Dashboard', icon: <FaHouse />, path: '/dashboard' },
    { name: 'Websites', icon: <FaGlobe />, path: '/websites' },
    { name: 'Products', icon: <FaBox />, path: '/products' },
    { name: 'Orders', icon: <FaCartShopping />, path: '/orders' },
    { name: 'Customers', icon: <FaUsers />, path: '/customers' },
    { name: 'Payments', icon: <FaCreditCard />, path: '/payments' },
    { name: 'Pages', icon: <FaFile />, path: '/pages' },
    { name: 'Media', icon: <FaImage />, path: '/media' },
    { name: 'Billing', icon: <FaMoneyBill />, path: '/billing' },
    { name: 'Tax & Settings', icon: <FaGear />, path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-sidebar text-gray-400 flex flex-col h-screen">
      {/* Header */}
      <div className="p-5 flex items-center gap-3 text-white font-bold text-lg border-b border-gray-700">
        <FaCube /> Your Platform
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3 text-sm transition hover:bg-sidebar-hover hover:text-white ${
                isActive
                  ? 'bg-sidebar-hover text-white border-l-4 border-primary'
                  : ''
              }`
            }
          >
            {item.icon} {item.name}
          </NavLink>
        ))}

        {/* Platform Admin Link */}
        <NavLink
          to="/admin-panel"
          className={({ isActive }) =>
            `flex items-center gap-3 px-5 py-3 text-sm text-yellow-400 font-semibold mt-2 border-t border-gray-700 hover:bg-sidebar-hover ${
              isActive ? 'bg-sidebar-hover text-white border-l-4 border-yellow-400' : ''
            }`
          }
        >
          <FaShield /> Platform Admin
        </NavLink>

        {/* Desktop Link */}
        {isPinSet && (
          <NavLink
            to="/workspace"
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3 text-sm text-blue-400 font-semibold border-t border-gray-700 hover:bg-sidebar-hover ${
                isActive ? 'bg-sidebar-hover text-white border-l-4 border-blue-400' : ''
              }`
            }
          >
            <FaDesktop /> Desktop
          </NavLink>
        )}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-sm">
            <FaUser />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;