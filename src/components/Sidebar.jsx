import { NavLink } from 'react-router-dom';
import {
  FaCube, FaHouse, FaGlobe, FaBox, FaCartShopping,
  FaUsers, FaCreditCard, FaFile, FaImage, FaGear, FaDesktop
} from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { isPinSet } = useAuth();

  const menuItems = [
    { name: 'Dashboard', icon: <FaHouse />, path: '/dashboard' },
    { name: 'Websites', icon: <FaGlobe />, path: '/websites' },
    { name: 'Products', icon: <FaBox />, path: '/products' },
    { name: 'Orders', icon: <FaCartShopping />, path: '/orders' },
    { name: 'Customers', icon: <FaUsers />, path: '/customers' },
    { name: 'Payments', icon: <FaCreditCard />, path: '/payments' },
    { name: 'Pages', icon: <FaFile />, path: '/pages' },
    { name: 'Media', icon: <FaImage />, path: '/media' },
    { name: 'Tax & Settings', icon: <FaGear />, path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-sidebar text-gray-400 flex flex-col h-screen">
      <div className="p-5 flex items-center gap-3 text-white font-bold text-lg border-b border-gray-700">
        <FaCube /> Your Platform
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3 text-sm transition hover:bg-sidebar-hover hover:text-white ${
                isActive ? 'bg-sidebar-hover text-white border-l-4 border-primary' : ''
              }`
            }
          >
            {item.icon} {item.name}
          </NavLink>
        ))}

        {/* Desktop Link - Sirf tab dikhe jab PIN set ho */}
        {isPinSet && (
          <NavLink
            to="/workspace"
            className="flex items-center gap-3 px-5 py-3 text-sm text-blue-400 font-semibold mt-2 border-t border-gray-700 hover:bg-sidebar-hover"
          >
            <FaDesktop /> Desktop
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;