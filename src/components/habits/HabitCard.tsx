import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Text } from '../common/Text';
import { Card } from '../common/Card';
import { Habit } from '../../types';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { categoryInfo } from '../../data/habits';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onComplete: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  isCompleted,
  onComplete,
}) => {
  const scale = useSharedValue(1);
  const checkScale = useSharedValue(isCompleted ? 1 : 0);

  const handlePress = () => {
    if (!isCompleted) {
      // Celebration animation
      scale.value = withSequence(
        withSpring(1.05, { damping: 10, stiffness: 400 }),
        withSpring(1, { damping: 15, stiffness: 400 })
      );
      checkScale.value = withSequence(
        withTiming(1.3, { duration: 150 }),
        withSpring(1, { damping: 10, stiffness: 400 })
      );
      onComplete();
    }
  };

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkScale.value,
  }));

  const categoryColor = categoryInfo[habit.category]?.color || colors.primary.main;

  return (
    <AnimatedTouchable
      onPress={handlePress}
      activeOpacity={0.9}
      disabled={isCompleted}
      style={cardStyle}
    >
      <Card
        style={[
          styles.card,
          isCompleted && styles.completedCard,
          { borderLeftColor: categoryColor },
        ]}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{habit.icon}</Text>
          </View>
          <View style={styles.info}>
            <Text
              variant="labelLarge"
              style={isCompleted && styles.completedText}
            >
              {habit.name}
            </Text>
            <Text
              variant="caption"
              color={colors.text.tertiary}
            >
              +{habit.experienceReward} XP
            </Text>
          </View>
          <View style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}>
            {isCompleted && (
              <Animated.Text style={[styles.checkmark, checkStyle]}>
                ✓
              </Animated.Text>
            )}
          </View>
        </View>
      </Card>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    borderLeftWidth: 4,
  },
  completedCard: {
    opacity: 0.7,
    backgroundColor: colors.neutral[50],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.text.tertiary,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.neutral[300],
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkmark: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HabitCard;
