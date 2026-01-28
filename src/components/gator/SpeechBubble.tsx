import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { Text } from '../common/Text';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadows } from '../../theme/spacing';

interface SpeechBubbleProps {
  message: string;
  visible?: boolean;
  position?: 'top' | 'bottom';
  onHide?: () => void;
  autoHide?: boolean;
  autoHideDelay?: number;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  message,
  visible = true,
  position = 'top',
  onHide,
  autoHide = false,
  autoHideDelay = 4000,
}) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSequence(
        withTiming(1.05, { duration: 200, easing: Easing.out(Easing.back(2)) }),
        withTiming(1, { duration: 100 })
      );

      if (autoHide && onHide) {
        const timer = setTimeout(() => {
          onHide();
        }, autoHideDelay);
        return () => clearTimeout(timer);
      }
    } else {
      scale.value = withTiming(0, { duration: 150 });
    }
  }, [visible, autoHide, autoHideDelay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      style={[
        styles.container,
        position === 'bottom' && styles.containerBottom,
        animatedStyle,
      ]}
    >
      <View style={[styles.bubble, shadows.md]}>
        <Text variant="bodyMedium" center>
          {message}
        </Text>
      </View>
      <View
        style={[
          styles.tail,
          position === 'bottom' && styles.tailBottom,
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  containerBottom: {
    marginBottom: 0,
    marginTop: spacing.md,
  },
  bubble: {
    backgroundColor: colors.background.card,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    maxWidth: 280,
  },
  tail: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.background.card,
    marginTop: -1,
  },
  tailBottom: {
    borderTopWidth: 0,
    borderBottomWidth: 12,
    borderBottomColor: colors.background.card,
    marginTop: 0,
    marginBottom: -1,
    transform: [{ rotate: '180deg' }],
  },
});

export default SpeechBubble;
