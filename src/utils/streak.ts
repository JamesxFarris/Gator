import { getToday, isYesterday, getDaysBetween } from './date';
import { StreakData } from '../types';

export const calculateStreak = (
  completionDates: string[],
  lastActiveDate: string
): { currentStreak: number; isActive: boolean } => {
  const today = getToday();
  const sortedDates = [...new Set(completionDates)].sort().reverse();

  if (sortedDates.length === 0) {
    return { currentStreak: 0, isActive: false };
  }

  const mostRecentDate = sortedDates[0];

  // If most recent activity is today, streak is active
  if (mostRecentDate === today) {
    let streak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const daysBetween = getDaysBetween(sortedDates[i], sortedDates[i - 1]);
      if (daysBetween === 1) {
        streak++;
      } else {
        break;
      }
    }
    return { currentStreak: streak, isActive: true };
  }

  // If most recent activity was yesterday, streak can continue
  if (isYesterday(mostRecentDate)) {
    let streak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const daysBetween = getDaysBetween(sortedDates[i], sortedDates[i - 1]);
      if (daysBetween === 1) {
        streak++;
      } else {
        break;
      }
    }
    return { currentStreak: streak, isActive: false };
  }

  // Streak is broken
  return { currentStreak: 0, isActive: false };
};

export const updateStreakData = (
  currentData: StreakData,
  newActivityDate: string
): StreakData => {
  const today = getToday();

  // First activity ever
  if (!currentData.lastActiveDate) {
    return {
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: newActivityDate,
    };
  }

  // Already logged today
  if (currentData.lastActiveDate === today) {
    return currentData;
  }

  // Continuing streak from yesterday
  if (isYesterday(currentData.lastActiveDate)) {
    const newStreak = currentData.currentStreak + 1;
    return {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, currentData.longestStreak),
      lastActiveDate: newActivityDate,
    };
  }

  // Starting new streak (previous streak broken)
  return {
    currentStreak: 1,
    longestStreak: currentData.longestStreak,
    lastActiveDate: newActivityDate,
  };
};

export const getStreakStatus = (streakData: StreakData): 'active' | 'pending' | 'broken' => {
  const today = getToday();

  if (!streakData.lastActiveDate) {
    return 'broken';
  }

  if (streakData.lastActiveDate === today) {
    return 'active';
  }

  if (isYesterday(streakData.lastActiveDate)) {
    return 'pending';
  }

  return 'broken';
};

export const isStreakMilestone = (streak: number): boolean => {
  const milestones = [7, 14, 21, 30, 60, 90, 100, 180, 365];
  return milestones.includes(streak);
};
