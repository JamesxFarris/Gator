import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '../components/common/Text';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { EmojiPicker } from '../components/mood/EmojiPicker';
import { MoodHistory } from '../components/mood/MoodHistory';
import { GatorAvatar } from '../components/gator/GatorAvatar';
import { SpeechBubble } from '../components/gator/SpeechBubble';
import { useAppStore, useGator, useMoodEntries } from '../store/useAppStore';
import { MoodLevel, GatorExpression } from '../types';
import { colors } from '../theme/colors';
import { spacing, layout, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { getMoodResponse } from '../data';

export const MoodCheckInScreen: React.FC = () => {
  const navigation = useNavigation();
  const gator = useGator();
  const moodEntries = useMoodEntries();
  const { addMoodEntry, updateStreak, addExperience } = useAppStore();

  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gatorResponse, setGatorResponse] = useState<string>('');

  const getGatorExpression = (): GatorExpression => {
    if (!selectedMood) return 'happy';
    if (selectedMood >= 4) return 'excited';
    if (selectedMood <= 2) return 'encouraging';
    return 'happy';
  };

  const handleSubmit = () => {
    if (selectedMood) {
      addMoodEntry(selectedMood, note || undefined);
      updateStreak();
      addExperience(10); // XP for mood check-in
      setGatorResponse(getMoodResponse(selectedMood));
      setIsSubmitted(true);
    }
  };

  const handleDone = () => {
    navigation.goBack();
  };

  if (isSubmitted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.submittedContainer}>
          <SpeechBubble message={gatorResponse} visible />
          <GatorAvatar
            size={200}
            expression={getGatorExpression()}
            accessory={gator.accessory}
            color={gator.color}
          />
          <Text variant="headingMedium" center style={styles.thankYou}>
            Thanks for checking in!
          </Text>
          <Text variant="bodyMedium" color={colors.text.secondary} center>
            +10 XP for your mood check-in
          </Text>
          <Button
            title="Done"
            onPress={handleDone}
            style={styles.doneButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Gator */}
          <View style={styles.gatorContainer}>
            <GatorAvatar
              size={120}
              expression={getGatorExpression()}
              accessory={gator.accessory}
              color={gator.color}
            />
          </View>

          {/* Mood Picker */}
          <Card style={styles.pickerCard}>
            <EmojiPicker
              value={selectedMood}
              onChange={setSelectedMood}
            />
          </Card>

          {/* Note Input */}
          {selectedMood && (
            <Card style={styles.noteCard}>
              <Text variant="labelMedium" style={styles.noteLabel}>
                Anything on your mind? (optional)
              </Text>
              <TextInput
                style={styles.noteInput}
                placeholder="Write a note..."
                placeholderTextColor={colors.text.tertiary}
                multiline
                numberOfLines={3}
                value={note}
                onChangeText={setNote}
                textAlignVertical="top"
              />
            </Card>
          )}

          {/* Submit Button */}
          <Button
            title="Log Mood"
            onPress={handleSubmit}
            disabled={!selectedMood}
            fullWidth
            style={styles.submitButton}
          />

          {/* Mood History */}
          <View style={styles.historySection}>
            <Text variant="headingSmall" style={styles.historyTitle}>
              Your Week
            </Text>
            <MoodHistory entries={moodEntries} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: layout.screenPadding,
  },
  gatorContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  pickerCard: {
    marginBottom: spacing.lg,
  },
  noteCard: {
    marginBottom: spacing.lg,
  },
  noteLabel: {
    marginBottom: spacing.sm,
  },
  noteInput: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    minHeight: 80,
  },
  submitButton: {
    marginBottom: spacing['2xl'],
  },
  historySection: {
    marginTop: spacing.md,
  },
  historyTitle: {
    marginBottom: spacing.md,
  },
  // Submitted state
  submittedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: layout.screenPadding,
  },
  thankYou: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  doneButton: {
    marginTop: spacing['2xl'],
    minWidth: 150,
  },
});

export default MoodCheckInScreen;
