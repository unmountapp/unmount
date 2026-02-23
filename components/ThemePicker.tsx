import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { MOUNTAIN_THEMES, MountainTheme, MountainThemeId } from '../app/storage';
import { COLORS } from '../utils/theme';

interface ThemePickerProps {
  currentThemeId: string;
  isPro: boolean;
  onSelect: (themeId: MountainThemeId) => void;
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.themeRow}
      >
        {MOUNTAIN_THEMES.map((theme) => {
          const isSelected = currentThemeId === theme.id;
          const isLocked = theme.isPro && !isPro;
          return (
            <TouchableOpacity
              key={theme.id}
              style={styles.themeCard}
              onPress={() => handleSelect(theme)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.colorPreview,
                  {
                    backgroundColor: theme.colors.base,
                    borderColor: isSelected ? COLORS.primary : 'transparent',
                  },
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
  colorPreview: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
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
