import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../utils/theme';

export interface MountainTheme {
  id: string;
  name: string;
  emoji: string;
  isPro: boolean;
  colors: {
    mountainBase: string;
    mountainMid: string;
    mountainPeak: string;
    snow: string;
    sky: string;
  };
}

export const MOUNTAIN_THEMES: MountainTheme[] = [
  {
    id: 'stone',
    name: 'Stone Peak',
    emoji: '⛰️',
    isPro: false,
    colors: {
      mountainBase: '#4a4a5e',
      mountainMid: '#5a5a72',
      mountainPeak: '#8a8aaa',
      snow: '#e8e8f0',
      sky: '#1a1a2e',
    },
  },
  {
    id: 'volcano',
    name: 'Volcano',
    emoji: '🌋',
    isPro: true,
    colors: {
      mountainBase: '#3d1515',
      mountainMid: '#8b2020',
      mountainPeak: '#c0392b',
      snow: '#ff6b35',
      sky: '#1a0a0a',
    },
  },
  {
    id: 'glacier',
    name: 'Glacier',
    emoji: '🧊',
    isPro: true,
    colors: {
      mountainBase: '#1a3a4a',
      mountainMid: '#2a5a7a',
      mountainPeak: '#5ab4d8',
      snow: '#e8f8ff',
      sky: '#0a1a2a',
    },
  },
  {
    id: 'canyon',
    name: 'Canyon',
    emoji: '🏜️',
    isPro: true,
    colors: {
      mountainBase: '#5c2a0a',
      mountainMid: '#8b4513',
      mountainPeak: '#d2691e',
      snow: '#f4a460',
      sky: '#1a0f05',
    },
  },
  {
    id: 'sanddune',
    name: 'Sand Dune',
    emoji: '🏜️',
    isPro: true,
    colors: {
      mountainBase: '#4a3a1a',
      mountainMid: '#8b7355',
      mountainPeak: '#c8a96e',
      snow: '#f5deb3',
      sky: '#1a1205',
    },
  },
  {
    id: 'crystal',
    name: 'Crystal',
    emoji: '💎',
    isPro: true,
    colors: {
      mountainBase: '#1a0a3a',
      mountainMid: '#4a1a8a',
      mountainPeak: '#9b59b6',
      snow: '#d8b4fe',
      sky: '#0d0021',
    },
  },
];

interface ThemePickerProps {
  currentThemeId: string;
  isPro: boolean;
  onSelect: (themeId: string) => void;
  onUpgrade: () => void;
}

export function ThemePicker({
  currentThemeId,
  isPro,
  onSelect,
  onUpgrade,
}: ThemePickerProps) {
  const handleSelect = (theme: MountainTheme) => {
    if (theme.isPro && !isPro) {
      onUpgrade();
    } else {
      onSelect(theme.id);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mountain Theme</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.themeRow}>
          {MOUNTAIN_THEMES.map((theme) => {
            const isSelected = currentThemeId === theme.id;
            const isLocked = theme.isPro && !isPro;
            return (
              <TouchableOpacity
                key={theme.id}
                style={[
                  styles.themeCard,
                  isSelected && styles.themeCardSelected,
                ]}
                onPress={() => handleSelect(theme)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.colorPreview,
                    { backgroundColor: theme.colors.mountainMid },
                  ]}
                >
                  <Text style={styles.themeEmoji}>{theme.emoji}</Text>
                  {isLocked && (
                    <View style={styles.lockOverlay}>
                      <Text style={styles.lockIcon}>🔒</Text>
                    </View>
                  )}
                </View>
                <Text
                  style={[
                    styles.themeName,
                    isSelected && styles.themeNameSelected,
                  ]}
                >
                  {theme.name}
                </Text>
                {theme.isPro && (
                  <Text style={styles.proTag}>PRO</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  themeRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  themeCard: {
    alignItems: 'center',
    width: 80,
  },
  themeCardSelected: {
    opacity: 1,
  },
  colorPreview: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  themeEmoji: {
    fontSize: 28,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    fontSize: 20,
  },
  themeName: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    fontWeight: '500',
  },
  themeNameSelected: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  proTag: {
    fontSize: 9,
    color: '#f59e0b',
    fontWeight: '800',
    marginTop: 2,
    letterSpacing: 0.5,
  },
});
