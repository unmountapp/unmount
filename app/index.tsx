import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useMountainData } from '../hooks/useMountainData';
import { Mountain } from '../components/Mountain';
import { Stars } from '../components/Stars';
import { ActivityLog } from '../components/ActivityLog';
import { StatsRow } from '../components/StatsRow';
import { SetupScreen } from '../components/SetupScreen';
import { VictoryScreen } from '../components/VictoryScreen';
import { PaywallScreen } from '../components/PaywallScreen';
import { TabBar } from '../components/TabBar';
import { MountainSwitcher } from '../components/MountainSwitcher';
import { AnalyticsScreen } from '../components/AnalyticsScreen';
import { TrophyRoom } from '../components/TrophyRoom';
import { ThemePicker } from '../components/ThemePicker';
import { COLORS } from '../utils/theme';

type Tab = 'home' | 'habits' | 'stats' | 'trophies';

export default function App() {
  const {
    currentMountain,
    allMountains,
    proStatus,
    addMountain,
    updateMountain,
    deleteMountain,
    switchMountain,
    refreshProStatus,
  } = useMountainData();

  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showPaywall, setShowPaywall] = useState(false);
  const [addingNew, setAddingNew] = useState(false);

  // Show setup screen if no mountains exist or user is adding a new one
  if (!currentMountain || addingNew) {
    return (
      <SetupScreen
        onComplete={(habitName) => {
          addMountain(habitName);
          setAddingNew(false);
        }}
      />
    );
  }

  // Show victory screen if current mountain is conquered
  if (currentMountain.isVictory) {
    return (
      <VictoryScreen
        mountain={currentMountain}
        onContinue={() => setActiveTab('trophies')}
      />
    );
  }

  const handleCleanDay = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const updated = {
      ...currentMountain,
      cleanDays: currentMountain.cleanDays + 1,
      daysRemaining: Math.max(0, currentMountain.daysRemaining - 1),
      lastUpdated: new Date().toISOString(),
      log: [
        ...currentMountain.log,
        { date: new Date().toISOString(), type: 'clean' as const, timestamp: Date.now() },
      ],
      isVictory: currentMountain.daysRemaining - 1 <= 0,
      completedAt:
        currentMountain.daysRemaining - 1 <= 0
          ? new Date().toISOString()
          : currentMountain.completedAt,
    };
    await updateMountain(updated);
  };

  const handleRelapse = () => {
    Alert.alert(
      'Log Relapse',
      'Are you sure? Your mountain will grow back a bit.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Relapse',
          style: 'destructive',
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            const updated = {
              ...currentMountain,
              cleanDays: Math.max(0, currentMountain.cleanDays - 1),
              daysRemaining: Math.min(66, currentMountain.daysRemaining + 1),
              relapseCount: currentMountain.relapseCount + 1,
              currentStreak: 0,
              lastUpdated: new Date().toISOString(),
              log: [
                ...currentMountain.log,
                { date: new Date().toISOString(), type: 'relapse' as const, timestamp: Date.now() },
              ],
            };
            await updateMountain(updated);
          },
        },
      ]
    );
  };

  const handleTabPress = (tab: Tab) => {
    if ((tab === 'stats' || tab === 'trophies') && !proStatus) {
      setShowPaywall(true);
    } else {
      setActiveTab(tab);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'habits':
        return (
          <MountainSwitcher
            mountains={allMountains}
            currentId={currentMountain.id}
            isPro={proStatus}
            onSelect={(id) => switchMountain(id)}
            onAdd={() => setAddingNew(true)}
            onDelete={(id) => deleteMountain(id)}
            onUpgrade={() => setShowPaywall(true)}
          />
        );
      case 'stats':
        return <AnalyticsScreen mountain={currentMountain} allMountains={allMountains} />;
      case 'trophies':
        return <TrophyRoom mountains={allMountains} />;
      default:
        // Home tab
        return (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <Text style={styles.habitName}>{currentMountain.habitName}</Text>
              <Text style={styles.dayCount}>
                Day {currentMountain.cleanDays} of 66
              </Text>
            </View>

            <Mountain
              progress={currentMountain.cleanDays / 66}
              themeId={currentMountain.themeId || 'stone'}
            />

            <StatsRow mountain={currentMountain} />

            <ThemePicker
              currentThemeId={currentMountain.themeId || 'stone'}
              isPro={proStatus}
              onSelect={async (themeId) => {
                await updateMountain({ ...currentMountain, themeId });
              }}
              onUpgrade={() => setShowPaywall(true)}
            />

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.cleanButton]}
                onPress={handleCleanDay}
                activeOpacity={0.85}
              >
                <Text style={styles.buttonText}>✅ I stayed clean today</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.relapseButton]}
                onPress={handleRelapse}
                activeOpacity={0.85}
              >
                <Text style={styles.relapseText}>I relapsed</Text>
              </TouchableOpacity>
            </View>

            <ActivityLog log={currentMountain.log} />
          </ScrollView>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stars />
      <View style={styles.content}>{renderContent()}</View>
      <TabBar
        activeTab={activeTab}
        onTabPress={handleTabPress}
        isPro={proStatus}
      />
      {showPaywall && (
        <PaywallScreen
          onClose={() => setShowPaywall(false)}
          onSuccess={() => {
            setShowPaywall(false);
            refreshProStatus();
          }}
        />
      )}
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
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 8,
  },
  habitName: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    textTransform: 'uppercase',
    letterSpacing: 2,
    textAlign: 'center',
  },
  dayCount: {
    fontSize: 16,
    color: COLORS.primary,
    marginTop: 6,
    fontWeight: '600',
  },
  actions: {
    marginVertical: 24,
    gap: 12,
  },
  button: {
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  cleanButton: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  relapseButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  relapseText: {
    color: COLORS.textMuted,
    fontSize: 16,
    fontWeight: '500',
  },
});
