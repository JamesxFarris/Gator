// User Types
export interface User {
  id: string;
  createdAt: string;
  hasCompletedOnboarding: boolean;
  notificationsEnabled: boolean;
  reminderTime?: string;
}

// Gator Types
export type GatorExpression = 'happy' | 'excited' | 'sleepy' | 'encouraging' | 'neutral' | 'proud';

export type GatorAccessory =
  | 'none'
  | 'bow'
  | 'hat'
  | 'glasses'
  | 'scarf'
  | 'flower'
  | 'crown'
  | 'headphones';

export type GatorEnvironment =
  | 'pond'
  | 'garden'
  | 'beach'
  | 'forest'
  | 'cozy_room'
  | 'starry_night';

export interface Gator {
  name: string;
  level: number;
  experience: number;
  expression: GatorExpression;
  accessory: GatorAccessory;
  environment: GatorEnvironment;
  unlockedAccessories: GatorAccessory[];
  unlockedEnvironments: GatorEnvironment[];
}

// Mood Types
export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export type MoodEmoji = '😢' | '😔' | '😐' | '🙂' | '😊';

export interface MoodEntry {
  id: string;
  date: string;
  level: MoodLevel;
  note?: string;
  createdAt: string;
}

// Habit Types
export type HabitCategory = 'hydration' | 'movement' | 'mindfulness' | 'social' | 'rest' | 'creativity';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  category: HabitCategory;
  experienceReward: number;
  isDefault: boolean;
  isActive: boolean;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: string;
  completedAt: string;
}

// Journal Types
export interface JournalEntry {
  id: string;
  date: string;
  prompt?: string;
  content: string;
  mood?: MoodLevel;
  createdAt: string;
  updatedAt: string;
}

export interface JournalPrompt {
  id: string;
  text: string;
  category: 'gratitude' | 'reflection' | 'growth' | 'affirmation';
}

// Streak Types
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
}

// Achievement Types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  condition: {
    type: 'streak' | 'habits_completed' | 'moods_logged' | 'journal_entries' | 'level';
    threshold: number;
  };
}

// Level System
export interface LevelThreshold {
  level: number;
  experienceRequired: number;
  unlocks?: {
    accessory?: GatorAccessory;
    environment?: GatorEnvironment;
  };
}

// Navigation Types
export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  NameGator: undefined;
  SelectHabits: undefined;
  SetReminder: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  MoodCheckIn: undefined;
  Habits: undefined;
  Journal: undefined;
  Customize: undefined;
};

export type JournalStackParamList = {
  JournalList: undefined;
  JournalEntry: { entryId?: string; promptId?: string };
};

// Store State Types
export interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  completeOnboarding: () => void;
}

export interface GatorState {
  gator: Gator;
  setGatorName: (name: string) => void;
  addExperience: (amount: number) => void;
  setExpression: (expression: GatorExpression) => void;
  setAccessory: (accessory: GatorAccessory) => void;
  setEnvironment: (environment: GatorEnvironment) => void;
  unlockAccessory: (accessory: GatorAccessory) => void;
  unlockEnvironment: (environment: GatorEnvironment) => void;
}

export interface MoodState {
  moodEntries: MoodEntry[];
  addMoodEntry: (level: MoodLevel, note?: string) => void;
  getMoodEntriesForDate: (date: string) => MoodEntry[];
  getRecentMoods: (days: number) => MoodEntry[];
}

export interface HabitState {
  habits: Habit[];
  completions: HabitCompletion[];
  addHabit: (habit: Omit<Habit, 'id'>) => void;
  toggleHabitActive: (habitId: string) => void;
  completeHabit: (habitId: string) => void;
  getCompletionsForDate: (date: string) => HabitCompletion[];
  isHabitCompletedToday: (habitId: string) => boolean;
}

export interface JournalState {
  entries: JournalEntry[];
  addEntry: (content: string, prompt?: string, mood?: MoodLevel) => void;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntryById: (id: string) => JournalEntry | undefined;
}

export interface StreakState {
  streakData: StreakData;
  updateStreak: () => void;
  checkAndUpdateStreak: () => void;
}

export interface AppState extends UserState, GatorState, MoodState, HabitState, JournalState, StreakState {
  isHydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
}
