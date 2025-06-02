import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, AlertCircle, ArrowRight } from 'lucide-react';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { useAuth } from '../context/AuthContext';
import RecommendationSection from '../components/RecommendationSection';

const Cart: React.FC = () => {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useShoppingCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.id} className="p-4 sm:p-6 animate-fade-in">
                    <div className="flex flex-col sm:flex-row items-center">
                      <div className="w-full sm:w-24 h-24 flex-shrink-0 mb-4 sm:mb-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div className="ml-0 sm:ml-6 flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                          <Link
                            to={`/product/${item.productId}`}
                            className="text-lg font-medium text-gray-900 hover:text-primary-600"
                          >
                            {item.product.name}
                          </Link>
                          <div className="text-lg font-medium text-primary-600 mt-2 sm:mt-0">
                            ₹{(item.product.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 mb-4">₹{item.product.price.toFixed(2)} each</p>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                          <div className="flex items-center mb-4 sm:mb-0">
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              className="bg-gray-200 text-gray-600 px-3 py-1 rounded-l-md"
                            >
                              -
                            </button>
                            <span className="bg-gray-100 text-gray-800 px-4 py-1 inline-block w-12 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                              className="bg-gray-200 text-gray-600 px-3 py-1 rounded-r-md"
                              disabled={item.quantity >= item.product.stock}
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.productId)}
                            className="text-red-600 hover:text-red-800 flex items-center"
                          >
                            <Trash2 className="h-5 w-5 mr-1" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="p-4 sm:p-6 border-t border-gray-200">
                <div className="flex justify-between">
                  <button
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-800 flex items-center"
                  >
                    <Trash2 className="h-5 w-5 mr-2" />
                    Clear Cart
                  </button>
                  <Link
                    to="/products"
                    className="text-primary-600 hover:text-primary-800 flex items-center"
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-medium">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900 font-medium">
                    {cartTotal >= 2500 ? 'Free' : '₹99.00'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18% GST)</span>
                  <span className="text-gray-900 font-medium">₹{(cartTotal * 0.18).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-semibold text-primary-600">
                      ₹{(cartTotal + (cartTotal >= 2500 ? 0 : 99) + cartTotal * 0.18).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="mt-6 w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              {!isAuthenticated && (
                <div className="mt-4 flex items-start text-sm text-amber-600">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <p>You'll need to log in before completing your purchase</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <div className="mx-auto w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full mb-6">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Start Shopping
          </Link>
        </div>
      )}

      {/* AI Recommendations */}
      {cartItems.length > 0 && (
        <div className="mt-12">
          <RecommendationSection />
        </div>
      )}
    </div>
  );
};

export default Cart;