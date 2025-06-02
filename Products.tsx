import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { getProducts, getProductsByCategory, searchProducts, getCategories } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

const Products: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        let productsData: Product[];

        if (searchQuery) {
          productsData = await searchProducts(searchQuery);
          setLocalSearch(searchQuery);
        } else if (category) {
          productsData = await getProductsByCategory(category);
        } else {
          productsData = await getProducts();
        }

        const categories = await getCategories();
        setAllCategories(categories);
        setProducts(productsData);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [category, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      product.description.toLowerCase().includes(localSearch.toLowerCase())
    );
    setProducts(filtered);
  };

  const handleCategoryChange = (selectedCategory: string) => {
    navigate(`/products/${selectedCategory}`);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value);
    
    let sortedProducts = [...products];
    switch (value) {
      case 'price-low':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sortedProducts.sort((a, b) => b.rating - a.rating);
        break;
      default:
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    setProducts(sortedProducts);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = parseInt(e.target.value);
    if (type === 'min') {
      setPriceRange([value, priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], value]);
    }
  };

  const filteredProducts = products.filter(
    product => product.price >= priceRange[0] && product.price <= priceRange[1]
  );

  const resetFilters = async () => {
    setSortBy('');
    setPriceRange([0, 1000]);
    setLocalSearch('');
    navigate('/products');
    
    const productsData = await getProducts();
    setProducts(productsData);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 
           searchQuery ? `Search results for "${searchQuery}"` : 'All Products'}
        </h1>
        <p className="text-gray-600">
          {filteredProducts.length} products available
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - Mobile Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={toggleFilters}
            className="w-full flex items-center justify-between px-4 py-2 bg-gray-100 rounded-lg"
          >
            <span className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </span>
            <ChevronDown className={`h-5 w-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filters - Sidebar */}
        <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="sticky top-20 bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={resetFilters}
                className="text-sm text-primary-600 hover:text-primary-800"
              >
                Reset All
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-md font-medium mb-2">Search</h3>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full py-2 px-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <button 
                  type="submit"
                  className="absolute right-0 top-0 mt-2 mr-2 text-gray-600 hover:text-primary-600"
                >
                  <Search size={20} />
                </button>
              </form>
            </div>

            <div className="mb-6">
              <h3 className="text-md font-medium mb-2">Sort By</h3>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <div className="mb-6">
              <h3 className="text-md font-medium mb-2">Price Range</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(e, 'min')}
                  min="0"
                  max={priceRange[1]}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <span>to</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(e, 'max')}
                  min={priceRange[0]}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium mb-2">Categories</h3>
              <div className="space-y-2">
                {allCategories.map((cat) => (
                  <div key={cat} className="flex items-center">
                    <input
                      type="radio"
                      id={`category-${cat}`}
                      name="category"
                      checked={category === cat}
                      onChange={() => handleCategoryChange(cat)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label 
                      htmlFor={`category-${cat}`}
                      className="ml-2 text-gray-700 capitalize cursor-pointer"
                    >
                      {cat}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:w-3/4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4">
                <X className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;