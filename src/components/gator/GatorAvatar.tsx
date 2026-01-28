import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Ellipse, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { GatorExpression, GatorAccessory } from '../../types';
import { colors } from '../../theme/colors';

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

interface GatorAvatarProps {
  size?: number;
  expression?: GatorExpression;
  accessory?: GatorAccessory;
  animated?: boolean;
}

export const GatorAvatar: React.FC<GatorAvatarProps> = ({
  size = 200,
  expression = 'happy',
  accessory = 'none',
  animated = true,
}) => {
  // Animation values
  const breathe = useSharedValue(0);
  const blink = useSharedValue(1);
  const bounce = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      // Breathing animation
      breathe.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );

      // Blinking animation
      const startBlinking = () => {
        blink.value = withSequence(
          withTiming(0, { duration: 100 }),
          withTiming(1, { duration: 100 }),
          withDelay(
            Math.random() * 3000 + 2000,
            withSequence(
              withTiming(0, { duration: 100 }),
              withTiming(1, { duration: 100 })
            )
          )
        );
      };
      startBlinking();
      const blinkInterval = setInterval(startBlinking, 5000);

      // Gentle bounce for excited expression
      if (expression === 'excited') {
        bounce.value = withRepeat(
          withSequence(
            withTiming(-5, { duration: 300, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 300, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        );
      }

      return () => clearInterval(blinkInterval);
    }
  }, [animated, expression]);

  const bodyAnimatedProps = useAnimatedProps(() => {
    const scale = interpolate(breathe.value, [0, 1], [1, 1.02]);
    return {
      transform: [{ scale }],
    };
  });

  const eyeAnimatedProps = useAnimatedProps(() => {
    const scaleY = blink.value;
    return {
      ry: 12 * scaleY,
    };
  });

  const getEyeExpression = () => {
    switch (expression) {
      case 'sleepy':
        return { ry: 6 };
      case 'excited':
        return { ry: 14 };
      default:
        return {};
    }
  };

  const getMouthPath = () => {
    switch (expression) {
      case 'happy':
        return 'M 70 140 Q 100 170 130 140'; // Big smile
      case 'excited':
        return 'M 65 135 Q 100 180 135 135'; // Open mouth smile
      case 'sleepy':
        return 'M 80 145 Q 100 155 120 145'; // Small sleepy smile
      case 'encouraging':
        return 'M 75 140 Q 100 160 125 140'; // Warm smile
      case 'proud':
        return 'M 70 135 Q 100 175 130 135'; // Proud smile
      default:
        return 'M 80 145 Q 100 155 120 145'; // Neutral smile
    }
  };

  const renderAccessory = () => {
    switch (accessory) {
      case 'bow':
        return (
          <G transform="translate(140, 30)">
            <Path
              d="M 0 15 Q -15 0 0 -10 Q 15 0 0 15"
              fill={colors.secondary.main}
            />
            <Path
              d="M 0 15 Q 15 30 0 40 Q -15 30 0 15"
              fill={colors.secondary.main}
            />
            <Circle cx={0} cy={15} r={5} fill={colors.secondary.dark} />
          </G>
        );
      case 'hat':
        return (
          <G transform="translate(100, 5)">
            <Ellipse cx={0} cy={25} rx={40} ry={8} fill="#4A453E" />
            <Path
              d="M -25 25 L -20 -15 L 20 -15 L 25 25"
              fill="#4A453E"
            />
            <Path
              d="M -20 -15 L 20 -15"
              stroke={colors.secondary.main}
              strokeWidth={4}
            />
          </G>
        );
      case 'glasses':
        return (
          <G transform="translate(100, 85)">
            <Circle cx={-25} cy={0} r={18} fill="none" stroke="#4A453E" strokeWidth={3} />
            <Circle cx={25} cy={0} r={18} fill="none" stroke="#4A453E" strokeWidth={3} />
            <Path d="M -7 0 L 7 0" stroke="#4A453E" strokeWidth={3} />
            <Path d="M -43 0 L -55 -10" stroke="#4A453E" strokeWidth={3} />
            <Path d="M 43 0 L 55 -10" stroke="#4A453E" strokeWidth={3} />
          </G>
        );
      case 'flower':
        return (
          <G transform="translate(145, 25)">
            <Circle cx={0} cy={-8} r={8} fill="#FFB6C1" />
            <Circle cx={-10} cy={0} r={8} fill="#FFB6C1" />
            <Circle cx={10} cy={0} r={8} fill="#FFB6C1" />
            <Circle cx={-6} cy={10} r={8} fill="#FFB6C1" />
            <Circle cx={6} cy={10} r={8} fill="#FFB6C1" />
            <Circle cx={0} cy={2} r={6} fill="#FFD700" />
          </G>
        );
      case 'crown':
        return (
          <G transform="translate(100, 10)">
            <Path
              d="M -35 30 L -35 5 L -20 15 L 0 -10 L 20 15 L 35 5 L 35 30 Z"
              fill="#FFD700"
            />
            <Circle cx={0} cy={0} r={5} fill="#FF6B6B" />
            <Circle cx={-25} cy={12} r={4} fill="#6BCB77" />
            <Circle cx={25} cy={12} r={4} fill="#6FDFDF" />
          </G>
        );
      case 'headphones':
        return (
          <G transform="translate(100, 50)">
            <Path
              d="M -50 20 Q -50 -30 0 -40 Q 50 -30 50 20"
              fill="none"
              stroke="#4A453E"
              strokeWidth={6}
            />
            <Circle cx={-50} cy={25} r={15} fill="#4A453E" />
            <Circle cx={50} cy={25} r={15} fill="#4A453E" />
            <Circle cx={-50} cy={25} r={10} fill={colors.primary.main} />
            <Circle cx={50} cy={25} r={10} fill={colors.primary.main} />
          </G>
        );
      case 'scarf':
        return (
          <G transform="translate(100, 165)">
            <Path
              d="M -40 0 Q -20 10 0 5 Q 20 0 40 10"
              fill={colors.accent.main}
              stroke={colors.accent.dark}
              strokeWidth={2}
            />
            <Path
              d="M 30 10 L 40 40 L 50 35 L 45 15"
              fill={colors.accent.main}
            />
          </G>
        );
      default:
        return null;
    }
  };

  const scale = size / 200;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
      >
        <G transform={`scale(${scale})`}>
          {/* Body */}
          <AnimatedG animatedProps={bodyAnimatedProps}>
            {/* Main body */}
            <Ellipse
              cx={100}
              cy={120}
              rx={70}
              ry={65}
              fill={colors.gator.body}
            />
            {/* Belly */}
            <Ellipse
              cx={100}
              cy={130}
              rx={45}
              ry={45}
              fill={colors.gator.belly}
            />
            {/* Head bump */}
            <Ellipse
              cx={100}
              cy={70}
              rx={55}
              ry={45}
              fill={colors.gator.body}
            />
            {/* Snout */}
            <Ellipse
              cx={100}
              cy={100}
              rx={35}
              ry={25}
              fill={colors.gator.body}
            />
          </AnimatedG>

          {/* Eyes */}
          <AnimatedEllipse
            cx={75}
            cy={75}
            rx={12}
            ry={12}
            fill="white"
            animatedProps={eyeAnimatedProps}
            {...getEyeExpression()}
          />
          <AnimatedEllipse
            cx={125}
            cy={75}
            rx={12}
            ry={12}
            fill="white"
            animatedProps={eyeAnimatedProps}
            {...getEyeExpression()}
          />

          {/* Pupils */}
          <Circle cx={77} cy={77} r={6} fill={colors.gator.eyes} />
          <Circle cx={127} cy={77} r={6} fill={colors.gator.eyes} />

          {/* Eye shine */}
          <Circle cx={80} cy={73} r={2} fill="white" />
          <Circle cx={130} cy={73} r={2} fill="white" />

          {/* Nostrils */}
          <Ellipse cx={90} cy={95} rx={3} ry={4} fill={colors.gator.bodyDark} />
          <Ellipse cx={110} cy={95} rx={3} ry={4} fill={colors.gator.bodyDark} />

          {/* Cheeks */}
          <Ellipse cx={55} cy={95} rx={12} ry={8} fill={colors.gator.cheeks} opacity={0.5} />
          <Ellipse cx={145} cy={95} rx={12} ry={8} fill={colors.gator.cheeks} opacity={0.5} />

          {/* Mouth */}
          <Path
            d={getMouthPath()}
            fill="none"
            stroke={colors.gator.bodyDark}
            strokeWidth={3}
            strokeLinecap="round"
          />

          {/* Little arms */}
          <Ellipse
            cx={40}
            cy={130}
            rx={15}
            ry={10}
            fill={colors.gator.body}
            transform="rotate(-30 40 130)"
          />
          <Ellipse
            cx={160}
            cy={130}
            rx={15}
            ry={10}
            fill={colors.gator.body}
            transform="rotate(30 160 130)"
          />

          {/* Accessory */}
          {renderAccessory()}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GatorAvatar;
