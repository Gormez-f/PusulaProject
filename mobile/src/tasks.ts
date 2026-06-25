import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from 'expo-crypto';

// Hafif gorev deposu (cihazda). DEHB-dostu: uzun liste degil, tek-gorev odagi.
// Acik gorev sayisi ileride ctxCalendarLoad baglamini besler.
const KEY = 'pusula.tasks.v1';

export interface Task {
  id: string;
  text: string;
  focus: boolean; // "SIMDI" odagi (ayni anda en fazla bir tane)
  createdAt: string;
  due?: string; // ISO tarih/saat — yapilacak tarih (opsiyonel)
}

export async function listTasks(): Promise<Task[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Task[];
  } catch {
    return [];
  }
}

async function save(tasks: Task[]): Promise<Task[]> {
  await AsyncStorage.setItem(KEY, JSON.stringify(tasks));
  return tasks;
}

export async function addTask(text: string, due?: string): Promise<Task[]> {
  const tasks = await listTasks();
  const t: Task = { id: randomUUID(), text: text.trim(), focus: false, createdAt: new Date().toISOString(), due };
  return save([t, ...tasks]);
}

// Bir gorevi "SIMDI" odagi yap (digerlerinin odagini kaldir).
export async function setFocus(id: string): Promise<Task[]> {
  const tasks = await listTasks();
  return save(tasks.map((t) => ({ ...t, focus: t.id === id })));
}

export async function completeTask(id: string): Promise<Task[]> {
  const tasks = await listTasks();
  return save(tasks.filter((t) => t.id !== id));
}

// Tum gorevleri sil (KVKK: verini sil).
export async function clearTasks(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
