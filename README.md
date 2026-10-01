# 🍔 Food Ordering & Menu Management Mobile Application

A full-stack mobile application developed for the **SE2020 – Web and Mobile Technologies** assignment.

The system enables customers to browse a food menu, search and filter menu items, place orders, and track their order status. Administrators can manage menu items, upload food images, and process customer orders through dedicated admin functionality.

---

## 📌 Project Overview

The **Food Ordering and Menu Management Mobile Application** provides a complete food-ordering workflow through a mobile application backed by a RESTful API.

### 👤 Customer

- Register and log in securely
- Browse available food items
- Search menu items
- Filter items by category
- View detailed menu item information
- Place food orders
- View personal order history
- Track order status
- Manage profile information

### 👨‍💼 Administrator

- Secure admin authentication
- Create menu items
- Update menu items
- Delete menu items
- Upload and manage food images
- Manage item availability
- View all customer orders
- Update order statuses

---

## 🏗️ System Architecture

```text
┌──────────────────────────────┐
│       React Native App       │
│       Expo + TypeScript      │
└──────────────┬───────────────┘
               │
               │ REST API / Axios
               ▼
┌──────────────────────────────┐
│       Express.js API         │
│                              │
│  Authentication              │
│  Menu Management             │
│  Order Management            │
│  Validation & Authorization  │
└───────┬──────────────┬───────┘
        │              │
        ▼              ▼
┌──────────────┐  ┌──────────────┐
│ MongoDB Atlas│  │  Cloudinary  │
│   Database   │  │ Image Storage│
└──────────────┘  └──────────────┘
```

---

## 📂 Repository Structure

This repository follows a monorepo structure containing both the backend API and mobile application.

```text
food-ordering-app/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── menuController.js
│   │   └── orderController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   └── validationMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── MenuItem.js
│   │   └── Order.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── menuRoutes.js
│   │   └── orderRoutes.js
│   │
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── mobile/
    ├── src/
    │   ├── api/
    │   │   ├── axiosClient.ts
    │   │   ├── menuService.ts
    │   │   └── orderService.ts
    │   │
    │   ├── components/
    │   │   ├── EmptyState.tsx
    │   │   ├── ErrorText.tsx
    │   │   ├── InputField.tsx
    │   │   ├── Loading.tsx
    │   │   ├── MenuCard.tsx
    │   │   ├── OrderCard.tsx
    │   │   ├── PrimaryButton.tsx
    │   │   └── StatusBadge.tsx
    │   │
    │   ├── config/
    │   │   └── env.ts
    │   │
    │   ├── context/
    │   │   └── AuthContext.tsx
    │   │
    │   ├── navigation/
    │   │   ├── AppNavigator.tsx
    │   │   ├── AuthStack.tsx
    │   │   ├── MainTabs.tsx
    │   │   └── types.ts
    │   │
    │   ├── screens/
    │   │   ├── SplashScreen.tsx
    │   │   ├── auth/
    │   │   ├── menu/
    │   │   ├── orders/
    │   │   ├── profile/
    │   │   └── admin/
    │   │
    │   ├── theme/
    │   │   └── colors.ts
    │   │
    │   ├── types/
    │   │   ├── menuItem.ts
    │   │   └── order.ts
    │   │
    │   └── utils/
    │       ├── normalizeAvailability.ts
    │       └── validators.ts
    │
    ├── App.tsx
    ├── app.json
    ├── package.json
    └── tsconfig.json
```

---

## 🛠️ Tech Stack

### 📱 Mobile Application

<p>
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native"/>
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
</p>

| Technology        | Purpose                           |
| ----------------- | --------------------------------- |
| React Native      | Cross-platform mobile application |
| Expo SDK 57       | Mobile development and deployment |
| TypeScript        | Type-safe application development |
| React Navigation  | Stack and tab navigation          |
| Axios             | REST API communication            |
| AsyncStorage      | Local client-side storage         |
| Ionicons          | Application icons                 |
| Expo Image Picker | Selecting images from device      |

### ⚙️ Backend

<p>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose"/>
</p>

| Technology    | Purpose              |
| ------------- | -------------------- |
| Node.js       | Backend runtime      |
| Express.js    | REST API framework   |
| MongoDB Atlas | Cloud database       |
| Mongoose      | MongoDB ODM          |
| JWT           | Authentication       |
| bcryptjs      | Password hashing     |
| Multer        | File upload handling |
| Cloudinary    | Food image storage   |

### ☁️ Deployment & Tools

<p>
  <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black" alt="Render"/>
  <img src="https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB Atlas"/>
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary"/>
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
</p>

---

## 🚀 Deployment Details

| Component          | Deployment    |
| ------------------ | ------------- |
| Backend            | Render        |
| Database           | MongoDB Atlas |
| Image Storage      | Cloudinary    |
| Mobile Application | Expo Go       |

### Backend

```text
Backend URL:
https://food-ordering-app-8wh7.onrender.com/api

Health Check:
https://food-ordering-app-8wh7.onrender.com/health
```

> Replace the placeholder URL with the actual deployed Render URL before submission.

---

## 🔐 Environment Variables

The backend requires the following environment variables.

Create a `.env` file inside the `backend/` directory.

```env
PORT=5000

MONGO_URI=mongodb://dbadmindevplux:DevpluxIT2026@ac-lbmktyd-shard-00-00.3m8rimy.mongodb.net:27017,ac-lbmktyd-shard-00-01.3m8rimy.mongodb.net:27017,ac-lbmktyd-shard-00-02.3m8rimy.mongodb.net:27017/food-ordering-db?ssl=true&replicaSet=atlas-e9rg4j-shard-0&authSource=admin&appName=Cluster0
JWT_SECRET=food_app_secret_jwt_key


CLOUDINARY_CLOUD_NAME=xoghnr60
CLOUDINARY_API_KEY=777218796215433
CLOUDINARY_API_SECRET=-JAUlATKgft85cj6w7RpJGewL8M
```

### ⚠️ Security

Never commit the actual `.env` file or sensitive credentials to GitHub.

Use `.env.example` to document the required environment variables.

---

# 💻 Local Setup & Running Guide

## Prerequisites

Make sure the following are installed:

- Node.js `v18+`
- npm
- Yarn
- Git
- Expo Go mobile application
- MongoDB Atlas account

---

## 1️⃣ Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd food-ordering-app
```

---

## 2️⃣ Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
yarn install
```

Create a `.env` file:

```bash
.env
```

Add the required environment variables.

Start the development server:

```bash
yarn dev
```

The backend will be available at:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/health
```

---

## 3️⃣ Backend Deployment – Render

The backend can be deployed using Render.

### Configuration

| Field          | Value          |
| -------------- | -------------- |
| Service Type   | Web Service    |
| Root Directory | `backend`      |
| Build Command  | `yarn install` |
| Start Command  | `yarn start`   |
| Instance Type  | Free           |

After deployment:

1. Add all required environment variables.
2. Deploy the service.
3. Open the `/health` endpoint.
4. Verify that the backend is running successfully.

Example:

```text
https://your-backend-url.onrender.com/health
```

---

# 📱 Mobile App Setup

Navigate to the mobile application:

```bash
cd mobile
```

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npx expo start
```

Scan the displayed QR code using the **Expo Go** application.

### 📡 Local Backend Testing

When testing with a physical mobile device, the device and development computer should normally be connected to the same Wi-Fi network.

The application automatically detects the Expo development host through:

```text
Constants.expoConfig?.hostUri
```

The API configuration is located at:

```text
mobile/src/config/env.ts
```

Example:

```ts
import Constants from "expo-constants";

const debuggerHost = Constants.expoConfig?.hostUri;
const autoIp = debuggerHost ? debuggerHost.split(":")[0] : "localhost";

export const API_BASE_URL = __DEV__
  ? `http://${autoIp}:5000/api`
  : "https://food-ordering-app-8wh7.onrender.com/health";
```

---

## 📲 Common Mobile Commands

```bash
# Start Expo development server
npx expo start

# Clear Expo cache
npx expo start --clear

# Start using tunnel connection
npx expo start --tunnel

# TypeScript type checking
npx tsc --noEmit
```

---

# ✨ Features Implemented

## 🔐 Authentication

- User registration
- User login
- JWT-based authentication
- Password hashing using bcryptjs
- Protected backend routes
- Authentication-protected application screens
- Role-based admin access
- Admin middleware
- Current user retrieval

---

## 🍔 Menu Management

The **Menu Item** is the primary entity of the system.

### CRUD Operations

- Create menu item
- View all menu items
- View individual menu item
- Update menu item
- Delete menu item

### Additional Functionality

- Food image upload
- Cloudinary image storage
- Multer file handling
- File type validation
- File size validation
- Availability management
- Category classification
- Search functionality
- Category filtering

---

## 🛒 Order Management

The **Order** entity is related to users and menu items.

### Customer

- Place orders
- View own orders
- View order details
- Track order status
- Cancel/delete eligible orders

### Administrator

- View all orders
- View individual orders
- Update order status
- Process customer orders

---

## 🧠 Business Logic

The application implements several business rules:

### Total Amount Calculation

```text
Total Amount = Menu Item Price × Quantity
```

The total amount is calculated by the backend when an order is created.

### Availability Validation

Orders cannot be placed for menu items that are currently unavailable.

### Order Status Flow

```text
Pending
   ↓
Confirmed
   ↓
Preparing
   ↓
Ready
   ↓
Completed
```

An order may also be cancelled where permitted:

```text
Pending → Cancelled
```

### Ownership Enforcement

Regular users can only access their own orders.

Administrators have access to all customer orders.

---

# 📱 Mobile Application Features

The mobile application includes:

- React Navigation
- Bottom tab navigation
- Stack navigation
- Authentication flow
- Form validation
- Visible validation errors
- Loading states
- Empty states
- Pull-to-refresh
- Search
- Category filters
- Menu item details
- Order history
- Order details
- Order status badges
- Order progress tracking
- Admin screens
- Image selection
- API-based data loading
- No hardcoded application data

---

# 🔌 API Endpoints

## Authentication

| Method | Endpoint             | Auth | Admin | Description         |
| ------ | -------------------- | ---: | ----: | ------------------- |
| `POST` | `/api/auth/register` |   ❌ |    ❌ | Register a new user |
| `POST` | `/api/auth/login`    |   ❌ |    ❌ | Login user          |
| `GET`  | `/api/auth/me`       |   ✅ |    ❌ | Get current user    |

---

## Menu Items

| Method   | Endpoint              | Auth | Admin | Description        |
| -------- | --------------------- | ---: | ----: | ------------------ |
| `GET`    | `/api/menu-items`     |   ❌ |    ❌ | Get all menu items |
| `GET`    | `/api/menu-items/:id` |   ❌ |    ❌ | Get a menu item    |
| `POST`   | `/api/menu-items`     |   ✅ |    ✅ | Create menu item   |
| `PUT`    | `/api/menu-items/:id` |   ✅ |    ✅ | Update menu item   |
| `DELETE` | `/api/menu-items/:id` |   ✅ |    ✅ | Delete menu item   |

> `POST /api/menu-items` supports multipart form data for image uploads.

---

## Orders

| Method   | Endpoint                 | Auth | Admin | Description           |
| -------- | ------------------------ | ---: | ----: | --------------------- |
| `POST`   | `/api/orders`            |   ✅ |    ❌ | Place an order        |
| `GET`    | `/api/orders/my`         |   ✅ |    ❌ | Get user's own orders |
| `GET`    | `/api/orders`            |   ✅ |    ✅ | Get all orders        |
| `GET`    | `/api/orders/:id`        |   ✅ |    ❌ | Get order details     |
| `PATCH`  | `/api/orders/:id/status` |   ✅ |    ✅ | Update order status   |
| `DELETE` | `/api/orders/:id`        |   ✅ |    ❌ | Delete / cancel order |

### API Error Format

```json
{
  "message": "Error description"
}
```

---

# 🗃️ Main Data Entities

The application uses three main MongoDB collections.

```text
┌──────────────┐
│     User     │
└──────┬───────┘
       │
       │ places
       ▼
┌──────────────┐
│    Order     │
└──────┬───────┘
       │
       │ contains
       ▼
┌──────────────┐
│  MenuItem    │
└──────────────┘
```

### User

Stores customer and administrator information.

### MenuItem

Stores food item information including:

- Name
- Description
- Price
- Category
- Image
- Availability

### Order

Stores:

- Customer reference
- Ordered menu items
- Quantities
- Total amount
- Order status
- Order timestamps

---

# ☁️ External Services

### MongoDB Atlas

Used as the cloud-hosted database for storing application data.

### Cloudinary

Used for storing and serving uploaded food item images.

### Render

Used for hosting the backend REST API.

### Expo

Used for developing and running the React Native mobile application.

---

# 🔒 Security Considerations

The application includes several security mechanisms:

- JWT-based authentication
- Password hashing using bcryptjs
- Protected API routes
- Admin authorization middleware
- User ownership checks
- Input validation
- File type validation
- File size validation
- Environment variables for sensitive credentials

Sensitive credentials such as database URLs, JWT secrets, and Cloudinary API keys are not included in the repository.

---

# 🧪 Testing & Verification

The system can be verified through:

### Backend

```bash
yarn dev
```

Health endpoint:

```text
GET /health
```

### Mobile

```bash
npx expo start
```

Type checking:

```bash
npx tsc --noEmit
```

The main application workflows include:

- Registration
- Login
- Menu browsing
- Menu searching
- Category filtering
- Menu item viewing
- Order creation
- Order history
- Order status tracking
- Admin menu management
- Admin order management

---

# 🤖 AI Tool Declaration

In accordance with the **SE2020 assignment requirements**, AI tools, including ChatGPT, were used strictly as learning and development support.

AI assistance was used for:

- Understanding technical concepts
- Debugging assistance
- Identifying potential implementation issues
- UI/UX design guidance
- Documentation assistance

All implemented functionality was reviewed and understood by the team members.

---

# 📚 Academic Purpose

This project was developed as part of the:

**SE2020 – Web and Mobile Technologies**

The application demonstrates the implementation of:

- Mobile application development
- RESTful API development
- Authentication and authorization
- CRUD operations
- Database integration
- Cloud image storage
- Mobile-to-backend communication
- Role-based functionality
- Business logic validation
- Cloud deployment

---

## 👨‍💻 Development Team

<p align="center">

**SE2020 – Food Ordering and Menu Management Mobile Application**

Built with React Native, Node.js, Express.js and MongoDB.

</p>
