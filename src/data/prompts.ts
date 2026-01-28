import { JournalPrompt } from '../types';

export const journalPrompts: Omit<JournalPrompt, 'id'>[] = [
  // Gratitude
  {
    text: "What are three things you're grateful for today?",
    category: 'gratitude',
  },
  {
    text: 'What small moment brought you joy recently?',
    category: 'gratitude',
  },
  {
    text: 'Who made a positive difference in your day?',
    category: 'gratitude',
  },
  {
    text: 'What comfort or convenience did you enjoy today?',
    category: 'gratitude',
  },
  {
    text: 'What is something beautiful you noticed today?',
    category: 'gratitude',
  },

  // Reflection
  {
    text: 'How are you really feeling right now?',
    category: 'reflection',
  },
  {
    text: "What's on your mind today?",
    category: 'reflection',
  },
  {
    text: 'What was the highlight of your day?',
    category: 'reflection',
  },
  {
    text: 'What was challenging about today, and how did you handle it?',
    category: 'reflection',
  },
  {
    text: 'What would make tomorrow a good day?',
    category: 'reflection',
  },
  {
    text: 'What did you learn about yourself today?',
    category: 'reflection',
  },

  // Growth
  {
    text: "What's one small step you can take toward a goal?",
    category: 'growth',
  },
  {
    text: "What's something you'd like to improve about yourself?",
    category: 'growth',
  },
  {
    text: 'What fear would you like to overcome?',
    category: 'growth',
  },
  {
    text: 'What habit would you like to build?',
    category: 'growth',
  },
  {
    text: "What's something you've been putting off?",
    category: 'growth',
  },

  // Affirmation
  {
    text: "Write about something you're proud of yourself for.",
    category: 'affirmation',
  },
  {
    text: 'What makes you uniquely you?',
    category: 'affirmation',
  },
  {
    text: 'Write a kind letter to yourself.',
    category: 'affirmation',
  },
  {
    text: 'What are your best qualities?',
    category: 'affirmation',
  },
  {
    text: "What progress have you made that you haven't acknowledged?",
    category: 'affirmation',
  },
];

export const affirmations = [
  "You're doing better than you think.",
  "It's okay to take things one step at a time.",
  'Your feelings are valid.',
  "You don't have to be perfect to be worthy.",
  'Progress, not perfection.',
  "It's okay to rest.",
  'You are enough, just as you are.',
  'Tough times never last, but tough people do.',
  "Be gentle with yourself. You're doing your best.",
  'Every day is a fresh start.',
  "You've overcome hard things before. You can do it again.",
  'Small steps still move you forward.',
  "It's okay to ask for help.",
  "You're allowed to set boundaries.",
  "Your best is good enough.",
];

export const getRandomPrompt = (): Omit<JournalPrompt, 'id'> => {
  const index = Math.floor(Math.random() * journalPrompts.length);
  return journalPrompts[index];
};

export const getRandomAffirmation = (): string => {
  const index = Math.floor(Math.random() * affirmations.length);
  return affirmations[index];
};

export const getPromptsByCategory = (category: JournalPrompt['category']) => {
  return journalPrompts.filter(prompt => prompt.category === category);
};
