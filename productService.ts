import { Product, Recommendation } from '../types';

// Mock data for products with prices in Rupees
let MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Organic Apples',
    price: 199.99,
    description: 'Fresh organic apples from local farmers. Rich in vitamins and fiber.',
    image: 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg',
    category: 'fruits',
    rating: 4.5,
    stock: 50
  },
  {
    id: '2',
    name: 'Whole Wheat Bread',
    price: 49.99,
    description: 'Freshly baked whole wheat bread. High in fiber and protein.',
    image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg',
    category: 'bakery',
    rating: 4.2,
    stock: 30
  },
  {
    id: '3',
    name: 'Organic Milk',
    price: 89.99,
    description: 'Organic whole milk from grass-fed cows. Rich in calcium and vitamin D.',
    image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg',
    category: 'dairy',
    rating: 4.8,
    stock: 20
  },
  {
    id: '4',
    name: 'Fresh Spinach',
    price: 59.99,
    description: 'Fresh organic spinach leaves. High in iron and antioxidants.',
    image: 'https://images.pexels.com/photos/2255925/pexels-photo-2255925.jpeg',
    category: 'vegetables',
    rating: 4.3,
    stock: 40
  },
  {
    id: '5',
    name: 'Free-Range Eggs',
    price: 129.99,
    description: 'Free-range eggs from local farms. High in protein and omega-3.',
    image: 'https://images.pexels.com/photos/144133/pexels-photo-144133.jpeg',
    category: 'dairy',
    rating: 4.7,
    stock: 25
  },
  {
    id: '6',
    name: 'Atlantic Salmon',
    price: 899.99,
    description: 'Fresh wild-caught Atlantic salmon. Rich in omega-3 fatty acids.',
    image: 'https://images.pexels.com/photos/3296280/pexels-photo-3296280.jpeg',
    category: 'seafood',
    rating: 4.6,
    stock: 15
  },
  {
    id: '7',
    name: 'Organic Bananas',
    price: 79.99,
    description: 'Organic bananas from sustainable farms. Rich in potassium and fiber.',
    image: 'https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg',
    category: 'fruits',
    rating: 4.4,
    stock: 60
  },
  {
    id: '8',
    name: 'Greek Yogurt',
    price: 149.99,
    description: 'Creamy Greek yogurt. High in protein and probiotics.',
    image: 'https://images.pexels.com/photos/373882/pexels-photo-373882.jpeg',
    category: 'dairy',
    rating: 4.5,
    stock: 35
  }
];

// Rest of the service functions remain the same
export const getProducts = async (): Promise<Product[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_PRODUCTS;
};

export const addProduct = async (productData: Partial<Product>): Promise<Product> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newProduct: Product = {
    id: `product-${Date.now()}`,
    name: productData.name || '',
    price: productData.price || 0,
    description: productData.description || '',
    image: productData.image || '',
    category: productData.category || '',
    rating: productData.rating || 0,
    stock: productData.stock || 0
  };
  
  MOCK_PRODUCTS = [...MOCK_PRODUCTS, newProduct];
  return newProduct;
};

export const updateProduct = async (productData: Product): Promise<Product> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  MOCK_PRODUCTS = MOCK_PRODUCTS.map(p => 
    p.id === productData.id ? productData : p
  );
  
  return productData;
};

export const deleteProduct = async (productId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  MOCK_PRODUCTS = MOCK_PRODUCTS.filter(p => p.id !== productId);
};

export const getProductById = async (id: string): Promise<Product | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const product = MOCK_PRODUCTS.find(p => p.id === id);
  return product || null;
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return MOCK_PRODUCTS.filter(p => p.category === category);
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  const lowercaseQuery = query.toLowerCase();
  return MOCK_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(lowercaseQuery) || 
    p.description.toLowerCase().includes(lowercaseQuery) ||
    p.category.toLowerCase().includes(lowercaseQuery)
  );
};

export const getCategories = async (): Promise<string[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const categories = [...new Set(MOCK_PRODUCTS.map(p => p.category))];
  return categories;
};

export const getRecommendations = async (
  productIds: string[],
  userId?: string
): Promise<Recommendation[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const productsNotInCart = MOCK_PRODUCTS.filter(p => !productIds.includes(p.id));
  const cartProducts = MOCK_PRODUCTS.filter(p => productIds.includes(p.id));
  const cartCategories = [...new Set(cartProducts.map(p => p.category))];
  
  let recommendations = productsNotInCart
    .filter(p => cartCategories.includes(p.category))
    .map(product => ({
      id: `rec-${product.id}`,
      productId: product.id,
      product,
      score: 0.7 + Math.random() * 0.3
    }));
  
  if (recommendations.length < 3) {
    const otherRecommendations = productsNotInCart
      .filter(p => !cartCategories.includes(p.category))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3 - recommendations.length)
      .map(product => ({
        id: `rec-${product.id}`,
        productId: product.id,
        product,
        score: 0.5 + Math.random() * 0.2
      }));
    
    recommendations = [...recommendations, ...otherRecommendations];
  }
  
  return recommendations.sort((a, b) => b.score - a.score).slice(0, 4);
};