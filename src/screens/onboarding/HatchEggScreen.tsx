import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  ZoomIn,
  BounceIn,
} from 'react-native-reanimated';
import { Text } from '../../components/common/Text';
import { Button } from '../../components/common/Button';
import { EggAvatar } from '../../components/gator/EggAvatar';
import { GatorAvatar } from '../../components/gator/GatorAvatar';
import { useAppStore } from '../../store/useAppStore';
import { OnboardingStackParamList, GatorColor } from '../../types';
import { colors } from '../../theme/colors';
import { spacing, layout } from '../../theme/spacing';

type HatchEggNavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'HatchEgg'>;

export const HatchEggScreen: React.FC = () => {
  const navigation = useNavigation<HatchEggNavigationProp>();
  const { hatchEgg, gator } = useAppStore();

  const [isHatching, setIsHatching] = useState(false);
  const [hasHatched, setHasHatched] = useState(false);
  const [hatchedColor, setHatchedColor] = useState<GatorColor | null>(null);

  const handleTapEgg = () => {
    if (isHatching || hasHatched) return;
    setIsHatching(true);
  };

  const handleHatchComplete = () => {
    const color = hatchEgg();
    setHatchedColor(color);
    setHasHatched(true);
  };

  const handleContinue = () => {
    navigation.navigate('NameGator');
  };

  const getColorName = (color: GatorColor): string => {
    const names: Record<GatorColor, string> = {
      teal: 'Teal',
      pink: 'Pink',
      purple: 'Purple',
      orange: 'Orange',
      blue: 'Blue',
      green: 'Green',
      yellow: 'Yellow',
      coral: 'Coral',
    };
    return names[color];
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          {!hasHatched ? (
            <>
              <Animated.View
                entering={FadeInDown.delay(200).duration(600)}
                style={styles.headerContainer}
              >
                <Text variant="headingLarge" center style={styles.title}>
                  Your Gator Awaits!
                </Text>
                <Text variant="bodyMedium" center color={colors.text.secondary} style={styles.subtitle}>
                  Tap the egg to meet your new companion
                </Text>
              </Animated.View>

              <Animated.View
                entering={FadeIn.delay(400).duration(600)}
                style={styles.eggContainer}
              >
                <TouchableOpacity
                  onPress={handleTapEgg}
                  activeOpacity={0.9}
                  disabled={isHatching}
                >
                  <EggAvatar
                    size={220}
                    isHatching={isHatching}
                    onHatchComplete={handleHatchComplete}
                  />
                </TouchableOpacity>

                {!isHatching && (
                  <Animated.View
                    entering={FadeIn.delay(800).duration(400)}
                    style={styles.tapHint}
                  >
                    <Text variant="caption" color={colors.text.tertiary}>
                      Tap to hatch!
                    </Text>
                  </Animated.View>
                )}
              </Animated.View>
            </>
          ) : (
            <>
              <Animated.View
                entering={FadeInDown.duration(600)}
                style={styles.headerContainer}
              >
                <Text variant="headingLarge" center style={styles.title}>
                  Congratulations!
                </Text>
                <Text variant="bodyMedium" center color={colors.text.secondary} style={styles.subtitle}>
                  You hatched a {hatchedColor ? getColorName(hatchedColor) : ''} Gator!
                </Text>
              </Animated.View>

              <Animated.View
                entering={ZoomIn.delay(200).duration(600).springify()}
                style={styles.gatorContainer}
              >
                <GatorAvatar
                  size={220}
                  expression="excited"
                  color={hatchedColor || 'teal'}
                />
              </Animated.View>

              <Animated.View
                entering={BounceIn.delay(600).duration(400)}
                style={styles.sparkleContainer}
              >
                <Text style={styles.sparkles}>✨</Text>
              </Animated.View>
            </>
          )}
        </View>

        {hasHatched && (
          <Animated.View
            entering={FadeInUp.delay(800).duration(600)}
            style={styles.footer}
          >
            <Button
              title="Say Hello!"
              onPress={handleContinue}
              fullWidth
              size="large"
            />
          </Animated.View>
        )}
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
  headerContainer: {
    marginBottom: spacing['2xl'],
  },
  title: {
    marginBottom: spacing.sm,
  },
  subtitle: {
    paddingHorizontal: spacing.xl,
  },
  eggContainer: {
    alignItems: 'center',
  },
  gatorContainer: {
    alignItems: 'center',
  },
  tapHint: {
    marginTop: spacing.lg,
  },
  sparkleContainer: {
    position: 'absolute',
    top: '30%',
    alignSelf: 'center',
  },
  sparkles: {
    fontSize: 48,
  },
  footer: {
    paddingBottom: spacing.xl,
  },
});

export default HatchEggScreen;
