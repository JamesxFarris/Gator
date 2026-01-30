import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { GatorAvatar } from './GatorAvatar';
import { SpeechBubble } from './SpeechBubble';
import { GatorExpression, GatorAccessory, GatorEnvironment, GatorColor } from '../../types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { getGreeting, getExpressionMessage } from '../../data';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface GatorSceneProps {
  gatorName: string;
  expression?: GatorExpression;
  accessory?: GatorAccessory;
  environment?: GatorEnvironment;
  color?: GatorColor;
  message?: string;
  showGreeting?: boolean;
  size?: number;
}

const getEnvironmentColors = (environment: GatorEnvironment) => {
  switch (environment) {
    case 'pond':
      return {
        background: '#E8F4F8',
        accent1: '#87CEEB',
        accent2: '#B8E0D2',
      };
    case 'garden':
      return {
        background: '#E8F5E9',
        accent1: '#98D8AA',
        accent2: '#FFE4B5',
      };
    case 'beach':
      return {
        background: '#FFF8E7',
        accent1: '#FFEAA7',
        accent2: '#87CEEB',
      };
    case 'forest':
      return {
        background: '#E8F0E8',
        accent1: '#6B8E23',
        accent2: '#8B7355',
      };
    case 'cozy_room':
      return {
        background: '#FDF5E6',
        accent1: '#DEB887',
        accent2: '#D2691E',
      };
    case 'starry_night':
      return {
        background: '#2C3E50',
        accent1: '#F1C40F',
        accent2: '#9B59B6',
      };
    default:
      return {
        background: colors.background.secondary,
        accent1: colors.primary.light,
        accent2: colors.secondary.light,
      };
  }
};

export const GatorScene: React.FC<GatorSceneProps> = ({
  gatorName,
  expression = 'happy',
  accessory = 'none',
  environment = 'pond',
  color = 'teal',
  message,
  showGreeting = true,
  size = 180,
}) => {
  const [displayMessage, setDisplayMessage] = useState<string>('');
  const [showBubble, setShowBubble] = useState(false);

  const floatY = useSharedValue(0);

  useEffect(() => {
    // Gentle floating animation
    floatY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  useEffect(() => {
    if (message) {
      setDisplayMessage(message);
      setShowBubble(true);
    } else if (showGreeting) {
      const greeting = getGreeting(gatorName);
      setDisplayMessage(greeting);
      setShowBubble(true);
    }
  }, [message, gatorName, showGreeting]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const envColors = getEnvironmentColors(environment);

  const renderEnvironmentDecor = () => {
    switch (environment) {
      case 'pond':
        return (
          <>
            <View style={[styles.decor, styles.lily1, { backgroundColor: envColors.accent2 }]} />
            <View style={[styles.decor, styles.lily2, { backgroundColor: envColors.accent2 }]} />
          </>
        );
      case 'garden':
        return (
          <>
            <View style={[styles.flower1]}>
              <View style={[styles.flowerPetal, { backgroundColor: '#FFB6C1' }]} />
            </View>
            <View style={[styles.flower2]}>
              <View style={[styles.flowerPetal, { backgroundColor: '#87CEEB' }]} />
            </View>
          </>
        );
      case 'starry_night':
        return (
          <>
            {[...Array(12)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.star,
                  {
                    left: `${Math.random() * 90}%`,
                    top: `${Math.random() * 40}%`,
                    opacity: 0.6 + Math.random() * 0.4,
                  },
                ]}
              />
            ))}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: envColors.background }]}>
      {renderEnvironmentDecor()}

      <View style={styles.content}>
        <SpeechBubble
          message={displayMessage}
          visible={showBubble}
          onHide={() => setShowBubble(false)}
          autoHide
          autoHideDelay={5000}
        />

        <Animated.View style={floatStyle}>
          <GatorAvatar
            size={size}
            expression={expression}
            accessory={accessory}
            color={color}
            animated
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: spacing.lg,
    overflow: 'hidden',
    minHeight: 280,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  decor: {
    position: 'absolute',
    borderRadius: 50,
  },
  lily1: {
    width: 40,
    height: 20,
    bottom: 20,
    left: 20,
  },
  lily2: {
    width: 30,
    height: 15,
    bottom: 30,
    right: 30,
  },
  flower1: {
    position: 'absolute',
    bottom: 15,
    left: 25,
  },
  flower2: {
    position: 'absolute',
    bottom: 25,
    right: 20,
  },
  flowerPetal: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  star: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#F1C40F',
    borderRadius: 2,
  },
});

export default GatorScene;
