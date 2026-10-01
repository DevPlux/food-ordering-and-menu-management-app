import Constants from "expo-constants";

// Auto-detect your computer's LAN IP from Expo's dev server address.
const debuggerHost = Constants.expoConfig?.hostUri;
const autoIp = debuggerHost ? debuggerHost.split(":")[0] : "localhost";

// ⚙️ FORCED LOCAL for testing — this overrides everything else.
export const API_BASE_URL = `http://${autoIp}:5000/api`;
