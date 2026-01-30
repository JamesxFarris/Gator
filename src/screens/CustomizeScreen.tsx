import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Text } from '../components/common/Text';
import { Card } from '../components/common/Card';
import { GatorAvatar } from '../components/gator/GatorAvatar';
import { ProgressRing } from '../components/common/ProgressRing';
import { useGator, useAppStore } from '../store/useAppStore';
import { GatorAccessory, GatorEnvironment } from '../types';
import { colors } from '../theme/colors';
import { spacing, layout, borderRadius, shadows } from '../theme/spacing';
import { getLevelProgress, accessoryInfo, environmentInfo } from '../data/levels';

type Tab = 'accessories' | 'environments';

export const CustomizeScreen: React.FC = () => {
  const gator = useGator();
  const { setAccessory, setEnvironment } = useAppStore();
  const [activeTab, setActiveTab] = useState<Tab>('accessories');

  const levelProgress = getLevelProgress(gator.experience);

  const allAccessories: GatorAccessory[] = [
    'none',
    'bow',
    'hat',
    'glasses',
    'scarf',
    'flower',
    'crown',
    'headphones',
  ];

  const allEnvironments: GatorEnvironment[] = [
    'pond',
    'garden',
    'beach',
    'forest',
    'cozy_room',
    'starry_night',
  ];

  const handleAccessorySelect = (accessory: GatorAccessory) => {
    if (gator.unlockedAccessories.includes(accessory)) {
      setAccessory(accessory);
    }
  };

  const handleEnvironmentSelect = (environment: GatorEnvironment) => {
    if (gator.unlockedEnvironments.includes(environment)) {
      setEnvironment(environment);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Gator Preview */}
        <Card style={styles.previewCard}>
          <View style={styles.previewContent}>
            <GatorAvatar
              size={150}
              expression="happy"
              accessory={gator.accessory}
              color={gator.color}
            />
            <View style={styles.gatorInfo}>
              <Text variant="headingMedium">{gator.name}</Text>
              <Text variant="bodySmall" color={colors.text.secondary}>
                Level {gator.level}
              </Text>
              <View style={styles.progressContainer}>
                <ProgressRing
                  progress={levelProgress.progress}
                  size={50}
                  strokeWidth={5}
                  color={colors.accent.main}
                >
                  <Text variant="caption">{Math.round(levelProgress.progress * 100)}%</Text>
                </ProgressRing>
                <Text variant="caption" color={colors.text.tertiary} style={styles.xpText}>
                  {levelProgress.current}/{levelProgress.next} XP
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'accessories' && styles.activeTab]}
            onPress={() => setActiveTab('accessories')}
          >
            <Text
              variant="labelMedium"
              color={activeTab === 'accessories' ? colors.primary.main : colors.text.secondary}
            >
              Accessories
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'environments' && styles.activeTab]}
            onPress={() => setActiveTab('environments')}
          >
            <Text
              variant="labelMedium"
              color={activeTab === 'environments' ? colors.primary.main : colors.text.secondary}
            >
              Environments
            </Text>
          </TouchableOpacity>
        </View>

        {/* Items Grid */}
        {activeTab === 'accessories' ? (
          <View style={styles.grid}>
            {allAccessories.map((accessory) => {
              const isUnlocked = gator.unlockedAccessories.includes(accessory);
              const isSelected = gator.accessory === accessory;
              const info = accessoryInfo[accessory];

              return (
                <TouchableOpacity
                  key={accessory}
                  style={[
                    styles.item,
                    isSelected && styles.selectedItem,
                    !isUnlocked && styles.lockedItem,
                  ]}
                  onPress={() => handleAccessorySelect(accessory)}
                  disabled={!isUnlocked}
                >
                  <View style={styles.itemPreview}>
                    {isUnlocked ? (
                      <GatorAvatar
                        size={80}
                        expression="happy"
                        accessory={accessory}
                        color={gator.color}
                        animated={false}
                      />
                    ) : (
                      <View style={styles.lockedIcon}>
                        <Text style={styles.lockEmoji}>🔒</Text>
                      </View>
                    )}
                  </View>
                  <Text
                    variant="labelSmall"
                    color={isUnlocked ? colors.text.primary : colors.text.disabled}
                    center
                  >
                    {info.name}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <Text style={styles.checkmark}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.grid}>
            {allEnvironments.map((environment) => {
              const isUnlocked = gator.unlockedEnvironments.includes(environment);
              const isSelected = gator.environment === environment;
              const info = environmentInfo[environment];

              return (
                <TouchableOpacity
                  key={environment}
                  style={[
                    styles.item,
                    isSelected && styles.selectedItem,
                    !isUnlocked && styles.lockedItem,
                  ]}
                  onPress={() => handleEnvironmentSelect(environment)}
                  disabled={!isUnlocked}
                >
                  <View
                    style={[
                      styles.environmentPreview,
                      { backgroundColor: getEnvironmentColor(environment) },
                    ]}
                  >
                    {!isUnlocked && (
                      <View style={styles.lockedOverlay}>
                        <Text style={styles.lockEmoji}>🔒</Text>
                      </View>
                    )}
                  </View>
                  <Text
                    variant="labelSmall"
                    color={isUnlocked ? colors.text.primary : colors.text.disabled}
                    center
                  >
                    {info.name}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <Text style={styles.checkmark}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Stats */}
        <Card style={styles.statsCard}>
          <Text variant="labelLarge" style={styles.statsTitle}>
            Your Stats
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text variant="headingMedium" color={colors.primary.main}>
                {gator.unlockedAccessories.length - 1}
              </Text>
              <Text variant="caption" color={colors.text.secondary}>
                Accessories
              </Text>
            </View>
            <View style={styles.stat}>
              <Text variant="headingMedium" color={colors.primary.main}>
                {gator.unlockedEnvironments.length}
              </Text>
              <Text variant="caption" color={colors.text.secondary}>
                Environments
              </Text>
            </View>
            <View style={styles.stat}>
              <Text variant="headingMedium" color={colors.primary.main}>
                {gator.experience}
              </Text>
              <Text variant="caption" color={colors.text.secondary}>
                Total XP
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const getEnvironmentColor = (env: GatorEnvironment): string => {
  const envColors: Record<GatorEnvironment, string> = {
    pond: '#E8F4F8',
    garden: '#E8F5E9',
    beach: '#FFF8E7',
    forest: '#E8F0E8',
    cozy_room: '#FDF5E6',
    starry_night: '#2C3E50',
  };
  return envColors[env];
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: layout.screenPadding,
  },
  previewCard: {
    marginBottom: spacing.xl,
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gatorInfo: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  xpText: {
    marginLeft: spacing.md,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary.main,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  item: {
    width: '30%',
    aspectRatio: 0.85,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    marginBottom: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  selectedItem: {
    borderWidth: 2,
    borderColor: colors.primary.main,
  },
  lockedItem: {
    opacity: 0.6,
  },
  itemPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  environmentPreview: {
    flex: 1,
    width: '100%',
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  lockedIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockEmoji: {
    fontSize: 24,
  },
  checkBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsCard: {
    marginTop: spacing.md,
  },
  statsTitle: {
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
});

export default CustomizeScreen;
