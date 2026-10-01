// src/api/menuService.ts
import axiosClient from "./axiosClient";
import { MenuItem } from "../types/menuItem";

export const getMenuItems = async (): Promise<MenuItem[]> => {
  const response = await axiosClient.get("/menu-items");
  return response.data;
};

export const getMenuItemById = async (id: string): Promise<MenuItem> => {
  const response = await axiosClient.get(`/menu-items/${id}`);
  return response.data;
};

export type MenuItemInput = {
  name: string;
  description: string;
  price: number;
  category: string;
  availabilityStatus: "Available" | "Unavailable";
  imageUri?: string;
};

// Helper to build FormData for image upload
const buildMenuItemFormData = (input: MenuItemInput): FormData => {
  const formData = new FormData();

  formData.append("name", input.name);
  formData.append("description", input.description);
  formData.append("price", String(input.price));
  formData.append("category", input.category);
  formData.append("availabilityStatus", input.availabilityStatus);

  if (input.imageUri) {
    // Detect extension from the URI, fallback to jpg
    const uriParts = input.imageUri.split(".");
    const ext = uriParts.length > 1 ? uriParts[uriParts.length - 1] : "jpg";

    formData.append("image", {
      uri: input.imageUri,
      name: `photo.${ext}`,
      type: `image/${ext === "png" ? "png" : "jpeg"}`,
    } as any);
  }

  return formData;
};

export const createMenuItem = async (
  input: MenuItemInput,
): Promise<MenuItem> => {
  const formData = buildMenuItemFormData(input);
  const response = await axiosClient.post("/menu-items", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateMenuItem = async (
  id: string,
  input: MenuItemInput,
): Promise<MenuItem> => {
  const formData = buildMenuItemFormData(input);
  const response = await axiosClient.put(`/menu-items/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteMenuItem = async (id: string): Promise<void> => {
  await axiosClient.delete(`/menu-items/${id}`);
};
