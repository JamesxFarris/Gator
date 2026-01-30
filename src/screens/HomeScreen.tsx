import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Text } from '../components/common/Text';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ProgressRing } from '../components/common/ProgressRing';
import { GatorScene } from '../components/gator/GatorScene';
import { HabitCard } from '../components/habits/HabitCard';
import {
  useAppStore,
  useGator,
  useActiveHabits,
  useStreakData,
} from '../store/useAppStore';
import { MainTabParamList, GatorExpression } from '../types';
import { colors } from '../theme/colors';
import { spacing, layout } from '../theme/spacing';
import { getToday } from '../utils';
import { getLevelProgress } from '../data/levels';
import { getHabitCompletionMessage, getMoodResponse } from '../data';

type HomeNavigationProp = BottomTabNavigationProp<MainTabParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const gator = useGator();
  const activeHabits = useActiveHabits();
  const streakData = useStreakData();
  const { completeHabit, isHabitCompletedToday, moodEntries, setExpression } = useAppStore();

  const [gatorMessage, setGatorMessage] = useState<string | undefined>();
  const [gatorExpression, setGatorExpression] = useState<GatorExpression>('happy');

  const today = getToday();
  const completedToday = activeHabits.filter((h) => isHabitCompletedToday(h.id));
  const incompleteHabits = activeHabits.filter((h) => !isHabitCompletedToday(h.id));

  const levelProgress = getLevelProgress(gator.experience);

  // Check for today's mood
  const todaysMoods = moodEntries.filter((m) => m.date === today);
  const latestMood = todaysMoods[todaysMoods.length - 1];

  useEffect(() => {
    // Update gator expression based on time and activity
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 6) {
      setGatorExpression('sleepy');
    } else if (completedToday.length === activeHabits.length && activeHabits.length > 0) {
      setGatorExpression('proud');
    } else if (latestMood && latestMood.level >= 4) {
      setGatorExpression('happy');
    } else if (latestMood && latestMood.level <= 2) {
      setGatorExpression('encouraging');
    } else {
      setGatorExpression('happy');
    }
  }, [completedToday.length, latestMood, activeHabits.length]);

  const handleCompleteHabit = (habitId: string) => {
    completeHabit(habitId);
    setGatorMessage(getHabitCompletionMessage());
    setGatorExpression('excited');

    setTimeout(() => {
      setGatorMessage(undefined);
      setGatorExpression('happy');
    }, 3000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Gator Section */}
        <GatorScene
          gatorName={gator.name}
          expression={gatorExpression}
          accessory={gator.accessory}
          environment={gator.environment}
          color={gator.color}
          message={gatorMessage}
          showGreeting={!gatorMessage}
        />

        {/* Level Progress */}
        <Card style={styles.levelCard}>
          <View style={styles.levelContent}>
            <ProgressRing
              progress={levelProgress.progress}
              size={60}
              strokeWidth={6}
              color={colors.accent.main}
            >
              <Text variant="labelLarge">{gator.level}</Text>
            </ProgressRing>
            <View style={styles.levelInfo}>
              <Text variant="labelLarge">{gator.name}</Text>
              <Text variant="caption" color={colors.text.secondary}>
                {levelProgress.current} / {levelProgress.next} XP to level {gator.level + 1}
              </Text>
            </View>
            {streakData.currentStreak > 0 && (
              <View style={styles.streakBadge}>
                <Text style={styles.streakIcon}>🔥</Text>
                <Text variant="labelMedium">{streakData.currentStreak}</Text>
              </View>
            )}
          </View>
        </Card>

        {/* Quick Mood Button */}
        {!latestMood && (
          <Button
            title="How are you feeling?"
            onPress={() => navigation.navigate('MoodCheckIn')}
            variant="secondary"
            fullWidth
            style={styles.moodButton}
          />
        )}

        {/* Today's Habits */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="headingSmall">Today's Self-Care</Text>
            <Text variant="caption" color={colors.text.secondary}>
              {completedToday.length}/{activeHabits.length} done
            </Text>
          </View>

          {incompleteHabits.length > 0 ? (
            incompleteHabits.slice(0, 4).map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                isCompleted={false}
                onComplete={() => handleCompleteHabit(habit.id)}
              />
            ))
          ) : activeHabits.length > 0 ? (
            <Card style={styles.allDoneCard}>
              <Text variant="bodyMedium" center>
                🎉 All done for today!
              </Text>
              <Text variant="caption" color={colors.text.secondary} center>
                Great job taking care of yourself!
              </Text>
            </Card>
          ) : (
            <Card style={styles.emptyCard}>
              <Text variant="bodyMedium" center>
                No habits selected yet
              </Text>
              <Button
                title="Choose Habits"
                onPress={() => navigation.navigate('Habits')}
                variant="ghost"
                size="small"
                style={styles.chooseHabitsButton}
              />
            </Card>
          )}

          {incompleteHabits.length > 4 && (
            <Button
              title={`View all (${incompleteHabits.length - 4} more)`}
              onPress={() => navigation.navigate('Habits')}
              variant="ghost"
              size="small"
            />
          )}
        </View>
      </ScrollView>
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
  },
  content: {
    padding: layout.screenPadding,
  },
  levelCard: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  levelContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[100],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  streakIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  moodButton: {
    marginBottom: spacing.lg,
  },
  section: {
    marginTop: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  allDoneCard: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
  },
  chooseHabitsButton: {
    marginTop: spacing.md,
  },
});

export default HomeScreen;
