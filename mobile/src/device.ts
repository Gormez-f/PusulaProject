import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from 'expo-crypto';

// Anonim cihaz-id: login YOK (KVKK: minimum veri). Cihazda bir kez uretilir,
// kalici saklanir; tum API cagrilarinda userPseudoId olarak gider. Kimlik degil.
const KEY = 'pusula.deviceId';

let cached: string | null = null;

export async function getDeviceId(): Promise<string> {
  if (cached) return cached;

  const existing = await AsyncStorage.getItem(KEY);
  if (existing) {
    cached = existing;
    return existing;
  }

  const id = randomUUID();
  await AsyncStorage.setItem(KEY, id);
  cached = id;
  return id;
}
