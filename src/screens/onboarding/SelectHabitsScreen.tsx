import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Text } from '../../components/common/Text';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useAppStore, useHabits, useGator } from '../../store/useAppStore';
import { OnboardingStackParamList, Habit } from '../../types';
import { colors } from '../../theme/colors';
import { spacing, layout, borderRadius, shadows } from '../../theme/spacing';
import { categoryInfo } from '../../data/habits';

type SelectHabitsNavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'SelectHabits'>;

export const SelectHabitsScreen: React.FC = () => {
  const navigation = useNavigation<SelectHabitsNavigationProp>();
  const habits = useHabits();
  const gator = useGator();
  const { toggleHabitActive } = useAppStore();

  const [selectedIds, setSelectedIds] = useState<string[]>(
    habits.filter((h) => h.isActive).map((h) => h.id)
  );

  const handleToggle = (habitId: string) => {
    setSelectedIds((prev) =>
      prev.includes(habitId)
        ? prev.filter((id) => id !== habitId)
        : [...prev, habitId]
    );
  };

  const handleContinue = () => {
    // Update habit active states based on selection
    habits.forEach((habit) => {
      const shouldBeActive = selectedIds.includes(habit.id);
      if (habit.isActive !== shouldBeActive) {
        toggleHabitActive(habit.id);
      }
    });

    navigation.navigate('SetReminder');
  };

  // Group habits by category
  const habitsByCategory = habits.reduce((acc, habit) => {
    if (!acc[habit.category]) {
      acc[habit.category] = [];
    }
    acc[habit.category].push(habit);
    return acc;
  }, {} as Record<string, Habit[]>);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <Text variant="headingLarge" center>
            Choose Your Habits
          </Text>
          <Text variant="bodyMedium" color={colors.text.secondary} center style={styles.subtitle}>
            Select the self-care activities you want to track with {gator.name}. You can always change these later.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.scrollContainer}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {Object.entries(habitsByCategory).map(([category, categoryHabits]) => (
              <View key={category} style={styles.categorySection}>
                <View style={styles.categoryHeader}>
                  <View
                    style={[
                      styles.categoryDot,
                      { backgroundColor: categoryInfo[category as keyof typeof categoryInfo]?.color },
                    ]}
                  />
                  <Text variant="labelLarge">
                    {categoryInfo[category as keyof typeof categoryInfo]?.label || category}
                  </Text>
                </View>
                <View style={styles.habitsGrid}>
                  {categoryHabits.map((habit) => {
                    const isSelected = selectedIds.includes(habit.id);
                    return (
                      <TouchableOpacity
                        key={habit.id}
                        style={[
                          styles.habitChip,
                          isSelected && styles.habitChipSelected,
                        ]}
                        onPress={() => handleToggle(habit.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.habitIcon}>{habit.icon}</Text>
                        <Text
                          variant="labelSmall"
                          color={isSelected ? colors.primary.contrast : colors.text.primary}
                          numberOfLines={1}
                        >
                          {habit.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400).duration(600)} style={styles.footer}>
          <Text variant="caption" color={colors.text.tertiary} center style={styles.selectedCount}>
            {selectedIds.length} habit{selectedIds.length !== 1 ? 's' : ''} selected
          </Text>
          <Button
            title="Continue"
            onPress={handleContinue}
            fullWidth
            size="large"
            disabled={selectedIds.length === 0}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  container: {
    flex: 1,
    padding: layout.screenPadding,
  },
  header: {
    marginBottom: spacing.xl,
  },
  subtitle: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  scrollContainer: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
  },
  categorySection: {
    marginBottom: spacing.xl,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  habitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  habitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[100],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  habitChipSelected: {
    backgroundColor: colors.primary.main,
    ...shadows.sm,
  },
  habitIcon: {
    fontSize: 16,
  },
  footer: {
    paddingTop: spacing.lg,
  },
  selectedCount: {
    marginBottom: spacing.md,
  },
});

export default SelectHabitsScreen;
