import { Order, CartItem, Address } from '../types';

// Mock data for orders
const MOCK_ORDERS: Order[] = [];

// Create a new order
export const createOrder = async (
  userId: string,
  items: CartItem[],
  total: number,
  shippingAddress: Address
): Promise<Order> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newOrder: Order = {
    id: `order-${Date.now()}`,
    userId,
    items,
    total,
    status: 'pending',
    date: new Date().toISOString(),
    shippingAddress
  };
  
  // Add to mock orders
  MOCK_ORDERS.push(newOrder);
  
  return newOrder;
};

// Get orders by user ID
export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return MOCK_ORDERS.filter(order => order.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get order by ID
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const order = MOCK_ORDERS.find(o => o.id === orderId);
  return order || null;
};

// Update order status
export const updateOrderStatus = async (
  orderId: string, 
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
): Promise<Order | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const orderIndex = MOCK_ORDERS.findIndex(o => o.id === orderId);
  if (orderIndex === -1) return null;
  
  MOCK_ORDERS[orderIndex] = {
    ...MOCK_ORDERS[orderIndex],
    status
  };
  
  return MOCK_ORDERS[orderIndex];
};