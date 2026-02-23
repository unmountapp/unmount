import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
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

export default function App() {
  const { 
    currentMountain, 
    allMountains, 
    proStatus, 
    addMountain, 
    updateMountain, 
    deleteMountain,
    refreshProStatus 
  } = useMountainData();

  const [activeTab, setActiveTab] = useState('home');
  const [showPaywall, setShowPaywall] = useState(false);

  if (!currentMountain) {
    return <SetupScreen onComplete={addMountain} />;
  }

  if (currentMountain.daysClean >= 66) {
    return <VictoryScreen mountain={currentMountain} onRestart={() => deleteMountain(currentMountain.id)} />;
  }

  const handleCleanDay = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const updated = {
      ...currentMountain,
      daysClean: currentMountain.daysClean + 1,
      lastUpdated: new Date().toISOString(),
      log: [...currentMountain.log, { date: new Date().toISOString(), type: 'clean' }]
    };
    await updateMountain(updated);
  };

  const handleRelapse = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    const updated = {
      ...currentMountain,
      daysClean: Math.max(0, currentMountain.daysClean - 1),
      relapses: currentMountain.relapses + 1,
      lastUpdated: new Date().toISOString(),
      log: [...currentMountain.log, { date: new Date().toISOString(), type: 'relapse' }]
    };
    await updateMountain(updated);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stars />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{currentMountain.name}</Text>
          <Text style={styles.subtitle}>Day {currentMountain.daysClean} of 66</Text>
        </View>

        <Mountain 
          progress={currentMountain.daysClean / 66} 
          themeId={currentMountain.themeId} 
        />

        <StatsRow mountain={currentMountain} />

        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.button, styles.cleanButton]} 
            onPress={handleCleanDay}
          >
            <Text style={styles.buttonText}>I stayed clean today</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.relapseButton]} 
            onPress={handleRelapse}
          >
            <Text style={styles.buttonText}>I relapsed</Text>
          </TouchableOpacity>
        </View>

        <ActivityLog log={currentMountain.log} />
      </ScrollView>

      <TabBar 
        activeTab={activeTab} 
        onTabPress={(tab) => {
          if ((tab === 'stats' || tab === 'trophies') && !proStatus) {
            setShowPaywall(true);
          } else {
            setActiveTab(tab);
          }
        }} 
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
    backgroundColor: '#1a1a2e',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#e94560',
    marginTop: 5,
    fontWeight: '600',
  },
  actions: {
    marginVertical: 30,
    gap: 15,
  },
  button: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  cleanButton: {
    backgroundColor: '#e94560',
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  relapseButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
