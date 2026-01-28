import { useMemo } from 'react';
import { useAppStore, useActiveHabits, useMoodEntries } from '../store/useAppStore';
import { getToday } from '../utils';

interface DailyProgress {
  habitsCompleted: number;
  habitsTotal: number;
  habitProgress: number;
  hasMoodEntry: boolean;
  hasJournalEntry: boolean;
  overallProgress: number;
}

export const useDailyProgress = (): DailyProgress => {
  const activeHabits = useActiveHabits();
  const moodEntries = useMoodEntries();
  const journalEntries = useAppStore((state) => state.entries);
  const isHabitCompletedToday = useAppStore((state) => state.isHabitCompletedToday);

  return useMemo(() => {
    const today = getToday();

    // Habits progress
    const habitsCompleted = activeHabits.filter((h) => isHabitCompletedToday(h.id)).length;
    const habitsTotal = activeHabits.length;
    const habitProgress = habitsTotal > 0 ? habitsCompleted / habitsTotal : 0;

    // Mood check-in
    const hasMoodEntry = moodEntries.some((m) => m.date === today);

    // Journal entry
    const hasJournalEntry = journalEntries.some((e) => e.date === today);

    // Overall progress (habits count as 70%, mood 15%, journal 15%)
    let overallProgress = habitProgress * 0.7;
    if (hasMoodEntry) overallProgress += 0.15;
    if (hasJournalEntry) overallProgress += 0.15;

    return {
      habitsCompleted,
      habitsTotal,
      habitProgress,
      hasMoodEntry,
      hasJournalEntry,
      overallProgress,
    };
  }, [activeHabits, moodEntries, journalEntries, isHabitCompletedToday]);
};

export default useDailyProgress;
