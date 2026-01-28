import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Text } from '../components/common/Text';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { EmojiPicker } from '../components/mood/EmojiPicker';
import { useAppStore } from '../store/useAppStore';
import { JournalStackParamList, MoodLevel } from '../types';
import { colors } from '../theme/colors';
import { spacing, layout, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';

type JournalEntryRouteProp = RouteProp<JournalStackParamList, 'JournalEntry'>;

export const JournalEntryScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<JournalEntryRouteProp>();
  const { entryId, promptId } = route.params || {};

  const { addEntry, updateEntry, deleteEntry, getEntryById } = useAppStore();

  const existingEntry = entryId ? getEntryById(entryId) : undefined;

  const [content, setContent] = useState(existingEntry?.content || '');
  const [prompt, setPrompt] = useState(existingEntry?.prompt || promptId || '');
  const [mood, setMood] = useState<MoodLevel | null>(existingEntry?.mood || null);
  const [showMoodPicker, setShowMoodPicker] = useState(false);

  const isEditing = !!existingEntry;

  const handleSave = () => {
    if (content.trim().length === 0) {
      Alert.alert('Empty Entry', 'Please write something before saving.');
      return;
    }

    if (isEditing && existingEntry) {
      updateEntry(existingEntry.id, {
        content,
        mood: mood || undefined,
      });
    } else {
      addEntry(content, prompt || undefined, mood || undefined);
    }

    navigation.goBack();
  };

  const handleDelete = () => {
    if (!existingEntry) return;

    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteEntry(existingEntry.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Prompt Display */}
          {prompt && (
            <Card style={styles.promptCard}>
              <Text variant="caption" color={colors.text.tertiary}>
                Prompt
              </Text>
              <Text variant="bodyMedium" style={styles.promptText}>
                {prompt}
              </Text>
            </Card>
          )}

          {/* Content Input */}
          <Card style={styles.contentCard}>
            <TextInput
              style={styles.contentInput}
              placeholder="What's on your mind..."
              placeholderTextColor={colors.text.tertiary}
              multiline
              value={content}
              onChangeText={setContent}
              textAlignVertical="top"
              autoFocus={!isEditing}
            />
          </Card>

          {/* Mood Section */}
          <Card style={styles.moodCard}>
            <View style={styles.moodHeader}>
              <Text variant="labelMedium">How are you feeling?</Text>
              {mood && (
                <Button
                  title="Clear"
                  onPress={() => setMood(null)}
                  variant="ghost"
                  size="small"
                />
              )}
            </View>
            {showMoodPicker ? (
              <View style={styles.moodPickerContainer}>
                <EmojiPicker
                  value={mood}
                  onChange={(value) => {
                    setMood(value);
                    setShowMoodPicker(false);
                  }}
                />
              </View>
            ) : (
              <Button
                title={mood ? getMoodLabel(mood) : 'Add mood'}
                onPress={() => setShowMoodPicker(true)}
                variant="outline"
                size="small"
              />
            )}
          </Card>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Button
              title={isEditing ? 'Save Changes' : 'Save Entry'}
              onPress={handleSave}
              fullWidth
              disabled={content.trim().length === 0}
            />

            {isEditing && (
              <Button
                title="Delete Entry"
                onPress={handleDelete}
                variant="ghost"
                style={styles.deleteButton}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const getMoodLabel = (mood: MoodLevel): string => {
  const labels: Record<MoodLevel, string> = {
    1: '😢 Struggling',
    2: '😔 Not great',
    3: '😐 Okay',
    4: '🙂 Good',
    5: '😊 Great',
  };
  return labels[mood];
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
  promptCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.accent.main + '10',
  },
  promptText: {
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  contentCard: {
    marginBottom: spacing.md,
    minHeight: 200,
  },
  contentInput: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    minHeight: 160,
    padding: 0,
  },
  moodCard: {
    marginBottom: spacing.xl,
  },
  moodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  moodPickerContainer: {
    marginHorizontal: -spacing.lg,
  },
  actions: {
    gap: spacing.md,
  },
  deleteButton: {
    marginTop: spacing.sm,
  },
});

export default JournalEntryScreen;
