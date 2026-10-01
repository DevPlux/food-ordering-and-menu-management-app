// src/api/orderService.ts
import axiosClient from "./axiosClient";
import { Order, OrderStatus } from "../types/order";
import { MenuItem } from "../types/menuItem";

// ============= Read =============

export const getMyOrders = async (): Promise<Order[]> => {
  const response = await axiosClient.get("/orders/my");
  return response.data;
};

export const getAllOrders = async (): Promise<Order[]> => {
  const response = await axiosClient.get("/orders");
  return response.data;
};

export const getOrderById = async (id: string): Promise<Order> => {
  const response = await axiosClient.get(`/orders/${id}`);
  return response.data;
};

// ============= Create =============

type CreateOrderInput = {
  menuItem: MenuItem;
  quantity: number;
};

export const createOrder = async ({
  menuItem,
  quantity,
}: CreateOrderInput): Promise<Order> => {
  const response = await axiosClient.post("/orders", {
    menuItemId: menuItem._id,
    quantity,
  });
  return response.data;
};

// ============= Status =============

export const updateOrderStatus = async (
  id: string,
  newStatus: OrderStatus,
): Promise<Order> => {
  const response = await axiosClient.patch(`/orders/${id}/status`, {
    status: newStatus,
  });
  return response.data;
};

export const cancelOrder = async (id: string): Promise<Order> => {
  const response = await axiosClient.patch(`/orders/${id}/status`, {
    status: "Cancelled",
  });
  return response.data;
};

// ============= Delete =============

export const deleteOrder = async (id: string): Promise<void> => {
  await axiosClient.delete(`/orders/${id}`);
};
