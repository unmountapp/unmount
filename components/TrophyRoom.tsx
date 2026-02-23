import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { MountainData } from '../app/storage';
import { COLORS } from '../utils/theme';

interface TrophyRoomProps {
  mountains: MountainData[];
}

export function TrophyRoom({ mountains }: TrophyRoomProps) {
  const conqueredMountains = mountains.filter((m) => m.isVictory);

  const totalCleanDays = conqueredMountains.reduce(
    (sum, m) => sum + m.cleanDays,
    0
  );

  if (conqueredMountains.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Trophy Room</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🏔️</Text>
          <Text style={styles.emptyTitle}>No Trophies Yet</Text>
          <Text style={styles.emptyText}>
            Complete your first 66-day mountain to earn your first trophy.
            Keep chipping away!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Trophy Room</Text>

      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{conqueredMountains.length}</Text>
          <Text style={styles.statLabel}>Mountains{`\n`}Destroyed</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalCleanDays}</Text>
          <Text style={styles.statLabel}>Total Clean{`\n`}Days</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {Math.round(
              (conqueredMountains.length / Math.max(mountains.length, 1)) * 100
            )}%
          </Text>
          <Text style={styles.statLabel}>Success{`\n`}Rate</Text>
        </View>
      </View>

      <FlatList
        data={conqueredMountains}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const date = item.completedAt
            ? new Date(item.completedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : 'Unknown date';

          return (
            <View style={styles.trophyCard}>
              <View style={styles.trophyLeft}>
                <Text style={styles.trophyNumber}>#{index + 1}</Text>
                <Text style={styles.trophyIcon}>🏆</Text>
              </View>
              <View style={styles.trophyInfo}>
                <Text style={styles.habitName}>{item.habitName}</Text>
                <Text style={styles.completedDate}>Conquered on {date}</Text>
                <View style={styles.trophyStats}>
                  <Text style={styles.trophyStat}>
                    ✓ {item.cleanDays} clean days
                  </Text>
                  <Text style={styles.trophyStat}>
                    ✕ {item.relapseCount} relapses
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 8,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  trophyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  trophyLeft: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 50,
  },
  trophyNumber: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginBottom: 4,
  },
  trophyIcon: {
    fontSize: 32,
  },
  trophyInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  completedDate: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  trophyStats: {
    flexDirection: 'row',
    gap: 12,
  },
  trophyStat: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
