import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../common/Text';
import { Card } from '../common/Card';
import { JournalEntry, MoodLevel } from '../../types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { getRelativeDay, formatTime } from '../../utils';

interface JournalCardProps {
  entry: JournalEntry;
  onPress: () => void;
}

const moodEmojis: Record<MoodLevel, string> = {
  1: '😢',
  2: '😔',
  3: '😐',
  4: '🙂',
  5: '😊',
};

export const JournalCard: React.FC<JournalCardProps> = ({ entry, onPress }) => {
  const preview = entry.content.slice(0, 100) + (entry.content.length > 100 ? '...' : '');

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Text variant="labelMedium" color={colors.primary.main}>
            {getRelativeDay(entry.date)}
          </Text>
          <Text variant="caption" color={colors.text.tertiary}>
            {formatTime(entry.createdAt)}
          </Text>
        </View>
        {entry.mood && (
          <Text style={styles.mood}>{moodEmojis[entry.mood]}</Text>
        )}
      </View>

      {entry.prompt && (
        <Text
          variant="caption"
          color={colors.text.secondary}
          style={styles.prompt}
        >
          {entry.prompt}
        </Text>
      )}

      <Text variant="bodyMedium" style={styles.content} numberOfLines={3}>
        {preview}
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  dateContainer: {
    flex: 1,
  },
  mood: {
    fontSize: 24,
  },
  prompt: {
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },
  content: {
    lineHeight: 22,
  },
});

export default JournalCard;
