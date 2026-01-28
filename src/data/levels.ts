import { LevelThreshold, GatorAccessory, GatorEnvironment } from '../types';

export const levelThresholds: LevelThreshold[] = [
  { level: 1, experienceRequired: 0 },
  { level: 2, experienceRequired: 100 },
  { level: 3, experienceRequired: 250, unlocks: { accessory: 'bow' } },
  { level: 4, experienceRequired: 450 },
  { level: 5, experienceRequired: 700, unlocks: { environment: 'garden' } },
  { level: 6, experienceRequired: 1000, unlocks: { accessory: 'hat' } },
  { level: 7, experienceRequired: 1350 },
  { level: 8, experienceRequired: 1750, unlocks: { accessory: 'glasses' } },
  { level: 9, experienceRequired: 2200 },
  { level: 10, experienceRequired: 2700, unlocks: { environment: 'beach' } },
  { level: 11, experienceRequired: 3250, unlocks: { accessory: 'scarf' } },
  { level: 12, experienceRequired: 3850 },
  { level: 13, experienceRequired: 4500, unlocks: { accessory: 'flower' } },
  { level: 14, experienceRequired: 5200 },
  { level: 15, experienceRequired: 6000, unlocks: { environment: 'forest' } },
  { level: 16, experienceRequired: 6850, unlocks: { accessory: 'headphones' } },
  { level: 17, experienceRequired: 7750 },
  { level: 18, experienceRequired: 8700 },
  { level: 19, experienceRequired: 9700, unlocks: { environment: 'cozy_room' } },
  { level: 20, experienceRequired: 10800, unlocks: { accessory: 'crown' } },
  { level: 21, experienceRequired: 12000 },
  { level: 22, experienceRequired: 13300 },
  { level: 23, experienceRequired: 14700 },
  { level: 24, experienceRequired: 16200 },
  { level: 25, experienceRequired: 17800, unlocks: { environment: 'starry_night' } },
];

export const getLevelForExperience = (experience: number): number => {
  let level = 1;
  for (const threshold of levelThresholds) {
    if (experience >= threshold.experienceRequired) {
      level = threshold.level;
    } else {
      break;
    }
  }
  return level;
};

export const getExperienceForLevel = (level: number): number => {
  const threshold = levelThresholds.find(t => t.level === level);
  return threshold?.experienceRequired ?? 0;
};

export const getExperienceForNextLevel = (level: number): number => {
  const nextThreshold = levelThresholds.find(t => t.level === level + 1);
  return nextThreshold?.experienceRequired ?? levelThresholds[levelThresholds.length - 1].experienceRequired;
};

export const getLevelProgress = (experience: number): { current: number; next: number; progress: number } => {
  const level = getLevelForExperience(experience);
  const currentLevelXp = getExperienceForLevel(level);
  const nextLevelXp = getExperienceForNextLevel(level);

  const xpIntoLevel = experience - currentLevelXp;
  const xpNeededForLevel = nextLevelXp - currentLevelXp;
  const progress = xpNeededForLevel > 0 ? xpIntoLevel / xpNeededForLevel : 1;

  return {
    current: xpIntoLevel,
    next: xpNeededForLevel,
    progress: Math.min(progress, 1),
  };
};

export const getUnlocksForLevel = (level: number): { accessory?: GatorAccessory; environment?: GatorEnvironment } | undefined => {
  const threshold = levelThresholds.find(t => t.level === level);
  return threshold?.unlocks;
};

export const accessoryInfo: Record<GatorAccessory, { name: string; description: string }> = {
  none: { name: 'None', description: 'Just your friendly gator!' },
  bow: { name: 'Bow', description: 'A cute little bow' },
  hat: { name: 'Hat', description: 'A stylish hat' },
  glasses: { name: 'Glasses', description: 'Cool shades' },
  scarf: { name: 'Scarf', description: 'A cozy scarf' },
  flower: { name: 'Flower', description: 'A pretty flower' },
  crown: { name: 'Crown', description: 'For royalty!' },
  headphones: { name: 'Headphones', description: 'Music lover vibes' },
};

export const environmentInfo: Record<GatorEnvironment, { name: string; description: string }> = {
  pond: { name: 'Cozy Pond', description: 'A peaceful pond' },
  garden: { name: 'Garden', description: 'A beautiful garden' },
  beach: { name: 'Beach', description: 'Sandy shores' },
  forest: { name: 'Forest', description: 'A peaceful forest' },
  cozy_room: { name: 'Cozy Room', description: 'A warm, comfy room' },
  starry_night: { name: 'Starry Night', description: 'Under the stars' },
};
