import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useShoppingCart } from '../context/ShoppingCartContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useShoppingCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-primary-500 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand name */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <ShoppingCart className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">SmartCart</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md hover:bg-primary-600 transition-colors">
                Home
              </Link>
              <Link to="/products" className="px-3 py-2 rounded-md hover:bg-primary-600 transition-colors">
                Products
              </Link>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 py-1 px-3 pr-10 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
                <button 
                  type="submit"
                  className="absolute right-0 top-0 mt-1 mr-2 text-gray-600 hover:text-primary-600"
                >
                  <Search size={20} />
                </button>
              </form>
            </div>
          </div>

          {/* User and Cart */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className="relative px-3 py-2 rounded-md hover:bg-primary-600 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/profile" 
                  className="flex items-center px-3 py-2 rounded-md hover:bg-primary-600 transition-colors"
                >
                  <User className="h-5 w-5 mr-2" />
                  <span>{user?.name}</span>
                </Link>
                <Link 
                  to="/order-history" 
                  className="px-3 py-2 rounded-md hover:bg-primary-600 transition-colors"
                >
                  Order History
                </Link>
                <button 
                  onClick={logout}
                  className="px-3 py-2 rounded-md hover:bg-primary-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="px-3 py-2 rounded-md hover:bg-primary-600 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-primary-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary-600 px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link 
            to="/" 
            className="block px-3 py-2 rounded-md hover:bg-primary-500 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/products" 
            className="block px-3 py-2 rounded-md hover:bg-primary-500 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Products
          </Link>
          <Link 
            to="/cart" 
            className="block px-3 py-2 rounded-md hover:bg-primary-500 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Cart {cartCount > 0 && `(${cartCount})`}
          </Link>
          {isAuthenticated ? (
            <>
              <Link 
                to="/profile" 
                className="block px-3 py-2 rounded-md hover:bg-primary-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <Link 
                to="/order-history" 
                className="block px-3 py-2 rounded-md hover:bg-primary-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Order History
              </Link>
              <button 
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md hover:bg-primary-500 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="block px-3 py-2 rounded-md hover:bg-primary-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          )}
          <form onSubmit={handleSearch} className="px-3 py-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-1 px-3 pr-10 rounded-full text-gray-700 focus:outline-none"
              />
              <button 
                type="submit"
                className="absolute right-0 top-0 mt-1 mr-2 text-gray-600"
              >
                <Search size={20} />
              </button>
            </div>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar;