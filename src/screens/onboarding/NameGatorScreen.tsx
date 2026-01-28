import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Text } from '../../components/common/Text';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { GatorAvatar } from '../../components/gator/GatorAvatar';
import { SpeechBubble } from '../../components/gator/SpeechBubble';
import { useAppStore } from '../../store/useAppStore';
import { OnboardingStackParamList } from '../../types';
import { colors } from '../../theme/colors';
import { spacing, layout } from '../../theme/spacing';

type NameGatorNavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'NameGator'>;

const suggestedNames = ['Gator', 'Snappy', 'Chompers', 'Swampy', 'Bubbles', 'Marsh'];

export const NameGatorScreen: React.FC = () => {
  const navigation = useNavigation<NameGatorNavigationProp>();
  const { setGatorName } = useAppStore();

  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      setError('Please give your gator a name');
      return;
    }
    if (trimmedName.length > 20) {
      setError('Name is too long (max 20 characters)');
      return;
    }

    setGatorName(trimmedName);
    navigation.navigate('SelectHabits');
  };

  const handleSuggestion = (suggestion: string) => {
    setName(suggestion);
    setError('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <View style={styles.content}>
            <Animated.View
              entering={FadeInDown.delay(200).duration(600)}
              style={styles.gatorContainer}
            >
              <SpeechBubble
                message="What would you like to call me?"
                visible
              />
              <GatorAvatar size={150} expression="happy" />
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(400).duration(600)}
              style={styles.inputContainer}
            >
              <Text variant="headingMedium" center style={styles.title}>
                Name Your Gator
              </Text>

              <Input
                placeholder="Enter a name..."
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setError('');
                }}
                error={error}
                autoCapitalize="words"
                maxLength={20}
                containerStyle={styles.input}
              />

              <View style={styles.suggestions}>
                <Text variant="caption" color={colors.text.tertiary} style={styles.suggestionsLabel}>
                  Or try one of these:
                </Text>
                <View style={styles.suggestionChips}>
                  {suggestedNames.map((suggestion) => (
                    <Button
                      key={suggestion}
                      title={suggestion}
                      onPress={() => handleSuggestion(suggestion)}
                      variant="outline"
                      size="small"
                      style={styles.chip}
                    />
                  ))}
                </View>
              </View>
            </Animated.View>
          </View>

          <Animated.View
            entering={FadeInUp.delay(600).duration(600)}
            style={styles.footer}
          >
            <Button
              title="Continue"
              onPress={handleContinue}
              fullWidth
              size="large"
              disabled={name.trim().length === 0}
            />
          </Animated.View>
        </View>
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
    padding: layout.screenPadding,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  gatorContainer: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  inputContainer: {
    paddingHorizontal: spacing.md,
  },
  title: {
    marginBottom: spacing.xl,
  },
  input: {
    marginBottom: spacing.lg,
  },
  suggestions: {
    alignItems: 'center',
  },
  suggestionsLabel: {
    marginBottom: spacing.md,
  },
  suggestionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  chip: {
    marginHorizontal: spacing.xs,
    marginBottom: spacing.xs,
  },
  footer: {
    paddingBottom: spacing.xl,
  },
});

export default NameGatorScreen;
