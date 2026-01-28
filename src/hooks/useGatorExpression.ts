import { useMemo } from 'react';
import { GatorExpression } from '../types';
import { useAppStore, useGator, useActiveHabits, useMoodEntries } from '../store/useAppStore';
import { getToday } from '../utils';

export const useGatorExpression = (): GatorExpression => {
  const gator = useGator();
  const activeHabits = useActiveHabits();
  const moodEntries = useMoodEntries();
  const isHabitCompletedToday = useAppStore((state) => state.isHabitCompletedToday);

  return useMemo(() => {
    const today = getToday();
    const hour = new Date().getHours();

    // Time-based expressions
    if (hour >= 22 || hour < 6) {
      return 'sleepy';
    }

    // Check today's progress
    const completedToday = activeHabits.filter((h) => isHabitCompletedToday(h.id));
    const allCompleted = completedToday.length === activeHabits.length && activeHabits.length > 0;

    if (allCompleted) {
      return 'proud';
    }

    // Check today's mood
    const todaysMoods = moodEntries.filter((m) => m.date === today);
    const latestMood = todaysMoods[todaysMoods.length - 1];

    if (latestMood) {
      if (latestMood.level >= 4) return 'happy';
      if (latestMood.level <= 2) return 'encouraging';
    }

    // Default expressions based on activity
    if (completedToday.length > 0) {
      return 'happy';
    }

    return 'neutral';
  }, [activeHabits, moodEntries, isHabitCompletedToday]);
};

export default useGatorExpression;
