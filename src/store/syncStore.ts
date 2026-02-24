import { create } from 'zustand';

interface SyncState {
  isSyncing: boolean;
  lastSyncTime: number | null;
  pendingSalesCount: number;
  pendingPurchasesCount: number;
  setIsSyncing: (syncing: boolean) => void;
  setLastSyncTime: (time: number) => void;
  setPendingCounts: (sales: number, purchases: number) => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  isSyncing: false,
  lastSyncTime: null,
  pendingSalesCount: 0,
  pendingPurchasesCount: 0,
  setIsSyncing: (syncing) => set({ isSyncing: syncing }),
  setLastSyncTime: (time) => set({ lastSyncTime: time }),
  setPendingCounts: (sales, purchases) =>
    set({ pendingSalesCount: sales, pendingPurchasesCount: purchases })
}));
