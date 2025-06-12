import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from './components/ApperIcon';

const Layout = () => {
  const location = useLocation();

  const navItems = [
    { id: 'home', label: 'Home', path: '/', icon: 'Home' },
    { id: 'sessions', label: 'Sessions', path: '/sessions', icon: 'Play' },
    { id: 'journal', label: 'Journal', path: '/journal', icon: 'BookOpen' },
    { id: 'progress', label: 'Progress', path: '/progress', icon: 'TrendingUp' }
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="h-full"
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <nav className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-500 hover:text-primary hover:bg-primary/5'
                }`
              }
            >
              {({ isActive }) => (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center"
                >
                  <ApperIcon 
                    name={item.icon} 
                    size={20} 
                    className={isActive ? 'text-primary' : 'text-gray-500'}
                  />
                  <span className={`text-xs mt-1 font-medium ${
                    isActive ? 'text-primary' : 'text-gray-500'
                  }`}>
                    {item.label}
                  </span>
                </motion.div>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;