import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  WelcomeScreen,
  NameGatorScreen,
  SelectHabitsScreen,
  SetReminderScreen,
} from '../screens/onboarding';
import { OnboardingStackParamList } from '../types';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.primary },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="NameGator" component={NameGatorScreen} />
      <Stack.Screen name="SelectHabits" component={SelectHabitsScreen} />
      <Stack.Screen name="SetReminder" component={SetReminderScreen} />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;
