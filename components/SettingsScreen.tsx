import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import * as storage from '../app/storage';
import { COLORS } from '../utils/theme';

const TEXT_COLOR_OPTIONS = [
  { name: 'White', color: '#FFFFFF' },
  { name: 'Light Gray', color: '#f1f5f9' },
  { name: 'Yellow', color: '#fbbf24' },
  { name: 'Green', color: '#4ade80' },
  { name: 'Blue', color: '#60a5fa' },
  { name: 'Pink', color: '#f472b6' },
];

export function SettingsScreen() {
  const [settings, setSettings] = useState<storage.AppSettings>({
    remindersEnabled: false,
    reminderTime: "09:00",
    textColor: "#f1f5f9",
    textMode: "auto"
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const loaded = await storage.loadSettings();
    setSettings(loaded);
  };

  const handleColorSelect = async (color: string) => {
    const updated = { ...settings, textColor: color };
    setSettings(updated);
    await storage.saveSettings(updated);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Settings</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Text Color</Text>
          <Text style={styles.sectionDescription}>
            Choose a text color that works best with your screen brightness
          </Text>
          
          <View style={styles.colorGrid}>
            {TEXT_COLOR_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.color}
                style={[
                  styles.colorOption,
                  settings.textColor === option.color && styles.colorOptionSelected
                ]}
                onPress={() => handleColorSelect(option.color)}
              >
                <View style={[styles.colorCircle, { backgroundColor: option.color }]} />
                <Text style={styles.colorName}>{option.name}</Text>
                {settings.textColor === option.color && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 16,
  },
  colorGrid: {
    gap: 12,
  },
  colorOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.cardHighlight,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  colorName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  checkmark: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
