// src/mocks/mockData.ts
import { MenuItem } from "../types/menuItem";
import { Order } from "../types/order";

// ---------------- Menu Items ----------------

export const mockMenuItems: MenuItem[] = [
  {
    _id: "1",
    name: "Chicken Kottu",
    description:
      "Spicy chopped roti with tender chicken, egg, and fresh vegetables.",
    price: 1200,
    category: "Main Course",
    availabilityStatus: "Available",
    imageUrl:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400&auto=format&fit=crop",
  },
  {
    _id: "2",
    name: "Cheese Burger",
    description:
      "Juicy beef patty with melted cheddar cheese, lettuce, and special sauce.",
    price: 950,
    category: "Fast Food",
    availabilityStatus: "Available",
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop",
  },
  {
    _id: "3",
    name: "Iced Coffee",
    description: "Chilled freshly brewed coffee with milk and ice.",
    price: 450,
    category: "Beverage",
    availabilityStatus: "Unavailable",
    imageUrl:
      "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=400&auto=format&fit=crop",
  },
];

export function addMockMenuItem(item: MenuItem) {
  mockMenuItems.unshift(item);
}

export function updateMockMenuItem(id: string, updated: Partial<MenuItem>) {
  const idx = mockMenuItems.findIndex((i) => i._id === id);
  if (idx !== -1) {
    mockMenuItems[idx] = { ...mockMenuItems[idx], ...updated };
  }
}

export function deleteMockMenuItem(id: string) {
  const idx = mockMenuItems.findIndex((i) => i._id === id);
  if (idx !== -1) mockMenuItems.splice(idx, 1);
}

export function generateMockMenuItemId() {
  return "m" + Math.random().toString(36).substring(2, 8);
}

// ---------------- Orders ----------------

export const mockOrders: Order[] = [
  {
    _id: "o1",
    user: "u1",
    menuItem: mockMenuItems[0],
    quantity: 2,
    totalAmount: 2400,
    status: "Preparing",
    orderDate: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    _id: "o2",
    user: "u1",
    menuItem: mockMenuItems[1],
    quantity: 1,
    totalAmount: 950,
    status: "Pending",
    orderDate: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    _id: "o3",
    user: "u1",
    menuItem: mockMenuItems[2],
    quantity: 3,
    totalAmount: 1350,
    status: "Completed",
    orderDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    _id: "o4",
    user: "u1",
    menuItem: mockMenuItems[0],
    quantity: 1,
    totalAmount: 1200,
    status: "Cancelled",
    orderDate: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

export function addMockOrder(order: Order) {
  mockOrders.unshift(order);
}

export function updateMockOrder(id: string, updated: Partial<Order>) {
  const idx = mockOrders.findIndex((o) => o._id === id);
  if (idx !== -1) {
    mockOrders[idx] = { ...mockOrders[idx], ...updated };
  }
}

export function deleteMockOrder(id: string) {
  const idx = mockOrders.findIndex((o) => o._id === id);
  if (idx !== -1) mockOrders.splice(idx, 1);
}

export function generateMockOrderId() {
  return "o" + Math.random().toString(36).substring(2, 8);
}
