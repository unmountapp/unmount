import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/theme';

type Tab = 'home' | 'habits' | 'stats' | 'trophies' | 'settings';

interface TabBarProps {
  activeTab: Tab;
  onTabPress: (tab: Tab) => void;
  isPro: boolean;
}

const TABS: { key: Tab; label: string; icon: string; proOnly: boolean }[] = [
  { key: 'home', label: 'Home', icon: '⛰️', proOnly: false },
  { key: 'habits', label: 'Habits', icon: '📋', proOnly: false },
  { key: 'stats', label: 'Stats', icon: '📊', proOnly: true },
  { key: 'trophies', label: 'Trophies', icon: '🏆', proOnly: true },
];

export function TabBar({ activeTab, onTabPress, isPro }: TabBarProps) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        const isLocked = tab.proOnly && !isPro;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>
              {tab.icon}
              {isLocked ? ' 🔒' : ''}
            </Text>
            <Text
              style={[
                styles.label,
                isActive && styles.labelActive,
                isLocked && styles.labelLocked,
              ]}
            >
              {tab.label}
            </Text>
            {isActive && <View style={styles.activeDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 20,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  icon: {
    fontSize: 20,
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  labelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  labelLocked: {
    color: COLORS.textMuted,
    opacity: 0.6,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginTop: 3,
  },
});
