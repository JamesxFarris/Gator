import { GatorExpression, MoodLevel } from '../types';

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

export const greetings: Record<TimeOfDay, string[]> = {
  morning: [
    "Good morning! Ready for a fresh start?",
    "Rise and shine! Let's make today great!",
    "Morning! I believe in you today!",
    "Hello, sunshine! How are you feeling?",
    "A new day, a new adventure! Good morning!",
  ],
  afternoon: [
    "Good afternoon! How's your day going?",
    "Hey there! Taking a break?",
    "Afternoon! You're doing great!",
    "Hi! Checking in - how are you?",
    "Good afternoon! Keep up the good work!",
  ],
  evening: [
    "Good evening! How was your day?",
    "Evening! Time to wind down?",
    "Hey! Ready to reflect on your day?",
    "Good evening! You made it through another day!",
    "Hi there! Taking some time for yourself?",
  ],
  night: [
    "Hey night owl! How are you?",
    "Still up? Let's do a quick check-in!",
    "Good night! Ready for some rest?",
    "Hey! Remember, rest is important too!",
    "Late night? I'm here for you!",
  ],
};

export const getGreeting = (gatorName: string): string => {
  const timeOfDay = getTimeOfDay();
  const messages = greetings[timeOfDay];
  const message = messages[Math.floor(Math.random() * messages.length)];
  return message;
};

export const moodResponses: Record<MoodLevel, string[]> = {
  1: [
    "I'm here with you. Take it one moment at a time.",
    "It's okay to not be okay. I'm proud of you for checking in.",
    "Sending you a big gator hug. You're not alone.",
    "Tough days happen. Let's take it slow today.",
    "I'm sorry you're feeling this way. I'm here for you.",
  ],
  2: [
    "Thank you for being honest about how you feel.",
    "Some days are harder than others. You're doing your best.",
    "I see you're going through something. I'm here.",
    "It takes courage to acknowledge difficult feelings.",
    "Let's take things gently today.",
  ],
  3: [
    "Thanks for checking in! Every day is different.",
    "A neutral day is still a good day!",
    "Sometimes 'okay' is perfectly okay.",
    "Thanks for taking a moment to reflect!",
    "Steady days matter too!",
  ],
  4: [
    "That's great! Keep riding that good energy!",
    "Yay! I'm happy you're feeling good!",
    "Wonderful! Let's keep the momentum going!",
    "Love to see it! You deserve to feel good!",
    "That's the spirit! Keep it up!",
  ],
  5: [
    "Amazing! You're radiating good vibes!",
    "Woohoo! I'm so happy for you!",
    "You're glowing! What a great day!",
    "Fantastic! Let's celebrate this feeling!",
    "Yes! This is wonderful to hear!",
  ],
};

export const getMoodResponse = (mood: MoodLevel): string => {
  const responses = moodResponses[mood];
  return responses[Math.floor(Math.random() * responses.length)];
};

export const habitCompletionMessages = [
  "Great job! Every little bit counts!",
  "You did it! I'm so proud of you!",
  "Woohoo! Another one done!",
  "Amazing! Keep up the good work!",
  "Yes! You're on fire today!",
  "That's the spirit! Well done!",
  "Fantastic! You're taking care of yourself!",
  "Way to go! I knew you could do it!",
];

export const getHabitCompletionMessage = (): string => {
  return habitCompletionMessages[Math.floor(Math.random() * habitCompletionMessages.length)];
};

export const levelUpMessages = [
  "LEVEL UP! You're amazing!",
  "Woohoo! New level unlocked!",
  "Look at you grow! Level up!",
  "You did it! New level achieved!",
  "Incredible progress! Level up!",
];

export const getLevelUpMessage = (level: number): string => {
  const base = levelUpMessages[Math.floor(Math.random() * levelUpMessages.length)];
  return `${base} You're now level ${level}!`;
};

export const expressionMessages: Record<GatorExpression, string[]> = {
  happy: [
    "Life is good!",
    "I love spending time with you!",
    "What a lovely day!",
  ],
  excited: [
    "I can't contain my excitement!",
    "Something great is happening!",
    "This is amazing!",
  ],
  sleepy: [
    "*yawn* Maybe we both need rest...",
    "Getting a bit sleepy here...",
    "Rest is important, you know!",
  ],
  encouraging: [
    "You've got this!",
    "I believe in you!",
    "One step at a time!",
  ],
  neutral: [
    "Just hanging out here!",
    "Ready when you are!",
    "Taking it easy...",
  ],
  proud: [
    "Look at all you've accomplished!",
    "I'm so proud of you!",
    "You're doing amazing!",
  ],
};

export const getExpressionMessage = (expression: GatorExpression): string => {
  const messages = expressionMessages[expression];
  return messages[Math.floor(Math.random() * messages.length)];
};

export const streakMessages = {
  maintained: [
    "You're on a roll!",
    "Streak maintained! Keep going!",
    "Another day, another win!",
  ],
  broken: [
    "It's okay! Every day is a fresh start.",
    "Don't worry! Let's start a new streak today!",
    "No pressure - you're doing great just by being here!",
  ],
  milestone: (days: number) => [
    `${days} days! Incredible!`,
    `Wow, ${days} days in a row!`,
    `${days} day streak! You're unstoppable!`,
  ],
};

export const noTasksMessages = [
  "All done for today! Time to relax!",
  "You've completed everything! Great job!",
  "Nothing left to do - enjoy your day!",
  "All tasks done! You deserve a rest!",
];

export const getNoTasksMessage = (): string => {
  return noTasksMessages[Math.floor(Math.random() * noTasksMessages.length)];
};
