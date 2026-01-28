import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@gator_app_state';

export interface StorageData {
  user: any;
  gator: any;
  moodEntries: any[];
  habits: any[];
  completions: any[];
  journalEntries: any[];
  streakData: any;
}

export const storage = {
  async save(data: Partial<StorageData>): Promise<void> {
    try {
      const existingData = await this.load();
      const mergedData = { ...existingData, ...data };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mergedData));
    } catch (error) {
      console.error('Error saving data:', error);
      throw error;
    }
  },

  async load(): Promise<StorageData | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  },

  async savePartial<K extends keyof StorageData>(
    key: K,
    value: StorageData[K]
  ): Promise<void> {
    try {
      const existingData = await this.load();
      const mergedData = { ...existingData, [key]: value };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mergedData));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      throw error;
    }
  },

  async loadPartial<K extends keyof StorageData>(
    key: K
  ): Promise<StorageData[K] | null> {
    try {
      const data = await this.load();
      return data?.[key] ?? null;
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      return null;
    }
  },
};

// Zustand persist middleware helper
export const createStorageMiddleware = () => ({
  getItem: async (name: string) => {
    const data = await AsyncStorage.getItem(name);
    return data;
  },
  setItem: async (name: string, value: string) => {
    await AsyncStorage.setItem(name, value);
  },
  removeItem: async (name: string) => {
    await AsyncStorage.removeItem(name);
  },
});
