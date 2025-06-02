import React from 'react';
import { ShoppingCart, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white pt-10 pb-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <ShoppingCart className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">SmartCart</span>
            </div>
            <p className="text-gray-300 mb-4">
              Making grocery shopping smarter with AI-powered recommendations and a seamless shopping experience.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-300 hover:text-white transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                  Login / Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products/fruits" className="text-gray-300 hover:text-white transition-colors">
                  Fruits
                </Link>
              </li>
              <li>
                <Link to="/products/vegetables" className="text-gray-300 hover:text-white transition-colors">
                  Vegetables
                </Link>
              </li>
              <li>
                <Link to="/products/dairy" className="text-gray-300 hover:text-white transition-colors">
                  Dairy
                </Link>
              </li>
              <li>
                <Link to="/products/bakery" className="text-gray-300 hover:text-white transition-colors">
                  Bakery
                </Link>
              </li>
              <li>
                <Link to="/products/seafood" className="text-gray-300 hover:text-white transition-colors">
                  Seafood
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5" />
                <span className="text-gray-300">
                  123 Grocery Lane, Fresh City, FC 12345
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <span className="text-gray-300">(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <span className="text-gray-300">support@smartcart.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-5">
          <p className="text-center text-gray-400">
            &copy; {new Date().getFullYear()} SmartCart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;