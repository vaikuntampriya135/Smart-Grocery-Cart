import React, { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';
import { Recommendation } from '../types';
import { getRecommendations } from '../services/productService';
import ProductCard from './ProductCard';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { useAuth } from '../context/AuthContext';

const RecommendationSection: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const { cartItems } = useShoppingCart();
  const { user } = useAuth();

  useEffect(() => {
    const loadRecommendations = async () => {
      if (cartItems.length === 0) return;
      
      setLoading(true);
      try {
        const productIds = cartItems.map(item => item.productId);
        const recs = await getRecommendations(productIds, user?.id);
        setRecommendations(recs);
      } catch (error) {
        console.error('Error loading recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [cartItems, user?.id]);

  if (cartItems.length === 0 || recommendations.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-secondary-50 to-primary-50 p-6 rounded-lg shadow-md animate-fade-in">
      <div className="flex items-center mb-4">
        <Lightbulb className="h-6 w-6 text-secondary-500 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Smart Recommendations</h2>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-4">
            Based on your cart items, you might also like these products:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.map(rec => (
              <ProductCard key={rec.id} product={rec.product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RecommendationSection;