import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';
import { Text } from '../common/Text';
import { MoodLevel } from '../../types';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDER_WIDTH = SCREEN_WIDTH - spacing.lg * 4;
const THUMB_SIZE = 40;

interface MoodSliderProps {
  value: MoodLevel;
  onChange: (value: MoodLevel) => void;
}

const moodEmojis: Record<MoodLevel, string> = {
  1: '😢',
  2: '😔',
  3: '😐',
  4: '🙂',
  5: '😊',
};

const moodLabels: Record<MoodLevel, string> = {
  1: 'Struggling',
  2: 'Not great',
  3: 'Okay',
  4: 'Good',
  5: 'Great',
};

export const MoodSlider: React.FC<MoodSliderProps> = ({ value, onChange }) => {
  const translateX = useSharedValue(((value - 1) / 4) * (SLIDER_WIDTH - THUMB_SIZE));

  const updateValue = (newValue: MoodLevel) => {
    onChange(newValue);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newX = Math.max(
        0,
        Math.min(event.x - THUMB_SIZE / 2, SLIDER_WIDTH - THUMB_SIZE)
      );
      translateX.value = newX;

      // Calculate mood level (1-5)
      const percentage = newX / (SLIDER_WIDTH - THUMB_SIZE);
      const newMood = Math.round(percentage * 4) + 1;
      runOnJS(updateValue)(newMood as MoodLevel);
    })
    .onEnd(() => {
      // Snap to nearest mood level
      const percentage = translateX.value / (SLIDER_WIDTH - THUMB_SIZE);
      const snappedMood = Math.round(percentage * 4);
      const snappedX = (snappedMood / 4) * (SLIDER_WIDTH - THUMB_SIZE);
      translateX.value = withSpring(snappedX, { damping: 15, stiffness: 150 });
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const trackFillStyle = useAnimatedStyle(() => {
    const width = translateX.value + THUMB_SIZE / 2;
    const backgroundColor = interpolateColor(
      translateX.value,
      [0, SLIDER_WIDTH - THUMB_SIZE],
      [colors.mood[1], colors.mood[5]]
    );
    return {
      width,
      backgroundColor,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.emojiRow}>
        {([1, 2, 3, 4, 5] as MoodLevel[]).map((mood) => (
          <Text
            key={mood}
            style={[
              styles.emoji,
              mood === value && styles.activeEmoji,
            ]}
          >
            {moodEmojis[mood]}
          </Text>
        ))}
      </View>

      <GestureHandlerRootView style={styles.sliderContainer}>
        <GestureDetector gesture={panGesture}>
          <View style={styles.track}>
            <Animated.View style={[styles.trackFill, trackFillStyle]} />
            <Animated.View style={[styles.thumb, thumbStyle]}>
              <Text style={styles.thumbEmoji}>{moodEmojis[value]}</Text>
            </Animated.View>
          </View>
        </GestureDetector>
      </GestureHandlerRootView>

      <Text variant="headingMedium" center style={styles.label}>
        {moodLabels[value]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SLIDER_WIDTH,
    marginBottom: spacing.lg,
  },
  emoji: {
    fontSize: 24,
    opacity: 0.4,
  },
  activeEmoji: {
    opacity: 1,
    transform: [{ scale: 1.2 }],
  },
  sliderContainer: {
    width: SLIDER_WIDTH,
    height: 60,
    justifyContent: 'center',
  },
  track: {
    width: SLIDER_WIDTH,
    height: 12,
    backgroundColor: colors.neutral[200],
    borderRadius: borderRadius.full,
    justifyContent: 'center',
  },
  trackFill: {
    position: 'absolute',
    height: 12,
    borderRadius: borderRadius.full,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    backgroundColor: colors.background.card,
    borderRadius: THUMB_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  thumbEmoji: {
    fontSize: 24,
  },
  label: {
    marginTop: spacing.lg,
  },
});

export default MoodSlider;
