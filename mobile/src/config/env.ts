// src/config/env.ts

// ============================================================
// API Base URL Configuration
// ============================================================
//
// PRODUCTION (for viva / submission):
//   Uses the deployed Render backend.
//
// LOCAL DEVELOPMENT (optional):
//   Change `USE_LOCAL_BACKEND` to `true` and make sure your
//   local backend is running on port 5000 on your LAN.
//
// ============================================================

import Constants from "expo-constants";

// ⚙️ Toggle: set to `true` only while developing against a local backend.
const USE_LOCAL_BACKEND = false;

// Auto-detect your computer's LAN IP from Expo's dev server address.
const debuggerHost = Constants.expoConfig?.hostUri;
const autoIp = debuggerHost ? debuggerHost.split(":")[0] : "localhost";

// Deployed backend URL (Render)
const PRODUCTION_API_URL = "https://food-ordering-app-8wh7.onrender.com/api";

// Local backend URL (your machine)
const LOCAL_API_URL = `http://${autoIp}:5000/api`;

export const API_BASE_URL = USE_LOCAL_BACKEND
  ? LOCAL_API_URL
  : PRODUCTION_API_URL;
