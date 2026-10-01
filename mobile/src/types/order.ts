// src/types/order.ts
import { MenuItem } from "./menuItem";

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Preparing"
  | "Ready"
  | "Completed"
  | "Cancelled";

export interface Order {
  _id: string;
  user: string;
  menuItem: MenuItem;
  quantity: number;
  totalAmount: number;
  status: OrderStatus;
  orderDate: string;
}
