import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text } from '../components/common/Text';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { JournalCard } from '../components/journal/JournalCard';
import { PromptCard } from '../components/journal/PromptCard';
import { useJournalEntries } from '../store/useAppStore';
import { JournalStackParamList } from '../types';
import { colors } from '../theme/colors';
import { spacing, layout } from '../theme/spacing';
import { journalPrompts, getRandomPrompt, getRandomAffirmation } from '../data/prompts';

type JournalNavigationProp = NativeStackNavigationProp<JournalStackParamList, 'JournalList'>;

export const JournalListScreen: React.FC = () => {
  const navigation = useNavigation<JournalNavigationProp>();
  const entries = useJournalEntries();

  const [showPrompts, setShowPrompts] = useState(entries.length === 0);

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const todaysAffirmation = getRandomAffirmation();
  const suggestedPrompts = journalPrompts.slice(0, 4);

  const handleNewEntry = () => {
    navigation.navigate('JournalEntry', {});
  };

  const handlePromptPress = (promptText: string) => {
    navigation.navigate('JournalEntry', { promptId: promptText });
  };

  const handleEntryPress = (entryId: string) => {
    navigation.navigate('JournalEntry', { entryId });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Affirmation Card */}
        <Card style={styles.affirmationCard}>
          <Text variant="caption" color={colors.text.tertiary} style={styles.affirmationLabel}>
            Today's Affirmation
          </Text>
          <Text variant="bodyLarge" center style={styles.affirmationText}>
            "{todaysAffirmation}"
          </Text>
        </Card>

        {/* New Entry Button */}
        <Button
          title="Write New Entry"
          onPress={handleNewEntry}
          fullWidth
          style={styles.newEntryButton}
        />

        {/* Prompts Section */}
        {(showPrompts || entries.length === 0) && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="headingSmall">Writing Prompts</Text>
              {entries.length > 0 && (
                <Button
                  title="Hide"
                  onPress={() => setShowPrompts(false)}
                  variant="ghost"
                  size="small"
                />
              )}
            </View>
            {suggestedPrompts.map((prompt, index) => (
              <PromptCard
                key={index}
                prompt={prompt}
                onPress={() => handlePromptPress(prompt.text)}
              />
            ))}
          </View>
        )}

        {/* Entries Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="headingSmall">Your Entries</Text>
            <Text variant="caption" color={colors.text.secondary}>
              {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
            </Text>
          </View>

          {sortedEntries.length > 0 ? (
            sortedEntries.map((entry) => (
              <JournalCard
                key={entry.id}
                entry={entry}
                onPress={() => handleEntryPress(entry.id)}
              />
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text variant="bodyMedium" center>
                No journal entries yet
              </Text>
              <Text variant="caption" color={colors.text.secondary} center>
                Start writing to track your thoughts and feelings
              </Text>
            </Card>
          )}
        </View>

        {/* Show prompts toggle */}
        {entries.length > 0 && !showPrompts && (
          <Button
            title="Show Writing Prompts"
            onPress={() => setShowPrompts(true)}
            variant="ghost"
            size="small"
          />
        )}
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
  affirmationCard: {
    backgroundColor: colors.accent.main + '15',
    marginBottom: spacing.lg,
  },
  affirmationLabel: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  affirmationText: {
    fontStyle: 'italic',
    color: colors.accent.dark,
  },
  newEntryButton: {
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyCard: {
    paddingVertical: spacing['3xl'],
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: spacing.md,
  },
});

export default JournalListScreen;
