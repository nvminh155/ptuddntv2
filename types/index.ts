export interface Cuisine {
  id: string
  name: string
  image: string
}

export interface Dish {
  id: string
  name: string
  price: number
  description: string
  image: string
  cuisineId: string
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: any;
}
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
}