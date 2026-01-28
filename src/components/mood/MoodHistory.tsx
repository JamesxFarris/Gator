import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../common/Text';
import { Card } from '../common/Card';
import { MoodEntry, MoodLevel } from '../../types';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { getLast7Days, getWeekday } from '../../utils';

interface MoodHistoryProps {
  entries: MoodEntry[];
}

const moodEmojis: Record<MoodLevel, string> = {
  1: '😢',
  2: '😔',
  3: '😐',
  4: '🙂',
  5: '😊',
};

export const MoodHistory: React.FC<MoodHistoryProps> = ({ entries }) => {
  const last7Days = getLast7Days();

  const getMoodForDate = (date: string): MoodEntry | undefined => {
    const dayEntries = entries.filter((e) => e.date === date);
    if (dayEntries.length === 0) return undefined;
    // Return the most recent entry for that day
    return dayEntries.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  };

  return (
    <Card style={styles.container}>
      <Text variant="labelLarge" style={styles.title}>
        Your Week
      </Text>
      <View style={styles.grid}>
        {last7Days.map((date) => {
          const mood = getMoodForDate(date);
          const isToday = date === last7Days[last7Days.length - 1];

          return (
            <View key={date} style={styles.dayColumn}>
              <View
                style={[
                  styles.moodCircle,
                  mood && { backgroundColor: colors.mood[mood.level] },
                  !mood && styles.emptyCircle,
                  isToday && styles.todayCircle,
                ]}
              >
                {mood ? (
                  <Text style={styles.emoji}>{moodEmojis[mood.level]}</Text>
                ) : (
                  <Text style={styles.emptyText}>-</Text>
                )}
              </View>
              <Text
                variant="caption"
                color={isToday ? colors.primary.main : colors.text.tertiary}
                style={styles.dayLabel}
              >
                {getWeekday(date)}
              </Text>
            </View>
          );
        })}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  title: {
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayColumn: {
    alignItems: 'center',
  },
  moodCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  emptyCircle: {
    backgroundColor: colors.neutral[100],
  },
  todayCircle: {
    borderWidth: 2,
    borderColor: colors.primary.main,
  },
  emoji: {
    fontSize: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.disabled,
  },
  dayLabel: {
    textTransform: 'uppercase',
  },
});

export default MoodHistory;
