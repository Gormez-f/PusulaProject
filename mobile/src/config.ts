import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Backend portu (3000 baska projede kullanimda -> 3334).
const PORT = 3334;

// API taban URL'ini Expo'nun sundugu host'tan otomatik turet.
// - Expo Go / fiziksel cihaz: hostUri = "172.20.10.2:8081" -> ayni IP, backend portu.
// - Web: hostUri = "localhost:8081" -> localhost:3334.
// - Android emulator (hostUri yoksa): 10.0.2.2.
function resolveBaseUrl(): string {
  const hostUri = Constants.expoConfig?.hostUri; // "ip:port" | undefined
  if (hostUri) {
    const host = hostUri.split(':')[0];
    return `http://${host}:${PORT}`;
  }
  if (Platform.OS === 'android') return `http://10.0.2.2:${PORT}`;
  return `http://localhost:${PORT}`;
}

export const API_BASE_URL = resolveBaseUrl();
