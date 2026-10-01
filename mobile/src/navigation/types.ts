// src/navigation/types.ts
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MenuStackParamList = {
  MenuList: undefined;
  MenuDetail: { itemId: string };
};

export type OrdersStackParamList = {
  MyOrders: undefined;
  OrderDetail: { orderId: string };
};

export type MainTabParamList = {
  MenuTab: undefined;
  OrdersTab: undefined;
  AdminTab: undefined; // ← THIS is the line that fixes your error
  ProfileTab: undefined;
};

export type AdminStackParamList = {
  AdminMenuList: undefined;
  MenuItemForm: { itemId?: string };
  AdminOrders: undefined;
  AdminOrderDetail: { orderId: string };
};
