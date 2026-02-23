import AsyncStorage from "@react-native-async-storage/async-storage";

// ============================================================
// Storage keys
// ============================================================
const KEYS = {
  mountains: "unmount-mountains",
  activeMountain: "unmount-active-id",
  trophies: "unmount-trophies",
  settings: "unmount-settings",
  isPro: "unmount-is-pro",
};

export const TOTAL_DAYS = 66;
export const FREE_MOUNTAIN_LIMIT = 1;

// ============================================================
// Types
// ============================================================
export interface LogEntry {
  date: string;
  type: "clean" | "relapse";
  timestamp: number;
}

export interface MountainData {
  id: string;
  habitName: string;
  cleanDays: number;
  daysRemaining: number;
  currentStreak: number;
  bestStreak: number;
  relapseCount: number;
  totalRelapses: number;
  log: LogEntry[];
  startedAt: string;
  themeId: string;
  isVictory: boolean;
  completedAt: string | null;
}

export interface Trophy {
  id: string;
  habitName: string;
  completedAt: string;
  startedAt: string;
  totalRelapses: number;
  bestStreak: number;
  themeId: string;
}

export type MountainThemeId =
  | "classic"
  | "glacier"
  | "volcano"
  | "canyon"
  | "desert"
  | "crystal";

export interface MountainTheme {
  id: MountainThemeId;
  name: string;
  emoji: string;
  isPro: boolean;
  colors: {
    peak: string;
    mid: string;
    base: string;
    snow: string;
    snowShadow: string;
    accent: string;
  };
}

export interface AppSettings {
  remindersEnabled: boolean;
  reminderTime: string;
}

// ============================================================
// Themes
// ============================================================
export const MOUNTAIN_THEMES: MountainTheme[] = [
  {
    id: "classic",
    name: "Stone Peak",
    emoji: "\u26F0\uFE0F",
    isPro: false,
    colors: {
      peak: "#5a6e7f",
      mid: "#4a5568",
      base: "#2d3748",
      snow: "#f0f4f8",
      snowShadow: "#cbd5e0",
      accent: "#64dca0",
    },
  },
  {
    id: "volcano",
    name: "Volcano",
    emoji: "\uD83C\uDF0B",
    isPro: true,
    colors: {
      peak: "#8b2500",
      mid: "#6b1d00",
      base: "#3d1200",
      snow: "#ff6b35",
      snowShadow: "#e84e1b",
      accent: "#ff9a56",
    },
  },
  {
    id: "glacier",
    name: "Glacier",
    emoji: "\uD83E\uDDE3",
    isPro: true,
    colors: {
      peak: "#4a9ec5",
      mid: "#2d7da8",
      base: "#1a5276",
      snow: "#f0f4f8",
      snowShadow: "#b8ddf0",
      accent: "#7ec8e3",
    },
  },
  {
    id: "canyon",
    name: "Red Canyon",
    emoji: "\uD83C\uDFDC\uFE0F",
    isPro: true,
    colors: {
      peak: "#c2703e",
      mid: "#a85a2a",
      base: "#6e3a1a",
      snow: "#f5d5b8",
      snowShadow: "#dbb896",
      accent: "#e8a87c",
    },
  },
  {
    id: "desert",
    name: "Sand Dune",
    emoji: "\uD83C\uDFDD\uFE0F",
    isPro: true,
    colors: {
      peak: "#d4a76a",
      mid: "#c49352",
      base: "#8b6d3f",
      snow: "#f7eed3",
      snowShadow: "#e8d9b4",
      accent: "#f0c97e",
    },
  },
  {
    id: "crystal",
    name: "Crystal",
    emoji: "\uD83D\uDC8E",
    isPro: true,
    colors: {
      peak: "#8e6abf",
      mid: "#6f4e9e",
      base: "#432f6b",
      snow: "#e8ddf5",
      snowShadow: "#c9b5e3",
      accent: "#b38de8",
    },
  },
];

export function getTheme(id: string): MountainTheme {
  return MOUNTAIN_THEMES.find((t) => t.id === id) ?? MOUNTAIN_THEMES[0];
}

// ============================================================
// Helpers
// ============================================================
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ============================================================
// Mountain CRUD
// ============================================================
export async function loadMountains(): Promise<MountainData[]> {
  try {
    const json = await AsyncStorage.getItem(KEYS.mountains);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

export async function saveMountains(mountains: MountainData[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.mountains, JSON.stringify(mountains));
}

export async function getActiveMountainId(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.activeMountain);
}

export async function setActiveMountainId(id: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.activeMountain, id);
}

export function createMountain(
  habitName: string,
  themeId: MountainThemeId = "classic"
): MountainData {
  return {
    id: generateId(),
    habitName,
    cleanDays: 0,
    daysRemaining: TOTAL_DAYS,
    currentStreak: 0,
    bestStreak: 0,
    relapseCount: 0,
    totalRelapses: 0,
    log: [],
    startedAt: new Date().toISOString(),
    themeId,
    isVictory: false,
    completedAt: null,
  };
}

export async function addMountain(mountain: MountainData): Promise<void> {
  const mountains = await loadMountains();
  mountains.push(mountain);
  await saveMountains(mountains);
  await setActiveMountainId(mountain.id);
}

export async function updateMountain(updated: MountainData): Promise<void> {
  const mountains = await loadMountains();
  const idx = mountains.findIndex((m) => m.id === updated.id);
  if (idx >= 0) {
    mountains[idx] = updated;
    await saveMountains(mountains);
  }
}

export async function deleteMountain(id: string): Promise<void> {
  let mountains = await loadMountains();
  mountains = mountains.filter((m) => m.id !== id);
  await saveMountains(mountains);
  const activeId = await getActiveMountainId();
  if (activeId === id && mountains.length > 0) {
    await setActiveMountainId(mountains[0].id);
  }
}

// ============================================================
// Trophy Room
// ============================================================
export async function loadTrophies(): Promise<Trophy[]> {
  try {
    const json = await AsyncStorage.getItem(KEYS.trophies);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

export async function addTrophy(mountain: MountainData): Promise<Trophy> {
  const trophy: Trophy = {
    id: generateId(),
    habitName: mountain.habitName,
    completedAt: mountain.completedAt ?? new Date().toISOString(),
    startedAt: mountain.startedAt,
    totalRelapses: mountain.totalRelapses,
    bestStreak: mountain.bestStreak,
    themeId: mountain.themeId,
  };
  const trophies = await loadTrophies();
  trophies.push(trophy);
  await AsyncStorage.setItem(KEYS.trophies, JSON.stringify(trophies));
  return trophy;
}

// ============================================================
// Pro Status cache
// ============================================================
export async function getProStatus(): Promise<boolean> {
  try {
    const val = await AsyncStorage.getItem(KEYS.isPro);
    return val === "true";
  } catch {
    return false;
  }
}

export async function setProStatus(isPro: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.isPro, isPro ? "true" : "false");
}

// ============================================================
// Settings
// ============================================================
export async function loadSettings(): Promise<AppSettings> {
  try {
    const json = await AsyncStorage.getItem(KEYS.settings);
    return json ? JSON.parse(json) : { remindersEnabled: false, reminderTime: "09:00" };
  } catch {
    return { remindersEnabled: false, reminderTime: "09:00" };
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(KEYS.settings, JSON.stringify(settings));
}

// ============================================================
// Full Reset
// ============================================================
export async function clearAllData(): Promise<void> {
  await Promise.all(Object.values(KEYS).map((k) => AsyncStorage.removeItem(k)));
}

// ============================================================
// Analytics (Pro feature)
// ============================================================
export interface WeeklyStats {
  weekLabel: string;
  cleanDays: number;
  relapses: number;
}

export function computeWeeklyStats(log: LogEntry[]): WeeklyStats[] {
  if (log.length === 0) return [];
  const weeks: Map<string, { clean: number; relapse: number }> = new Map();
  log.forEach((entry) => {
    const d = new Date(entry.timestamp || Date.parse(entry.date));
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (!weeks.has(key)) weeks.set(key, { clean: 0, relapse: 0 });
    const w = weeks.get(key)!;
    if (entry.type === "clean") w.clean++;
    else w.relapse++;
  });
  return Array.from(weeks.entries()).map(([weekLabel, data]) => ({
    weekLabel,
    cleanDays: data.clean,
    relapses: data.relapse,
  }));
}

export interface RelapsePattern {
  dayOfWeek: string;
  count: number;
}

export function computeRelapsePatterns(log: LogEntry[]): RelapsePattern[] {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const counts = new Array(7).fill(0);
  log
    .filter((e) => e.type === "relapse")
    .forEach((entry) => {
      const d = new Date(entry.timestamp || Date.parse(entry.date));
      counts[d.getDay()]++;
    });
  return days.map((dayOfWeek, i) => ({ dayOfWeek, count: counts[i] }));
}
