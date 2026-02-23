import { useState, useEffect, useCallback } from 'react';
import * as storage from '../app/storage';

export function useMountainData() {
  const [allMountains, setAllMountains] = useState<storage.MountainData[]>([]);
  const [currentMountain, setCurrentMountain] = useState<storage.MountainData | null>(null);
  const [proStatus, setProStatus] = useState(false);

  const loadData = useCallback(async () => {
    const [mountains, activeId, isPro] = await Promise.all([
      storage.loadMountains(),
      storage.getActiveMountainId(),
      storage.getProStatus()
    ]);

    setAllMountains(mountains);
    setProStatus(isPro);

    if (activeId) {
      const active = mountains.find(m => m.id === activeId);
      setCurrentMountain(active || mountains[0] || null);
    } else {
      setCurrentMountain(mountains[0] || null);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addMountain = async (habit: string, themeId: storage.MountainThemeId = 'classic') => {
    const newMountain = storage.createMountain(habit, themeId);
    await storage.addMountain(newMountain);
    await loadData();
  };

  const updateMountain = async (updated: storage.MountainData) => {
    await storage.updateMountain(updated);
    await loadData();
  };

  const deleteMountain = async (id: string) => {
    await storage.deleteMountain(id);
    await loadData();
  };

  const refreshProStatus = async () => {
    const isPro = await storage.getProStatus();
    setProStatus(isPro);
  };

  return {
    currentMountain,
    allMountains,
    proStatus,
    addMountain,
    updateMountain,
    deleteMountain,
    refreshProStatus,
    reload: loadData
  };
}
