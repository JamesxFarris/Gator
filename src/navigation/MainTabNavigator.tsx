import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  HomeScreen,
  MoodCheckInScreen,
  HabitsScreen,
  JournalListScreen,
  JournalEntryScreen,
  CustomizeScreen,
} from '../screens';
import { Text } from '../components/common/Text';
import { MainTabParamList, JournalStackParamList } from '../types';
import { colors } from '../theme/colors';
import { spacing, shadows } from '../theme/spacing';

const Tab = createBottomTabNavigator<MainTabParamList>();
const JournalStack = createNativeStackNavigator<JournalStackParamList>();

// Tab bar icons using emojis (can be replaced with SVG icons)
const TabIcon: React.FC<{ icon: string; focused: boolean }> = ({ icon, focused }) => (
  <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
    <Text style={[styles.icon, focused && styles.iconFocused]}>{icon}</Text>
  </View>
);

// Journal Stack Navigator
const JournalNavigator: React.FC = () => {
  return (
    <JournalStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background.primary,
        },
        headerShadowVisible: false,
        headerTintColor: colors.text.primary,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <JournalStack.Screen
        name="JournalList"
        component={JournalListScreen}
        options={{ title: 'Journal' }}
      />
      <JournalStack.Screen
        name="JournalEntry"
        component={JournalEntryScreen}
        options={({ route }) => ({
          title: route.params?.entryId ? 'Edit Entry' : 'New Entry',
        })}
      />
    </JournalStack.Navigator>
  );
};

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background.primary,
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: '600',
          color: colors.text.primary,
        },
        tabBarStyle: {
          backgroundColor: colors.background.card,
          borderTopColor: colors.border.light,
          paddingTop: spacing.sm,
          paddingBottom: spacing.md,
          height: 80,
          ...shadows.lg,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.text.tertiary,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="MoodCheckIn"
        component={MoodCheckInScreen}
        options={{
          title: 'Mood',
          tabBarIcon: ({ focused }) => <TabIcon icon="💭" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Habits"
        component={HabitsScreen}
        options={{
          title: 'Habits',
          tabBarIcon: ({ focused }) => <TabIcon icon="✨" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Journal"
        component={JournalNavigator}
        options={{
          headerShown: false,
          title: 'Journal',
          tabBarIcon: ({ focused }) => <TabIcon icon="📝" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Customize"
        component={CustomizeScreen}
        options={{
          title: 'Gator',
          tabBarIcon: ({ focused }) => <TabIcon icon="🐊" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerFocused: {
    backgroundColor: colors.primary.main + '15',
  },
  icon: {
    fontSize: 22,
    opacity: 0.6,
  },
  iconFocused: {
    opacity: 1,
  },
});

export default MainTabNavigator;
