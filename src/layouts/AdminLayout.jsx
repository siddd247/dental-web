import { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { CalendarDays, Inbox, LayoutDashboard, LogOut, Wallet, ShieldAlert, Menu, X } from 'lucide-react';
import { getAdminAuth, setAdminAuth } from '../stores/localStorageInfo';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = getAdminAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/admin/login') {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate, location]);

  const handleLogout = () => {
    setAdminAuth(false);
    navigate('/admin/login');
  };

  // If not authenticated, only render the outlet (which will be the login page)
  if (!isAuthenticated) {
    return <Outlet />;
  }

  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Slot Manager', path: '/admin/slots', icon: CalendarDays },
    { name: 'Inbox', path: '/admin/inbox', icon: Inbox },
    { name: 'Payment Tracker', path: '/admin/payments', icon: Wallet },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden bg-slate-900 text-white flex items-center justify-between p-4 shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <ShieldAlert className="h-6 w-6 text-red-400" />
          <span className="font-bold text-lg tracking-wide">Admin Portal</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="focus:outline-none hover:text-primary-400 transition-colors">
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`${isSidebarOpen ? 'flex' : 'hidden'} md:flex w-full md:w-64 bg-slate-900 text-slate-300 md:min-h-screen flex-col p-4 shadow-xl z-40 ${isSidebarOpen ? 'absolute' : ''} md:relative`}>
        <div className="hidden md:flex items-center gap-3 mb-8 px-2 mt-4 text-white">
          <ShieldAlert className="h-7 w-7 text-red-400" />
          <span className="font-bold text-lg tracking-wide">Admin Portal</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.name} 
                to={link.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  isActive 
                  ? 'bg-primary-600 text-white font-medium' 
                  : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                {link.name}
              </Link>
            )
          })}
        </nav>

        <div className="mt-8 md:mt-auto pt-8 border-t border-slate-700 md:border-t-0">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-3 text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-lg transition-colors font-medium cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
