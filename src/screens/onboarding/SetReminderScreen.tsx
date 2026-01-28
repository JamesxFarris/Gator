import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Text } from '../../components/common/Text';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { GatorAvatar } from '../../components/gator/GatorAvatar';
import { SpeechBubble } from '../../components/gator/SpeechBubble';
import { useAppStore, useGator } from '../../store/useAppStore';
import { OnboardingStackParamList, User } from '../../types';
import { colors } from '../../theme/colors';
import { spacing, layout, borderRadius } from '../../theme/spacing';
import { generateId } from '../../utils';

type SetReminderNavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'SetReminder'>;

const reminderOptions = [
  { label: 'Morning', time: '09:00', icon: '🌅' },
  { label: 'Afternoon', time: '14:00', icon: '☀️' },
  { label: 'Evening', time: '19:00', icon: '🌆' },
  { label: 'No reminders', time: null, icon: '🔕' },
];

export const SetReminderScreen: React.FC = () => {
  const navigation = useNavigation<SetReminderNavigationProp>();
  const gator = useGator();
  const { setUser, completeOnboarding } = useAppStore();

  const [selectedTime, setSelectedTime] = useState<string | null>('09:00');

  const handleFinish = () => {
    // Create user and complete onboarding
    const newUser: User = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      hasCompletedOnboarding: true,
      notificationsEnabled: selectedTime !== null,
      reminderTime: selectedTime || undefined,
    };

    setUser(newUser);
    completeOnboarding();

    // Navigation will be handled by the navigator detecting the onboarding complete state
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Animated.View
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.gatorContainer}
        >
          <SpeechBubble
            message={`I can remind you to check in! When works best for you?`}
            visible
          />
          <GatorAvatar size={140} expression="happy" accessory={gator.accessory} />
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(400).duration(600)}
          style={styles.content}
        >
          <Text variant="headingMedium" center style={styles.title}>
            Daily Reminder
          </Text>
          <Text variant="bodyMedium" color={colors.text.secondary} center style={styles.subtitle}>
            Get a gentle nudge to check in with yourself
          </Text>

          <View style={styles.options}>
            {reminderOptions.map((option) => {
              const isSelected = selectedTime === option.time;
              return (
                <TouchableOpacity
                  key={option.label}
                  style={[styles.option, isSelected && styles.optionSelected]}
                  onPress={() => setSelectedTime(option.time)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionIcon}>{option.icon}</Text>
                  <View style={styles.optionText}>
                    <Text
                      variant="labelLarge"
                      color={isSelected ? colors.primary.contrast : colors.text.primary}
                    >
                      {option.label}
                    </Text>
                    {option.time && (
                      <Text
                        variant="caption"
                        color={isSelected ? colors.primary.contrast : colors.text.tertiary}
                      >
                        Around {formatTime(option.time)}
                      </Text>
                    )}
                  </View>
                  <View style={[styles.radio, isSelected && styles.radioSelected]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(600).duration(600)}
          style={styles.footer}
        >
          <Button
            title="Let's Go!"
            onPress={handleFinish}
            fullWidth
            size="large"
          />
          <Text variant="caption" color={colors.text.tertiary} center style={styles.disclaimer}>
            You can change this anytime in settings
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
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
  gatorContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    marginBottom: spacing.sm,
  },
  subtitle: {
    marginBottom: spacing.xl,
  },
  options: {
    gap: spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    borderColor: colors.border.light,
  },
  optionSelected: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  optionIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  optionText: {
    flex: 1,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral[300],
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: colors.primary.contrast,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary.contrast,
  },
  footer: {
    paddingBottom: spacing.xl,
  },
  disclaimer: {
    marginTop: spacing.md,
  },
});

export default SetReminderScreen;
