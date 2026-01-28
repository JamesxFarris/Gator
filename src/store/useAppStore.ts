import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AppState,
  User,
  Gator,
  GatorExpression,
  GatorAccessory,
  GatorEnvironment,
  MoodEntry,
  MoodLevel,
  Habit,
  HabitCompletion,
  JournalEntry,
  StreakData,
} from '../types';
import { generateId, getToday } from '../utils';
import { defaultHabits } from '../data/habits';
import { getLevelForExperience, getUnlocksForLevel } from '../data/levels';

const initialGator: Gator = {
  name: 'Gator',
  level: 1,
  experience: 0,
  expression: 'happy',
  accessory: 'none',
  environment: 'pond',
  unlockedAccessories: ['none'],
  unlockedEnvironments: ['pond'],
};

const initialStreakData: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: '',
};

const initialHabits: Habit[] = defaultHabits.map((habit, index) => ({
  ...habit,
  id: `default-${index}`,
}));

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Hydration state
      isHydrated: false,
      setHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),

      // User state
      user: null,
      setUser: (user: User) => set({ user }),
      updateUser: (updates: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      completeOnboarding: () =>
        set((state) => ({
          user: state.user
            ? { ...state.user, hasCompletedOnboarding: true }
            : null,
        })),

      // Gator state
      gator: initialGator,
      setGatorName: (name: string) =>
        set((state) => ({
          gator: { ...state.gator, name },
        })),
      addExperience: (amount: number) =>
        set((state) => {
          const newExperience = state.gator.experience + amount;
          const newLevel = getLevelForExperience(newExperience);
          const leveledUp = newLevel > state.gator.level;

          let newUnlockedAccessories = [...state.gator.unlockedAccessories];
          let newUnlockedEnvironments = [...state.gator.unlockedEnvironments];

          // Check for unlocks at new level
          if (leveledUp) {
            const unlocks = getUnlocksForLevel(newLevel);
            if (unlocks?.accessory && !newUnlockedAccessories.includes(unlocks.accessory)) {
              newUnlockedAccessories.push(unlocks.accessory);
            }
            if (unlocks?.environment && !newUnlockedEnvironments.includes(unlocks.environment)) {
              newUnlockedEnvironments.push(unlocks.environment);
            }
          }

          return {
            gator: {
              ...state.gator,
              experience: newExperience,
              level: newLevel,
              unlockedAccessories: newUnlockedAccessories,
              unlockedEnvironments: newUnlockedEnvironments,
              expression: leveledUp ? 'excited' : state.gator.expression,
            },
          };
        }),
      setExpression: (expression: GatorExpression) =>
        set((state) => ({
          gator: { ...state.gator, expression },
        })),
      setAccessory: (accessory: GatorAccessory) =>
        set((state) => ({
          gator: { ...state.gator, accessory },
        })),
      setEnvironment: (environment: GatorEnvironment) =>
        set((state) => ({
          gator: { ...state.gator, environment },
        })),
      unlockAccessory: (accessory: GatorAccessory) =>
        set((state) => ({
          gator: {
            ...state.gator,
            unlockedAccessories: state.gator.unlockedAccessories.includes(accessory)
              ? state.gator.unlockedAccessories
              : [...state.gator.unlockedAccessories, accessory],
          },
        })),
      unlockEnvironment: (environment: GatorEnvironment) =>
        set((state) => ({
          gator: {
            ...state.gator,
            unlockedEnvironments: state.gator.unlockedEnvironments.includes(environment)
              ? state.gator.unlockedEnvironments
              : [...state.gator.unlockedEnvironments, environment],
          },
        })),

      // Mood state
      moodEntries: [],
      addMoodEntry: (level: MoodLevel, note?: string) =>
        set((state) => {
          const newEntry: MoodEntry = {
            id: generateId(),
            date: getToday(),
            level,
            note,
            createdAt: new Date().toISOString(),
          };
          return {
            moodEntries: [...state.moodEntries, newEntry],
          };
        }),
      getMoodEntriesForDate: (date: string) => {
        return get().moodEntries.filter((entry) => entry.date === date);
      },
      getRecentMoods: (days: number) => {
        const today = new Date();
        const cutoffDate = new Date(today);
        cutoffDate.setDate(cutoffDate.getDate() - days);
        const cutoffStr = cutoffDate.toISOString().split('T')[0];

        return get().moodEntries.filter((entry) => entry.date >= cutoffStr);
      },

      // Habits state
      habits: initialHabits,
      completions: [],
      addHabit: (habit: Omit<Habit, 'id'>) =>
        set((state) => ({
          habits: [...state.habits, { ...habit, id: generateId() }],
        })),
      toggleHabitActive: (habitId: string) =>
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === habitId ? { ...habit, isActive: !habit.isActive } : habit
          ),
        })),
      completeHabit: (habitId: string) =>
        set((state) => {
          const today = getToday();
          const alreadyCompleted = state.completions.some(
            (c) => c.habitId === habitId && c.date === today
          );

          if (alreadyCompleted) {
            return state;
          }

          const habit = state.habits.find((h) => h.id === habitId);
          const newCompletion: HabitCompletion = {
            id: generateId(),
            habitId,
            date: today,
            completedAt: new Date().toISOString(),
          };

          // Add experience for completing habit
          if (habit) {
            setTimeout(() => {
              get().addExperience(habit.experienceReward);
            }, 0);
          }

          return {
            completions: [...state.completions, newCompletion],
          };
        }),
      getCompletionsForDate: (date: string) => {
        return get().completions.filter((c) => c.date === date);
      },
      isHabitCompletedToday: (habitId: string) => {
        const today = getToday();
        return get().completions.some(
          (c) => c.habitId === habitId && c.date === today
        );
      },

      // Journal state
      entries: [],
      addEntry: (content: string, prompt?: string, mood?: MoodLevel) =>
        set((state) => {
          const now = new Date().toISOString();
          const newEntry: JournalEntry = {
            id: generateId(),
            date: getToday(),
            prompt,
            content,
            mood,
            createdAt: now,
            updatedAt: now,
          };

          // Add experience for journaling
          setTimeout(() => {
            get().addExperience(15);
          }, 0);

          return {
            entries: [...state.entries, newEntry],
          };
        }),
      updateEntry: (id: string, updates: Partial<JournalEntry>) =>
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id
              ? { ...entry, ...updates, updatedAt: new Date().toISOString() }
              : entry
          ),
        })),
      deleteEntry: (id: string) =>
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        })),
      getEntryById: (id: string) => {
        return get().entries.find((entry) => entry.id === id);
      },

      // Streak state
      streakData: initialStreakData,
      updateStreak: () =>
        set((state) => {
          const today = getToday();

          if (state.streakData.lastActiveDate === today) {
            return state;
          }

          const isConsecutive =
            state.streakData.lastActiveDate &&
            (() => {
              const lastDate = new Date(state.streakData.lastActiveDate);
              const todayDate = new Date(today);
              const diffTime = todayDate.getTime() - lastDate.getTime();
              const diffDays = diffTime / (1000 * 60 * 60 * 24);
              return diffDays === 1;
            })();

          const newStreak = isConsecutive
            ? state.streakData.currentStreak + 1
            : 1;

          return {
            streakData: {
              currentStreak: newStreak,
              longestStreak: Math.max(newStreak, state.streakData.longestStreak),
              lastActiveDate: today,
            },
          };
        }),
      checkAndUpdateStreak: () => {
        const state = get();
        const today = getToday();

        // If already active today, nothing to do
        if (state.streakData.lastActiveDate === today) {
          return;
        }

        // Check if streak should be broken (missed more than 1 day)
        if (state.streakData.lastActiveDate) {
          const lastDate = new Date(state.streakData.lastActiveDate);
          const todayDate = new Date(today);
          const diffTime = todayDate.getTime() - lastDate.getTime();
          const diffDays = diffTime / (1000 * 60 * 60 * 24);

          if (diffDays > 1) {
            set({
              streakData: {
                ...state.streakData,
                currentStreak: 0,
              },
            });
          }
        }
      },
    }),
    {
      name: 'gator-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      partialize: (state) => ({
        user: state.user,
        gator: state.gator,
        moodEntries: state.moodEntries,
        habits: state.habits,
        completions: state.completions,
        entries: state.entries,
        streakData: state.streakData,
      }),
    }
  )
);

// Selector hooks for better performance
export const useUser = () => useAppStore((state) => state.user);
export const useGator = () => useAppStore((state) => state.gator);
export const useMoodEntries = () => useAppStore((state) => state.moodEntries);
export const useHabits = () => useAppStore((state) => state.habits);
export const useActiveHabits = () =>
  useAppStore((state) => state.habits.filter((h) => h.isActive));
export const useCompletions = () => useAppStore((state) => state.completions);
export const useJournalEntries = () => useAppStore((state) => state.entries);
export const useStreakData = () => useAppStore((state) => state.streakData);
export const useIsHydrated = () => useAppStore((state) => state.isHydrated);
