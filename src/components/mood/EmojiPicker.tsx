import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { Text } from '../common/Text';
import { MoodLevel } from '../../types';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadows } from '../../theme/spacing';

interface EmojiPickerProps {
  value: MoodLevel | null;
  onChange: (value: MoodLevel) => void;
}

const moodOptions: { level: MoodLevel; emoji: string; label: string }[] = [
  { level: 1, emoji: '😢', label: 'Struggling' },
  { level: 2, emoji: '😔', label: 'Not great' },
  { level: 3, emoji: '😐', label: 'Okay' },
  { level: 4, emoji: '🙂', label: 'Good' },
  { level: 5, emoji: '😊', label: 'Great' },
];

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface EmojiButtonProps {
  emoji: string;
  label: string;
  level: MoodLevel;
  isSelected: boolean;
  onPress: () => void;
  color: string;
}

const EmojiButton: React.FC<EmojiButtonProps> = ({
  emoji,
  label,
  isSelected,
  onPress,
  color,
}) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
      style={[
        styles.emojiButton,
        isSelected && [styles.selected, { backgroundColor: color }],
        isSelected && shadows.md,
        animatedStyle,
      ]}
    >
      <Text style={[styles.emoji, isSelected && styles.selectedEmoji]}>
        {emoji}
      </Text>
      <Text
        variant="caption"
        color={isSelected ? colors.text.primary : colors.text.tertiary}
        center
        style={styles.label}
      >
        {label}
      </Text>
    </AnimatedTouchable>
  );
};

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ value, onChange }) => {
  return (
    <View style={styles.container}>
      <Text variant="bodyLarge" center style={styles.question}>
        How are you feeling?
      </Text>
      <View style={styles.grid}>
        {moodOptions.map((option) => (
          <EmojiButton
            key={option.level}
            emoji={option.emoji}
            label={option.label}
            level={option.level}
            isSelected={value === option.level}
            onPress={() => onChange(option.level)}
            color={colors.mood[option.level]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  question: {
    marginBottom: spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
  },
  emojiButton: {
    width: 72,
    height: 90,
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.sm,
  },
  selected: {
    borderWidth: 0,
  },
  emoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  selectedEmoji: {
    transform: [{ scale: 1.1 }],
  },
  label: {
    marginTop: spacing.xs,
  },
});

export default EmojiPicker;
