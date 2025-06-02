import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Star, Truck, Package, RefreshCw, ArrowLeft } from 'lucide-react';
import { getProductById, getProductsByCategory } from '../services/productService';
import { Product } from '../types';
import { useShoppingCart } from '../context/ShoppingCartContext';
import ProductCard from '../components/ProductCard';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useShoppingCart();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const productData = await getProductById(id);
        setProduct(productData);
        
        if (productData?.category) {
          const related = await getProductsByCategory(productData.category);
          setRelatedProducts(related.filter(p => p.id !== id).slice(0, 4));
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link 
          to="/products" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex mb-8 text-sm text-gray-500">
        <Link to="/" className="hover:text-gray-700">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-gray-700">Products</Link>
        <span className="mx-2">/</span>
        <Link to={`/products/${product.category}`} className="hover:text-gray-700 capitalize">{product.category}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Product Image */}
        <div className="rounded-lg overflow-hidden bg-white shadow-md">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
              <span className="ml-2 text-gray-600">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-gray-600 capitalize">Category: {product.category}</span>
          </div>
          
          <div className="text-2xl font-bold text-primary-600 mb-4">
            ${product.price.toFixed(2)}
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700 mb-4">{product.description}</p>
            <div className="flex items-center text-gray-700 mb-2">
              <Truck className="h-5 w-5 mr-2 text-primary-600" />
              <span>Free shipping on orders over $35</span>
            </div>
            <div className="flex items-center text-gray-700 mb-2">
              <Package className="h-5 w-5 mr-2 text-primary-600" />
              <span>In stock: {product.stock} units</span>
            </div>
            <div className="flex items-center text-gray-700">
              <RefreshCw className="h-5 w-5 mr-2 text-primary-600" />
              <span>30-day return policy</span>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <button 
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="bg-gray-200 text-gray-600 px-3 py-1 rounded-l-md disabled:opacity-50"
              >
                -
              </button>
              <span className="bg-gray-100 text-gray-800 px-4 py-1 inline-block w-16 text-center">
                {quantity}
              </span>
              <button 
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
                className="bg-gray-200 text-gray-600 px-3 py-1 rounded-r-md disabled:opacity-50"
              >
                +
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(relatedProduct => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;