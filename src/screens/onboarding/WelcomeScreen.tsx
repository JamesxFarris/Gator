import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Text } from '../../components/common/Text';
import { Button } from '../../components/common/Button';
import { GatorAvatar } from '../../components/gator/GatorAvatar';
import { OnboardingStackParamList } from '../../types';
import { colors } from '../../theme/colors';
import { spacing, layout } from '../../theme/spacing';

type WelcomeNavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeNavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <GatorAvatar size={200} expression="excited" />
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(400).duration(600)}
            style={styles.textContainer}
          >
            <Text variant="displaySmall" center style={styles.title}>
              Welcome to Gator!
            </Text>
            <Text
              variant="bodyLarge"
              color={colors.text.secondary}
              center
              style={styles.subtitle}
            >
              Your friendly companion for daily self-care and mental wellness.
            </Text>
          </Animated.View>
        </View>

        <Animated.View
          entering={FadeInUp.delay(600).duration(600)}
          style={styles.footer}
        >
          <Button
            title="Get Started"
            onPress={() => navigation.navigate('NameGator')}
            fullWidth
            size="large"
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginTop: spacing['2xl'],
    paddingHorizontal: spacing.lg,
  },
  title: {
    marginBottom: spacing.md,
  },
  subtitle: {
    lineHeight: 26,
  },
  footer: {
    paddingBottom: spacing.xl,
  },
});

export default WelcomeScreen;
