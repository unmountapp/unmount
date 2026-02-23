import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { MountainData } from '../app/storage';
import { COLORS } from '../utils/theme';

interface MountainSwitcherProps {
  mountains: MountainData[];
  currentId: string;
  isPro: boolean;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onUpgrade: () => void;
}

export function MountainSwitcher({
  mountains,
  currentId,
  isPro,
  onSelect,
  onAdd,
  onDelete,
  onUpgrade,
}: MountainSwitcherProps) {
  const handleDelete = (mountain: MountainData) => {
    Alert.alert(
      'Delete Mountain',
      `Are you sure you want to delete "${mountain.habitName}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(mountain.id),
        },
      ]
    );
  };

  const handleAdd = () => {
    if (!isPro && mountains.length >= 1) {
      onUpgrade();
    } else {
      onAdd();
    }
  };

  const progressPercent = (m: MountainData) =>
    Math.round(((66 - m.daysRemaining) / 66) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Mountains</Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>
            {!isPro && mountains.length >= 1 ? '🔒 Add' : '+ Add'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={mountains}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isActive = item.id === currentId;
          const pct = progressPercent(item);
          return (
            <TouchableOpacity
              style={[styles.card, isActive && styles.cardActive]}
              onPress={() => onSelect(item.id)}
              onLongPress={() => handleDelete(item)}
              activeOpacity={0.8}
            >
              <View style={styles.cardLeft}>
                <Text style={styles.habitName} numberOfLines={1}>
                  {item.habitName}
                </Text>
                <Text style={styles.cardMeta}>
                  {item.daysRemaining} days left · {pct}% destroyed
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${pct}%` as any },
                      item.isVictory && styles.progressVictory,
                    ]}
                  />
                </View>
              </View>
              <View style={styles.cardRight}>
                {item.isVictory && <Text style={styles.victoryBadge}>✔</Text>}
                {isActive && !item.isVictory && (
                  <Text style={styles.activeBadge}>▶</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>No mountains yet. Add one!</Text>
        }
        contentContainerStyle={styles.list}
      />
      {!isPro && (
        <TouchableOpacity style={styles.proPrompt} onPress={onUpgrade}>
          <Text style={styles.proPromptText}>
            🔒 Upgrade to Pro for unlimited mountains
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardActive: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  cardLeft: {
    flex: 1,
  },
  cardRight: {
    marginLeft: 12,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  progressVictory: {
    backgroundColor: COLORS.success,
  },
  victoryBadge: {
    fontSize: 20,
    color: COLORS.success,
  },
  activeBadge: {
    fontSize: 16,
    color: COLORS.primary,
  },
  empty: {
    textAlign: 'center',
    color: COLORS.textMuted,
    marginTop: 40,
    fontSize: 16,
  },
  proPrompt: {
    margin: 20,
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
  },
  proPromptText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
});
