import { Outlet, Link } from 'react-router-dom';
import { Stethoscope, Menu, X } from 'lucide-react';
import { useState } from 'react';

const PublicLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary-600">
            <Stethoscope className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tight">Gagan Dental Care</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Home</Link>
            <Link to="/book" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Book Appointment</Link>
            <Link to="/contact" className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-5 py-2.5 rounded-full shadow-sm transition-transform hover:scale-105">Contact</Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-primary-600 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-4 space-y-2 shadow-sm absolute w-full">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50"
            >
              Home
            </Link>
            <Link
              to="/book"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50"
            >
              Book Appointment
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:bg-primary-50"
            >
              Contact
            </Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-slate-50">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 md:gap-0">
          <div className="flex flex-col md:flex-row items-center gap-2 text-white">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-6 w-6 text-primary-500" />
              <span className="font-semibold">Gagan Dental Care</span>
            </div>
          </div>
          <div className="text-sm">
            &copy; {new Date().getFullYear()} Gagan Dental Care. All rights reserved.
          </div>
          <div className="text-sm flex gap-4">
            <Link to="/admin/login" className="hover:text-white transition-colors">Admin Login</Link>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919622172998"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50 group"
      >
        <span className="font-bold text-xl">WA</span>
        {/* Tooltip */}
        <span className="absolute right-16 bg-white text-slate-800 text-sm px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-medium">
          Chat with us!
        </span>
      </a>
    </div>
  );
};

export default PublicLayout;
