import { Habit, HabitCategory } from '../types';

export const defaultHabits: Omit<Habit, 'id'>[] = [
  // Hydration
  {
    name: 'Drink water',
    icon: '💧',
    category: 'hydration',
    experienceReward: 10,
    isDefault: true,
    isActive: true,
  },
  {
    name: 'Drink herbal tea',
    icon: '🍵',
    category: 'hydration',
    experienceReward: 10,
    isDefault: true,
    isActive: false,
  },

  // Movement
  {
    name: 'Take a walk',
    icon: '🚶',
    category: 'movement',
    experienceReward: 20,
    isDefault: true,
    isActive: true,
  },
  {
    name: 'Stretch',
    icon: '🧘',
    category: 'movement',
    experienceReward: 15,
    isDefault: true,
    isActive: true,
  },
  {
    name: 'Exercise',
    icon: '💪',
    category: 'movement',
    experienceReward: 25,
    isDefault: true,
    isActive: false,
  },
  {
    name: 'Dance',
    icon: '💃',
    category: 'movement',
    experienceReward: 20,
    isDefault: true,
    isActive: false,
  },

  // Mindfulness
  {
    name: 'Deep breathing',
    icon: '🌬️',
    category: 'mindfulness',
    experienceReward: 15,
    isDefault: true,
    isActive: true,
  },
  {
    name: 'Meditate',
    icon: '🧘‍♀️',
    category: 'mindfulness',
    experienceReward: 20,
    isDefault: true,
    isActive: false,
  },
  {
    name: 'Mindful moment',
    icon: '🌸',
    category: 'mindfulness',
    experienceReward: 10,
    isDefault: true,
    isActive: false,
  },

  // Social
  {
    name: 'Text a friend',
    icon: '💬',
    category: 'social',
    experienceReward: 15,
    isDefault: true,
    isActive: false,
  },
  {
    name: 'Call someone',
    icon: '📞',
    category: 'social',
    experienceReward: 20,
    isDefault: true,
    isActive: false,
  },
  {
    name: 'Spend time with loved ones',
    icon: '❤️',
    category: 'social',
    experienceReward: 25,
    isDefault: true,
    isActive: false,
  },

  // Rest
  {
    name: 'Take a nap',
    icon: '😴',
    category: 'rest',
    experienceReward: 15,
    isDefault: true,
    isActive: false,
  },
  {
    name: 'Go to bed on time',
    icon: '🌙',
    category: 'rest',
    experienceReward: 20,
    isDefault: true,
    isActive: true,
  },
  {
    name: 'Screen-free time',
    icon: '📵',
    category: 'rest',
    experienceReward: 15,
    isDefault: true,
    isActive: false,
  },

  // Creativity
  {
    name: 'Journal',
    icon: '📝',
    category: 'creativity',
    experienceReward: 20,
    isDefault: true,
    isActive: true,
  },
  {
    name: 'Draw or doodle',
    icon: '🎨',
    category: 'creativity',
    experienceReward: 15,
    isDefault: true,
    isActive: false,
  },
  {
    name: 'Read',
    icon: '📚',
    category: 'creativity',
    experienceReward: 15,
    isDefault: true,
    isActive: false,
  },
  {
    name: 'Listen to music',
    icon: '🎵',
    category: 'creativity',
    experienceReward: 10,
    isDefault: true,
    isActive: false,
  },
];

export const categoryInfo: Record<HabitCategory, { label: string; color: string }> = {
  hydration: { label: 'Hydration', color: '#6FDFDF' },
  movement: { label: 'Movement', color: '#6BCB77' },
  mindfulness: { label: 'Mindfulness', color: '#A78BFA' },
  social: { label: 'Social', color: '#FFB08B' },
  rest: { label: 'Rest', color: '#6B8E9F' },
  creativity: { label: 'Creativity', color: '#F9C74F' },
};
