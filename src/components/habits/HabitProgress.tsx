import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../common/Text';
import { ProgressRing } from '../common/ProgressRing';
import { Card } from '../common/Card';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface HabitProgressProps {
  completed: number;
  total: number;
}

export const HabitProgress: React.FC<HabitProgressProps> = ({
  completed,
  total,
}) => {
  const progress = total > 0 ? completed / total : 0;
  const isComplete = completed === total && total > 0;

  return (
    <Card style={styles.container}>
      <View style={styles.content}>
        <ProgressRing
          progress={progress}
          size={70}
          strokeWidth={8}
          color={isComplete ? colors.success : colors.primary.main}
        >
          <Text variant="headingSmall" color={colors.text.primary}>
            {completed}/{total}
          </Text>
        </ProgressRing>
        <View style={styles.info}>
          <Text variant="labelLarge">Today's Progress</Text>
          <Text variant="bodySmall" color={colors.text.secondary}>
            {isComplete
              ? 'All done! Great job!'
              : `${total - completed} more to go`}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    marginLeft: spacing.lg,
    flex: 1,
  },
});

export default HabitProgress;
