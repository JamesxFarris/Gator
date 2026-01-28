import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../common/Text';
import { Card } from '../common/Card';
import { JournalPrompt } from '../../types';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';

interface PromptCardProps {
  prompt: Omit<JournalPrompt, 'id'>;
  onPress: () => void;
}

const categoryIcons: Record<JournalPrompt['category'], string> = {
  gratitude: '🙏',
  reflection: '💭',
  growth: '🌱',
  affirmation: '💪',
};

const categoryColors: Record<JournalPrompt['category'], string> = {
  gratitude: colors.success,
  reflection: colors.accent.main,
  growth: colors.primary.main,
  affirmation: colors.secondary.main,
};

export const PromptCard: React.FC<PromptCardProps> = ({ prompt, onPress }) => {
  const icon = categoryIcons[prompt.category];
  const color = categoryColors[prompt.category];

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text variant="bodyMedium" style={styles.promptText}>
            {prompt.text}
          </Text>
          <Text variant="caption" color={colors.text.tertiary} style={styles.category}>
            {prompt.category.charAt(0).toUpperCase() + prompt.category.slice(1)}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 22,
  },
  textContainer: {
    flex: 1,
  },
  promptText: {
    marginBottom: spacing.xs,
  },
  category: {
    textTransform: 'capitalize',
  },
});

export default PromptCard;
