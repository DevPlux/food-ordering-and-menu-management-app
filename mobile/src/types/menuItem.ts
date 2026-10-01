// src/types/menuItem.ts
export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  availabilityStatus: "Available" | "Unavailable";
  imageUrl?: string;
}
