import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Text } from '../components/common/Text';
import { Card } from '../components/common/Card';
import { HabitCard } from '../components/habits/HabitCard';
import { HabitProgress } from '../components/habits/HabitProgress';
import { useAppStore, useHabits, useActiveHabits } from '../store/useAppStore';
import { Habit, HabitCategory } from '../types';
import { colors } from '../theme/colors';
import { spacing, layout, borderRadius } from '../theme/spacing';
import { categoryInfo } from '../data/habits';
import { getHabitCompletionMessage } from '../data';

type ViewMode = 'today' | 'all';

export const HabitsScreen: React.FC = () => {
  const habits = useHabits();
  const activeHabits = useActiveHabits();
  const { completeHabit, isHabitCompletedToday, toggleHabitActive } = useAppStore();

  const [viewMode, setViewMode] = useState<ViewMode>('today');
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'all'>('all');

  const completedToday = activeHabits.filter((h) => isHabitCompletedToday(h.id));

  const handleCompleteHabit = (habitId: string) => {
    completeHabit(habitId);
  };

  const handleToggleActive = (habitId: string) => {
    toggleHabitActive(habitId);
  };

  const categories: (HabitCategory | 'all')[] = [
    'all',
    'hydration',
    'movement',
    'mindfulness',
    'social',
    'rest',
    'creativity',
  ];

  const filteredHabits = viewMode === 'today'
    ? activeHabits
    : selectedCategory === 'all'
    ? habits
    : habits.filter((h) => h.category === selectedCategory);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress */}
        {viewMode === 'today' && (
          <HabitProgress
            completed={completedToday.length}
            total={activeHabits.length}
          />
        )}

        {/* View Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === 'today' && styles.toggleActive,
            ]}
            onPress={() => setViewMode('today')}
          >
            <Text
              variant="labelMedium"
              color={viewMode === 'today' ? colors.primary.contrast : colors.text.secondary}
            >
              Today
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === 'all' && styles.toggleActive,
            ]}
            onPress={() => setViewMode('all')}
          >
            <Text
              variant="labelMedium"
              color={viewMode === 'all' ? colors.primary.contrast : colors.text.secondary}
            >
              All Habits
            </Text>
          </TouchableOpacity>
        </View>

        {/* Category Filter (for All view) */}
        {viewMode === 'all' && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  variant="labelSmall"
                  color={
                    selectedCategory === category
                      ? colors.primary.contrast
                      : colors.text.secondary
                  }
                >
                  {category === 'all'
                    ? 'All'
                    : categoryInfo[category]?.label || category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Habits List */}
        <View style={styles.habitsList}>
          {viewMode === 'today' ? (
            // Today's view - completable habits
            filteredHabits.length > 0 ? (
              filteredHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  isCompleted={isHabitCompletedToday(habit.id)}
                  onComplete={() => handleCompleteHabit(habit.id)}
                />
              ))
            ) : (
              <Card style={styles.emptyCard}>
                <Text variant="bodyMedium" center>
                  No habits selected for today
                </Text>
                <Text variant="caption" color={colors.text.secondary} center>
                  Switch to "All Habits" to enable some
                </Text>
              </Card>
            )
          ) : (
            // All habits view - toggleable
            filteredHabits.map((habit) => (
              <HabitToggleCard
                key={habit.id}
                habit={habit}
                onToggle={() => handleToggleActive(habit.id)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface HabitToggleCardProps {
  habit: Habit;
  onToggle: () => void;
}

const HabitToggleCard: React.FC<HabitToggleCardProps> = ({ habit, onToggle }) => {
  const categoryColor = categoryInfo[habit.category]?.color || colors.primary.main;

  return (
    <Card
      onPress={onToggle}
      style={[
        styles.toggleCard,
        { borderLeftColor: categoryColor },
        !habit.isActive && styles.inactiveCard,
      ]}
    >
      <View style={styles.toggleCardContent}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{habit.icon}</Text>
        </View>
        <View style={styles.info}>
          <Text variant="labelLarge">{habit.name}</Text>
          <Text variant="caption" color={colors.text.tertiary}>
            {categoryInfo[habit.category]?.label} • +{habit.experienceReward} XP
          </Text>
        </View>
        <View style={[styles.toggle, habit.isActive && styles.toggleOn]}>
          <View style={[styles.toggleThumb, habit.isActive && styles.toggleThumbOn]} />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: layout.screenPadding,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    marginBottom: spacing.lg,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  toggleActive: {
    backgroundColor: colors.primary.main,
  },
  categoryScroll: {
    marginBottom: spacing.lg,
    marginHorizontal: -layout.screenPadding,
  },
  categoryContainer: {
    paddingHorizontal: layout.screenPadding,
    gap: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: colors.primary.main,
  },
  habitsList: {
    marginTop: spacing.sm,
  },
  emptyCard: {
    paddingVertical: spacing['3xl'],
  },
  toggleCard: {
    marginBottom: spacing.md,
    borderLeftWidth: 4,
  },
  inactiveCard: {
    opacity: 0.6,
  },
  toggleCardContent: {
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
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.neutral[300],
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleOn: {
    backgroundColor: colors.primary.main,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background.card,
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },
});

export default HabitsScreen;
