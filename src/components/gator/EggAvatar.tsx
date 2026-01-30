import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Ellipse, G, Defs, RadialGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';

interface EggAvatarProps {
  size?: number;
  isHatching?: boolean;
  onHatchComplete?: () => void;
}

export const EggAvatar: React.FC<EggAvatarProps> = ({
  size = 200,
  isHatching = false,
  onHatchComplete,
}) => {
  const wobble = useSharedValue(0);
  const crack = useSharedValue(0);
  const shake = useSharedValue(0);

  useEffect(() => {
    // Gentle idle wobble animation
    if (!isHatching) {
      wobble.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(-1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }
  }, [isHatching]);

  useEffect(() => {
    if (isHatching) {
      // Stop wobble
      wobble.value = 0;

      // Intense shaking and cracking sequence
      shake.value = withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(-1, { duration: 100 }),
        withTiming(1, { duration: 100 }),
        withTiming(-1, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );

      crack.value = withSequence(
        withTiming(0.3, { duration: 300 }),
        withTiming(0.3, { duration: 200 }),
        withTiming(0.6, { duration: 300 }),
        withTiming(0.6, { duration: 200 }),
        withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) })
      );

      // Trigger completion callback
      const timeout = setTimeout(() => {
        onHatchComplete?.();
      }, 1400);

      return () => clearTimeout(timeout);
    }
  }, [isHatching]);

  const animatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(wobble.value, [-1, 0, 1], [-3, 0, 3]);
    const shakeRotation = interpolate(shake.value, [-1, 0, 1], [-8, 0, 8]);
    const scale = interpolate(crack.value, [0, 0.8, 1], [1, 1.05, 0]);
    const opacity = interpolate(crack.value, [0, 0.9, 1], [1, 1, 0]);

    return {
      transform: [
        { rotate: `${rotation + shakeRotation}deg` },
        { scale },
      ],
      opacity,
    };
  });

  const scale = size / 200;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View style={animatedStyle}>
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <Defs>
            <RadialGradient id="eggGradient" cx="40%" cy="30%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#FFFEF7" />
              <Stop offset="100%" stopColor="#F5E6D3" />
            </RadialGradient>
            <RadialGradient id="spotGradient" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor={colors.primary.light} stopOpacity="0.4" />
              <Stop offset="100%" stopColor={colors.primary.main} stopOpacity="0.2" />
            </RadialGradient>
          </Defs>

          <G transform={`scale(${scale})`}>
            {/* Shadow */}
            <Ellipse
              cx={100}
              cy={185}
              rx={50}
              ry={12}
              fill="rgba(0,0,0,0.1)"
            />

            {/* Main egg shape */}
            <Path
              d="M 100 20
                 C 45 20 30 80 30 120
                 C 30 165 60 180 100 180
                 C 140 180 170 165 170 120
                 C 170 80 155 20 100 20 Z"
              fill="url(#eggGradient)"
            />

            {/* Decorative spots */}
            <Ellipse cx={70} cy={100} rx={15} ry={12} fill="url(#spotGradient)" />
            <Ellipse cx={130} cy={80} rx={12} ry={10} fill="url(#spotGradient)" />
            <Ellipse cx={90} cy={140} rx={10} ry={8} fill="url(#spotGradient)" />
            <Ellipse cx={125} cy={130} rx={8} ry={6} fill="url(#spotGradient)" />

            {/* Shine highlight */}
            <Ellipse
              cx={75}
              cy={60}
              rx={20}
              ry={15}
              fill="white"
              opacity={0.6}
            />
            <Ellipse
              cx={80}
              cy={55}
              rx={8}
              ry={6}
              fill="white"
              opacity={0.8}
            />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EggAvatar;
