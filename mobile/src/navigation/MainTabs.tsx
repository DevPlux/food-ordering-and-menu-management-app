// src/navigation/MainTabs.tsx
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import MenuListScreen from "../screens/menu/MenuListScreen";
import MenuDetailScreen from "../screens/menu/MenuDetailScreen";
import MyOrdersScreen from "../screens/orders/MyOrdersScreen";
import OrderDetailScreen from "../screens/orders/OrderDetailScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import AdminMenuListScreen from "../screens/admin/AdminMenuListScreen";
import MenuItemFormScreen from "../screens/admin/MenuItemFormScreen";
import AdminOrdersScreen from "../screens/admin/AdminOrdersScreen";
import AdminOrderDetailScreen from "../screens/admin/AdminOrderDetailScreen";
import { useAuth } from "../context/AuthContext";
import {
  MainTabParamList,
  MenuStackParamList,
  OrdersStackParamList,
  AdminStackParamList,
} from "./types";

// Uber Eats inspired palette
const UE = {
  green: "#06C167",
  greenDark: "#048A4A",
  black: "#000000",
  white: "#FFFFFF",
  offWhite: "#F3F3F3",
  gray: "#8A8A8A",
  border: "#E5E5E5",
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const MenuStack = createNativeStackNavigator<MenuStackParamList>();
const OrdersStack = createNativeStackNavigator<OrdersStackParamList>();
const AdminStack = createNativeStackNavigator<AdminStackParamList>();

function MenuStackScreen() {
  return (
    <MenuStack.Navigator screenOptions={{ headerShown: false }}>
      <MenuStack.Screen name="MenuList" component={MenuListScreen} />
      <MenuStack.Screen name="MenuDetail" component={MenuDetailScreen} />
    </MenuStack.Navigator>
  );
}

function OrdersStackScreen() {
  return (
    <OrdersStack.Navigator screenOptions={{ headerShown: false }}>
      <OrdersStack.Screen name="MyOrders" component={MyOrdersScreen} />
      <OrdersStack.Screen name="OrderDetail" component={OrderDetailScreen} />
    </OrdersStack.Navigator>
  );
}

function AdminStackScreen() {
  return (
    <AdminStack.Navigator screenOptions={{ headerShown: false }}>
      <AdminStack.Screen name="AdminMenuList" component={AdminMenuListScreen} />
      <AdminStack.Screen name="MenuItemForm" component={MenuItemFormScreen} />
      <AdminStack.Screen name="AdminOrders" component={AdminOrdersScreen} />
      <AdminStack.Screen
        name="AdminOrderDetail"
        component={AdminOrderDetailScreen}
      />
    </AdminStack.Navigator>
  );
}

// Custom tab icon with a pill-highlight when focused (Uber Eats style)
function TabIcon({
  name,
  focused,
  color,
  size,
}: {
  name: any;
  focused: boolean;
  color: string;
  size: number;
}) {
  return (
    <View style={tabIconStyles.wrapper}>
      {focused && <View style={tabIconStyles.pill} />}
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
}

const tabIconStyles = StyleSheet.create({
  wrapper: {
    width: 56,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  pill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    backgroundColor: "#E6F7EE", // subtle green wash behind the active icon
  },
});

export default function MainTabs() {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: UE.black,
        tabBarInactiveTintColor: UE.gray,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: UE.white,
          borderTopWidth: 1,
          borderTopColor: UE.border,
          height: Platform.OS === "ios" ? 88 : 68,
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 28 : 10,
          paddingHorizontal: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "800",
          letterSpacing: 0.3,
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
      }}
    >
      <Tab.Screen
        name="MenuTab"
        component={MenuStackScreen}
        options={{
          title: "Menu",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name={focused ? "bag-handle" : "bag-handle-outline"}
              focused={focused}
              color={color}
              size={22}
            />
          ),
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersStackScreen}
        options={{
          title: "Orders",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name={focused ? "receipt" : "receipt-outline"}
              focused={focused}
              color={color}
              size={22}
            />
          ),
        }}
      />
      {user?.isAdmin && (
        <Tab.Screen
          name="AdminTab"
          component={AdminStackScreen}
          options={{
            title: "Admin",
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon
                name={focused ? "shield" : "shield-outline"}
                focused={focused}
                color={color}
                size={22}
              />
            ),
          }}
        />
      )}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name={focused ? "person" : "person-outline"}
              focused={focused}
              color={color}
              size={22}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
